# 웹 발표 모션그래픽 도구 TOP 10 — 신진욱팀 적합성 비교

**목적:** 고등학생이 7분 안에 스스로 설명할 수 있는 학술 발표. 대형 화면 가독성·통계 숫자의 정확성·모션의 완성도·독립 배포성을 우선 평가.

| 추천 순위 | 오픈소스 / 소스 공개 프로젝트 | 평가된 강점 | 신진욱팀 실제 구현 | 채택 판단 |
|---:|---|---|---|---|
| 1 | [Reveal.js](https://github.com/hakimel/reveal.js) | 키보드 조작·전환·장면 분리·발표 UX 안정성 | **적용·실행 검증** | 발표 엔진 |
| 2 | [Vizzu](https://github.com/vizzuhq/vizzu-lib) | 움직이는 통계 그래프·데이터 스토리텔링 | **적용·공개 환경 WASM 실행 검증** | 친밀도 문항 차트 |
| 3 | [Motion](https://github.com/motiondivision/motion) | 객체 이동·숫자 카운트업·stagger | **적용·실행 검증** | 타이틀·숫자·영수증 |
| 4 | [Three.js](https://github.com/mrdoob/three.js) | 3D 선형 오브젝트·카메라·동적 공간 | **적용·WebGL 실행 검증** | 3D 공간 배경 |
| 5 | [Apache ECharts](https://github.com/apache/echarts) | 수치 정확성과 차트 인터랙션 | **적용·실제 canvas 검증** | 77.4% 주 그래프 |
| 6 | [HyperFrames](https://github.com/heygen-com/hyperframes) | 미리 정한 경로와 분기, 발표자 메모 | 설계 문서 참고 / **번들 미포함** | 후속 고도화 후보 |
| 7 | [Spatial Deck](https://github.com/ibrews/spatial-deck) | 공간·메모·단일 HTML로 발표 | README/기능 참고 / **번들 미포함** | 학교 행사 프레임 후보 |
| 8 | [Motion Canvas](https://github.com/motion-canvas/motion-canvas) | 코드 기반 씬 구성·전문적인 그래픽 | README/사례 참고 / **번들 미포함** | 별도 영상 인트로 제작 |
| 9 | [Theatre.js](https://github.com/theatre-js/theatre) | 키프레임 타임라인·3D 모션 편집 | README/사례 참고 / **번들 미포함** | 시네마틱 씬 후속 작업 |
| 10 | [PixiJS](https://github.com/pixijs/pixijs) | GPU 가속 2D 파티클과 객체 움직임 | 소스 확인 / **번들 미포함** | GPU 기반 데이터 연출 |

표의 순서는 **신진욱팀 발표 목적에 대한 실무적 추천 순위**입니다. 저장소 실존과 README 기반 기능은 확인했지만, 모든 도구를 설치해서 직접 성능 벤치마크한 순위가 아닙니다. 실제 운영 프로젝트는 무거운 라이브러리를 모두 탑재하지 않고 **다섯 개로 역할 분담**했습니다.

## 구현 장면과 사용 기술

- [도입 / 질문 제시] Three.js의 3D 오브젝트, HTML/CSS 공정성 궤도
- [영수증 1/N↔개별 부담] Motion의 숫자 보간, 사용자의 선택 버튼
- [학생 106건 분석] 수치 카운트업과 단계별 등장
- [77.4%] ECharts 막대 차트 + 응답 점 106개
- [소액 차액 48.1%·24.5%] 숫자 보간 + 비율 바
- [친밀도 37.7/31.1/31.1] Vizzu WebAssembly 캔버스
- [롤스·하버마스] HTML 카드 + CSS 진입 모션
- [결론] 원형 3D 그래픽 + 공정성 원칙의 시각적 통합

**교육 원칙:** 그래프의 화려함이 응답 수치의 의미를 왜곡해서는 안 됩니다. 특히 사전 합의 68.9%는 갈등 감소의 경험적 증명이 아니라 응답자의 인식입니다.
