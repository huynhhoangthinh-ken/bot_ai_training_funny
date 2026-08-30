/**
 * INTERACTIVE ASSESSMENT & GRADUATION CERTIFICATE
 * Hệ thống trắc nghiệm nghiệp vụ BĐS có đếm giờ và cấp chứng chỉ Hổ Master
 */

class RealEstateQuizManager {
  constructor() {
    this.quizContainer = document.getElementById('quizContainer');
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.totalQuestions = (window.PROJECT_DATA && window.PROJECT_DATA.quizzes) ? window.PROJECT_DATA.quizzes.length : 6;
    this.timerSeconds = 15;
    this.timerInterval = null;
    this.userAnswers = [];

    this.init();
  }

  init() {
    this.renderQuestion(0);
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timerSeconds = 15;
    const timerDisplay = document.getElementById('quizTimerDisplay');
    if (timerDisplay) {
      timerDisplay.textContent = `${this.timerSeconds}s`;
    }

    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      if (timerDisplay) {
        timerDisplay.textContent = `${this.timerSeconds}s`;
      }
      if (this.timerSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeOut();
      }
    }, 1000);
  }

  handleTimeOut() {
    // Treat as incorrect if timeout
    const currentQ = window.PROJECT_DATA.quizzes[this.currentQuestionIndex];
    this.showAnswerFeedback(-1, currentQ);
  }

  renderQuestion(index) {
    if (!window.PROJECT_DATA || !window.PROJECT_DATA.quizzes) return;
    const questions = window.PROJECT_DATA.quizzes;

    if (index >= questions.length) {
      this.renderResults();
      return;
    }

    this.currentQuestionIndex = index;
    const q = questions[index];
    const letters = ['A', 'B', 'C', 'D'];

    let optionsHtml = '';
    q.options.forEach((opt, optIndex) => {
      optionsHtml += `
        <button class="quiz-ans-btn" data-index="${optIndex}" onclick="window.quizManager.selectAnswer(${optIndex})">
          <span class="quiz-ans-letter">${letters[optIndex]}</span>
          <span>${opt}</span>
        </button>
      `;
    });

    this.quizContainer.innerHTML = `
      <div class="glass-panel quiz-card">
        <div class="quiz-header-bar">
          <div class="quiz-counter">Câu hỏi ${index + 1} / ${questions.length}</div>
          <div class="quiz-timer">
            <span>⏱️ Còn lại:</span>
            <span id="quizTimerDisplay">15s</span>
          </div>
        </div>

        <h3 class="quiz-question-title">${q.question}</h3>

        <div class="quiz-answers-grid" id="quizAnswersGrid">
          ${optionsHtml}
        </div>

        <div id="quizFeedbackBox" style="display:none; margin-top: 20px;"></div>
      </div>
    `;

    this.startTimer();
  }

  selectAnswer(selectedIndex) {
    clearInterval(this.timerInterval);
    const q = window.PROJECT_DATA.quizzes[this.currentQuestionIndex];
    this.showAnswerFeedback(selectedIndex, q);
  }

  showAnswerFeedback(selectedIndex, q) {
    const isCorrect = selectedIndex === q.correctIndex;
    const buttons = document.querySelectorAll('.quiz-ans-btn');
    
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIndex) {
        btn.classList.add('wrong');
      }
    });

    if (isCorrect) {
      this.score += 100;
      if (window.appManager) {
        window.appManager.addExp(50, 'Trả lời đúng trắc nghiệm');
      }
      this.playQuizSound(true);
    } else {
      this.playQuizSound(false);
    }

    const feedbackBox = document.getElementById('quizFeedbackBox');
    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = `feedback-banner ${isCorrect ? 'success' : 'error'}`;
      feedbackBox.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 6px;">
          ${isCorrect ? '🎉 CHÍNH XÁC 100%!' : '❌ CHƯA CHÍNH XÁC RỒI!'}
        </div>
        <p style="margin-bottom: 8px;"><strong>Giải thích:</strong> ${q.explanation}</p>
        <div style="color: var(--gold-light); font-style: italic;">
          ${q.mascotComment}
        </div>
        <div style="margin-top: 16px; text-align: right;">
          <button class="btn btn-gold btn-sm" onclick="window.quizManager.nextQuestion()">
            ${this.currentQuestionIndex + 1 < window.PROJECT_DATA.quizzes.length ? 'Câu tiếp theo ➔' : 'Xem Tổng Kết & Nhận Bằng 🏆'}
          </button>
        </div>
      `;
    }
  }

  nextQuestion() {
    this.renderQuestion(this.currentQuestionIndex + 1);
  }

  renderResults() {
    clearInterval(this.timerInterval);
    const maxScore = this.totalQuestions * 100;
    const percentage = Math.round((this.score / maxScore) * 100);
    const isPassed = percentage >= 60;
    const defaultName = "Chiến Binh Sales HKP";

    let rankTitle = "Tập Sự Tiềm Năng";
    if (percentage >= 90) rankTitle = "Hổ Chúa Bất Động Sản (Master Dealmaker)";
    else if (percentage >= 75) rankTitle = "Sát Thủ Chốt Căn (Top Producer)";
    else if (percentage >= 60) rankTitle = "Chiến Binh Bán Hàng Ưu Tú";

    this.quizContainer.innerHTML = `
      <div class="glass-panel result-card">
        <div class="result-trophy">${isPassed ? '🏆' : '🐯'}</div>
        <h2 class="result-score-title">${isPassed ? 'CHÚC MỪNG BẠN ĐÃ TỐT NGHIỆP!' : 'CẦN ÔN TẬP THÊM NHA!'}</h2>
        <p class="result-score-sub">Điểm số đạt được: <strong>${this.score} / ${maxScore}</strong> (${percentage}%) - Xếp loại: <span style="color: var(--text-gold); font-weight:700;">${rankTitle}</span></p>

        ${isPassed ? `
          <div class="certificate-frame" id="printableCertificate">
            <div class="cert-header">TẬP ĐOÀN HOÀNG KIM PHÁT • HỌC VIỆN ĐÀO TẠO BĐS</div>
            <h2 class="cert-title">CHỨNG NHẬN MASTER SALES</h2>
            <p class="cert-desc">Trân trọng trao tặng chứng chỉ tốt nghiệp khóa huấn luyện dự án <em>The Royal Riverside</em> cho:</p>
            <div class="cert-recipient" id="certStudentName">${defaultName}</div>
            <p class="cert-desc" style="max-width: 500px; margin: 0 auto 16px;">Đã hoàn thành xuất sắc kỳ sát hạch kiến thức dự án, chính sách đòn bẩy tài chính và kỹ năng xử lý từ chối đỉnh cao cùng Hổ Master!</p>
            <div class="cert-footer">
              <div>Ngày cấp: ${new Date().toLocaleDateString('vi-VN')}</div>
              <div class="cert-seal">🐯 HỔ THẦN TÀI ĐÓNG DẤU VÀNG</div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">
            <div style="display: flex; gap: 8px;">
              <input type="text" id="customCertName" placeholder="Nhập họ tên của bạn..." class="form-input" style="width: 240px; padding: 8px 14px;" value="${defaultName}">
              <button class="btn btn-outline btn-sm" onclick="window.quizManager.updateCertName()">Đổi Tên</button>
            </div>
            <button class="btn btn-gold btn-sm" onclick="window.print()">🖨️ In Chứng Chỉ / Lưu PDF</button>
            <button class="btn btn-outline btn-sm" onclick="window.quizManager.restartQuiz()">🔄 Làm Lại Bài Thi</button>
          </div>
        ` : `
          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid var(--accent-ruby); padding: 20px; border-radius: var(--radius-md); max-width: 500px; margin: 0 auto 20px;">
            <p style="color: #fecaca; font-size: 0.95rem;">Đừng buồn nhé! Cọp khuyên bạn hãy lật lại <strong>Module 1: Key Selling Points</strong> và hỏi thêm Hổ Master ở Chatbot để nâng cao công lực rồi thi lại nhé!</p>
          </div>
          <button class="btn btn-gold" onclick="window.quizManager.restartQuiz()">🔥 Thử Thách Lại Ngay</button>
        `}
      </div>
    `;

    if (isPassed && window.appManager) {
      window.appManager.addExp(200, 'Tốt nghiệp sát hạch BĐS');
      window.appManager.showToast('🏆 Chúc mừng bạn đã hoàn thành sát hạch & nhận chứng chỉ!');
    }
  }

  updateCertName() {
    const input = document.getElementById('customCertName');
    const display = document.getElementById('certStudentName');
    if (input && display && input.value.trim()) {
      display.textContent = input.value.trim();
      if (window.appManager) {
        window.appManager.showToast(`Đã cập nhật tên: ${input.value.trim()}`);
      }
    }
  }

  restartQuiz() {
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.renderQuestion(0);
  }

  playQuizSound(isWin) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isWin) {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch(e) {}
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.quizManager = new RealEstateQuizManager();
});
