// 기본 슬라이드 프리셋 데이터 (스크린샷에 등장하는 디지털 마케팅 입문 및 시장 세분화 강의 자료)
export const DEFAULT_SLIDES = [
  {
    page: 1,
    title: "디지털 마케팅 입문",
    subtitle: "핵심 전략 및 고객 여정 분석",
    contentHtml: `
      <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; text-align:center; background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color:#ffffff; border-radius:12px; padding:40px; position:relative; overflow:hidden;">
        <div style="position:absolute; top:-50px; right:-50px; width:220px; height:220px; background:rgba(59,130,246,0.2); border-radius:50%; filter:blur(40px);"></div>
        <div style="position:absolute; bottom:-50px; left:-50px; width:220px; height:220px; background:rgba(239,68,68,0.2); border-radius:50%; filter:blur(40px);"></div>
        <div style="font-size:14px; text-transform:uppercase; letter-spacing:2px; color:#94a3b8; margin-bottom:12px;">경영학특강 / 비즈니스 전략</div>
        <h1 style="font-size:36px; font-weight:800; margin:0 0 16px 0; background:linear-gradient(90deg, #60a5fa, #a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">디지털 마케팅 입문</h1>
        <p style="font-size:18px; color:#cbd5e1; max-width:600px; margin-bottom:28px;">데이터 기반 고객 이해와 STP 전략을 통한 시장 경쟁력 확보</p>
        <div style="display:flex; gap:16px; font-size:13px; color:#94a3b8;">
          <span style="background:rgba(255,255,255,0.1); padding:6px 14px; border-radius:20px;">경영대학 마케팅학부</span>
          <span style="background:rgba(255,255,255,0.1); padding:6px 14px; border-radius:20px;">담당교수: 마케팅 연구팀</span>
        </div>
      </div>
    `,
    thumbnailTitle: "디지털 마케팅 입문",
    defaultStt: "오늘 강의는 디지털 마케팅 입문 첫 번째 시간입니다. 오늘 다룰 핵심은 시장 환경의 변화와 고객 중심의 세분화 전략입니다.",
    defaultSummary: [
      "디지털 마케팅의 기초 개념 및 환경 분석 개요 소개",
      "데이터 중심의 마케팅 의사결정 프레임워크 학습",
      "전체 강의의 핵심 목차 및 주차별 학습 로드맵 공유"
    ],
    defaultHighlight: "디지털 마케팅의 성패는 데이터 기반 고객 이해와 STP 전략의 일관성에 달려 있음을 강조함."
  },
  {
    page: 2,
    title: "강의 아젠다 및 STP 개요",
    subtitle: "전체 강의 구성",
    contentHtml: `
      <div style="height:100%; display:flex; flex-direction:column; padding:36px 44px; background:#ffffff; color:#1e293b; border-radius:12px; box-sizing:border-box;">
        <div style="border-bottom:2px solid #3b82f6; padding-bottom:12px; margin-bottom:24px;">
          <h2 style="font-size:26px; font-weight:700; margin:0; color:#1e293b;">강의 아젠다 및 STP 전략 개요</h2>
          <span style="font-size:13px; color:#64748b;">효과적인 시장 접근을 위한 3단계 프로세스</span>
        </div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; margin-top:10px;">
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-top:4px solid #3b82f6; border-radius:8px; padding:20px;">
            <div style="font-size:24px; font-weight:800; color:#3b82f6; margin-bottom:8px;">01. S</div>
            <h3 style="font-size:16px; margin:0 0 8px 0; color:#0f172a;">Segmentation (시장 세분화)</h3>
            <p style="font-size:13px; color:#64748b; line-height:1.5; margin:0;">인구통계학적, 심리적, 행동적 요인을 바탕으로 전체 시장을 세분 집단으로 분류</p>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-top:4px solid #10b981; border-radius:8px; padding:20px;">
            <div style="font-size:24px; font-weight:800; color:#10b981; margin-bottom:8px;">02. T</div>
            <h3 style="font-size:16px; margin:0 0 8px 0; color:#0f172a;">Targeting (목표시장 선정)</h3>
            <p style="font-size:13px; color:#64748b; line-height:1.5; margin:0;">세분화된 시장 중 자사의 강점과 매력도가 가장 높은 표적 세그먼트 선정</p>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-top:4px solid #8b5cf6; border-radius:8px; padding:20px;">
            <div style="font-size:24px; font-weight:800; color:#8b5cf6; margin-bottom:8px;">03. P</div>
            <h3 style="font-size:16px; margin:0 0 8px 0; color:#0f172a;">Positioning (위치화)</h3>
            <p style="font-size:13px; color:#64748b; line-height:1.5; margin:0;">소비자의 인식 속에서 경쟁사와 차별화되는 고유한 위치와 가치 제안 정립</p>
          </div>
        </div>
      </div>
    `,
    thumbnailTitle: "STP 전략 개요",
    defaultStt: "이어서 2페이지에서는 STP 전략의 전체적인 3단계 흐름을 짚어보겠습니다. 세분화, 타겟팅, 포지셔닝의 유기적 연결이 중요합니다.",
    defaultSummary: [
      "STP(Segmentation, Targeting, Positioning) 프레임워크 3단계 정의",
      "각 단계별 핵심 목표 및 유기적 연계성 설명",
      "단편적 마케팅 집행 지양 및 체계적 전략 수립의 필요성"
    ],
    defaultHighlight: "단순 프로모션보다 선행되어야 할 STP 분석의 중요성을 3회 이상 강조함."
  },
  {
    page: 3,
    title: "시장 세분화의 기준 및 방법",
    subtitle: "고객 그룹화 기준 분석",
    contentHtml: `
      <div style="height:100%; display:flex; flex-direction:column; padding:36px 44px; background:#ffffff; color:#1e293b; border-radius:12px; box-sizing:border-box;">
        <div style="border-bottom:2px solid #3b82f6; padding-bottom:12px; margin-bottom:24px;">
          <h2 style="font-size:26px; font-weight:700; margin:0; color:#1e293b;">시장 세분화의 4대 기준</h2>
          <span style="font-size:13px; color:#64748b;">고객 집단을 정의하는 다차원적 지표</span>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
          <div style="display:flex; align-items:flex-start; gap:12px; background:#f1f5f9; padding:16px; border-radius:8px;">
            <div style="width:36px; height:36px; background:#3b82f6; color:#fff; border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:700;">1</div>
            <div>
              <div style="font-weight:700; font-size:15px; color:#0f172a;">지리적 세분화 (Geographic)</div>
              <div style="font-size:13px; color:#64748b; margin-top:4px;">국가, 지역, 도시 규모, 기후, 주거 밀도 등 공간적 환경 기준</div>
            </div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:12px; background:#f1f5f9; padding:16px; border-radius:8px;">
            <div style="width:36px; height:36px; background:#10b981; color:#fff; border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:700;">2</div>
            <div>
              <div style="font-weight:700; font-size:15px; color:#0f172a;">인구통계학적 세분화 (Demographic)</div>
              <div style="font-size:13px; color:#64748b; margin-top:4px;">연령, 성별, 소득 수준, 직업, 학력, 가족 구성원 수</div>
            </div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:12px; background:#f1f5f9; padding:16px; border-radius:8px;">
            <div style="width:36px; height:36px; background:#f59e0b; color:#fff; border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:700;">3</div>
            <div>
              <div style="font-weight:700; font-size:15px; color:#0f172a;">심리묘사적 세분화 (Psychographic)</div>
              <div style="font-size:13px; color:#64748b; margin-top:4px;">사회적 계층, 라이프스타일, 성격, 개인적 가치관</div>
            </div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:12px; background:#f1f5f9; padding:16px; border-radius:8px;">
            <div style="width:36px; height:36px; background:#8b5cf6; color:#fff; border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:700;">4</div>
            <div>
              <div style="font-weight:700; font-size:15px; color:#0f172a;">행동적 세분화 (Behavioral)</div>
              <div style="font-size:13px; color:#64748b; margin-top:4px;">사용 빈도, 충성도(로열티), 추구 편익, 구매 준비도</div>
            </div>
          </div>
        </div>
      </div>
    `,
    thumbnailTitle: "시장 세분화 기준",
    defaultStt: "3페이지에서는 시장을 나눌 수 있는 4가지 전통적이며 강력한 기준들을 살펴봅니다. 특히 디지털 환경에서는 행동적 세분화가 실시간 로그로 측정 가능합니다.",
    defaultSummary: [
      "지리적, 인구통계적, 심리묘사적, 행동적 4대 세분화 기준 분석",
      "디지털 시대의 행동 데이터(로그, 구매 주기) 중요성 대두",
      "단일 기준보다는 복합적 세분화 기법의 채택 권장"
    ],
    defaultHighlight: "행동 데이터(Behavioral Data)를 통한 실시간 타겟 그룹 식별의 중요성 강조."
  },
  {
    page: 4,
    title: "시장 세분화 (Market Segmentation)",
    subtitle: "프로세스 매핑 및 실행 모델",
    contentHtml: `
      <div style="height:100%; display:flex; flex-direction:column; padding:32px 40px; background:#ffffff; color:#1e293b; border-radius:12px; box-sizing:border-box; position:relative;">
        <div style="border-bottom:2px solid #2563eb; padding-bottom:10px; margin-bottom:20px;">
          <h2 style="font-size:24px; font-weight:800; margin:0; color:#1e293b;">시장 세분화 (Market Segmentation)</h2>
        </div>
        <div style="display:grid; grid-template-columns: 1.1fr 1.3fr; gap:24px; align-items:center; margin-top:10px;">
          <!-- 좌측 도표 영역 (스크린샷 플로우차트 완벽 재현) -->
          <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:20px; display:flex; flex-direction:column; align-items:center; gap:16px;">
            <div style="background:#eff6ff; border:1.5px solid #3b82f6; border-radius:6px; padding:10px 18px; font-size:13px; font-weight:600; text-align:center; color:#1e40af; width:80%;">
              20가지 안전 시장 세이프
            </div>
            <div style="color:#64748b; font-size:16px;">↓</div>
            <div style="display:flex; justify-content:space-between; width:100%; gap:12px;">
              <div style="background:#e0e7ff; border:1px solid #818cf8; border-radius:6px; padding:10px 12px; font-size:12px; text-align:center; color:#3730a3; flex:1; font-weight:600;">
                사이의 세분화<br>성풍 재현
              </div>
              <div style="display:flex; align-items:center; color:#64748b; font-weight:bold;">→</div>
              <div style="background:#2563eb; color:#ffffff; border-radius:6px; padding:10px 12px; font-size:12px; text-align:center; flex:1; font-weight:700; display:flex; align-items:center; justify-content:center;">
                시장 세분화
              </div>
            </div>
          </div>
          <!-- 우측 설명 영역 (스크린샷 불릿 포인트 완벽 재현) -->
          <div style="display:flex; flex-direction:column; gap:14px;">
            <div style="display:flex; align-items:flex-start; gap:8px;">
              <span style="font-size:16px; color:#2563eb; line-height:1.2;">•</span>
              <div>
                <strong style="font-size:14px; color:#0f172a;">이전자 강의 모양화 매차 표커로 라명한 강의 무성학 사업</strong>
                <p style="font-size:12px; color:#64748b; margin:4px 0 0 0;">시장 사전의 모호화 패차 표기로 파생된 강의 무성학 사업</p>
              </div>
            </div>
            <div style="display:flex; align-items:flex-start; gap:8px;">
              <span style="font-size:16px; color:#2563eb; line-height:1.2;">•</span>
              <div>
                <strong style="font-size:14px; color:#0f172a;">모향과 등언 고려의 수가의 언정</strong>
                <p style="font-size:12px; color:#64748b; margin:4px 0 0 0;">지역 성형자자: 학릉화영 제조, 파체업</p>
              </div>
            </div>
            <div style="display:flex; align-items:flex-start; gap:8px;">
              <span style="font-size:16px; color:#2563eb; line-height:1.2;">•</span>
              <div>
                <strong style="font-size:14px; color:#0f172a;">시장의 강의 세분화</strong>
                <p style="font-size:12px; color:#64748b; margin:4px 0 0 0;">아이보의 뒬행, 아이여안, 혜장 공합</p>
              </div>
            </div>
          </div>
        </div>
        <div style="position:absolute; bottom:14px; right:20px; font-size:11px; color:#94a3b8;">4</div>
      </div>
    `,
    thumbnailTitle: "시장 세분화",
    defaultStt: "이전전 강의의 모양화 매차 표표로 라명한 인개 응자 표 라명한 일어 무상착 사업. 모향차 동언 고려의 수가의 수가클 지적면 안청. 시장의 강의의 세분화, 아이여언, 아, 이여연, 해란 곳곳.",
    defaultSummary: [
      "이전자 강의 모양화 매차 표차로 라명한 입어 무상착 사업",
      "라량차 동언 고려의 수가와 사업",
      "모량차 동언 고려의 수가의 안정"
    ],
    defaultHighlight: "교수에 즉한 강조주면 하는 표점을 몽심 표앙을 말어했다."
  },
  {
    page: 5,
    title: "목표 시장 선정 및 포지셔닝 맵",
    subtitle: "경쟁 우위 선점 전략",
    contentHtml: `
      <div style="height:100%; display:flex; flex-direction:column; padding:32px 40px; background:#ffffff; color:#1e293b; border-radius:12px; box-sizing:border-box;">
        <div style="border-bottom:2px solid #2563eb; padding-bottom:10px; margin-bottom:20px;">
          <h2 style="font-size:24px; font-weight:800; margin:0; color:#1e293b;">포지셔닝 맵 (Positioning Map)</h2>
          <span style="font-size:13px; color:#64748b;">가격 대 품질 매트릭스 상에서의 자사 브랜드 차별화 포지션</span>
        </div>
        <div style="display:flex; height:240px; align-items:center; justify-content:center; position:relative; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
          <!-- 십자축 -->
          <div style="position:absolute; width:80%; height:1px; background:#cbd5e1;"></div>
          <div style="position:absolute; height:80%; width:1px; background:#cbd5e1;"></div>
          <!-- 축 라벨 -->
          <span style="position:absolute; top:12px; font-size:11px; font-weight:bold; color:#64748b;">고품질 (High Quality)</span>
          <span style="position:absolute; bottom:12px; font-size:11px; font-weight:bold; color:#64748b;">실속형 (Value)</span>
          <span style="position:absolute; left:20px; font-size:11px; font-weight:bold; color:#64748b;">저가격</span>
          <span style="position:absolute; right:20px; font-size:11px; font-weight:bold; color:#64748b;">프리미엄</span>
          <!-- 포지션 원형들 -->
          <div style="position:absolute; top:45px; right:90px; background:#2563eb; color:#fff; padding:6px 14px; border-radius:20px; font-size:12px; font-weight:bold; box-shadow:0 4px 10px rgba(37,99,235,0.3);">
            ★ 자사 브랜드 (Target)
          </div>
          <div style="position:absolute; bottom:55px; left:90px; background:#94a3b8; color:#fff; padding:4px 10px; border-radius:16px; font-size:11px;">
            경쟁사 A
          </div>
          <div style="position:absolute; top:75px; left:120px; background:#cbd5e1; color:#334155; padding:4px 10px; border-radius:16px; font-size:11px;">
            경쟁사 B
          </div>
        </div>
      </div>
    `,
    thumbnailTitle: "포지셔닝 맵",
    defaultStt: "마지막으로 자사 브랜드의 포지셔닝 맵을 도출하고 경쟁사와의 차별화 요소를 확정짓는 단계입니다. 다음 차시 과제는 각 조별 포지셔닝 맵 작성입니다.",
    defaultSummary: [
      "2차원 지각도(Perceptual Map)를 통한 시장 빈틈 발견",
      "자사 브랜드의 고유 가치 제안(Value Proposition) 설정",
      "다음 차시 실습 과제 및 최종 질의응답 안내"
    ],
    defaultHighlight: "경쟁사가 선점하지 않은 미개척 프리미엄 틈새 영역의 선점 전략을 강력 권고함."
  }
];

export const DEFAULT_LECTURE_SUMMARY = {
  title: "디지털 마케팅 입문",
  bulletPoints: [
    "이전자 강의 모양화 매차 표차로 라명한 입어 무상착 사업",
    "라량차 동언 고려의 수가와 사업",
    "모량차 동언 고려의 수가의 안정"
  ],
  narrativeSummary: "디지털 마케팅 입문은 디지털 마게 치 마케팅 임체. 모망자 동언 고려의 추가와 영정이 영하고 라학란겜 입어 자입의 있습니다. 안전하여 여전 안식 접처를 풍영하여 한다. 무업이 마매가 될 모하고 갑여서 여전 입감게 됩니다. 달자업이 중거과 쾅의 과약의 자약을 이어헌고 따라헌 촌화한 아여여연 합억 모화의 공합"
};
