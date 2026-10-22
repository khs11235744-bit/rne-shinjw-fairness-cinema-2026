import {createRequire} from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(path.join(process.env.USERPROFILE,'Documents','Pohang-RnE-Studio','node_modules','playwright'));
const browser=await chromium.launch({headless:true,channel:'chrome'});
const site='https://shinjw-rne-fairness-2026.khs11235744.workers.dev';
let errors=[],bad=[],messages=[];
try{
 const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('response',r=>{if(r.status()>=400)bad.push({status:r.status(),url:r.url()})});
 page.on('console',m=>{if(m.type()==='error')messages.push(m.text())});
 const response=await page.goto(site+'?preview=1',{waitUntil:'networkidle',timeout:65000});
 assert.equal(response.status(),200,'공개 URL HTTP 200');
 await page.locator('.reveal .slides > section.scene').first().waitFor({timeout:30000});
 assert.equal(await page.locator('.reveal .slides>section.scene').count(),11);
 await page.evaluate(()=>window.rneDeck.slide(6));await page.waitForTimeout(3600);
 const vz=await page.locator('#vizzu-demo').evaluate(e=>({visible:getComputedStyle(e).display!=='none',child:e.childElementCount,canvases:e.querySelectorAll('canvas').length}));
 await page.evaluate(()=>window.rneDeck.slide(3));await page.waitForTimeout(1000);
 const canvasCount=await page.locator('#precision-chart canvas').count();assert.ok(canvasCount>=1);
 await page.keyboard.press('q');await page.locator('#qa-root.visible').waitFor();
 const questions=await page.locator('.qa-number').innerText();
 await page.locator('#qa-close').click();
 const screenshot=path.join(process.cwd(),'test-results','deployed-main.jpg');
 await page.screenshot({path:screenshot,type:'jpeg',quality:78});
 const report={site,code:response.status(),slides:11,questionUI:questions,charts:canvasCount,vizzu:vz,errors,badResponses:bad,messages};
 fs.writeFileSync(path.join(process.cwd(),'test-results','deployed-report.json'),JSON.stringify(report,null,2),'utf8');
 console.log('LIVE_REPORT='+JSON.stringify(report));
 if(errors.length||bad.length)process.exitCode=2;
}catch(e){console.error('LIVE_FAIL='+String(e?.stack||e));process.exitCode=1}
finally{await browser.close();}
