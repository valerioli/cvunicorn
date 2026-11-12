const {chromium,expect}=require('@playwright/test');
const fs=require('fs');
const base=process.env.TEST_BASE_URL||'http://localhost:3123';
(async()=>{
 fs.mkdirSync('audit-artifacts',{recursive:true});
 const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const findings=[];const errors=[];
 try {
  for(const width of [1440,390]){
   const p=await b.newPage({viewport:{width,height:900}});p.on('pageerror',e=>errors.push(e.message));
   for(const route of ['/','/start','/showcase','/pricing','/how-it-works','/faq','/account','/checkout','/legal/privacy','/legal/terms','/legal/refunds','/for/designers']){
    const r=await p.goto(base+route,{waitUntil:'networkidle',timeout:60000});
    await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
    const audit=await p.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,violations:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})).slice(0,4)}))}));
    findings.push({route,width,status:r.status(),...audit});
    if(['/','/start','/showcase'].includes(route))await p.screenshot({path:`audit-artifacts/after-${route.slice(1)||'home'}-${width}.png`});
   }
   await p.close();
  }
  const p=await b.newPage({viewport:{width:1280,height:900}});p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'/start');
  await p.getByLabel(/Full name/).fill('Browser Audit');await p.getByLabel(/Professional headline/).fill('Independent designer');
  await p.locator('input[type=file]').nth(1).setInputFiles({name:'sample.txt',mimeType:'text/plain',buffer:Buffer.from('Browser Audit\nDesigner\n2022 - Present\nCreated a research project.')});
  await expect(p.getByLabel(/Review extracted CV text/)).toContainText('Browser Audit');
  await p.getByLabel(/Review extracted CV text/).fill('Browser Audit\nDesigner\n2022 - Present\nCorrected source text.');
  await p.getByRole('button',{name:'Continue →',exact:true}).click();
  await p.getByRole('button',{name:/Mercury Fintech/}).click();await p.getByRole('button',{name:'Continue →',exact:true}).click();await p.getByRole('button',{name:'Continue →',exact:true}).click();
  await p.getByRole('button',{name:'Save and choose a pass'}).click();await p.waitForURL('**/checkout?**');
  const draftId=new URL(p.url()).searchParams.get('draft');const saved=await (await p.request.get(base+'/api/intake?draft='+draftId)).json();
  if(saved.style!=='mercury'||!saved.essentials.cvText.includes('Corrected source text'))throw Error('Checkout used stale content');
  await p.getByLabel('Receipt email',{exact:false}).fill('browser@example.test');await p.getByRole('button',{name:/Pay .* securely/}).click();await p.waitForURL('**/checkout/pay?**');
  await p.getByRole('button',{name:'Simulate successful payment'}).click();await p.getByRole('link',{name:'Go to my site dashboard'}).click();await p.waitForURL('**/account?**');
  const account=p.url();await p.getByRole('link',{name:'Review my content first'}).click();await expect(p.getByLabel(/Full name/)).toHaveValue('Browser Audit');
  await p.getByLabel(/Short bio/).fill('Saved from the authenticated editor');
  for(let i=0;i<3;i++)await p.getByRole('button',{name:'Continue →',exact:true}).click();await p.getByRole('button',{name:'Save and return to my site'}).click();await p.waitForURL('**/account?**');
  const q=new URL(account).search;const edited=await(await p.request.get(base+'/api/editor'+q)).json();if(edited.essentials.bio!=='Saved from the authenticated editor')throw Error('Edited content was not persisted');
  await p.route('**/api/generate',r=>r.fulfill({json:{siteUrl:base+'/site/browser-audit',needsPublish:true}}));
  await p.route('**/api/site-preview?**',r=>r.fulfill({contentType:'text/html',headers:{'Content-Security-Policy':"sandbox allow-scripts allow-popups; default-src 'none'; script-src 'unsafe-inline'",'X-Frame-Options':'SAMEORIGIN'},body:'<!doctype html><html><body><h1>Browser Audit Preview</h1><p id="isolation"></p><script>try { parent.localStorage.getItem("cvunicorn.account"); document.getElementById("isolation").textContent="unsafe"; } catch { document.getElementById("isolation").textContent="isolated"; }</script></body></html>'}));
  await p.route('**/api/site-preview',r=>r.fulfill({json:{siteUrl:base+'/site/browser-audit'}}));
  await p.getByRole('button',{name:'Generate my website',exact:true}).click();await expect(p.getByRole('heading',{name:'Review before publishing'})).toBeVisible();await expect(p.frameLocator('iframe').getByRole('heading',{name:'Browser Audit Preview'})).toBeVisible();await expect(p.frameLocator('iframe').locator('#isolation')).toHaveText('isolated');await p.screenshot({path:'audit-artifacts/account-preview.png',fullPage:true});
  await p.getByRole('button',{name:'Publish my website',exact:true}).click();await expect(p.getByRole('link',{name:base+'/site/browser-audit ↗'})).toBeVisible();
  await p.goto(base+'/start');await p.getByRole('button',{name:'中',exact:true}).click();await expect(p.getByRole('heading',{name:'先从你开始'})).toBeVisible();await p.screenshot({path:'audit-artifacts/start-zh.png'});
  await p.close();
  const nojs=await b.newContext({javaScriptEnabled:false});const nj=await nojs.newPage();await nj.goto(base+'/');await expect(nj.getByRole('heading',{level:1})).toBeVisible();await nojs.close();
  fs.writeFileSync('audit-artifacts/after.json',JSON.stringify({findings,errors,workflow:'passed (model response mocked; payment simulated)'},null,2));
  console.log(JSON.stringify({pages:findings.length,overflow:findings.filter(f=>f.overflow),a11y:findings.filter(f=>f.violations.length).map(f=>({route:f.route,width:f.width,violations:f.violations})),errors,workflow:'passed'}));
 } finally {await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
