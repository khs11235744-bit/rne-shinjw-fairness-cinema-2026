import {DATA,esc} from './scenes.js';
const $=s=>document.querySelector(s);
const fmt=v=>String(Math.floor(Math.max(0,v)/60)).padStart(2,'0')+':'+String(Math.floor(Math.max(0,v)%60)).padStart(2,'0');
function visual(s){
 switch(s.kind){
  case 'hero':return '<div class="m-symbol">≠</div><div class="m-tags"><b>평등</b><b>형평</b><b>합의</b></div>';
  case 'bill':return '<div class="m-bill"><div>친구 A <b>6,000원</b></div><div>친구 B <b>15,000원</b></div><hr><div>합계 <strong>21,000원</strong></div></div><div class="m-switch"><button data-m="equal" class="active">똑같이 나누기</button><button data-m="spent">각자 내기</button></div><div class="m-money"><span>A <strong id="m-a">10,500원</strong></span><span>B <strong id="m-b">10,500원</strong></span></div>';
  case 'method':return '<div class="m-stat"><b>107건</b> 수집 → <b>106건</b> 분석</div><div class="m-pills"><span>1학년 58건</span><span>2학년 20건</span><span>3학년 28건</span></div><p>동일 인적사항으로 반복된 응답 3쌍은 중복 가능성이 있으므로 별도로 검토했습니다.</p>';
  case 'stat':return '<div class="m-number">77.4%</div><div class="m-bar"><i style="width:77.4%"></i></div><p>106건 중 82건이 각자 먹은 금액을 부담하는 방식을 선택했습니다.</p>';
  case 'comparison':return '<div class="m-dual"><span><strong>48.1%</strong> 소액 차액을 넘겨도 됨</span><span><strong>24.5%</strong> 소액도 정확히 정산</span></div><p>답이 하나로 모이지 않았습니다.</p>';
  case 'care':return '<div class="m-stacked"><span style="width:50.9%">50.9</span><span style="width:31.1%">31.1</span><span style="width:17.9%">17.9</span></div><div class="m-pills"><span>긍정 54건</span><span>중립 33건</span><span>부정 19건</span></div>';
  case 'doubt':return '<div class="m-dual"><span><strong>37.7%</strong> 동의</span><span><strong>31.1%</strong> 보통</span><span><strong>31.1%</strong> 비동의</span></div><p>친할수록 계산을 덜 한다는 결론을 입증하지 못했습니다.</p>';
  case 'consensus':return '<div class="m-number">68.9%</div><div class="m-bar"><i style="width:68.9%"></i></div><p>73/106건이 사전 합의가 갈등 감소에 도움이 된다고 <b>생각했습니다.</b> 실제 감소 효과를 측정하지는 않았습니다.</p>';
  case 'theory':return '<div class="m-dual"><span><strong>도이치</strong> 평등·형평·필요</span><span><strong>롤스</strong> 무지의 베일</span><span><strong>하버마스</strong> 담론 윤리</span></div><p>세 이론은 설문 결과의 인과증명이 아니라 윤리적 해석 틀입니다.</p>';
  case 'transfer':return '<div class="m-dual"><span><strong>모둠 과제</strong> 역할과 기여도 협의</span><span><strong>학급 공동비용</strong> 투명성·소수 의견</span><span><strong>지역사회</strong> 참여권과 숙의</span></div>';
  case 'finale':return '<div class="m-symbol" style="font-size:70px">OUR<br>FAIRNESS</div><div class="m-tags"><b>정확성</b><b>배려</b><b>자유로운 합의</b></div>';
 }
 return '';
}
export function startMobile(opt){
 let at=0;
 const html='<div class="mobile-app"><header class="m-top"><div><small>POHANG HIGH SCHOOL</small><b>2026 R&E · 신진욱팀</b></div><span id="m-index">01/11</span></header><main class="m-stage" id="m-stage"><div class="m-kicker" id="m-kicker"></div><h1 id="m-title"></h1><p id="m-lead"></p><div id="m-visual"></div><div id="m-source"></div></main><nav class="m-nav" aria-label="모바일 발표"><button id="m-prev">◀</button><button id="m-next">다음 ▶</button><span id="m-clock">07:00</span><button id="m-timer">시작</button><button id="m-qa">STAT</button><button id="m-refs">출처</button></nav></div>';
 document.querySelector('#app').innerHTML=html+opt.modalHtml();
 const paint=()=>{
  const s=DATA.slides[at];$('#m-index').textContent=String(at+1).padStart(2,'0')+'/'+DATA.slides.length;
  $('#m-kicker').textContent=s.kicker+' · '+s.role;
  $('#m-title').textContent=s.title;$('#m-lead').textContent=s.lead;
  $('#m-visual').innerHTML=visual(s);$('#m-source').textContent='근거: '+s.source;
  $('#m-prev').disabled=at===0;$('#m-next').disabled=at===DATA.slides.length-1;
  $('#m-stage').scrollTop=0;
  const switchers=document.querySelectorAll('[data-m]');
  switchers.forEach(b=>b.addEventListener('click',()=>{
   switchers.forEach(x=>x.classList.toggle('active',x===b));
   $('#m-a').textContent=(b.dataset.m==='spent'?'6,000':'10,500')+'원';$('#m-b').textContent=(b.dataset.m==='spent'?'15,000':'10,500')+'원';
  }));
 };
 function move(n){at=Math.max(0,Math.min(DATA.slides.length-1,at+n));paint()}
 $('#m-prev').addEventListener('click',()=>move(-1));$('#m-next').addEventListener('click',()=>move(1));
 $('#m-qa').addEventListener('click',opt.openQA);$('#m-refs').addEventListener('click',opt.showRefs);
 $('#m-timer').addEventListener('click',()=>{
  if(opt.isStarted())opt.resetClock();else opt.startClock();
 });
 const display=()=>{const v=opt.remaining();$('#m-clock').textContent=v<0?'+'+fmt(-v):fmt(v);$('#m-timer').textContent=opt.isStarted()?'초기화':'시작'};
 let touch=0;
 $('#m-stage').addEventListener('touchstart',e=>{touch=e.touches[0].clientX},{passive:true});
 $('#m-stage').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touch;if(Math.abs(dx)>80)move(dx<0?1:-1)},{passive:true});
 window.addEventListener("rne:mobile-speakercount",paint);opt.initQA();opt.initRefs();paint();display();setInterval(display,400);
}
