# 같은 돈이 공정한 돈일까? — 신진욱팀 R&E 시네마틱 발표

2026 포항고등학교 인문사회 R&E · 11장 · 정확히 420초 분량의 웹 발표. PowerPoint 파일이 아닌 웹앱입니다.

## 핵심 결과와 주의

- 설문 총 제출 107건 중 참여 동의 106건 분석. 응답자 인적사항 동일한 사례 3쌍은 중복 가능성이 있으나 확정하지 않았습니다. 106 **명**이 아니라 106 **건**으로 표시합니다.
- Q07: 각자 먹은 만큼 82/106 = 77.4%.
- Q09: 1,000원 미만 차액을 정산하지 않아도 된다 51/106 = 48.1%; 정확히 정산 26/106 = 24.5%.
- Q11: 경제적으로 어려운 친구 배려에 긍정 54/106 = 50.9%; 중립 33/106 = 31.1%, 부정 19/106 = 17.9%.
- Q13: 친밀도에 따라 공정성 판단이 달라질 수 있다는 데 동의 40/106 = 37.7%; 중립·비동의 각 31.1%.
- Q17: 사전 합의가 갈등 감소에 도움이 된다고 **생각한** 응답 73/106 = 68.9%. 실험으로 갈등 감소가 입증된 것이 아닙니다.
- 단일학교 편의표본·자기보고 자료로 청소년 전체 일반화나 인과관계 주장 금지. 초안에서 계획했던 별도 친밀도 실험 및 인터뷰 수행 여부는 확인되지 않아 발표 결과에 넣지 않았습니다.

## 실행

Windows Node.js 22 이상.

    npm install
    npm run dev
    npm test
    npm run build

빌드 결과는 dist/에 생성됩니다. 비즈니스 서비스·원본 R&E 스튜디오와 분리되어 있습니다.

## 발표 조작

- ← / →, Space: 슬라이드 이동.
- ‘시작’ 버튼: 7분 타이머, 이후 ‘초기화’.
- P 또는 ‘발표자’: 별도 창에 장면별 학생 대본·다음 슬라이드·타이머 표시. 원래 창은 관객용으로 사용.
- Q 또는 ‘STAT’: 자체 구축한 연구 설계·통계·주장/한계·교과 적용 질문 32개와 모범답안, 1~5점 자체 연습 평가.
- B: 참고자료·연구의 한계.
- F: 전체 화면.
- ‘시연’: 장면의 움직임을 3.6초 간격으로 넘기는 효과 미리보기(실제 7분 발표와 다름).
- 휴대전화 세로 화면: 읽기 편한 모바일 카드 뷰어 제공.
- 발표자 모드 실시간 동기화는 **동일 브라우저·동일 출처**에서 BroadcastChannel을 사용합니다.

## 비교·적용한 공개 프로젝트

핵심 라이브러리(프로덕션 번들):
- Reveal.js — 프레젠테이션 엔진 / https://github.com/hakimel/reveal.js
- Motion — 객체 애니메이션 / https://github.com/motiondivision/motion
- Vizzu — 애니메이션 데이터 시각화 / https://github.com/vizzuhq/vizzu-lib
- ECharts — 캔버스 통계 그래프 / https://github.com/apache/echarts
- Three.js — WebGL 공간 배경 / https://github.com/mrdoob/three.js

컨셉·효과 참고(실제 런타임을 번들에 넣지는 않음):
- HyperFrames — 분기·발표자 UX: https://github.com/heygen-com/hyperframes
- Spatial Deck — HTML 발표 접근: https://github.com/ibrews/spatial-deck
- Motion Canvas — 씬 모션 구성: https://github.com/motion-canvas/motion-canvas
- Theatre.js — 키프레임: https://github.com/theatre-js/theatre
- PixiJS — 입자·GPU 시각효과: https://github.com/pixijs/pixijs

비교 후보는 역할별 특성으로 선별한 **제작 적합성 평가**이며, 이 모든 후보를 벤치마크하거나 실행 설치한 결과는 아닙니다. GSAP과 Remotion은 각자의 특별한 이용 허가 조건이 있어 프로덕션에서 제외했습니다.

## 교육적 맥락

분배적 정의의 평등·형평·필요(Morton Deutsch), 원초적 입장·무지의 베일(John Rawls), 담론 윤리(Jürgen Habermas)를 연구 결과 해석에 적용했습니다. 학생 설문이 이론의 인과관계를 입증한 것은 아닙니다.

- Deutsch (1975): https://doi.org/10.1111/j.1540-4560.1975.tb01000.x
- Rawls: https://plato.stanford.edu/entries/original-position/
- Habermas: https://plato.stanford.edu/entries/habermas/

본 저장소에는 **학생별 원자료, 학번, 전화번호, 응답자의 이름**을 넣지 않았습니다. 발표 장면과 본문의 집계표만 공개합니다.

## 확인

실제 Windows Chrome + Playwright로 11장 이동, 원형 7분 시계, 영수증 분할, ECharts 렌더링, 별도 발표자 창, STAT 문답·채점, 휴대전화 화면을 확인합니다. QA 파일은 test/에 있습니다.


## 배포된 발표 주소 (2026-10-22 검증)

- 웹 발표: https://shinjw-rne-fairness-2026.khs11235744.workers.dev
- GitHub 소스: https://github.com/khs11235744-bit/rne-shinjw-fairness-cinema-2026
- 공개 주소에서 HTTP 200 / 11개 슬라이드 / ECharts / Vizzu WebAssembly / STAT 질문 UI 확인.

## 교사용 첨부자료

- [7분 학생 발표자 대본](docs/7분_발표자_대본.md)
- [STAT 예상 질문 32개와 모범 답변](docs/STAT_32문항_모범답안.md)
- [오픈소스 50개 조사표](docs/GitHub_50_모션그래픽_비교.md)
- [적용·참고 TOP 10 비교](docs/TOP10_선정비교.md)

GitHub Actions가 연구 스토리 11장·420초·STAT 32문항 구조와 사이트 빌드를 확인합니다. Cloudflare 게시 자체는 별도의 현장 배포 명령으로 수행하며, GitHub Actions에 사용자 비밀값이나 Cloudflare 키를 넣지 않았습니다.


## 2026-10-30 V5 서사 개정 · 정산은 끝이 아니라 다음

- 웹 발표의 11개 장면·420초 구조를 보존하면서 9~11장 해석·결론을 수정했습니다.
- 뒤르켐(1893)의 기계적/유기적 연대를 비유적 해석 틀로 추가했습니다. 학생 설문에서 관계가 실제 확장되었음을 관찰한 것은 아닙니다.
- 주요 근거: Q07 82/106건, Q09 51/106건, Q11 54/106건, Q13 40/106건, Q17 73/106건.
- 인터뷰 관련 계획은 있지만 검증 가능한 전사·분석표가 없어 발표 결과로 인용하지 않습니다.
- **주의:** GitHub 원본 코드를 수정한 것으로 Cloudflare 운영 사이트 재배포는 별도의 절차가 필요합니다. 웹 운영 주소의 V5 반영은 별도로 확인해야 합니다.
- V5 PPTX는 23장 본편 + 4장 부록 별도 아티팩트이며 웹사이트의 11장·7분과 장수는 다릅니다.
