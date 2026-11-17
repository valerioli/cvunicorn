import test from 'node:test';
import assert from 'node:assert/strict';
import {NextRequest} from 'next/server';
import {proxy} from '../src/proxy';
const route=(host:string,path='/')=>proxy(new NextRequest(`https://${host}${path}`,{headers:{host}}));
test('maths host serves the H5 and its module assets while rejecting unrelated routes',()=>{
 for(const p of ['/','/app.js','/effects.mjs','/template.config.mjs','/motion.css']){
  const r=route('maths.cvunicorn.com',p);assert.equal(new URL(r.headers.get('x-middleware-rewrite')!).pathname,'/coconut-h5'+(p==='/'?'/index.html':p));
 }
 assert.equal(route('maths.cvunicorn.com','/api/orders').status,404);
 assert.equal(route('maths.cvunicorn.com','/site/private').status,404);
});
test('existing marketing, portfolio and generated host behavior remains unchanged',()=>{
 assert.equal(route('cvunicorn.com').headers.get('x-middleware-rewrite'),null);
 assert.equal(new URL(route('valerio.cvunicorn.com').headers.get('x-middleware-rewrite')!).pathname,'/valerio-original');
 assert.equal(new URL(route('mayachen.cvunicorn.com').headers.get('x-middleware-rewrite')!).pathname,'/case-study-sites/maya-chen');
 assert.equal(new URL(route('some-generated.cvunicorn.com').headers.get('x-middleware-rewrite')!).pathname,'/site/some-generated');
});
