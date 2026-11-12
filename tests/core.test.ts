import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { emptyIntake } from "../src/lib/intake";
import { isIntake } from "../src/lib/intakeValidation";
import { intakeToBrief, styleDirections } from "../src/lib/ai/brief";
import { cleanHtml } from "../src/lib/ai/generator";
import { kvSet, kvGet, acquireLease, releaseLease } from "../src/lib/storage";
import { createOrder, markOrderPaid, getOrder, saveOrder } from "../src/lib/orders";
import { createAccessToken } from "../src/lib/access";
import { POST as generate } from "../src/app/api/generate/route";
import { GET as serveSite } from "../src/app/site/[slug]/route";
import { GET as preview, POST as publish } from "../src/app/api/site-preview/route";
import { GET as readDraft, POST as editDraft } from "../src/app/api/editor/route";
import { POST as checkout } from "../src/app/api/checkout/route";
import { POST as saveDraft } from "../src/app/api/intake/route";
import { POST as upload } from "../src/app/api/upload/route";
import { extractDocumentText } from "../src/lib/documentText";
import { readFileSync } from "node:fs";

const req = (path:string,body?:unknown) => new NextRequest(`http://localhost:3123${path}`, body === undefined ? {} : { method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body) });
const html = '<!doctype html><html><head><meta name="viewport" content="width=device-width"><style>body{font-family:system-ui}</style></head><body><main><h1>Ada Chen</h1><p>Researcher</p></main></body></html>';
function draft() { const d=emptyIntake(); d.essentials.fullName="Ada Chen"; d.essentials.headline="Researcher"; return d; }

test("styles, language and extracted attachments reach every generation brief; billing email stays private",()=>{
 const d=draft(); d.essentials.email="private-billing@example.test"; d.siteLanguage="zh";d.selected=["other"];d.entries.other=[{id:"one",values:{title:"Research"},files:[{id:"file",name:"paper.pdf",type:"application/pdf",size:50,url:"https://assets.test/paper.pdf",extractedText:"Verified research achievement"}]}];
 for(const style of Object.keys(styleDirections)){d.style=style as typeof d.style; const b=intakeToBrief(d);assert.ok(b.includes(styleDirections[d.style]));assert.ok(b.includes("Verified research achievement"));assert.ok(b.includes("Simplified Chinese"));assert.ok(!b.includes(d.essentials.email));}
});
test("malformed drafts and invalid generated HTML are rejected",()=>{
 const d=draft();assert.ok(isIntake(d));assert.equal(isIntake({...d,selected:["nonexistent"]}),false);assert.equal(isIntake({...d,entries:{other:[{values:{x:45},files:[]}]}}),false);
 assert.equal(cleanHtml(html,d),html);assert.throws(()=>cleanHtml(html.replace('</html>',''),d));assert.throws(()=>cleanHtml(html.replace('<main>','<main><a href="https://invented.test">Profile</a>'),d));
 d.essentials.photo={id:'photo',name:'me.png',url:'https://assets.test/me.png',type:'image/png',size:10};assert.throws(()=>cleanHtml(html,d));
});
test("generation, authenticated edits, private preview, publication and safe regeneration",async()=>{
 process.env.OPENROUTER_API_KEY="test-key-not-real";process.env.GENERATION_PROVIDER="openrouter";
 const d=draft(); await kvSet(`draft:${d.draftId}`,d);
 const order=await createOrder({planId:"preview",draftId:d.draftId,email:"owner@example.test"});await markOrderPaid(order.id);const token=createAccessToken(order.id);const body={orderId:order.id,token};
 const realFetch=global.fetch;let callBody:any;
 global.fetch=async(_url,options)=>{callBody=JSON.parse(options!.body as string);return Response.json({choices:[{message:{content:html}}]});};
 try {
  assert.equal((await generate(req('/api/generate',{...body,token:'bad'}))).status,403);
  assert.equal((await generate(req('/api/generate',body))).status,200);assert.ok(callBody.messages[1].content.includes('Modern Editorial'));
  const saved=(await getOrder(order.id))!;const context={params:Promise.resolve({slug:saved.siteSlug!})};
  assert.equal((await serveSite(req('/site/'+saved.siteSlug),context)).status,404);
  assert.equal((await preview(req(`/api/site-preview?order=${order.id}&t=bad`))).status,403);
  const pre=await preview(req(`/api/site-preview?order=${order.id}&t=${token}`));assert.equal(pre.status,200);assert.ok(pre.headers.get('Content-Security-Policy')?.includes('sandbox'));assert.ok(!pre.headers.get('Content-Security-Policy')?.includes('allow-same-origin'));
  assert.equal((await publish(req('/api/site-preview',body))).status,200);
  assert.equal(await (await serveSite(req('/site/'+saved.siteSlug),context)).text(),html);
  assert.equal((await saveDraft(req('/api/intake',d))).status,403);
  const edited={...d,essentials:{...d.essentials,bio:'Updated research bio'}};
  assert.equal((await editDraft(req('/api/editor',{...body,draft:edited}))).status,200);
  assert.equal((await (await readDraft(req(`/api/editor?order=${order.id}&t=${token}`))).json()).essentials.bio,'Updated research bio');
  assert.equal((await editDraft(req('/api/editor',{...body,draft:{...edited,draftId:crypto.randomUUID()}}))).status,400);
  global.fetch=async()=>Response.json({choices:[{message:{content:'<html>truncated'}}]});
  assert.equal((await generate(req('/api/generate',body))).status,502);assert.equal(await (await serveSite(req('/site/'+saved.siteSlug),context)).text(),html);
  await acquireLease(`generation:${order.id}`,'other',60);assert.equal((await generate(req('/api/generate',body))).status,409);await releaseLease(`generation:${order.id}`,'other');
  await saveOrder({...saved,status:'paid',accessExpiresAt:Date.now()-1000});assert.equal((await serveSite(req('/site/'+saved.siteSlug),context)).status,410);
 } finally {global.fetch=realFetch;}
});
test("checkout refuses missing content; renewal preserves the owning site's URL and is idempotent",async()=>{
 assert.equal((await checkout(req('/api/checkout',{planId:'preview',email:'owner@example.test'}))).status,400);
 const d=draft();await kvSet(`draft:${d.draftId}`,d);const first=await createOrder({planId:'preview',draftId:d.draftId,email:'owner@example.test'});await markOrderPaid(first.id);const paid=(await getOrder(first.id))!;await saveOrder({...paid,siteSlug:'ada-existing'});
 const r=await checkout(req('/api/checkout',{planId:'year',email:paid.email,orderId:first.id,token:createAccessToken(first.id)}));assert.equal(r.status,200);const {orderId}=await r.json();await markOrderPaid(orderId);const renewed=(await getOrder(first.id))!;assert.equal(renewed.siteSlug,'ada-existing');assert.equal(renewed.accessExpiresAt,paid.accessExpiresAt!+365*86_400_000);await markOrderPaid(orderId);assert.equal((await getOrder(first.id))?.accessExpiresAt,renewed.accessExpiresAt);
});
test("lease ownership and upload safety",async()=>{
 assert.equal(await acquireLease('test-lock','one',30),true);assert.equal(await acquireLease('test-lock','two',30),false);await releaseLease('test-lock','two');assert.equal(await acquireLease('test-lock','two',30),false);await releaseLease('test-lock','one');assert.equal(await acquireLease('test-lock','two',30),true);
 const form=new FormData();form.append('file',new File(['<svg/>'],'payload.svg',{type:'image/svg+xml'}));assert.equal((await upload(new NextRequest('http://localhost/api/upload',{method:'POST',body:form}))).status,415);
});
test("text extraction preserves readable source",async()=>{
 const r=await extractDocumentText({bytes:new TextEncoder().encode('Ada Chen\nResearcher\n2022 - 2026'),name:'cv.txt',type:'text/plain'});assert.ok(r.text.includes('2022 - 2026'));
 if(process.env.CV_TEST_PDF){const p=await extractDocumentText({bytes:readFileSync(process.env.CV_TEST_PDF),name:'resume.pdf',type:'application/pdf'});assert.ok(p.charCount>1000,p.error);}
});
