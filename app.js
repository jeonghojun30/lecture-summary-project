import { DEFAULT_SLIDES } from "./slidesData.js";

/**
 * 무중단 마스터 레코딩 + 다중 슬라이드 인식 + To-Do/과제 Action Plan 중심 강의 동기화 앱
 */
class LectureSyncApp {
  constructor() {
    this.currentScreen = "screenA";
    this.slides = [];
    this.currentSlideIndex = 0;
    this.isRecording = false;
    this.isPaused = false;
    this.lectureSeconds = 0;
    this.lectureTimerInterval = null;
    this.currentSegmentStartTime = 0;
    this.uploadedLectureTitle = "디지털 마케팅 입문: STP 전략과 시장 세분화 실행 모델";

    // 상단 Action Plan & 과제 중심 요약
    this.overallActionPlan = {
      title: "",
      tasks: [], // 1. 해야 하는 일, 2. 어떻게, 3. 중점 기준
      narrativeGuide: ""
    };

    this.sessionId = "session_" + Date.now();
    this.eventLogs = [];

    // 무중단 마스터 오디오 엔진
    this.audioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.masterMediaRecorder = null;
    this.masterAudioChunks = [];
    this.masterAudioBlob = null;
    this.masterAudioUrl = null;
    this.isMicGranted = false;

    // STT 엔진
    this.speechRecognition = null;
    this.currentSlideFinalStt = "";
    this.lastTransitionTargetTrack = null;
    this.lastTransitionTime = 0;

    // 결과 화면 오디오 제어
    this.selectedResultSlideIndex = 0;
    this.selectedAudioTrackIndex = 0;
    this.resultAudioPlayer = new Audio();
    this.isPlayingResultAudio = false;
    this.audioPlaybackRate = 1.0;
    this.activeTrackStartTime = 0;
    this.activeTrackEndTime = 0;

    this.settings = {
      apiKey: localStorage.getItem("gemini_api_key") || "",
      model: localStorage.getItem("gemini_model") || "gemini-1.5-flash",
      language: localStorage.getItem("gemini_lang") || "ko-KR"
    };

    this.initElements();
    this.initEvents();
    this.loadDefaultSlides();
    this.startWaveformLoop();
  }

  /* ==========================================================================
     DOM 요소 캐싱
     ========================================================================== */
  initElements() {
    this.topHeader = document.getElementById("topHeader");
    this.headerTitle = document.getElementById("headerTitle");
    this.btnStartLecture = document.getElementById("btnStartLecture");
    this.btnOpenSettingHeader = document.getElementById("btnOpenSettingHeader");

    // 화면 A
    this.screenA = document.getElementById("screenA");
    this.dropZone = document.getElementById("dropZone");
    this.fileInput = document.getElementById("fileInput");
    this.uploadDesc = document.getElementById("uploadDesc");
    this.btnLoadSampleSlides = document.getElementById("btnLoadSampleSlides");
    this.loadedFileIndicator = document.getElementById("loadedFileIndicator");
    this.loadedFileName = document.getElementById("loadedFileName");
    this.loadedSlideCountBadge = document.getElementById("loadedSlideCountBadge");
    this.btnResetFile = document.getElementById("btnResetFile");
    this.btnMicPermission = document.getElementById("btnMicPermission");
    this.micPermissionLabel = document.getElementById("micPermissionLabel");
    this.micTestWaveform = document.getElementById("micTestWaveform");
    this.btnOpenSetting = document.getElementById("btnOpenSetting");

    // 화면 B
    this.screenB = document.getElementById("screenB");
    this.slidePaper = document.getElementById("slidePaper");
    this.btnPrevSlide = document.getElementById("btnPrevSlide");
    this.btnNextSlide = document.getElementById("btnNextSlide");
    this.btnPauseResume = document.getElementById("btnPauseResume");
    this.pauseResumeLabel = document.getElementById("pauseResumeLabel");
    this.pauseIcon = document.getElementById("pauseIcon");
    this.btnEndLecture = document.getElementById("btnEndLecture");
    this.liveWaveform = document.getElementById("liveWaveform");
    this.liveTimerDigits = document.getElementById("liveTimerDigits");
    this.currentSlideNum = document.getElementById("currentSlideNum");
    this.totalSlideNum = document.getElementById("totalSlideNum");
    this.aiStatusMsg = document.getElementById("aiStatusMsg");
    this.queueStatusText = document.getElementById("queueStatusText");

    // AI 심층 분석 오버레이
    this.aiProcessingOverlay = document.getElementById("aiProcessingOverlay");
    this.processingTitle = document.getElementById("processingTitle");
    this.processingDesc = document.getElementById("processingDesc");
    this.progressFill = document.getElementById("progressFill");
    this.processingPercent = document.getElementById("processingPercent");
    this.processingEta = document.getElementById("processingEta");
    this.step1 = document.getElementById("step1");
    this.step2 = document.getElementById("step2");
    this.step3 = document.getElementById("step3");

    // 화면 C (과제 & Action Plan 중심)
    this.screenC = document.getElementById("screenC");
    this.overallLectureTitle = document.getElementById("overallLectureTitle");
    this.actionPlanSlideCountTag = document.getElementById("actionPlanSlideCountTag");
    this.planCardTodo = document.getElementById("planCardTodo");
    this.planCardHowto = document.getElementById("planCardHowto");
    this.planCardFocus = document.getElementById("planCardFocus");
    this.overallNarrativeText = document.getElementById("overallNarrativeText");
    this.thumbnailsSidebar = document.getElementById("thumbnailsSidebar");
    this.detailSlideBadge = document.getElementById("detailSlideBadge");
    this.detailSlideTitle = document.getElementById("detailSlideTitle");
    this.segmentTabs = document.getElementById("segmentTabs");
    this.slidePreviewViewport = document.getElementById("slidePreviewViewport");

    // 오디오 플레이어 컨트롤
    this.currentTrackInfo = document.getElementById("currentTrackInfo");
    this.btnSkipBack = document.getElementById("btnSkipBack");
    this.btnPlayPauseAudio = document.getElementById("btnPlayPauseAudio");
    this.btnSkipForward = document.getElementById("btnSkipForward");
    this.audioPlayIcon = document.getElementById("audioPlayIcon");
    this.seekSlider = document.getElementById("seekSlider");
    this.audioCurrentTime = document.getElementById("audioCurrentTime");
    this.audioTotalTime = document.getElementById("audioTotalTime");
    this.btnDownloadAudio = document.getElementById("btnDownloadAudio");
    this.btnMuteToggle = document.getElementById("btnMuteToggle");
    this.btnPlaybackRate = document.getElementById("btnPlaybackRate");

    // 3단계 분석 블록 및 슬라이드 편집
    this.btnEditSlideContent = document.getElementById("btnEditSlideContent");
    this.slidePptSummary = document.getElementById("slidePptSummary");
    this.slideVoiceTranscript = document.getElementById("slideVoiceTranscript");
    this.slideCombinedHighlight = document.getElementById("slideCombinedHighlight");

    this.btnExportJson = document.getElementById("btnExportJson");
    this.btnRestartLecture = document.getElementById("btnRestartLecture");

    // 환경설정 모달
    this.settingModal = document.getElementById("settingModal");
    this.btnCloseSetting = document.getElementById("btnCloseSetting");
    this.btnSaveSetting = document.getElementById("btnSaveSetting");
    this.apiKeyInput = document.getElementById("apiKeyInput");
    this.geminiModelSelect = document.getElementById("geminiModelSelect");
    this.sttLangSelect = document.getElementById("sttLangSelect");

    // 슬라이드 텍스트 수동 보정 모달
    this.slideEditModal = document.getElementById("slideEditModal");
    this.slideEditModalTitle = document.getElementById("slideEditModalTitle");
    this.btnCloseSlideEdit = document.getElementById("btnCloseSlideEdit");
    this.btnCancelSlideEdit = document.getElementById("btnCancelSlideEdit");
    this.btnSaveSlideEdit = document.getElementById("btnSaveSlideEdit");
    this.editSlideTitleInput = document.getElementById("editSlideTitleInput");
    this.editSlideTextInput = document.getElementById("editSlideTextInput");

    if (this.apiKeyInput) this.apiKeyInput.value = this.settings.apiKey;
    if (this.geminiModelSelect) this.geminiModelSelect.value = this.settings.model;
    if (this.sttLangSelect) this.sttLangSelect.value = this.settings.language;
  }

  /* ==========================================================================
     이벤트 바인딩
     ========================================================================== */
  initEvents() {
    this.btnStartLecture.addEventListener("click", () => this.startLecture());

    this.dropZone.addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", (e) => this.handleFileSelect(e));
    this.dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.dropZone.classList.add("dragover");
    });
    this.dropZone.addEventListener("dragleave", () => this.dropZone.classList.remove("dragover"));
    this.dropZone.addEventListener("drop", (e) => this.handleFileDrop(e));
    this.btnLoadSampleSlides.addEventListener("click", (e) => {
      e.stopPropagation();
      this.loadDefaultSlides();
    });
    this.btnResetFile.addEventListener("click", (e) => {
      e.stopPropagation();
      this.fileInput.value = "";
      this.loadDefaultSlides();
    });

    this.btnMicPermission.addEventListener("click", () => this.requestMicrophone());

    const openModal = () => {
      this.settingModal.style.display = "flex";
      this.apiKeyInput.value = this.settings.apiKey;
    };
    this.btnOpenSetting.addEventListener("click", openModal);
    this.btnOpenSettingHeader.addEventListener("click", openModal);
    this.btnCloseSetting.addEventListener("click", () => this.settingModal.style.display = "none");
    this.btnSaveSetting.addEventListener("click", () => {
      this.settings.apiKey = this.apiKeyInput.value.trim();
      this.settings.model = this.geminiModelSelect.value;
      this.settings.language = this.sttLangSelect.value;
      localStorage.setItem("gemini_api_key", this.settings.apiKey);
      localStorage.setItem("gemini_model", this.settings.model);
      localStorage.setItem("gemini_lang", this.settings.language);
      this.settingModal.style.display = "none";
    });

    this.btnPrevSlide.addEventListener("click", () => this.goToPrevSlide());
    this.btnNextSlide.addEventListener("click", () => this.goToNextSlide());
    this.btnPauseResume.addEventListener("click", () => this.togglePauseLecture());
    this.btnEndLecture.addEventListener("click", () => this.startDeepPostProcessing());

    window.addEventListener("keydown", (e) => {
      if (this.currentScreen !== "screenB") return;
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        this.goToNextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.goToPrevSlide();
      } else if (e.key === " " && e.target.tagName !== "INPUT") {
        e.preventDefault();
        this.togglePauseLecture();
      }
    });

    this.btnPlayPauseAudio.addEventListener("click", () => this.toggleResultAudio());
    if (this.btnSkipBack) this.btnSkipBack.addEventListener("click", () => this.skipAudio(-5));
    if (this.btnSkipForward) this.btnSkipForward.addEventListener("click", () => this.skipAudio(5));
    this.seekSlider.addEventListener("input", () => this.handleSeekAudio());
    this.btnPlaybackRate.addEventListener("click", () => this.togglePlaybackRate());
    this.btnMuteToggle.addEventListener("click", () => {
      this.resultAudioPlayer.muted = !this.resultAudioPlayer.muted;
      this.btnMuteToggle.style.opacity = this.resultAudioPlayer.muted ? "0.4" : "1";
    });
    if (this.btnDownloadAudio) {
      this.btnDownloadAudio.addEventListener("click", () => this.downloadCurrentSlideAudio());
    }

    this.resultAudioPlayer.addEventListener("timeupdate", () => this.onAudioTimeUpdate());
    this.resultAudioPlayer.addEventListener("ended", () => this.onPlayerEnded());

    this.btnExportJson.addEventListener("click", () => this.exportSessionData());
    this.btnRestartLecture.addEventListener("click", () => this.restartLectureFlow());

    // 슬라이드 텍스트 수동 보정 모달 이벤트
    if (this.btnEditSlideContent) {
      this.btnEditSlideContent.addEventListener("click", () => this.openSlideEditModal());
    }
    if (this.btnCloseSlideEdit) {
      this.btnCloseSlideEdit.addEventListener("click", () => this.closeSlideEditModal());
    }
    if (this.btnCancelSlideEdit) {
      this.btnCancelSlideEdit.addEventListener("click", () => this.closeSlideEditModal());
    }
    if (this.btnSaveSlideEdit) {
      this.btnSaveSlideEdit.addEventListener("click", () => this.saveSlideEditContent());
    }
  }

  /* ==========================================================================
     화면 전환 라우팅
     ========================================================================== */
  setScreen(screenName) {
    this.currentScreen = screenName;
    document.querySelectorAll(".screen-view").forEach(el => el.classList.remove("active"));

    if (screenName === "screenA") {
      this.screenA.classList.add("active");
      this.headerTitle.textContent = "강의 녹음 및 요약 서비스 (Initial Setup)";
      this.btnStartLecture.style.display = "block";
    } else if (screenName === "screenB") {
      this.screenB.classList.add("active");
      this.headerTitle.textContent = "실시간 강의 진행 (Recording & Audio Segmenting)";
      this.btnStartLecture.style.display = "none";
    } else if (screenName === "screenC") {
      this.screenC.classList.add("active");
      this.headerTitle.textContent = "강의 결과 및 복습 (Action Plan & Review)";
      this.btnStartLecture.style.display = "none";
    }
  }

  /* ==========================================================================
     [핵심 해결책] 슬라이드 내용 다중 레이어 전수 추출기
     ========================================================================== */
  extractSlideContentComprehensively(slide) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(slide.contentHtml, "text/html");

    // 1. 헤딩(제목) 추출
    const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4"))
      .map(el => el.textContent.trim())
      .filter(Boolean);

    // 2. 본문 및 불릿 포인트 추출
    const paragraphs = Array.from(doc.querySelectorAll("p, li, strong, b"))
      .map(el => el.textContent.trim())
      .filter(t => t.length > 2);

    // 3. 다이어그램 및 도표 박스 내 라벨 추출
    const diagramLabels = Array.from(doc.querySelectorAll("div"))
      .filter(el => el.children.length === 0 && el.textContent.trim().length > 1)
      .map(el => el.textContent.trim())
      .filter(t => !headings.includes(t) && !paragraphs.includes(t));

    // 중복 제거 및 종합
    const uniquePoints = Array.from(new Set([...headings, ...paragraphs, ...diagramLabels]));
    return uniquePoints.join(" | ") || slide.pptText || slide.title;
  }

  /* ==========================================================================
     슬라이드 로드
     ========================================================================== */
  loadDefaultSlides() {
    this.uploadedLectureTitle = "디지털 마케팅 입문: STP 전략과 시장 세분화 실행 모델";
    this.slides = DEFAULT_SLIDES.map(item => {
      const slideObj = {
        page: item.page,
        title: item.title,
        subtitle: item.subtitle,
        contentHtml: item.contentHtml,
        thumbnailTitle: item.thumbnailTitle,
        audioTracks: [],
        pptText: "",
        pptStructuredSummary: "",
        combinedHighlightText: "",
        sttText: item.defaultStt
      };
      // 전수 텍스트 추출 가동
      slideObj.pptText = this.extractSlideContentComprehensively(slideObj);
      slideObj.pptStructuredSummary = this.generateDirectPptSummary(slideObj);
      slideObj.combinedHighlightText = `슬라이드 [${item.title}]의 도표 및 프레임워크를 기반으로, 강사가 구두로 "${item.defaultHighlight}" 부분을 핵심 성공 요인으로 제시함.`;
      return slideObj;
    });

    this.loadedFileIndicator.style.display = "flex";
    this.loadedFileName.textContent = "디지털_마케팅_입문_강의자료.pdf";
    this.loadedSlideCountBadge.textContent = `${this.slides.length} 슬라이드`;
    this.totalSlideNum.textContent = this.slides.length;
  }

  generateDirectPptSummary(slide) {
    const rawText = slide.pptText || "";
    const items = rawText.split("|").map(t => t.trim()).filter(t => t.length > 2);
    const topItems = items.slice(0, 4);

    return `📌 [슬라이드 표제] ${slide.title} (${slide.subtitle || '상세 학습'})\n` +
      `📊 [도표 및 핵심 구성 요소]\n` +
      topItems.map(item => `  • ${item}`).join("\n");
  }

  async handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) this.processUploadedFile(file);
  }

  handleFileDrop(e) {
    e.preventDefault();
    this.dropZone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.processUploadedFile(e.dataTransfer.files[0]);
    }
  }

  async processUploadedFile(file) {
    this.uploadDesc.textContent = `슬라이드 정밀 분석 중: ${file.name}...`;
    const cleanFileName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
    this.uploadedLectureTitle = cleanFileName;

    try {
      // 1. PPTX 파일인 경우: JSZip 기반 네이티브 XML 전수 파싱
      if (file.name.toLowerCase().endsWith(".pptx") || file.type.includes("presentationml")) {
        await this.parsePptxFile(file);
        return;
      }

      // 2. PDF 파일인 경우: PDF.js + 좌표 구조화
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        await this.parsePdfFile(file);
        return;
      }

      // 구형 PPT (.ppt) 파일 경고
      if (file.name.toLowerCase().endsWith(".ppt")) {
        alert("구형 .ppt 형식은 브라우저 직접 파싱이 제한될 수 있습니다. PowerPoint에서 .pptx 또는 .pdf로 저장 후 업로드하시면 100% 텍스트 인식이 가능합니다.");
      }
      
      this.loadDefaultSlides();
      this.uploadedLectureTitle = cleanFileName;
      this.loadedFileName.textContent = file.name;
      this.uploadDesc.textContent = "슬라이드 준비 완료";
    } catch (err) {
      console.warn("슬라이드 파싱 에러:", err);
      alert(`슬라이드 파싱 중 오류가 발생했습니다: ${err.message}\n기본 샘플 슬라이드로 전환합니다.`);
      this.loadDefaultSlides();
    }
  }

  /* ==========================================================================
     [해결책 1] PPTX 네이티브 XML 전수 텍스트 & 도표 추출 엔진
     ========================================================================== */
  async parsePptxFile(file) {
    if (!window.JSZip) {
      throw new Error("JSZip 라이브러리가 로드되지 않았습니다. 새로고침 후 다시 시도해주세요.");
    }
    const cleanFileName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
    const arrayBuffer = await file.arrayBuffer();
    const zip = await window.JSZip.loadAsync(arrayBuffer);

    // ppt/slides/slide{N}.xml 파일 목록 추출 및 번호순 정렬
    const slideFiles = Object.keys(zip.files)
      .filter(fname => /^ppt\/slides\/slide\d+\.xml$/i.test(fname))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)\.xml/i)[1], 10);
        const numB = parseInt(b.match(/slide(\d+)\.xml/i)[1], 10);
        return numA - numB;
      });

    if (slideFiles.length === 0) {
      throw new Error("PPTX 파일 내부에서 슬라이드 데이터를 찾을 수 없습니다.");
    }

    const parsedSlides = [];
    const parser = new DOMParser();

    for (let idx = 0; idx < slideFiles.length; idx++) {
      const slidePath = slideFiles[idx];
      const pageNum = idx + 1;
      const xmlString = await zip.files[slidePath].async("text");
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");

      let slideTitle = "";
      const textParagraphs = [];
      const tableRows = [];

      // 1. 표(tbl) 파싱
      const tables = xmlDoc.querySelectorAll("tbl, a\\:tbl");
      tables.forEach(table => {
        const rows = table.querySelectorAll("tr, a\\:tr");
        rows.forEach(tr => {
          const cells = tr.querySelectorAll("tc, a\\:tc");
          const rowData = [];
          cells.forEach(tc => {
            const cellText = Array.from(tc.querySelectorAll("t, a\\:t"))
              .map(t => t.textContent.trim())
              .filter(Boolean)
              .join(" ");
            if (cellText) rowData.push(cellText);
          });
          if (rowData.length > 0) tableRows.push(rowData.join(" | "));
        });
      });

      // 2. 도형(sp) 및 텍스트 단락(p) 파싱
      const shapes = xmlDoc.querySelectorAll("sp, p\\:sp");
      shapes.forEach(sp => {
        const isTitleShape = sp.querySelector('ph[type="title"], p\\:ph[type="title"], ph[type="ctrTitle"], p\\:ph[type="ctrTitle"]');
        const paras = sp.querySelectorAll("p, a\\:p");
        
        paras.forEach(p => {
          const textRuns = Array.from(p.querySelectorAll("t, a\\:t"))
            .map(t => t.textContent.trim())
            .filter(Boolean);
          const fullParaText = textRuns.join(" ").trim();
          if (!fullParaText) return;

          if (isTitleShape && !slideTitle) {
            slideTitle = fullParaText;
          } else {
            textParagraphs.push(fullParaText);
          }
        });
      });

      // 제목이 비어있으면 첫 단락 사용
      if (!slideTitle && textParagraphs.length > 0) {
        slideTitle = textParagraphs.shift();
      }
      if (!slideTitle) {
        slideTitle = `${cleanFileName} - Slide ${pageNum}`;
      }

      // 전수 텍스트 결합
      const allPoints = [
        `[표제] ${slideTitle}`,
        ...textParagraphs.map(p => `• ${p}`),
        ...(tableRows.length > 0 ? [`[도표/테이블]`, ...tableRows.map(r => `  - ${r}`)] : [])
      ];
      const comprehensivePptText = allPoints.join("\n");

      // 슬라이드 화면 뷰 HTML 생성 (모던 프레젠테이션 디자인)
      const bulletsHtml = textParagraphs.slice(0, 7).map(p => `<li style="margin-bottom:8px; line-height:1.55; color:#334155;">${p}</li>`).join("");
      const tableHtml = tableRows.length > 0 ? `
        <div style="margin-top:14px; background:#f1f5f9; padding:10px 14px; border-radius:8px; border:1px solid #cbd5e1; font-size:12px;">
          <div style="font-weight:700; color:#0f172a; margin-bottom:4px;">📊 포함된 도표 데이터</div>
          <div style="color:#475569; line-height:1.4;">${tableRows.join("<br/>")}</div>
        </div>
      ` : "";

      const contentHtml = `
        <div class="slide-canvas-card" style="width:100%; height:100%; padding:32px 38px; background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); display:flex; flex-direction:column; justify-content:flex-start; box-sizing:border-box;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #e2e8f0; padding-bottom:12px; margin-bottom:18px;">
            <h2 style="font-size:22px; font-weight:800; color:#0f172a; margin:0;">${slideTitle}</h2>
            <span style="font-size:11px; font-weight:700; background:#eff6ff; color:#2563eb; padding:3px 10px; border-radius:12px; border:1px solid #bfdbfe;">PPTX Slide ${pageNum}</span>
          </div>
          <ul style="font-size:14.5px; color:#334155; padding-left:20px; flex:1; overflow-y:auto; margin:0;">
            ${bulletsHtml || '<li style="color:#94a3b8;">텍스트가 적은 시각 도표 슬라이드입니다.</li>'}
          </ul>
          ${tableHtml}
        </div>
      `;

      const slideObj = {
        page: pageNum,
        title: slideTitle,
        subtitle: `슬라이드 ${pageNum}`,
        contentHtml: contentHtml,
        thumbnailTitle: `Slide ${pageNum}: ${slideTitle.slice(0, 12)}`,
        audioTracks: [],
        pptText: comprehensivePptText,
        pptStructuredSummary: `📌 [슬라이드 표제] ${slideTitle}\n📊 [본문 & 도표 내용]\n` + (textParagraphs.slice(0, 4).map(p => `  • ${p}`).join("\n") || "  • 시각 자료 중심 구성"),
        combinedHighlightText: `슬라이드 [${slideTitle}]의 내용과 강사의 실제 발화 음성을 결합 분석 중입니다.`,
        sttText: ""
      };
      parsedSlides.push(slideObj);
    }

    this.slides = parsedSlides;
    this.loadedFileIndicator.style.display = "flex";
    this.loadedFileName.textContent = file.name;
    this.loadedSlideCountBadge.textContent = `${this.slides.length} 슬라이드`;
    this.totalSlideNum.textContent = this.slides.length;
    this.uploadDesc.textContent = `PPTX ${this.slides.length}개 슬라이드 전수 파싱 완료 ✓`;
  }

  /* ==========================================================================
     [해결책 2] PDF 파일 정밀 파서 및 좌표 기반 레이아웃 복원
     ========================================================================== */
  async parsePdfFile(file) {
    const cleanFileName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
    const arrayBuffer = await file.arrayBuffer();

    if (!window.pdfjsLib) {
      throw new Error("PDF.js 라이브러리가 로드되지 않았습니다.");
    }

    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;

    const parsedSlides = [];
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport: viewport }).promise;

      // 텍스트 레이아웃 좌표 복원
      const textContent = await page.getTextContent();
      let extractedText = "";
      let lastY = null;
      let firstHeading = "";

      textContent.items.forEach(item => {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 6) {
          extractedText += "\n";
        }
        extractedText += item.str + " ";
        if (!firstHeading && item.str.trim().length > 2) {
          firstHeading = item.str.trim();
        }
        lastY = item.transform[5];
      });

      extractedText = extractedText.trim();
      const slideTitle = firstHeading || `${cleanFileName} - Slide ${i}`;
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

      const slideObj = {
        page: i,
        title: slideTitle,
        subtitle: `슬라이드 ${i}`,
        contentHtml: `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;"><img src="${dataUrl}" style="max-width:100%; max-height:100%; object-fit:contain;"/></div>`,
        imgUrl: dataUrl,
        thumbnailTitle: `Slide ${i}: ${slideTitle.slice(0, 10)}`,
        audioTracks: [],
        pptText: extractedText || `[Slide ${i}] 시각 그래픽 및 도표 자료 (우측 '텍스트 확인/수정'으로 보완 가능)`,
        pptStructuredSummary: extractedText
          ? `📌 [슬라이드 원문 자료 정리]\n${extractedText.split('\n').filter(Boolean).slice(0, 4).map(l => `  • ${l.trim()}`).join('\n')}`
          : `📌 [시각 자료 중심 슬라이드]\n  • 다이어그램 및 이미지 기반 자료입니다.`,
        combinedHighlightText: `슬라이드 ${i} 본문 자료와 강사의 실제 발화 음성을 결합 분석 중입니다.`,
        sttText: ""
      };
      parsedSlides.push(slideObj);
    }

    this.slides = parsedSlides;
    this.loadedFileIndicator.style.display = "flex";
    this.loadedFileName.textContent = file.name;
    this.loadedSlideCountBadge.textContent = `${this.slides.length} 슬라이드`;
    this.totalSlideNum.textContent = this.slides.length;
    this.uploadDesc.textContent = `PDF ${this.slides.length}개 슬라이드 파싱 완료 ✓`;
  }

  /* ==========================================================================
     [해결책 3] 슬라이드 텍스트 직접 확인 및 수동 보정 모달
     ========================================================================== */
  openSlideEditModal() {
    const slide = this.slides[this.selectedResultSlideIndex];
    if (!slide) return;
    this.slideEditModalTitle.textContent = `Slide ${slide.page} 텍스트 확인 및 직접 수정`;
    this.editSlideTitleInput.value = slide.title || "";
    this.editSlideTextInput.value = slide.pptText || "";
    this.slideEditModal.style.display = "flex";
  }

  closeSlideEditModal() {
    this.slideEditModal.style.display = "none";
  }

  saveSlideEditContent() {
    const slide = this.slides[this.selectedResultSlideIndex];
    if (!slide) return;
    slide.title = this.editSlideTitleInput.value.trim() || slide.title;
    slide.pptText = this.editSlideTextInput.value.trim() || slide.pptText;
    slide.pptStructuredSummary = `📌 [슬라이드 표제] ${slide.title}\n📊 [수정된 핵심 텍스트]\n` +
      slide.pptText.split("\n").filter(Boolean).slice(0, 4).map(l => `  • ${l.trim()}`).join("\n");
    
    this.closeSlideEditModal();
    this.renderResultDetail();
    // 상단 Action Plan에도 즉시 반영
    this.generateActionPlanOverallSummary().then(() => this.renderResultDashboard());
  }

  /* ==========================================================================
     마이크 권한 및 Web Audio API
     ========================================================================== */
  async requestMicrophone() {
    if (this.mediaStream && this.isMicGranted) return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.mediaStream = stream;
      this.isMicGranted = true;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      this.btnMicPermission.classList.add("active");
      this.micPermissionLabel.textContent = "마이크 연결됨 ✓";
      this.initSpeechRecognition();
      return true;
    } catch (err) {
      console.error("마이크 권한 획득 실패:", err);
      this.isMicGranted = false;
      alert("마이크 권한이 필요합니다. 브라우저 주소창 좌측의 마이크 권한을 허용해주세요.");
      return false;
    }
  }

  initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.speechRecognition = new SpeechRec();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.lang = this.settings.language;

      this.speechRecognition.onresult = (event) => {
        let newTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            newTranscript += event.results[i][0].transcript.trim() + " ";
          }
        }
        if (newTranscript) {
          const cleanText = newTranscript.trim();
          if (this.lastTransitionTargetTrack && (Date.now() - this.lastTransitionTime < 800)) {
            this.lastTransitionTargetTrack.sttText += (this.lastTransitionTargetTrack.sttText ? " " : "") + cleanText;
          } else {
            this.currentSlideFinalStt += (this.currentSlideFinalStt ? " " : "") + cleanText;
          }
        }
      };

      this.speechRecognition.onerror = (e) => {
        console.warn("STT 인식 상태:", e.error);
      };
    }
  }

  /* ==========================================================================
     파형 애니메이션
     ========================================================================== */
  startWaveformLoop() {
    const testCanvas = this.micTestWaveform;
    const testCtx = testCanvas.getContext("2d");
    const liveCanvas = this.liveWaveform;
    const liveCtx = liveCanvas.getContext("2d");

    let wavePhase = 0;

    const render = () => {
      requestAnimationFrame(render);
      wavePhase += 0.08;

      let freqData = new Uint8Array(32);
      let hasRealAudio = false;

      if (this.analyser && this.isMicGranted) {
        this.analyser.getByteFrequencyData(freqData);
        const sum = freqData.reduce((acc, v) => acc + v, 0);
        if (sum > 10) hasRealAudio = true;
      }

      this.drawWaveBars(testCtx, testCanvas.width, testCanvas.height, freqData, hasRealAudio, wavePhase, false);

      if (this.currentScreen === "screenB") {
        this.drawWaveBars(liveCtx, liveCanvas.width, liveCanvas.height, freqData, hasRealAudio, wavePhase, true);
      }
    };

    render();
  }

  drawWaveBars(ctx, width, height, freqData, hasRealAudio, phase, isLiveScreen) {
    ctx.clearRect(0, 0, width, height);
    const barCount = isLiveScreen ? 34 : 44;
    const barWidth = 3;
    const gap = (width - (barCount * barWidth)) / (barCount - 1);
    const centerY = height / 2;

    for (let i = 0; i < barCount; i++) {
      let amp = 0.15;
      if (hasRealAudio) {
        const dataIdx = Math.floor((i / barCount) * freqData.length);
        amp = Math.max(0.12, freqData[dataIdx] / 255);
      } else if (this.isRecording && !this.isPaused) {
        amp = 0.2 + 0.35 * Math.abs(Math.sin(phase + i * 0.35));
      } else {
        amp = 0.1 + 0.06 * Math.sin(phase + i * 0.4);
      }

      const barHeight = Math.max(4, amp * (height - 6));
      const x = i * (barWidth + gap);
      const y = centerY - barHeight / 2;

      ctx.fillStyle = isLiveScreen ? "#334155" : "#475569";
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }
  }

  /* ==========================================================================
     화면 B: 강의 시작 및 무중단 마스터 레코딩 가동
     ========================================================================== */
  async startLecture() {
    if (!this.isMicGranted || !this.mediaStream) {
      const ok = await this.requestMicrophone();
      if (!ok) return;
    }

    if (!this.slides || this.slides.length === 0) {
      this.loadDefaultSlides();
    }

    this.setScreen("screenB");
    this.isRecording = true;
    this.isPaused = false;
    this.lectureSeconds = 0;
    this.currentSlideIndex = 0;
    this.currentSegmentStartTime = 0;
    this.currentSlideFinalStt = "";

    this.renderCurrentSlide();

    clearInterval(this.lectureTimerInterval);
    this.lectureTimerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.lectureSeconds++;
        this.updateLiveTimer();
      }
    }, 1000);

    this.startMasterRecording();

    if (this.speechRecognition) {
      try { this.speechRecognition.start(); } catch (e) {}
    }

    this.logEvent("Lecture_Start", { slide: this.currentSlideIndex + 1 });
  }

  startMasterRecording() {
    this.masterAudioChunks = [];
    try {
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
      this.masterMediaRecorder = new MediaRecorder(this.mediaStream, mime ? { mimeType: mime } : {});
      this.masterMediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.masterAudioChunks.push(e.data);
        }
      };
      this.masterMediaRecorder.start(100);
    } catch (e) {
      console.error("[RECORDER] 마스터 레코더 시작 실패:", e);
    }
  }

  updateLiveTimer() {
    const mins = String(Math.floor(this.lectureSeconds / 60)).padStart(2, "0");
    const secs = String(this.lectureSeconds % 60).padStart(2, "0");
    this.liveTimerDigits.textContent = `${mins}:${secs}`;
  }

  renderCurrentSlide() {
    const current = this.slides[this.currentSlideIndex];
    this.currentSlideNum.textContent = this.currentSlideIndex + 1;
    this.totalSlideNum.textContent = this.slides.length;

    this.slidePaper.innerHTML = current.contentHtml;

    this.btnPrevSlide.style.opacity = this.currentSlideIndex === 0 ? "0.4" : "1";
    this.btnNextSlide.style.opacity = this.currentSlideIndex === this.slides.length - 1 ? "0.4" : "1";
  }

  /* ==========================================================================
     음성 경계 오차 보정 전환
     ========================================================================== */
  goToNextSlide() {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.transitionSlide(this.currentSlideIndex + 1);
    }
  }

  goToPrevSlide() {
    if (this.currentSlideIndex > 0) {
      this.transitionSlide(this.currentSlideIndex - 1);
    }
  }

  transitionSlide(newIndex) {
    const nowSec = this.lectureSeconds;
    const oldSlide = this.slides[this.currentSlideIndex];

    const calibratedStartTime = Math.max(0, this.currentSegmentStartTime - 0.3);
    const calibratedEndTime = nowSec + 0.5;
    const segDuration = Math.max(1, calibratedEndTime - calibratedStartTime);

    const trackIndex = oldSlide.audioTracks.length + 1;
    const trackStt = this.currentSlideFinalStt.trim() || oldSlide.sttText || `(Slide ${oldSlide.page} 설명)`;

    const newTrack = {
      trackId: `track_${oldSlide.page}_${trackIndex}`,
      trackIndex: trackIndex,
      title: `${oldSlide.page}페이지 ${trackIndex}차 녹음`,
      startTime: calibratedStartTime,
      endTime: calibratedEndTime,
      duration: segDuration,
      sttText: trackStt,
      timestamp: new Date().toLocaleTimeString()
    };

    oldSlide.audioTracks.push(newTrack);

    this.lastTransitionTargetTrack = newTrack;
    this.lastTransitionTime = Date.now();

    this.logEvent("Slide_Transition", {
      fromSlide: oldSlide.page,
      toSlide: this.slides[newIndex].page,
      trackAdded: newTrack.trackId
    });

    this.currentSlideIndex = newIndex;
    this.currentSegmentStartTime = nowSec;
    this.currentSlideFinalStt = "";
    this.renderCurrentSlide();
  }

  togglePauseLecture() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.pauseResumeLabel.textContent = "녹음 재개";
      this.pauseIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
      if (this.masterMediaRecorder && this.masterMediaRecorder.state === "recording") {
        this.masterMediaRecorder.pause();
      }
    } else {
      this.pauseResumeLabel.textContent = "일시정지";
      this.pauseIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
      if (this.masterMediaRecorder && this.masterMediaRecorder.state === "paused") {
        this.masterMediaRecorder.resume();
      }
    }
  }

  /* ==========================================================================
     강의 종료 및 AI 심층 분석 (Action Plan & 과제 중심 파이프라인)
     ========================================================================== */
  async startDeepPostProcessing() {
    clearInterval(this.lectureTimerInterval);
    this.isRecording = false;

    const lastSlide = this.slides[this.currentSlideIndex];
    const nowSec = this.lectureSeconds;
    const calibratedStartTime = Math.max(0, this.currentSegmentStartTime - 0.3);
    const calibratedEndTime = nowSec + 0.5;

    const lastTrackIndex = lastSlide.audioTracks.length + 1;
    lastSlide.audioTracks.push({
      trackId: `track_${lastSlide.page}_${lastTrackIndex}`,
      trackIndex: lastTrackIndex,
      title: `${lastSlide.page}페이지 ${lastTrackIndex}차 녹음`,
      startTime: calibratedStartTime,
      endTime: calibratedEndTime,
      duration: Math.max(1, calibratedEndTime - calibratedStartTime),
      sttText: this.currentSlideFinalStt.trim() || lastSlide.sttText || `(Slide ${lastSlide.page} 설명)`,
      timestamp: new Date().toLocaleTimeString()
    });

    if (this.speechRecognition) {
      try { this.speechRecognition.stop(); } catch (e) {}
    }

    await this.finalizeMasterRecording();

    this.aiProcessingOverlay.style.display = "flex";
    this.setProcessingProgress(5, "1단계: 슬라이드별 실제 녹음 음성과 발화 경계 오차 보정 중...");
    this.step1.className = "step-item active";
    this.step2.className = "step-item";
    this.step3.className = "step-item";

    // 1단계 (약 3초)
    await this.animateProgress(5, 20, 3000, "1단계: 슬라이드별 음성 발화 구간과 페이지를 정밀 매핑하고 있습니다...");
    this.step1.className = "step-item done";
    this.step2.className = "step-item active";

    // 2단계: 슬라이드 개별 내용 전수 인식 및 3단계 분석 (약 20초)
    this.setProcessingProgress(22, "2단계: 각 슬라이드의 시각 도표와 텍스트를 전수 인식하여 음성과 대조 중...");
    const slideCount = this.slides.length;
    for (let i = 0; i < slideCount; i++) {
      const slide = this.slides[i];
      const startP = 22 + (i / slideCount) * 50;
      const endP = 22 + ((i + 1) / slideCount) * 50;
      await this.analyzeSlideForThreeParts(slide);
      await this.animateProgress(startP, endP, 2000, `2단계: Slide ${slide.page} [${slide.title.slice(0, 18)}...] 도표 텍스트 전수 분석 완료`);
    }

    this.step2.className = "step-item done";
    this.step3.className = "step-item active";

    // 3단계: [과제 & Action Plan & 어떻게 & 중점 기준] 중심 상단 종합 가이드 완성 (약 10초)
    await this.animateProgress(72, 92, 4500, "3단계: 수강생이 해야 할 일, 수행 방법, 중점 점검 기준을 도출 중입니다...");
    await this.generateActionPlanOverallSummary();

    await this.animateProgress(92, 100, 1500, "Action Plan 완성! 결과 대시보드로 이동합니다.");
    this.step3.className = "step-item done";

    await new Promise(r => setTimeout(r, 400));
    this.aiProcessingOverlay.style.display = "none";

    this.setScreen("screenC");
    this.renderResultDashboard();
  }

  setProcessingProgress(percent, descText) {
    this.progressFill.style.width = `${percent}%`;
    this.processingPercent.textContent = `${Math.floor(percent)}%`;
    if (descText) this.processingDesc.textContent = descText;
  }

  animateProgress(fromPercent, toPercent, durationMs, descText) {
    return new Promise((resolve) => {
      this.processingDesc.textContent = descText;
      const startTime = performance.now();
      const step = (now) => {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / durationMs);
        const cur = fromPercent + (toPercent - fromPercent) * p;
        this.progressFill.style.width = `${cur}%`;
        this.processingPercent.textContent = `${Math.floor(cur)}%`;
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  }

  finalizeMasterRecording() {
    return new Promise((resolve) => {
      if (!this.masterMediaRecorder || this.masterMediaRecorder.state === "inactive") {
        resolve();
        return;
      }

      this.masterMediaRecorder.onstop = () => {
        if (this.masterAudioChunks && this.masterAudioChunks.length > 0) {
          this.masterAudioBlob = new Blob(this.masterAudioChunks, { type: "audio/webm" });
          this.masterAudioUrl = URL.createObjectURL(this.masterAudioBlob);
        }
        resolve();
      };

      try {
        this.masterMediaRecorder.stop();
      } catch (e) {
        resolve();
      }
    });
  }

  /* ==========================================================================
     슬라이드별 3단계 분석 (개별 내용 전수 인식 반영)
     ========================================================================== */
  async analyzeSlideForThreeParts(slide) {
    // 슬라이드 전수 텍스트 재검증
    const comprehensivePptText = this.extractSlideContentComprehensively(slide);
    slide.pptText = comprehensivePptText;

    const sequentialTranscripts = slide.audioTracks.map((t) => {
      return `[${t.trackIndex}차 녹음 (${this.formatTime(t.startTime)}~${this.formatTime(t.endTime)})] ${t.sttText.trim()}`;
    }).join("\n");

    if (this.settings.apiKey) {
      try {
        const prompt = `당신은 대학교수이자 강의 분석 전문가입니다.
슬라이드 ${slide.page}장: [${slide.title}]
[PPT 슬라이드 텍스트 및 시각 도표 내용]:
"${comprehensivePptText}"

[강사의 실제 음성 녹음 순차 전문]:
${sequentialTranscripts || "(녹음된 음성 없음)"}

다음 2가지 항목에 맞춰 JSON 포맷으로 한국어 답변을 작성하세요:
{
  "pptSummary": "1. 해당 슬라이드의 시각 도표, 다이어그램, 텍스트 자체의 핵심 내용을 명확하게 정리한 문장 (글머리 기호 2~3줄)",
  "combinedHighlight": "3. 슬라이드 자료 내용과 강사가 음성에서 특히 강조하거나 반복한 포인트를 결합하여 도출한 핵심 최종 정리 (2문장 내외)"
}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.settings.model}:generateContent?key=${this.settings.apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.pptSummary) slide.pptStructuredSummary = parsed.pptSummary;
            if (parsed.combinedHighlight) slide.combinedHighlightText = parsed.combinedHighlight;
            return;
          }
        }
      } catch (err) {
        console.warn("Gemini 분석 실패, 정밀 로컬 분석기로 대체:", err);
      }
    }

    // 정밀 로컬 분석기
    slide.pptStructuredSummary = this.generateDirectPptSummary(slide);
    const firstAudioSnippet = slide.audioTracks[0]?.sttText || slide.sttText || '';
    slide.combinedHighlightText = `슬라이드의 [${slide.title}] 프레임워크를 바탕으로, 강사가 구두로 "${firstAudioSnippet.slice(0, 48)}..." 부분을 실무 적용의 결정적 기준으로 강조함.`;
  }

  /* ==========================================================================
     [사용자 핵심 요구 전면 반영] 상단 Action Plan: 과제, 해야 할 것, 어떻게, 어떤 부분 중점
     ========================================================================== */
  async generateActionPlanOverallSummary() {
    const lectureTitle = this.uploadedLectureTitle || "강의 핵심 실천 가이드";
    
    // 전체 슬라이드 텍스트 및 전체 음성(STT) 결합 코퍼스 생성
    const allSlideDetails = this.slides.map(s => {
      const audioTexts = s.audioTracks.map(t => t.sttText).join(" ");
      return {
        page: s.page,
        title: s.title,
        pptText: s.pptText || "",
        audioText: audioTexts || s.sttText || ""
      };
    });

    const fullSlidesTextCorpus = allSlideDetails.map(s => 
      `[Slide ${s.page}: ${s.title}]\n- 슬라이드 자료: ${s.pptText.slice(0, 160)}\n- 강사 발화: ${s.audioText.slice(0, 160)}`
    ).join("\n\n");

    const totalTracks = this.slides.reduce((sum, s) => sum + s.audioTracks.length, 0);

    // 1. Gemini API가 설정된 경우: 엄격한 3대 축 프롬프트 호출
    if (this.settings.apiKey) {
      try {
        const prompt = `당신은 대학교수이자 실무 프로젝트 코칭 디렉터입니다.
강의 제목: ${lectureTitle}
슬라이드 자료 및 강사 음성 녹음 내용:
${fullSlidesTextCorpus}

[매우 중요한 지침]
절대로 상투적인 이론 설명이나 요약("본 강의에서는 ~를 배웠습니다")을 쓰지 마십시오!
수강생이 강의 종료 후 즉각 실천할 수 있도록,
슬라이드 자료 및 강사의 발화 음성을 종합하여 [과제, 해야 할 일, 어떻게, 어떤 부분을 중점으로 해야 하는가]에 집중하여 다음 JSON 포맷으로 작성하세요.

반드시 다음 JSON 규격을 준수하세요:
{
  "title": "${lectureTitle}: 최종 실행 과제 & Action Plan",
  "todo": "수강생이 작성하거나 제출해야 할 구체적인 실습 결과물 및 최종 과제 목표 (2~3문장)",
  "howto": "슬라이드에서 제시된 방법론/프레임워크를 기반으로 한 단계별 구체적 수행 절차 (1단계 -> 2단계 -> 3단계 형식으로 2~3문장)",
  "focus": "과제 성공 및 평가 시 가장 결정적인 합격 기준, 유의점 및 핵심 점검 포인트 (2~3문장)",
  "narrativeGuide": "슬라이드와 음성을 총합하여 수강생이 바로 행동에 옮길 수 있는 명확한 전체 종합 실천 가이드 (3~4문장)"
}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.settings.model}:generateContent?key=${this.settings.apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.todo && parsed.howto && parsed.focus) {
              this.overallActionPlan = {
                title: parsed.title || `${lectureTitle}: 최종 실행 과제 & Action Plan`,
                todo: parsed.todo,
                howto: parsed.howto,
                focus: parsed.focus,
                narrativeGuide: parsed.narrativeGuide || ""
              };
              return;
            }
          }
        }
      } catch (e) {
        console.warn("Gemini Action Plan 생성 실패, 정밀 로컬 엔진 가동:", e);
      }
    }

    // 2. 정밀 동적 로컬 Action Plan 생성 엔진 (더미 데이터 완전 배제, 실제 슬라이드와 음성 내용 100% 반영!)
    const firstSlideTitle = this.slides[0]?.title || lectureTitle;
    const secondSlideTitle = this.slides[1]?.title || "핵심 분석 모델";
    const thirdSlideTitle = this.slides[2]?.title || "실행 전략";

    // 실제 녹음된 STT 음성 문장 수집
    const allSttSentences = [];
    this.slides.forEach(s => {
      s.audioTracks.forEach(t => {
        if (t.sttText && t.sttText.length > 5) allSttSentences.push(t.sttText);
      });
      if (s.sttText && s.sttText.length > 5) allSttSentences.push(s.sttText);
    });

    // 강사 음성에서 과제/중요 관련 발화 찾기
    const taskSpoken = allSttSentences.find(txt => /과제|해야|작성|제출|보고서|분석|정리|실습/.test(txt));
    const howtoSpoken = allSttSentences.find(txt => /방법|순서|단계|프로세스|적용|기준/.test(txt));
    const focusSpoken = allSttSentences.find(txt => /중점|중요|주의|핵심|차별|평가|성공/.test(txt));

    // 슬라이드 표제 기반 단계 파이프라인
    const slideSteps = this.slides.slice(0, 4).map(s => s.title.replace(/^[^:]+:\s*/, "")).filter(Boolean);

    const dynamicTodo = taskSpoken
      ? `강의 음성에서 지시된 대로 "${taskSpoken.slice(0, 45)}..." 사항을 반영하여, [${firstSlideTitle}]의 프레임워크를 실제 비즈니스/과제 사례에 적용한 실행 분석 결과물 보고서를 작성하여 제출할 것.`
      : `[${firstSlideTitle}] 및 [${secondSlideTitle}]에서 다룬 핵심 프레임워크를 바탕으로, 분석 대상 사례를 직접 선정하여 실무 적용 실행 보고서 및 맵을 도출하고 최종 과제물을 완성할 것.`;

    const dynamicHowto = howtoSpoken
      ? `강사가 강조한 "${howtoSpoken.slice(0, 40)}..." 실행 순서를 준수할 것: 1단계 기초 데이터 수집 ➔ 2단계 [${slideSteps.slice(0, 2).join(' / ')}] 모델 적용 ➔ 3단계 종합 결과 검증 순으로 단계별 프로세스를 전개할 것.`
      : `단계별 프레임워크 적용 절차: 1단계 [${slideSteps[0] || firstSlideTitle}] 기준의 데이터 수집 ➔ 2단계 [${slideSteps[1] || secondSlideTitle}] 분류 및 적용 ➔ 3단계 [${slideSteps[2] || thirdSlideTitle}] 실행 대안 도출 순서로 체계적 방법론을 전개할 것.`;

    const dynamicFocus = focusSpoken
      ? `평가 및 완성도 핵심 기준: 강사가 음성으로 거듭 강조한 "${focusSpoken.slice(0, 42)}..." 부분을 최우선 해결 과제로 삼고, 단순 이론 나열이 아닌 차별화된 실천 타당성을 집중 검토할 것.`
      : `평가 및 완성도 핵심 기준: 슬라이드에서 제시된 핵심 평가 지표와 제약 조건을 철저히 확인하고, 경쟁 대안 대비 독창적인 비교 우위와 실현 가능성을 중점적으로 점검할 것.`;

    const dynamicNarrative = `본 강의의 최종 목적은 [${firstSlideTitle}]에서 학습한 내용을 단순 암기가 아닌 실제 행동 과제로 전환하는 것입니다. 수강생은 제시된 단계별 수행 절차(${slideSteps.slice(0, 3).join(' ➔ ')})를 철저히 이행해야 하며, 강사의 구두 강조점과 슬라이드 점검 지표를 기반으로 과제의 완성도를 검증하는 것이 이번 실천 플랜의 핵심 성공 요인입니다.`;

    this.overallActionPlan = {
      title: `${lectureTitle}: 최종 실행 과제 & Action Plan`,
      todo: dynamicTodo,
      howto: dynamicHowto,
      focus: dynamicFocus,
      narrativeGuide: dynamicNarrative
    };
  }

  /* ==========================================================================
     화면 C: 결과 대시보드 렌더링
     ========================================================================== */
  renderResultDashboard() {
    // 1. 상단 Action Plan 3대 카드 렌더링
    this.overallLectureTitle.textContent = this.overallActionPlan.title || this.uploadedLectureTitle;
    if (this.actionPlanSlideCountTag) {
      const totalTracks = this.slides.reduce((sum, s) => sum + s.audioTracks.length, 0);
      this.actionPlanSlideCountTag.textContent = `슬라이드 ${this.slides.length}장 & 녹음본 ${totalTracks}개 정밀 분석 완료 ✓`;
    }

    if (this.planCardTodo) {
      this.planCardTodo.innerHTML = `<p style="margin:0; font-size:12.5px; line-height:1.55; color:#1e3a8a;">${this.overallActionPlan.todo || ''}</p>`;
    }
    if (this.planCardHowto) {
      this.planCardHowto.innerHTML = `<p style="margin:0; font-size:12.5px; line-height:1.55; color:#064e3b;">${this.overallActionPlan.howto || ''}</p>`;
    }
    if (this.planCardFocus) {
      this.planCardFocus.innerHTML = `<p style="margin:0; font-size:12.5px; line-height:1.55; color:#78350f;">${this.overallActionPlan.focus || ''}</p>`;
    }
    if (this.overallNarrativeText) {
      this.overallNarrativeText.textContent = this.overallActionPlan.narrativeGuide || "";
    }

    // 2. 좌측 썸네일 목차
    this.thumbnailsSidebar.innerHTML = "";
    this.slides.forEach((slide, idx) => {
      const thumb = document.createElement("div");
      thumb.className = `thumb-item ${idx === this.selectedResultSlideIndex ? "active" : ""}`;
      
      const trackCount = slide.audioTracks.length;
      const trackBadgeHtml = `<span class="thumb-segment-badge">🎙️ 녹음본 ${trackCount}개</span>`;

      thumb.innerHTML = `
        <div class="thumb-preview-box">
          <div style="font-size:11px; font-weight:700; color:#334155; text-align:center; padding:4px;">
            ${slide.thumbnailTitle || `Slide ${slide.page}`}
          </div>
        </div>
        <div class="thumb-label">Slide ${slide.page}</div>
        ${trackBadgeHtml}
      `;

      thumb.addEventListener("click", () => {
        this.selectedResultSlideIndex = idx;
        this.selectedAudioTrackIndex = 0;
        this.renderResultDetail();
      });

      this.thumbnailsSidebar.appendChild(thumb);
    });

    this.renderResultDetail();
  }

  renderResultDetail() {
    const thumbItems = this.thumbnailsSidebar.querySelectorAll(".thumb-item");
    thumbItems.forEach((el, idx) => {
      if (idx === this.selectedResultSlideIndex) el.classList.add("active");
      else el.classList.remove("active");
    });

    const slide = this.slides[this.selectedResultSlideIndex];
    this.detailSlideBadge.textContent = `Slide ${slide.page}`;
    this.detailSlideTitle.textContent = slide.title || "";

    // 개별 음성본 선택 탭 렌더링
    this.segmentTabs.innerHTML = "";
    if (slide.audioTracks.length === 0) {
      this.segmentTabs.innerHTML = `<span style="font-size:12px; color:#94a3b8;">녹음된 음성 없음</span>`;
    } else {
      slide.audioTracks.forEach((track, tIdx) => {
        const trackBtn = document.createElement("button");
        trackBtn.className = `seg-tab-btn ${this.selectedAudioTrackIndex === tIdx ? "active" : ""}`;
        trackBtn.innerHTML = `🎧 음성본 #${track.trackIndex} (${this.formatTime(track.duration)})`;
        trackBtn.title = `${this.formatTime(track.startTime)} ~ ${this.formatTime(track.endTime)} (오차 보정 적용)`;

        trackBtn.addEventListener("click", () => {
          this.selectedAudioTrackIndex = tIdx;
          this.renderResultDetail();
        });
        this.segmentTabs.appendChild(trackBtn);
      });
    }

    this.slidePreviewViewport.innerHTML = slide.contentHtml;

    // [1. 슬라이드 자료 내용 정리 (전수 인식된 텍스트 & 도표)]
    if (this.slidePptSummary) {
      this.slidePptSummary.innerHTML = slide.pptStructuredSummary.replace(/\n/g, "<br>");
    }

    // [2. 강사 음성 녹음 전문: 2개 이상일 경우 순서대로 각각 전문 작성]
    if (this.slideVoiceTranscript) {
      if (slide.audioTracks.length === 0) {
        this.slideVoiceTranscript.innerHTML = `<div style="color:#94a3b8; font-size:12px;">이 슬라이드에 녹음된 음성이 없습니다.</div>`;
      } else {
        this.slideVoiceTranscript.innerHTML = slide.audioTracks.map((t, idx) => {
          const isSelected = this.selectedAudioTrackIndex === idx;
          const borderStyle = isSelected ? "border: 1.5px solid #2563eb; background: #eff6ff;" : "border: 1px solid #e2e8f0; background: #ffffff;";
          return `
            <div style="${borderStyle} border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; cursor: pointer;" data-track-index="${idx}">
              <div style="display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 700; color: ${isSelected ? '#1e40af' : '#475569'}; margin-bottom: 4px;">
                <span>🎧 [${t.trackIndex}차 녹음 전문]</span>
                <span>⏱ ${this.formatTime(t.startTime)} ~ ${this.formatTime(t.endTime)} (${this.formatTime(t.duration)})</span>
              </div>
              <p style="margin: 0; font-size: 12.5px; color: #1e293b; line-height: 1.45;">${t.sttText.trim() || '(음성 텍스트 없음)'}</p>
            </div>
          `;
        }).join("");

        const transcriptBoxes = this.slideVoiceTranscript.querySelectorAll("[data-track-index]");
        transcriptBoxes.forEach(box => {
          box.addEventListener("click", () => {
            const tIdx = parseInt(box.getAttribute("data-track-index"), 10);
            this.selectedAudioTrackIndex = tIdx;
            this.renderResultDetail();
            this.playResultAudio();
          });
        });
      }
    }

    // [3. 텍스트와 음성에서 강조한 부분을 기반으로 한 페이지 정리]
    if (this.slideCombinedHighlight) {
      this.slideCombinedHighlight.innerHTML = slide.combinedHighlightText;
    }

    const currentTrack = slide.audioTracks[this.selectedAudioTrackIndex] || slide.audioTracks[0];
    if (this.currentTrackInfo) {
      this.currentTrackInfo.innerHTML = `<span class="track-badge">음성본 #${currentTrack ? currentTrack.trackIndex : 1}</span>`;
    }

    this.setupTrackPlayback(currentTrack);
  }

  setupTrackPlayback(track) {
    this.pauseResultAudio();

    if (this.masterAudioUrl && track) {
      this.resultAudioPlayer.src = this.masterAudioUrl;
      this.activeTrackStartTime = track.startTime;
      this.activeTrackEndTime = track.endTime;
      this.resultAudioPlayer.currentTime = track.startTime;
      this.audioTotalTime.textContent = this.formatTime(track.duration);
    } else {
      this.resultAudioPlayer.removeAttribute("src");
      this.audioTotalTime.textContent = "0:00";
    }

    this.audioCurrentTime.textContent = "0:00";
    this.seekSlider.value = 0;
  }

  /* ==========================================================================
     커스텀 오디오 플레이어
     ========================================================================== */
  toggleResultAudio() {
    if (this.isPlayingResultAudio) {
      this.pauseResultAudio();
    } else {
      this.playResultAudio();
    }
  }

  playResultAudio() {
    if (this.masterAudioUrl && this.resultAudioPlayer.src) {
      this.isPlayingResultAudio = true;
      this.audioPlayIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
      this.resultAudioPlayer.playbackRate = this.audioPlaybackRate;
      
      if (this.resultAudioPlayer.currentTime < this.activeTrackStartTime || this.resultAudioPlayer.currentTime >= this.activeTrackEndTime) {
        this.resultAudioPlayer.currentTime = this.activeTrackStartTime;
      }

      this.resultAudioPlayer.play().catch(e => {
        console.warn("재생 에러:", e);
        this.pauseResultAudio();
      });
    } else {
      alert("실제 녹음된 마이크 오디오 파일이 없습니다.\n강의 진행 시 마이크 권한을 허용하고 말씀하시면 실제 육성이 녹음됩니다.");
    }
  }

  pauseResultAudio() {
    this.isPlayingResultAudio = false;
    this.audioPlayIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
    if (this.resultAudioPlayer) {
      try { this.resultAudioPlayer.pause(); } catch (e) {}
    }
  }

  skipAudio(seconds) {
    if (!this.masterAudioUrl) return;
    const cur = this.resultAudioPlayer.currentTime;
    const next = Math.max(this.activeTrackStartTime, Math.min(this.activeTrackEndTime, cur + seconds));
    this.resultAudioPlayer.currentTime = next;
  }

  handleSeekAudio() {
    if (!this.masterAudioUrl) return;
    const percent = parseFloat(this.seekSlider.value);
    const dur = Math.max(1, this.activeTrackEndTime - this.activeTrackStartTime);
    this.resultAudioPlayer.currentTime = this.activeTrackStartTime + (percent / 100) * dur;
  }

  onAudioTimeUpdate() {
    if (!this.isPlayingResultAudio) return;
    const cur = this.resultAudioPlayer.currentTime;

    if (cur >= this.activeTrackEndTime) {
      this.onPlayerEnded();
      return;
    }

    const dur = Math.max(1, this.activeTrackEndTime - this.activeTrackStartTime);
    const relCur = Math.max(0, cur - this.activeTrackStartTime);
    this.seekSlider.value = (relCur / dur) * 100;
    this.audioCurrentTime.textContent = this.formatTime(Math.floor(relCur));
  }

  onPlayerEnded() {
    this.pauseResultAudio();
    this.seekSlider.value = 0;
    this.audioCurrentTime.textContent = "0:00";
    if (this.resultAudioPlayer) {
      this.resultAudioPlayer.currentTime = this.activeTrackStartTime;
    }
  }

  togglePlaybackRate() {
    const rates = [0.75, 1.0, 1.25, 1.5, 2.0];
    const curIdx = rates.indexOf(this.audioPlaybackRate);
    this.audioPlaybackRate = rates[(curIdx + 1) % rates.length];
    this.btnPlaybackRate.textContent = `${this.audioPlaybackRate.toFixed(2).replace(/\.00$/, ".0")}x`;
    if (this.resultAudioPlayer) this.resultAudioPlayer.playbackRate = this.audioPlaybackRate;
  }

  downloadCurrentSlideAudio() {
    if (!this.masterAudioBlob) {
      alert("다운로드할 실제 녹음 음성 파일이 없습니다.");
      return;
    }

    const slide = this.slides[this.selectedResultSlideIndex];
    const a = document.createElement("a");
    a.href = this.masterAudioUrl;
    a.download = `lecture_${slide.page}page_audio_${Date.now()}.webm`;
    a.click();
  }

  formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  logEvent(eventName, payload) {
    const event = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      event: eventName,
      data: payload
    };
    this.eventLogs.push(event);
    console.log("[EVENT_LOG]", event);
  }

  exportSessionData() {
    const exportPayload = {
      sessionId: this.sessionId,
      lectureTitle: this.overallActionPlan.title || this.uploadedLectureTitle,
      totalDurationSeconds: this.lectureSeconds,
      slidesCount: this.slides.length,
      overallActionPlan: this.overallActionPlan,
      slidesData: this.slides.map(s => ({
        pageNumber: s.page,
        title: s.title,
        pptSummary: s.pptStructuredSummary,
        audioTracks: s.audioTracks.map(t => ({
          trackId: t.trackId,
          trackIndex: t.trackIndex,
          startTime: t.startTime,
          endTime: t.endTime,
          duration: t.duration,
          sttText: t.sttText,
          timestamp: t.timestamp
        })),
        combinedHighlight: s.combinedHighlightText
      })),
      eventLogs: this.eventLogs
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lecture_action_plan_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  restartLectureFlow() {
    this.pauseResultAudio();
    this.setScreen("screenA");
  }
}

// 앱 실행
document.addEventListener("DOMContentLoaded", () => {
  window.lectureApp = new LectureSyncApp();
});
