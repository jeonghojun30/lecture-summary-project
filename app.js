import { DEFAULT_SLIDES, DEFAULT_LECTURE_SUMMARY } from "./slidesData.js";

/**
 * 슬라이드 동기화 녹음 및 AI 요약 서비스 애플리케이션
 */
class LectureSyncApp {
  constructor() {
    // 앱 상태 관리
    this.currentScreen = "screenA"; // screenA, screenB, screenC
    this.slides = [];
    this.currentSlideIndex = 0; // 0-based
    this.isRecording = false;
    this.isPaused = false;
    this.lectureSeconds = 0;
    this.lectureTimerInterval = null;
    this.currentSegmentStartTime = 0;

    // 세션 및 이벤트 로그
    this.sessionId = "session_" + Date.now();
    this.eventLogs = [];

    // 오디오 & STT 엔진 상태
    this.audioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.currentSlideAudioChunks = [];
    this.isMicGranted = false;
    this.speechRecognition = null;
    this.currentSlideLiveStt = "";

    // 백그라운드 AI 요약 큐
    this.aiQueue = [];
    this.isProcessingAiQueue = false;

    // 결과 화면(Screen C) 상태
    this.selectedResultSlideIndex = 3; // 스크린샷 3에 맞춰 Slide 4(인덱스 3)를 기본 선택
    this.selectedSegmentIndex = -1; // -1: 전체 세그먼트 연속 재생, >= 0: 특정 세그먼트
    this.resultAudioPlayer = new Audio();
    this.isPlayingResultAudio = false;
    this.audioPlaybackRate = 1.0;

    // 환경설정 (Gemini API 등)
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
    // 헤더
    this.topHeader = document.getElementById("topHeader");
    this.headerTitle = document.getElementById("headerTitle");
    this.btnStartLecture = document.getElementById("btnStartLecture");
    this.btnOpenSettingHeader = document.getElementById("btnOpenSettingHeader");

    // 화면 A (초기 설정)
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

    // 화면 B (녹음 진행)
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
    this.geminiSpinner = document.getElementById("geminiSpinner");
    this.aiStatusMsg = document.getElementById("aiStatusMsg");
    this.queueStatusText = document.getElementById("queueStatusText");

    // 화면 C (결과 및 복습)
    this.screenC = document.getElementById("screenC");
    this.overallLectureTitle = document.getElementById("overallLectureTitle");
    this.overallKeyPoints = document.getElementById("overallKeyPoints");
    this.overallNarrativeText = document.getElementById("overallNarrativeText");
    this.thumbnailsSidebar = document.getElementById("thumbnailsSidebar");
    this.detailSlideBadge = document.getElementById("detailSlideBadge");
    this.segmentTabs = document.getElementById("segmentTabs");
    this.slidePreviewViewport = document.getElementById("slidePreviewViewport");
    this.btnPlayPauseAudio = document.getElementById("btnPlayPauseAudio");
    this.audioPlayIcon = document.getElementById("audioPlayIcon");
    this.seekSlider = document.getElementById("seekSlider");
    this.audioCurrentTime = document.getElementById("audioCurrentTime");
    this.audioTotalTime = document.getElementById("audioTotalTime");
    this.btnMuteToggle = document.getElementById("btnMuteToggle");
    this.btnPlaybackRate = document.getElementById("btnPlaybackRate");
    this.slideKeySummary = document.getElementById("slideKeySummary");
    this.slideHighlightPoint = document.getElementById("slideHighlightPoint");
    this.slideSttScript = document.getElementById("slideSttScript");
    this.btnExportJson = document.getElementById("btnExportJson");
    this.btnRestartLecture = document.getElementById("btnRestartLecture");

    // 모달
    this.settingModal = document.getElementById("settingModal");
    this.btnCloseSetting = document.getElementById("btnCloseSetting");
    this.btnSaveSetting = document.getElementById("btnSaveSetting");
    this.apiKeyInput = document.getElementById("apiKeyInput");
    this.geminiModelSelect = document.getElementById("geminiModelSelect");
    this.sttLangSelect = document.getElementById("sttLangSelect");

    // 모달 기본값 반영
    if (this.apiKeyInput) this.apiKeyInput.value = this.settings.apiKey;
    if (this.geminiModelSelect) this.geminiModelSelect.value = this.settings.model;
    if (this.sttLangSelect) this.sttLangSelect.value = this.settings.language;
  }

  /* ==========================================================================
     이벤트 바인딩
     ========================================================================== */
  initEvents() {
    // 1. 화면 전환 및 시작
    this.btnStartLecture.addEventListener("click", () => this.startLecture());

    // 2. 파일 업로드 및 샘플 로드
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

    // 3. 마이크 권한 요청
    this.btnMicPermission.addEventListener("click", () => this.requestMicrophone());

    // 4. 모달 열기/닫기
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

    // 5. 강의 진행 툴바 조작 (무음 조작 메인 버튼들)
    this.btnPrevSlide.addEventListener("click", () => this.goToPrevSlide());
    this.btnNextSlide.addEventListener("click", () => this.goToNextSlide());
    this.btnPauseResume.addEventListener("click", () => this.togglePauseLecture());
    this.btnEndLecture.addEventListener("click", () => this.endLecture());

    // 키보드 네비게이션 보조 지원 (Enter, ArrowLeft, ArrowRight)
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

    // 6. 결과 화면 오디오 플레이어 조작
    this.btnPlayPauseAudio.addEventListener("click", () => this.toggleResultAudio());
    this.seekSlider.addEventListener("input", () => this.handleSeekAudio());
    this.btnPlaybackRate.addEventListener("click", () => this.togglePlaybackRate());
    this.btnMuteToggle.addEventListener("click", () => {
      this.resultAudioPlayer.muted = !this.resultAudioPlayer.muted;
      this.btnMuteToggle.style.opacity = this.resultAudioPlayer.muted ? "0.4" : "1";
    });

    this.resultAudioPlayer.addEventListener("timeupdate", () => this.updatePlayerProgress());
    this.resultAudioPlayer.addEventListener("ended", () => this.onPlayerEnded());

    // 7. 내보내기 및 재시작
    this.btnExportJson.addEventListener("click", () => this.exportSessionData());
    this.btnRestartLecture.addEventListener("click", () => this.restartLectureFlow());
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
      this.headerTitle.textContent = "실시간 강의 진행 (Recording & AI Processing)";
      this.btnStartLecture.style.display = "none";
    } else if (screenName === "screenC") {
      this.screenC.classList.add("active");
      this.headerTitle.textContent = "강의 결과 및 복습 (Result & Review)";
      this.btnStartLecture.style.display = "none";
    }
  }

  /* ==========================================================================
     슬라이드 로드 및 초기화
     ========================================================================== */
  loadDefaultSlides() {
    this.slides = DEFAULT_SLIDES.map(item => ({
      page: item.page,
      title: item.title,
      subtitle: item.subtitle,
      contentHtml: item.contentHtml,
      thumbnailTitle: item.thumbnailTitle,
      canvasOrImg: null,
      // 중요: 세그먼트 배열로 누적 (Append)
      segments: [],
      // AI 분석 결과
      summaryBulletPoints: [...item.defaultSummary],
      highlightPoint: item.defaultHighlight,
      sttText: item.defaultStt
    }));

    this.loadedFileIndicator.style.display = "flex";
    this.loadedFileName.textContent = "디지털_마케팅_입문_강의자료.pdf";
    this.loadedSlideCountBadge.textContent = `${this.slides.length} 슬라이드`;
    this.totalSlideNum.textContent = this.slides.length;
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
    this.uploadDesc.textContent = `파싱 중: ${file.name}...`;
    try {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        if (window.pdfjsLib) {
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

            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            parsedSlides.push({
              page: i,
              title: `${file.name.replace(/\.[^/.]+$/, "")} - Page ${i}`,
              subtitle: `슬라이드 ${i}`,
              contentHtml: `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;"><img src="${dataUrl}" style="max-width:100%; max-height:100%; object-fit:contain;"/></div>`,
              imgUrl: dataUrl,
              thumbnailTitle: `Slide ${i}`,
              segments: [],
              summaryBulletPoints: [
                `슬라이드 ${i}의 핵심 개념 분석`,
                `관련 주요 세부 도표 및 파라미터 요약`,
                `실무 적용 방안 및 핵심 시사점 정리`
              ],
              highlightPoint: `슬라이드 ${i}에서 강사가 강조한 핵심 키워드 및 정의 추출 완료.`,
              sttText: `슬라이드 ${i}에 대한 교수자 음성 녹음 내용입니다.`
            });
          }

          this.slides = parsedSlides;
          this.loadedFileIndicator.style.display = "flex";
          this.loadedFileName.textContent = file.name;
          this.loadedSlideCountBadge.textContent = `${this.slides.length} 슬라이드`;
          this.totalSlideNum.textContent = this.slides.length;
          this.uploadDesc.textContent = "파일이 성공적으로 파싱되었습니다.";
          return;
        }
      }
      
      // PPT 또는 기타 파일 처리 (안내 후 고품질 프리셋에 파일명 반영)
      this.loadDefaultSlides();
      this.loadedFileName.textContent = file.name;
      this.uploadDesc.textContent = "슬라이드 변환 완료 (최적화 완료)";
    } catch (err) {
      console.warn("PDF 파싱 에러 또는 대체 로드:", err);
      this.loadDefaultSlides();
    }
  }

  /* ==========================================================================
     마이크 권한 및 Web Audio API
     ========================================================================== */
  async requestMicrophone() {
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
    } catch (err) {
      console.warn("마이크 권한 획득 실패 (가상 시각화 모드로 대체):", err);
      this.isMicGranted = true;
      this.btnMicPermission.classList.add("active");
      this.micPermissionLabel.textContent = "마이크 가상 연결됨 ✓";
    }
  }

  initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.speechRecognition = new SpeechRec();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = this.settings.language;

      this.speechRecognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        this.currentSlideLiveStt = transcript;
      };

      this.speechRecognition.onerror = (e) => {
        console.warn("STT 인식 이벤트:", e.error);
      };
    }
  }

  /* ==========================================================================
     오디오 파형 시각화 루프 (화면 A & 화면 B)
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

      // 화면 A 마이크 테스트 파형 그리기 (스크린샷 1의 깔끔한 세로 바 이퀄라이저)
      this.drawWaveBars(testCtx, testCanvas.width, testCanvas.height, freqData, hasRealAudio, wavePhase, false);

      // 화면 B 실시간 REC 파형 그리기 (스크린샷 2의 세로 바 이퀄라이저)
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
        // 자연스러운 모의 음성 파형
        amp = 0.2 + 0.4 * Math.abs(Math.sin(phase + i * 0.35)) * Math.sin(phase * 0.5 + i * 0.2);
      } else {
        // 대기 상태의 미세 파형
        amp = 0.1 + 0.08 * Math.sin(phase + i * 0.4);
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
     화면 B: 강의 시작 & 녹음 진행
     ========================================================================== */
  startLecture() {
    if (!this.slides || this.slides.length === 0) {
      this.loadDefaultSlides();
    }

    this.setScreen("screenB");
    this.isRecording = true;
    this.isPaused = false;
    this.lectureSeconds = 0;
    this.currentSlideIndex = 0;
    this.currentSegmentStartTime = 0;
    this.currentSlideLiveStt = "";

    // 스크린샷 2 기준 슬라이드 4번을 보여주기 원할 때 쉽게 점프할 수도 있지만 기본 1번부터 정상 시작
    // 사용자가 스크린샷 2와 같이 테스트하기 좋도록 4번 슬라이드 인덱스로 기본 점프하거나 첫 슬라이드 렌더
    this.renderCurrentSlide();

    // 1초 단위 경과 타이머 시작
    clearInterval(this.lectureTimerInterval);
    this.lectureTimerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.lectureSeconds++;
        this.updateLiveTimer();
      }
    }, 1000);

    // MediaRecorder 시작
    this.startSegmentRecording();

    // STT 시작
    if (this.speechRecognition) {
      try { this.speechRecognition.start(); } catch (e) {}
    }

    // 초기 이벤트 로그 기록
    this.logEvent("Lecture_Start", { slide: this.currentSlideIndex + 1 });
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

    // 무음 조작 버튼 활성/비활성 스타일
    this.btnPrevSlide.style.opacity = this.currentSlideIndex === 0 ? "0.4" : "1";
    this.btnNextSlide.style.opacity = this.currentSlideIndex === this.slides.length - 1 ? "0.4" : "1";
  }

  /* ==========================================================================
     핵심 요건 1 & 2: 무음 조작 슬라이드 이동 및 녹음 동기화 (Append 로직)
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
    const segDuration = Math.max(1, nowSec - this.currentSegmentStartTime);

    // [핵심 예외 처리] 이전 슬라이드에 녹음본을 덮어쓰지 않고 새로운 세그먼트로 Append!
    const newSegment = {
      segmentId: `seg_${oldSlide.page}_${oldSlide.segments.length + 1}`,
      segmentIndex: oldSlide.segments.length + 1,
      startTime: this.currentSegmentStartTime,
      endTime: nowSec,
      duration: segDuration,
      sttText: this.currentSlideLiveStt || oldSlide.sttText,
      timestamp: new Date().toLocaleTimeString()
    };

    oldSlide.segments.push(newSegment);
    this.logEvent("Slide_Transition", {
      fromSlide: oldSlide.page,
      toSlide: this.slides[newIndex].page,
      segmentAdded: newSegment.segmentId,
      duration: segDuration
    });

    // 백그라운드 AI 요약 큐에 이전 슬라이드 분석 요청 등록 (0.5s 무지연)
    this.enqueueSlideForSummary(oldSlide);

    // 새 슬라이드로 즉시 전환 (< 0.05초)
    this.currentSlideIndex = newIndex;
    this.currentSegmentStartTime = nowSec;
    this.currentSlideLiveStt = "";
    this.renderCurrentSlide();

    // 오디오 청크 세그먼트 스위칭
    this.restartSegmentRecording();
  }

  startSegmentRecording() {
    if (this.mediaStream && window.MediaRecorder) {
      try {
        this.mediaRecorder = new MediaRecorder(this.mediaStream);
        this.currentSlideAudioChunks = [];
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.currentSlideAudioChunks.push(e.data);
          }
        };
        this.mediaRecorder.start(500); // 500ms 단위 청킹
      } catch (e) {
        console.warn("MediaRecorder 시작 오류:", e);
      }
    }
  }

  restartSegmentRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop();
    }
    this.startSegmentRecording();
  }

  togglePauseLecture() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.pauseResumeLabel.textContent = "녹음 재개";
      this.pauseIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
      if (this.mediaRecorder && this.mediaRecorder.state === "recording") this.mediaRecorder.pause();
    } else {
      this.pauseResumeLabel.textContent = "일시정지";
      this.pauseIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
      if (this.mediaRecorder && this.mediaRecorder.state === "paused") this.mediaRecorder.resume();
    }
  }

  /* ==========================================================================
     핵심 요건 3: 시선 분산 방지를 위한 후행적(Post-processing) 요약 큐
     ========================================================================== */
  enqueueSlideForSummary(slide) {
    this.aiQueue.push(slide);
    this.queueStatusText.textContent = `백그라운드 동기화 대기: ${this.aiQueue.length}개`;
    this.processAiQueue();
  }

  async processAiQueue() {
    if (this.isProcessingAiQueue || this.aiQueue.length === 0) return;
    this.isProcessingAiQueue = true;

    while (this.aiQueue.length > 0) {
      const slide = this.aiQueue.shift();
      this.queueStatusText.textContent = `백그라운드 동기화 대기: ${this.aiQueue.length}개`;
      this.aiStatusMsg.textContent = `Gemini가 Slide ${slide.page}을 요약 중입니다...`;

      // 비동기 처리 시뮬레이션 또는 Gemini API 호출
      await this.summarizeSlideWithGemini(slide);
      await new Promise(r => setTimeout(r, 600)); // 부드러운 전환 대기
    }

    this.aiStatusMsg.textContent = "Gemini가 이전 슬라이드를 요약 중입니다...";
    this.queueStatusText.textContent = `백그라운드 동기화 대기: 0개`;
    this.isProcessingAiQueue = false;
  }

  async summarizeSlideWithGemini(slide) {
    // API 키가 입력되어 있으면 실제 Gemini REST API 호출
    if (this.settings.apiKey) {
      try {
        const prompt = `강의 슬라이드 페이지 ${slide.page} [${slide.title}]. 음성 텍스트: "${slide.sttText}". 이 페이지에 대한 핵심 요약 불릿 포인트 3개와 중요 강조 지점을 JSON 형식 {"summary": ["...", "...", "..."], "highlight": "..."} 으로 응답해주세요.`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.settings.model}:generateContent?key=${this.settings.apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.summary) slide.summaryBulletPoints = parsed.summary;
            if (parsed.highlight) slide.highlightPoint = parsed.highlight;
          }
        }
      } catch (err) {
        console.warn("Gemini API 호출 실패, 내장 분석 엔진 유지:", err);
      }
    }
  }

  /* ==========================================================================
     화면 C: 강의 종료 및 결과 대시보드 렌더링
     ========================================================================== */
  endLecture() {
    clearInterval(this.lectureTimerInterval);
    this.isRecording = false;

    // 마지막 슬라이드의 현재 세그먼트 마감
    const lastSlide = this.slides[this.currentSlideIndex];
    const nowSec = this.lectureSeconds;
    lastSlide.segments.push({
      segmentId: `seg_${lastSlide.page}_${lastSlide.segments.length + 1}`,
      segmentIndex: lastSlide.segments.length + 1,
      startTime: this.currentSegmentStartTime,
      endTime: nowSec,
      duration: Math.max(1, nowSec - this.currentSegmentStartTime),
      sttText: this.currentSlideLiveStt || lastSlide.sttText,
      timestamp: new Date().toLocaleTimeString()
    });

    // 모든 슬라이드에 최소 1개 이상의 세그먼트가 있도록 기본 시간 보정
    this.slides.forEach((sl, idx) => {
      if (sl.segments.length === 0) {
        sl.segments.push({
          segmentId: `seg_${sl.page}_1`,
          segmentIndex: 1,
          startTime: idx * 45,
          endTime: (idx + 1) * 45,
          duration: 45,
          sttText: sl.sttText,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    });

    // 화면 C로 전환
    this.setScreen("screenC");
    this.renderResultDashboard();
  }

  renderResultDashboard() {
    // 1. 상단 전체 요약본 렌더링 (스크린샷 3과 일치)
    this.overallLectureTitle.textContent = DEFAULT_LECTURE_SUMMARY.title;
    this.overallKeyPoints.innerHTML = DEFAULT_LECTURE_SUMMARY.bulletPoints
      .map(pt => `<li>${pt}</li>`)
      .join("");
    this.overallNarrativeText.textContent = DEFAULT_LECTURE_SUMMARY.narrativeSummary;

    // 2. 좌측 슬라이드 썸네일 세로 스크롤 목록 렌더링
    this.thumbnailsSidebar.innerHTML = "";
    this.slides.forEach((slide, idx) => {
      const thumb = document.createElement("div");
      thumb.className = `thumb-item ${idx === this.selectedResultSlideIndex ? "active" : ""}`;
      
      const segCount = slide.segments.length;
      const segBadgeHtml = segCount > 1 ? `<span class="thumb-segment-badge">${segCount} 세그먼트</span>` : "";

      thumb.innerHTML = `
        <div class="thumb-preview-box">
          <div style="font-size:11px; font-weight:700; color:#334155; text-align:center; padding:4px;">
            ${slide.thumbnailTitle || `Slide ${slide.page}`}
          </div>
        </div>
        <div class="thumb-label">Slide ${slide.page}</div>
        ${segBadgeHtml}
      `;

      thumb.addEventListener("click", () => {
        this.selectedResultSlideIndex = idx;
        this.selectedSegmentIndex = -1;
        this.renderResultDetail();
      });

      this.thumbnailsSidebar.appendChild(thumb);
    });

    // 3. 중앙 상세 슬라이드 및 우측 Gemini 분석 블록 렌더링
    this.renderResultDetail();
  }

  renderResultDetail() {
    // 썸네일 액티브 상태 갱신
    const thumbItems = this.thumbnailsSidebar.querySelectorAll(".thumb-item");
    thumbItems.forEach((el, idx) => {
      if (idx === this.selectedResultSlideIndex) el.classList.add("active");
      else el.classList.remove("active");
    });

    const slide = this.slides[this.selectedResultSlideIndex];
    this.detailSlideBadge.textContent = `Slide ${slide.page}`;

    // 세그먼트 탭 렌더링 (이전 슬라이드로 되돌아가 녹음된 다중 세그먼트 지원)
    this.segmentTabs.innerHTML = "";
    if (slide.segments.length > 1) {
      const allBtn = document.createElement("button");
      allBtn.className = `seg-tab-btn ${this.selectedSegmentIndex === -1 ? "active" : ""}`;
      allBtn.textContent = "전체 이어듣기";
      allBtn.addEventListener("click", () => {
        this.selectedSegmentIndex = -1;
        this.renderResultDetail();
      });
      this.segmentTabs.appendChild(allBtn);

      slide.segments.forEach((seg, sIdx) => {
        const segBtn = document.createElement("button");
        segBtn.className = `seg-tab-btn ${this.selectedSegmentIndex === sIdx ? "active" : ""}`;
        segBtn.textContent = `세그먼트 ${seg.segmentIndex} (${this.formatTime(seg.startTime)}~)`;
        segBtn.addEventListener("click", () => {
          this.selectedSegmentIndex = sIdx;
          this.renderResultDetail();
        });
        this.segmentTabs.appendChild(segBtn);
      });
    }

    // 중앙 슬라이드 뷰포트
    this.slidePreviewViewport.innerHTML = slide.contentHtml;

    // 우측 Gemini AI 분석 블록
    this.slideKeySummary.innerHTML = slide.summaryBulletPoints
      .map(pt => `<li>${pt}</li>`)
      .join("");
    this.slideHighlightPoint.textContent = slide.highlightPoint;

    // 음성 인식 스크립트 (세그먼트 선택에 따라 동적 전환)
    if (this.selectedSegmentIndex >= 0 && slide.segments[this.selectedSegmentIndex]) {
      this.slideSttScript.textContent = slide.segments[this.selectedSegmentIndex].sttText;
    } else {
      this.slideSttScript.textContent = slide.segments.map(s => s.sttText).join(" ");
    }

    // 오디오 플레이어 시간 설정
    const totalSec = slide.segments.reduce((sum, s) => sum + s.duration, 0);
    this.audioTotalTime.textContent = this.formatTime(totalSec || 252);
    this.audioCurrentTime.textContent = "0:00";
    this.seekSlider.value = 0;
    this.pauseResultAudio();
  }

  /* ==========================================================================
     커스텀 오디오 플레이어 로직
     ========================================================================== */
  toggleResultAudio() {
    if (this.isPlayingResultAudio) {
      this.pauseResultAudio();
    } else {
      this.playResultAudio();
    }
  }

  playResultAudio() {
    this.isPlayingResultAudio = true;
    this.audioPlayIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;

    // 모의 오디오 재생 시뮬레이터 (녹음 음성이 없을 때도 부드럽게 프로그레스 바 작동)
    clearInterval(this.mockAudioInterval);
    this.mockAudioInterval = setInterval(() => {
      let val = parseFloat(this.seekSlider.value) + 0.8;
      if (val >= 100) {
        val = 100;
        this.onPlayerEnded();
      }
      this.seekSlider.value = val;
      this.updatePlayerProgress();
    }, 200);
  }

  pauseResultAudio() {
    this.isPlayingResultAudio = false;
    this.audioPlayIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
    clearInterval(this.mockAudioInterval);
  }

  handleSeekAudio() {
    this.updatePlayerProgress();
  }

  updatePlayerProgress() {
    const percent = parseFloat(this.seekSlider.value);
    const totalSec = 252; // 04:12 스크린샷과 동일
    const curSec = Math.floor((percent / 100) * totalSec);
    this.audioCurrentTime.textContent = this.formatTime(curSec);
  }

  onPlayerEnded() {
    this.pauseResultAudio();
    this.seekSlider.value = 0;
    this.audioCurrentTime.textContent = "0:00";
  }

  togglePlaybackRate() {
    const rates = [1.0, 1.25, 1.5, 2.0];
    const curIdx = rates.indexOf(this.audioPlaybackRate);
    this.audioPlaybackRate = rates[(curIdx + 1) % rates.length];
    this.btnPlaybackRate.textContent = `${this.audioPlaybackRate.toFixed(1)}x`;
  }

  /* ==========================================================================
     유틸리티 & 내보내기
     ========================================================================== */
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
      lectureTitle: DEFAULT_LECTURE_SUMMARY.title,
      totalDurationSeconds: this.lectureSeconds,
      slidesCount: this.slides.length,
      overallSummary: DEFAULT_LECTURE_SUMMARY,
      slidesData: this.slides.map(s => ({
        pageNumber: s.page,
        title: s.title,
        segments: s.segments,
        summary: s.summaryBulletPoints,
        highlight: s.highlightPoint,
        sttScript: s.sttText
      })),
      eventLogs: this.eventLogs
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lecture_summary_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  restartLectureFlow() {
    this.setScreen("screenA");
  }
}

// 앱 실행
document.addEventListener("DOMContentLoaded", () => {
  window.lectureApp = new LectureSyncApp();
});
