import {preview} from 'vite';
import {createRequire} from 'node:module';
import path from 'node:path';
const {chromium}=createRequire(import.meta.url)(path.join(process.env.USERPROFILE,'Documents','Pohang-RnE-Studio','node_modules','playwright'));
const srv=await preview({preview:{port:4177,strictPort:true,host:'127.0.0.1'}});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:1600,height:900}});
await page.goto('http://127.0.0.1:4177',{waitUntil:'networkidle'});
await page.locator('.scene').first().waitFor();
for(const i of [0,1,3,8,10]){
 await page.evaluate(i=>window.rneDeck.slide(i),i);await page.waitForTimeout(600);
 const x=await page.evaluate(i=>{
 const stage=document.querySelector('.reveal'),layer=document.querySelector('.reveal .slides'),sec=document.querySelectorAll('.reveal .slides>section.scene')[i];
 const desc=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {x:r.x,y:r.y,w:r.width,h:r.height,transform:s.transform,top:s.top,left:s.left,margin:s.margin,style:e.getAttribute('style')?.slice(0,400)}};
 return {stage:desc(stage),layer:desc(layer),slide:desc(sec)};
 },i);
 console.log('SLIDE'+i+'='+JSON.stringify(x));
}
await browser.close();await new Promise(r=>srv.httpServer.close(r));
