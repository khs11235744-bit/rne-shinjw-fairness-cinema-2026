import {DATA,esc,groupLabels,buildScenes} from './scenes.js';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import {animate,stagger} from 'motion';
import * as THREE from 'three';
import * as echarts from 'echarts/core';
import {BarChart} from 'echarts/charts';
import {GridComponent,TooltipComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import Vizzu from 'vizzu';
import {startMobile} from './mobile.js';
import './style.css';

echarts.use([BarChart,GridComponent,TooltipComponent,CanvasRenderer]);
const key='khs-rne-shinjw-cinema-2026';
const channelName='khs-rne-shinjw-presentation';
const query=new URLSearchParams(window.location.search);
const isPresenter=query.has('presenter');
const isAudience=query.has('audience');
const $=(sel,root=document)=>root.querySelector(sel);
const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
const bc='BroadcastChannel' in window?new BroadcastChannel(channelName):null;
const state={index:0,quizIndex:0,quizFilter:'ALL',answer:false,tour:null,demo:false,clockStart:Number(localStorage.getItem(key+'-start')||0)};
const questions=DATA.questions.map((a,i)=>({group:a[0],q:a[1],a:a[2],i}));
const filterNames=['ALL','S','T','A','T2'];
const seconds=v=>String(Math.floor(Math.max(0,v)/60)).padStart(2,'0')+':'+String(Math.floor(Math.max(0,v)%60)).padStart(2,'0');
const numeral=v=>Math.round(v).toLocaleString('ko-KR');
function modalHtml(){
 return [
 '<div id="qa-root" role="dialog" aria-modal="true" aria-label="STAT 모의심사"><div class="qa-shell">',
 '<div class="qa-heading"><div><div class="qa-eyebrow">S T A T / STUDENT RESEARCH DEFENSE</div><h2>심사위원 예상질문 32개</h2></div><button id="qa-close" class="qa-close">✕ 닫기</button></div>',
 '<div id="qa-filters" class="qa-pills"></div>',
 '<div class="qa-question"><div class="qa-number" id="qa-no"></div><h3 id="qa-question"></h3></div>',
 '<div class="qa-answer" id="qa-answer" hidden></div>',
 '<div class="qa-footer"><button class="chrome-btn" id="qa-prev">◀ 이전</button><button class="chrome-btn primary" id="qa-answer-toggle">모범 답변 보기</button><button class="chrome-btn" id="qa-next">다음 ▶</button><div class="qa-score">자체 연습 평가 <select id="qa-grade" aria-label="모의 답변 평가"><option value="">미평가</option><option value="1">1 / 5</option><option value="2">2 / 5</option><option value="3">3 / 5</option><option value="4">4 / 5</option><option value="5">5 / 5</option></select></div></div>',
 '<p class="qa-caution" id="qa-summary"></p></div></div>',
 '<div id="refs-root" role="dialog" aria-modal="true" aria-label="연구 출처"><div class="qa-shell"><div class="qa-heading"><div><div class="qa-eyebrow">RESEARCH INTEGRITY / BIBLIOGRAPHY</div><h2>출처·방법·연구의 제한</h2></div><button id="refs-close" class="qa-close">✕ 닫기</button></div><div id="refs-content"></div></div></div>'
 ].join('');
}
function frameHtml(){
 return [
 '<canvas id="ambient-webgl" aria-hidden="true"></canvas><div class="grain"></div><div class="site-overlay"></div>',
 '<div class="reveal"><div class="slides">',buildScenes(),'</div></div>',
 '<div id="chrome" role="toolbar" aria-label="프레젠테이션 제어">',
 '<button class="chrome-btn" id="btn-prev" aria-label="이전 장면">◀</button>',
 '<div class="meta"><span class="counter" id="slide-counter">01 / 11</span><span class="who" id="current-role">발표자 1</span></div>',
 '<button class="chrome-btn" id="btn-next" aria-label="다음 장면">▶</button><span id="clock">07:00</span>',
 '<button class="chrome-btn primary text-label" id="btn-timer">시작</button>',
 '<button class="chrome-btn text-label" id="btn-presenter" title="발표자 창 P">발표자</button>',
 '<button class="chrome-btn text-label" id="btn-qa" title="질의응답 Q">STAT</button>',
 '<button class="chrome-btn text-label hide-mobile" id="btn-sources" title="출처 B">출처</button>',
 '<button class="chrome-btn text-label hide-mobile" id="btn-demo">시연</button>',
 '<button class="chrome-btn text-label" id="btn-full" title="전체화면 F">⛶</button></div>',
 '<div id="mini-progress" aria-hidden="true"></div>',
 '<div id="floating-help">← → 슬라이드 · <b>P</b> 발표자 · <b>Q</b> 질의응답 · <b>F</b> 전체화면</div>',
 modalHtml()
 ].join('');
}
function notifyClock(){bc?.postMessage({type:'clock',startedAt:state.clockStart})}
function startClock(){state.clockStart=Date.now();localStorage.setItem(key+'-start',String(state.clockStart));notifyClock();drawClock()}
function resetClock(){state.clockStart=0;localStorage.removeItem(key+'-start');notifyClock();drawClock()}
function remaining(){return state.clockStart?DATA.duration-(Date.now()-state.clockStart)/1000:DATA.duration}
function drawClock(){
 const e=$('#clock');if(!e)return;
 const left=remaining();e.textContent=left<0?'+'+seconds(-left):seconds(left);
 e.classList.toggle('alert',left<60&&left>0);e.classList.toggle('danger',left<=0);
 const b=$('#btn-timer');if(b)b.textContent=state.clockStart?'초기화':'시작';
}
function sync(){bc?.postMessage({type:'slide',index:state.index,origin:isAudience?'audience':'deck'})}
function displayIndex(i,publish=true){
 const s=DATA.slides[i];if(!s)return;
 state.index=i;
 const c=$('#slide-counter');if(c)c.textContent=String(i+1).padStart(2,'0')+' / '+DATA.slides.length;
 const w=$('#current-role');if(w)w.textContent=s.role;
 const bar=$('#mini-progress');if(bar)bar.style.width=(100*(i+1)/DATA.slides.length)+'%';
 const prev=$('#btn-prev'),next=$('#btn-next');if(prev)prev.disabled=i===0;if(next)next.disabled=i===DATA.slides.length-1;
 document.title=(i+1)+'/'+DATA.slides.length+' · '+s.title.replace('\n',' ')+' | 포항고 R&E';
 localStorage.setItem(key+'-slide',String(i));if(publish)sync();
}
function fullscreen(){if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});else document.documentElement.requestFullscreen?.().catch(()=>{})}
function openPresenter(){
 const u=new URL(location.href);u.search='?presenter=1';u.hash='';
 const p=window.open(u.href,'shinjw-presenter','popup=yes,width=1300,height=820');
 if(!p)alert('팝업이 차단되었습니다. 이 사이트의 팝업을 허용해 주세요.');
 else setTimeout(sync,400);
}
function keys(deck){
 document.addEventListener('keydown',e=>{
  if(['INPUT','SELECT','TEXTAREA'].includes(e.target?.tagName))return;
  const k=e.key.toLowerCase();
  if(k==='q'){e.preventDefault();e.stopImmediatePropagation();$('#qa-root').classList.contains('visible')?closeQA():openQA();}
  if(k==='b'){e.preventDefault();e.stopImmediatePropagation();showRefs()}
  if(k==='p'){e.preventDefault();e.stopImmediatePropagation();openPresenter()}
  if(k==='f'){e.preventDefault();e.stopImmediatePropagation();fullscreen()}
  if(k==='r'){e.preventDefault();e.stopImmediatePropagation();resetClock()}
  if(k==='escape'){closeQA();closeRefs()}
 },true);
}
let graph=null,vizzu=null;
function countUp(el){
 if(!el)return;
 const final=Number(el.dataset.count);const digits=Number(el.dataset.dec||0);
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=final.toFixed(digits);return}
 el.textContent=(0).toFixed(digits);
 animate(0,final,{duration:1.2,ease:'easeOut',onUpdate:v=>{el.textContent=Number(v).toFixed(digits)}});
}
function sceneMotion(i){
 const scene=$$('.scene')[i];if(!scene)return;
 $$('[data-count]',scene).forEach((el,k)=>setTimeout(()=>countUp(el),170+k*100));
 $$('[data-fill]',scene).forEach((el,k)=>{el.style.width='0%';setTimeout(()=>{el.style.transition='width 1150ms cubic-bezier(.18,.82,.2,1)';el.style.width=el.dataset.fill+'%'},190+k*90)});
 const dots=$$('.dot',scene);
 if(dots.length){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)dots.forEach(d=>d.style.transform='scale(1)');
  else animate(dots,{scale:[.4,1],opacity:[.25,1]},{duration:.4,delay:stagger(.011),ease:'easeOut'});
 }
 if(DATA.slides[i].kind==='stat')showDataChart();
 if(DATA.slides[i].kind==='doubt')showVizzuChart();
}
function showDataChart(){
 const e=$('#precision-chart');if(!e)return;
 try{
  if(!graph)graph=echarts.init(e,null,{renderer:'canvas',devicePixelRatio:Math.min(devicePixelRatio,1.5)});
  graph.clear();
  graph.setOption({animationDuration:1450,animationEasing:'cubicOut',grid:{top:28,bottom:15,right:80,left:30,containLabel:true},
  xAxis:{type:'value',max:100,axisLabel:{fontSize:15,color:'#59776b',formatter:'{value}%'},axisLine:{show:false},splitLine:{lineStyle:{color:'#395b4730'}}},
  yAxis:{type:'category',data:['기타 방식','각자 소비'],axisLabel:{fontSize:18,fontWeight:700,color:'#2b5147'},axisLine:{show:false},axisTick:{show:false}},
  series:[{type:'bar',barWidth:48,itemStyle:{borderRadius:[0,10,10,0],color:item=>item.dataIndex===1?'#147662':'#b3a889'},label:{show:true,position:'right',color:'#274c43',fontSize:24,fontWeight:900,formatter:'{c}%'},data:[22.6,77.4]}],
  tooltip:{trigger:'axis',formatter:arr=>arr.map(v=>esc(v.name)+': '+v.value+'%').join('<br>')}});
 }catch(err){console.warn('통계 애니메이션 대체 표시',err)}
}
function showVizzuChart(){
 const e=$('#vizzu-demo');if(!e||vizzu)return;
 try{
  vizzu=new Vizzu('vizzu-demo',{data:{series:[{name:'응답',values:['동의','보통','비동의']},{name:'비율',values:[37.7,31.1,31.1]}]}});
  Promise.resolve(vizzu.animate({x:'응답',y:'비율'})).catch(err=>{console.warn('Vizzu fallback',err);e.style.display='none'});
 }catch(err){console.warn('Vizzu fallback',err);e.style.display='none'}
}
function billControls(){
 $$('.choice-button').forEach(button=>{
  button.addEventListener('click',()=>{
   $$('.choice-button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   const values=button.dataset.choice==='spent'?[6000,15000]:[10500,10500];
   ['#bill-a','#bill-b'].forEach((sel,i)=>{
    const el=$(sel);if(!el)return;
    const from=Number(el.textContent.replace(/,/g,''))||0;
    animate(from,values[i],{duration:.68,ease:'easeOut',onUpdate:v=>el.textContent=numeral(v)});
   });
  });
 });
}
function stopDemo(){
 if(state.tour)clearInterval(state.tour);state.tour=null;state.demo=false;
 const e=$('#btn-demo');if(e)e.textContent='시연';
}
function demoTour(deck){
 if(state.demo){stopDemo();return}
 stopDemo();state.demo=true;$('#btn-demo').textContent='중단';deck.slide(0);
 state.tour=setInterval(()=>{if(deck.getIndices().h>=DATA.slides.length-1){stopDemo();return}deck.next()},3600);
}
function positionSlides(){
 const slides=$('.reveal .slides'),stage=$('.reveal');
 if(!slides||!stage)return;
 const W=stage.clientWidth,H=stage.clientHeight;
 const scale=Math.max(.15,Math.min(W/1600,H/900));
 const x=Math.max(0,(W-1600*scale)/2),y=Math.max(0,(H-900*scale)/2);
 slides.style.setProperty('transform','translate('+x+'px, '+y+'px) scale('+scale+')','important');
}
function beginDeck(){
 document.body.classList.toggle('audience',isAudience);
 $('#app').innerHTML=frameHtml();
 const deck=new Reveal($('.reveal'),{width:1600,height:900,margin:0,minScale:.15,maxScale:1.75,hash:true,controls:false,progress:false,center:false,transition:'fade',transitionSpeed:'fast',autoSlide:0});
 deck.initialize().then(()=>{
  positionSlides();const i=deck.getIndices().h||0;displayIndex(i,false);sceneMotion(i);setupThree();
 });
 deck.on('slidechanged',evt=>{displayIndex(evt.indexh,true);sceneMotion(evt.indexh);requestAnimationFrame(positionSlides)});
 $('#btn-prev').addEventListener('click',()=>{stopDemo();deck.prev()});
 $('#btn-next').addEventListener('click',()=>{stopDemo();deck.next()});
 $('#btn-timer').addEventListener('click',()=>state.clockStart?resetClock():startClock());
 $('#btn-presenter').addEventListener('click',openPresenter);
 $('#btn-qa').addEventListener('click',openQA);
 $('#btn-sources').addEventListener('click',showRefs);
 $('#btn-demo').addEventListener('click',()=>demoTour(deck));
 $('#btn-full').addEventListener('click',fullscreen);
 bc&&(bc.onmessage=ev=>{
  const msg=ev.data||{};
  if(msg.type==='slide' && Number.isInteger(msg.index) && msg.origin!=='audience' && deck.getIndices().h!==msg.index)deck.slide(msg.index,0,0);
  if(msg.type==='clock'){state.clockStart=Number(msg.startedAt)||0;drawClock();}
  if(msg.type==='request')sync();
 });
 window.addEventListener('resize',()=>requestAnimationFrame(positionSlides));keys(deck);billControls();initQA();initRefs();drawClock();setInterval(drawClock,300);
 window.rneDeck=deck;
}
function listQuestions(){return questions.filter(x=>state.quizFilter==='ALL'||x.group===state.quizFilter)}
function gradeData(){try{return JSON.parse(localStorage.getItem(key+'-grades')||'{}')}catch{return {}}}
function initQA(){
 $('#qa-close').addEventListener('click',closeQA);
 $('#qa-root').addEventListener('click',e=>{if(e.target===$('#qa-root'))closeQA()});
 $('#qa-filters').innerHTML=filterNames.map(f=>'<button class="qa-pill" data-filter="'+f+'" aria-pressed="'+String(f===state.quizFilter)+'">'+(f==='ALL'?'전체 32문항':groupLabels[f])+'</button>').join('');
 $$('.qa-pill').forEach(e=>e.addEventListener('click',()=>{state.quizFilter=e.dataset.filter;state.quizIndex=0;state.answer=false;drawQuestion()}));
 $('#qa-prev').addEventListener('click',()=>moveQuestion(-1));
 $('#qa-next').addEventListener('click',()=>moveQuestion(1));
 $('#qa-answer-toggle').addEventListener('click',()=>{state.answer=!state.answer;drawQuestion()});
 $('#qa-grade').addEventListener('change',e=>{
  const item=listQuestions()[state.quizIndex];if(!item)return;
  const grades=gradeData();if(e.target.value)grades[item.i]=Number(e.target.value);else delete grades[item.i];
  localStorage.setItem(key+'-grades',JSON.stringify(grades));drawQuestion();
 });
 drawQuestion();
}
function moveQuestion(shift){const all=listQuestions();state.quizIndex=(state.quizIndex+shift+all.length)%all.length;state.answer=false;drawQuestion()}
function drawQuestion(){
 const rows=listQuestions(),item=rows[state.quizIndex];if(!item)return;
 $$('.qa-pill').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===state.quizFilter)));
 $('#qa-no').textContent=String(state.quizIndex+1).padStart(2,'0')+' / '+rows.length+' · '+groupLabels[item.group];
 $('#qa-question').textContent=item.q;$('#qa-answer').textContent=item.a;
 $('#qa-answer').hidden=!state.answer;$('#qa-answer-toggle').textContent=state.answer?'모범 답변 숨기기':'모범 답변 보기';
 const grades=gradeData();$('#qa-grade').value=grades[item.i]?String(grades[item.i]):'';
 const count=Object.keys(grades).length,avg=count?(Object.values(grades).reduce((a,b)=>a+Number(b),0)/count).toFixed(2):'—';
 $('#qa-summary').textContent='자체 평가 '+count+'/32개 · 평균 '+avg+'/5점. 주장·증거·해석 범위를 스스로 연습하는 기능으로 실제 심사 점수를 예측하지 않습니다.';
}
function openQA(){closeRefs();$('#qa-root').classList.add('visible');$('#qa-answer-toggle').focus()}
function closeQA(){if($('#qa-root'))$('#qa-root').classList.remove('visible')}
function initRefs(){
 $('#refs-close').addEventListener('click',closeRefs);
 $('#refs-root').addEventListener('click',e=>{if(e.target===$('#refs-root'))closeRefs()});
 $('#refs-content').innerHTML='<p class="scene__lead" style="font-size:19px!important;margin-top:25px!important">설문 수치는 참여 동의 106건 기준입니다. 중복 가능 3쌍과 단일학교 편의표집·자기보고 문항이라는 한계가 있습니다. 학생 개별 응답과 인적사항은 공개하지 않습니다.</p>'+DATA.references.map(r=>'<div style="border-top:1px solid #ffffff24;padding:15px 0;display:flex;gap:15px;justify-content:space-between"><div><div style="font-size:13px;color:#64f5d2">'+esc(r.label)+'</div><strong style="font-size:19px">'+esc(r.title)+'</strong><p style="color:#b8d3dc;font-size:15px;margin:4px 0">'+esc(r.detail)+'</p></div>'+(r.url?'<a style="color:#64f5d2;white-space:nowrap" href="'+esc(r.url)+'" rel="noopener noreferrer" target="_blank">원문 ↗</a>':'')+'</div>').join('');
}
function showRefs(){closeQA();$('#refs-root').classList.add('visible')}
function closeRefs(){if($('#refs-root'))$('#refs-root').classList.remove('visible')}
function setupThree(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const canvas=$('#ambient-webgl');if(!canvas)return;
 try{
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.3));renderer.setSize(innerWidth,innerHeight,false);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(53,innerWidth/innerHeight,.1,100);camera.position.z=12;
  const shape=new THREE.Mesh(new THREE.TorusKnotGeometry(2.7,.42,100,12,2,5),new THREE.MeshBasicMaterial({color:0x55f5d6,wireframe:true,transparent:true,opacity:.16}));scene.add(shape);
  const verts=new Float32Array(360*3);
  for(let i=0;i<360;i++){const ang=Math.random()*Math.PI*2;const rad=3+Math.random()*6;verts[i*3]=Math.cos(ang)*rad;verts[i*3+1]=(Math.random()-.5)*10;verts[i*3+2]=Math.sin(ang)*rad}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(verts,3));
  const stars=new THREE.Points(geometry,new THREE.PointsMaterial({color:0x89efdc,size:.033,transparent:true,opacity:.58}));scene.add(stars);
  let last=0;
  function step(t){requestAnimationFrame(step);if(document.hidden||t-last<32)return;last=t;shape.rotation.x+=.001;shape.rotation.y+=.002;stars.rotation.y-=.00016;camera.position.x+=(Math.sin(state.index*.46)*1.2-camera.position.x)*.019;renderer.render(scene,camera)}
  requestAnimationFrame(step);
  addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()});
 }catch(err){console.warn('장치 WebGL 연출 미지원; 2D fallback 제공',err);canvas.hidden=true}
}
function buildPresenterHtml(){
 return '<div id="presenter-shell"><div class="presenter-preview"><iframe title="실시간 관객 화면" src="./index.html?audience=1"></iframe></div><aside class="presenter-sidebar"><div class="presenter-top"><span class="identity">POHANG R&E / PRESENTER MODE</span><span class="timer" id="presenter-clock">07:00</span></div><div class="presenter-main"><div class="small-title" id="presenter-role"></div><h2 id="presenter-title"></h2><div class="notes" id="presenter-notes"></div><div class="presenter-next"><small>다음 장면</small><h3 id="presenter-next-title"></h3><p id="presenter-next-lead"></p></div><p style="color:#b2cbd6;font-size:14px;margin:18px 0">← → 이동 · Q 모의심사 · R 타이머 초기화</p></div><div class="presenter-buttons"><button class="chrome-btn" id="pres-prev">◀ 이전</button><button class="chrome-btn" id="pres-next">다음 ▶</button><button class="chrome-btn primary" id="pres-start">7분 시작</button><button class="chrome-btn" id="pres-reset">시계 초기화</button><button class="chrome-btn" id="pres-qa">STAT 32문항</button><button class="chrome-btn" id="pres-refs">출처</button></div></aside></div>'+modalHtml();
}
function beginPresenter(){
 $('#app').innerHTML=buildPresenterHtml();
 function update(i){
  state.index=Math.max(0,Math.min(DATA.slides.length-1,i));
  const s=DATA.slides[state.index],next=DATA.slides[state.index+1];
  $('#presenter-role').textContent=s.role+' · '+(state.index+1)+'/'+DATA.slides.length+'장 · 권장 '+s.sec+'초';
  $('#presenter-title').textContent=s.title.replace('\n',' ');
  $('#presenter-notes').textContent=s.notes;
  $('#presenter-next-title').textContent=next?.title.replace('\n',' ')||'발표 종료';
  $('#presenter-next-lead').textContent=next?.lead||'수고하셨습니다.';
 }
 function goto(shift){
  const i=Math.max(0,Math.min(DATA.slides.length-1,state.index+shift));
  update(i);localStorage.setItem(key+'-slide',String(i));bc?.postMessage({type:'slide',index:i,origin:'presenter'});
 }
 update(Number(localStorage.getItem(key+'-slide')||0));
 function drawPresenterClock(){const v=remaining();const c=$('#presenter-clock');c.textContent=v<0?'+'+seconds(-v):seconds(v);c.style.color=v<=60?'#ffb88d':'#edfaff'}
 $('#pres-prev').addEventListener('click',()=>goto(-1));
 $('#pres-next').addEventListener('click',()=>goto(1));
 $('#pres-start').addEventListener('click',startClock);
 $('#pres-reset').addEventListener('click',resetClock);
 $('#pres-qa').addEventListener('click',openQA);
 $('#pres-refs').addEventListener('click',showRefs);
 if(bc)bc.onmessage=evt=>{const msg=evt.data||{};if(msg.type==='slide')update(msg.index);if(msg.type==='clock'){state.clockStart=Number(msg.startedAt)||0;drawPresenterClock()}};
 document.addEventListener('keydown',e=>{
  if(['INPUT','SELECT','TEXTAREA'].includes(e.target?.tagName))return;
  if($('#qa-root').classList.contains('visible')||$('#refs-root').classList.contains('visible')){if(e.key==='Escape'){closeQA();closeRefs()}return}
  if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();goto(1)}
  if(e.key==='ArrowLeft'){e.preventDefault();goto(-1)}
  if(e.key.toLowerCase()==='q')openQA();
  if(e.key.toLowerCase()==='r')resetClock();
 });
 initQA();initRefs();drawPresenterClock();setInterval(drawPresenterClock,300);bc?.postMessage({type:'request'});
}
window.addEventListener('rne-cinematic-start',(event)=>{
 const n=event.detail?.speakers===2?2:1;
 DATA.slides.forEach((slide,index)=>{slide.role=n===2?(index<6?'발표자 1':'발표자 2'):'대표 발표자'});
 state.clockStart=0;
 startClock();
 const id=document.querySelector('#slide-counter')?.textContent||'1';
 const i=Math.max(0,(parseInt(id,10)||1)-1);
 displayIndex(i,false);
 if(document.querySelector('#presenter-role')){
  const role=document.querySelector('#presenter-role');role.textContent=(n===1?'대표 발표자':'발표자 '+(i<6?'1':'2'))+' · '+(i+1)+'/11장';
 }
 window.dispatchEvent(new Event('rne:mobile-speakercount'));
});
if(isPresenter)beginPresenter();else if(!isAudience && matchMedia('(max-width:700px) and (orientation:portrait)').matches){startMobile({modalHtml,initQA,initRefs,openQA,showRefs,startClock,resetClock,remaining,isStarted:()=>!!state.clockStart})}else beginDeck();
