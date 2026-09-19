// 정교하고 전문적인 마케팅 강의 슬라이드 프리셋 데이터 (의뢰서 스크린샷 구조 완벽 일치 + 고품질 한국어 콘텐츠)
export const DEFAULT_SLIDES = [
  {
    page: 1,
    title: "디지털 마케팅 입문",
    subtitle: "핵심 전략 및 고객 여정 분석",
    contentHtml: `
      <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%; text-align:center; background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color:#ffffff; border-radius:12px; padding:40px; position:relative; overflow:hidden;">
        <div style="position:absolute; top:-50px; right:-50px; width:220px; height:220px; background:rgba(59,130,246,0.25); border-radius:50%; filter:blur(40px);"></div>
        <div style="position:absolute; bottom:-50px; left:-50px; width:220px; height:220px; background:rgba(239,68,68,0.25); border-radius:50%; filter:blur(40px);"></div>
        <div style="font-size:14px; text-transform:uppercase; letter-spacing:2px; color:#94a3b8; margin-bottom:12px;">경영학 특강 / 비즈니스 전략</div>
        <h1 style="font-size:36px; font-weight:800; margin:0 0 16px 0; background:linear-gradient(90deg, #60a5fa, #a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">디지털 마케팅 입문</h1>
        <p style="font-size:18px; color:#cbd5e1; max-width:600px; margin-bottom:28px;">데이터 기반 고객 이해와 STP 전략을 통한 시장 경쟁력 확보</p>
        <div style="display:flex; gap:16px; font-size:13px; color:#94a3b8;">
          <span style="background:rgba(255,255,255,0.1); padding:6px 14px; border-radius:20px;">경영대학 마케팅학부</span>
          <span style="background:rgba(255,255,255,0.1); padding:6px 14px; border-radius:20px;">담당교수: 마케팅 연구팀</span>
        </div>
      </div>
    `,
    thumbnailTitle: "디지털 마케팅 입문",
    defaultStt: "여러분 안녕하세요. 오늘부터 디지털 마케팅 입문 첫 번째 강의를 시작합니다. 오늘 1강에서는 전통적 마케팅과의 차이점과 데이터 기반 고객 분석의 기본 틀을 잡겠습니다.",
    defaultSummary: [
      "디지털 마케팅의 기본 개념 및 데이터 기반 의사결정 체계 소개",
      "전통 마케팅 대비 실시간 고객 상호작용 및 추적 가능성의 장점 설명",
      "한 학기 동안 진행될 STP 전략과 퍼널 최적화 전체 학습 로드맵 공유"
    ],
    defaultHighlight: "직관에만 의존하던 기존 마케팅에서 탈피하여, 실시간 고객 데이터 기반 접근이 필수적임을 역설함."
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
            <p style="font-size:13px; color:#64748b; line-height:1.5; margin:0;">인구통계학적, 심리적, 행동적 요인을 바탕으로 전체 시장을 동질적 하위 집단으로 분류</p>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-top:4px solid #10b981; border-radius:8px; padding:20px;">
            <div style="font-size:24px; font-weight:800; color:#10b981; margin-bottom:8px;">02. T</div>
            <h3 style="font-size:16px; margin:0 0 8px 0; color:#0f172a;">Targeting (목표시장 선정)</h3>
            <p style="font-size:13px; color:#64748b; line-height:1.5; margin:0;">세분화된 시장 중 자사의 핵심 역량과 수익성이 가장 높은 최적의 표적 시장 결정</p>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-top:4px solid #8b5cf6; border-radius:8px; padding:20px;">
            <div style="font-size:24px; font-weight:800; color:#8b5cf6; margin-bottom:8px;">03. P</div>
            <h3 style="font-size:16px; margin:0 0 8px 0; color:#0f172a;">Positioning (위치화)</h3>
            <p style="font-size:13px; color:#64748b; line-height:1.5; margin:0;">소비자의 인식 속에서 경쟁사와 명확히 차별화되는 고유한 브랜드 가치 제안 정립</p>
          </div>
        </div>
      </div>
    `,
    thumbnailTitle: "STP 전략 개요",
    defaultStt: "2페이지로 넘어가겠습니다. 마케팅 전략의 뼈대가 되는 STP 프레임워크는 세분화, 타겟팅, 포지셔닝으로 이어지며, 이 세 단계가 유기적으로 긴밀히 결합되어야 합니다.",
    defaultSummary: [
      "STP(Segmentation, Targeting, Positioning) 3단계 프레임워크의 학술적 및 실무적 정의",
      "각 단계별 목표 설정과 유기적 연계성 분석",
      "단순 프로모션 집행 이전에 체계적인 시장 정의가 선행되어야 함을 확인"
    ],
    defaultHighlight: "타겟팅과 포지셔닝이 어긋나면 마케팅 비용이 크게 낭비되므로 기초 세분화 분석이 핵심임을 강조함."
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
              <div style="font-size:13px; color:#64748b; margin-top:4px;">국가, 지역, 도시 규모, 기후, 상권 밀도 등 거주 환경 기준</div>
            </div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:12px; background:#f1f5f9; padding:16px; border-radius:8px;">
            <div style="width:36px; height:36px; background:#10b981; color:#fff; border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:700;">2</div>
            <div>
              <div style="font-weight:700; font-size:15px; color:#0f172a;">인구통계학적 세분화 (Demographic)</div>
              <div style="font-size:13px; color:#64748b; margin-top:4px;">연령, 성별, 소득 수준, 직업군, 학력, 가구원 수 등 객관적 통계</div>
            </div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:12px; background:#f1f5f9; padding:16px; border-radius:8px;">
            <div style="width:36px; height:36px; background:#f59e0b; color:#fff; border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:700;">3</div>
            <div>
              <div style="font-weight:700; font-size:15px; color:#0f172a;">심리묘사적 세분화 (Psychographic)</div>
              <div style="font-size:13px; color:#64748b; margin-top:4px;">사회 계층, 라이프스타일 패턴, 가치관, 개인 관심사 성향</div>
            </div>
          </div>
          <div style="display:flex; align-items:flex-start; gap:12px; background:#f1f5f9; padding:16px; border-radius:8px;">
            <div style="width:36px; height:36px; background:#8b5cf6; color:#fff; border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:700;">4</div>
            <div>
              <div style="font-weight:700; font-size:15px; color:#0f172a;">행동적 세분화 (Behavioral)</div>
              <div style="font-size:13px; color:#64748b; margin-top:4px;">웹사이트 방문 빈도, 구매 주기, 브랜드 충성도, 검색 키워드</div>
            </div>
          </div>
        </div>
      </div>
    `,
    thumbnailTitle: "시장 세분화 기준",
    defaultStt: "3페이지에서는 시장을 나누는 4가지 핵심 기준을 살펴봅니다. 특히 디지털 마케팅에서는 검색어, 체류시간, 장바구니 행동과 같은 행동적 세분화 데이터의 가치가 매우 높습니다.",
    defaultSummary: [
      "지리적, 인구통계적, 심리묘사적, 행동적 4대 전통 세분화 기준 비교",
      "디지털 시대의 실시간 사용자 행동 로그 데이터의 결정적 중요성 대두",
      "단일 기준보다는 행동과 인구통계를 결합한 다차원 타겟팅 권장"
    ],
    defaultHighlight: "단순한 성별·연령 구분을 넘어 실제 구매 의도와 행동 패턴 중심의 세분화가 실질적 매출을 견인한다고 강조."
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
              20가지 시장 안전성 기준 평가
            </div>
            <div style="color:#64748b; font-size:16px;">↓</div>
            <div style="display:flex; justify-content:space-between; width:100%; gap:12px;">
              <div style="background:#e0e7ff; border:1px solid #818cf8; border-radius:6px; padding:10px 12px; font-size:12px; text-align:center; color:#3730a3; flex:1; font-weight:600;">
                고객 니즈 세분화<br>상품 매칭 검증
              </div>
              <div style="display:flex; align-items:center; color:#64748b; font-weight:bold;">→</div>
              <div style="background:#2563eb; color:#ffffff; border-radius:6px; padding:10px 12px; font-size:12px; text-align:center; flex:1; font-weight:700; display:flex; align-items:center; justify-content:center;">
                최적 세분시장 확정
              </div>
            </div>
          </div>
          <!-- 우측 설명 영역 -->
          <div style="display:flex; flex-direction:column; gap:14px;">
            <div style="display:flex; align-items:flex-start; gap:8px;">
              <span style="font-size:16px; color:#2563eb; line-height:1.2;">•</span>
              <div>
                <strong style="font-size:14px; color:#0f172a;">사전 시장 리스크 및 규제 요인 사전 검토</strong>
                <p style="font-size:12px; color:#64748b; margin:4px 0 0 0;">시장 진입 시 발생하는 법률, 규제 및 경쟁 구도 선행 파악</p>
              </div>
            </div>
            <div style="display:flex; align-items:flex-start; gap:8px;">
              <span style="font-size:16px; color:#2563eb; line-height:1.2;">•</span>
              <div>
                <strong style="font-size:14px; color:#0f172a;">수익성과 시장 성장성의 적합도 평가</strong>
                <p style="font-size:12px; color:#64748b; margin:4px 0 0 0;">세분 시장별 고객 획득 비용(CAC)과 생애가치(LTV) 계산</p>
              </div>
            </div>
            <div style="display:flex; align-items:flex-start; gap:8px;">
              <span style="font-size:16px; color:#2563eb; line-height:1.2;">•</span>
              <div>
                <strong style="font-size:14px; color:#0f172a;">자사 핵심 역량과의 일치 여부 판별</strong>
                <p style="font-size:12px; color:#64748b; margin:4px 0 0 0;">보유 기술 및 마케팅 채널과의 시너지 창출 가능성 검증</p>
              </div>
            </div>
          </div>
        </div>
        <div style="position:absolute; bottom:14px; right:20px; font-size:11px; color:#94a3b8;">4</div>
      </div>
    `,
    thumbnailTitle: "시장 세분화",
    defaultStt: "4번 슬라이드의 시장 세분화 실행 모델을 보시겠습니다. 전체 시장을 20가지 안전성 기준으로 필터링한 후, 고객 니즈와 상품 적합도를 매칭하여 최종 표적 세분시장을 확정하는 프로세스입니다.",
    defaultSummary: [
      "20가지 리스크 기준을 통한 진입 시장의 안정성 사전 검토",
      "고객 니즈와 자사 상품 역량의 일치성(Product-Market Fit) 검증",
      "지속 가능한 수익 창출이 가능한 최적 세분시장 확정 로직 설명"
    ],
    defaultHighlight: "단순히 시장 규모가 큰 곳을 쫓기보다, 자사가 확실한 경쟁 우위를 점할 수 있는 틈새시장을 확정하는 것이 성공의 열쇠라고 강조함."
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
            경쟁사 A (저가 보급형)
          </div>
          <div style="position:absolute; top:75px; left:120px; background:#cbd5e1; color:#334155; padding:4px 10px; border-radius:16px; font-size:11px;">
            경쟁사 B (가성비 중심)
          </div>
        </div>
      </div>
    `,
    thumbnailTitle: "포지셔닝 맵",
    defaultStt: "마지막 슬라이드는 포지셔닝 맵입니다. 2차원 지각도 상에서 경쟁사들이 점유하지 못한 프리미엄 밸류 영역을 자사 브랜드의 목표 포지션으로 설정하여 고유 가치를 확보해야 합니다.",
    defaultSummary: [
      "가격과 품질 2대 축을 기준으로 한 경쟁 구도 시각화(Perceptual Map)",
      "경쟁사와의 정면 가격 경쟁을 피하고 독자적인 가치 제안(UVP) 정립",
      "소비자의 뇌리에 각인될 차별화된 브랜드 아이덴티티 확립 전략"
    ],
    defaultHighlight: "레드오션 경쟁을 지양하고 미개척 고부가가치 틈새 포지션을 선점하는 것이 마케팅의 핵심임을 재차 강조함."
  }
];

export const DEFAULT_LECTURE_SUMMARY = {
  title: "디지털 마케팅 입문: STP 전략과 시장 세분화 실행 모델",
  bulletPoints: [
    "데이터 기반 고객 여정 분석과 디지털 마케팅 환경 변화의 본질 이해",
    "STP(세분화·타겟팅·포지셔닝) 3단계의 유기적 연계 및 20가지 안전성 평가 모델 적용",
    "포지셔닝 맵을 통한 차별화된 가치 제안 정립 및 블루오션 포지션 선점 전략"
  ],
  narrativeSummary: "본 강의는 디지털 비즈니스 환경에서 실질적인 시장 경쟁 우위를 창출하기 위한 STP 프레임워크와 시장 세분화 방법론을 종합적으로 다루었습니다. 직관에 의존하던 전통적 방식에서 벗어나 실시간 고객 행동 데이터를 기반으로 시장을 4대 기준으로 세분화하고, 위험 요소를 사전에 스크리닝하여 최적의 표적 시장을 선별하는 3단계 프로세스를 확립하였습니다. 최종적으로 포지셔닝 지각도를 활용해 경쟁사와 차별화된 고부가가치 틈새 영역을 선점하는 실행 전략을 완성하였습니다."
};
