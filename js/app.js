/**
 * REAL ESTATE TRAINING HUB - MAIN APPLICATION CONTROLLER
 * Xử lý tabs, 3D flipcards, objection roleplay, EXP Leveling & Toast system
 */

class AppManager {
  constructor() {
    this.currentExp = 0;
    this.maxExp = 500;
    this.userLevel = 1;
    this.activeScenarioIndex = 0;

    this.init();
  }

  init() {
    this.loadState();
    this.setupTabs();
    this.renderKeySellingPoints();
    this.renderRoleplayArena();
    this.renderSalesKitDocs();
    this.setupSalesKitCopy();
    this.updateUserProgressUI();
  }

  loadState() {
    const savedExp = localStorage.getItem('hkp_training_exp');
    if (savedExp) {
      this.currentExp = parseInt(savedExp, 10) || 0;
    }
  }

  saveState() {
    localStorage.setItem('hkp_training_exp', this.currentExp.toString());
  }

  addExp(points, reason = '') {
    this.currentExp += points;
    this.saveState();
    this.updateUserProgressUI();
    if (reason) {
      this.showToast(`+${points} EXP: ${reason} 🐯✨`);
    }
  }

  updateUserProgressUI() {
    const expText = document.getElementById('userExpDisplay');
    const expFill = document.getElementById('userExpFill');
    const rankTitle = document.getElementById('userRankTitle');
    const rankBadge = document.getElementById('userRankBadge');

    let rankName = "Tập Sự";
    let badgeCode = "LV 1";
    let progressPercent = Math.min(100, Math.round((this.currentExp / this.maxExp) * 100));

    if (this.currentExp >= 450) {
      rankName = "Hổ Chúa BĐS (Master)";
      badgeCode = "LV 4";
    } else if (this.currentExp >= 280) {
      rankName = "Sát Thủ Chốt Căn";
      badgeCode = "LV 3";
    } else if (this.currentExp >= 120) {
      rankName = "Chiến Binh Sales";
      badgeCode = "LV 2";
    }

    if (expText) expText.textContent = `${this.currentExp} / ${this.maxExp} EXP`;
    if (expFill) expFill.style.width = `${progressPercent}%`;
    if (rankTitle) rankTitle.textContent = rankName;
    if (rankBadge) rankBadge.textContent = badgeCode;
  }

  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabSections = document.querySelectorAll('.tab-section');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabSections.forEach(s => s.classList.remove('active'));

        btn.classList.add('active');
        const activeSection = document.getElementById(targetTab);
        if (activeSection) {
          activeSection.classList.add('active');
        }

        // Award small EXP on discovering tabs
        this.addExp(5);
      });
    });
  }

  /* --------------------------------------------------------------------------
     MODULE 1: KEY SELLING POINTS (3D FLIP CARDS)
     -------------------------------------------------------------------------- */
  renderKeySellingPoints() {
    const container = document.getElementById('flipCardsGrid');
    if (!container || !window.PROJECT_DATA) return;

    const points = window.PROJECT_DATA.keySellingPoints || [];
    container.innerHTML = points.map((p, index) => `
      <div class="flip-card" onclick="window.appManager.toggleFlipCard(this)">
        <div class="flip-card-inner">
          <!-- Front Side -->
          <div class="flip-card-front">
            <div class="card-top">
              <div class="card-icon-badge">${p.icon}</div>
              <span class="card-number">USP #0${index + 1}</span>
            </div>
            <div>
              <h3 class="card-title">${p.title}</h3>
              <p class="card-short-desc">${p.shortDesc}</p>
            </div>
            <div class="flip-hint">
              <span>🔄 Nhấp để lật xem bí kíp tư vấn</span>
            </div>
          </div>

          <!-- Back Side -->
          <div class="flip-card-back">
            <div>
              <div class="back-detail-title">Chi Tiết Đòn Bẩy</div>
              <p class="back-detail-text">${p.detail}</p>
            </div>
            <div class="tiger-cheat-box">
              <strong>🐯 Mẹo Chốt Cọc Của Cọp:</strong>
              ${p.cheatCode}
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  toggleFlipCard(cardEl) {
    cardEl.classList.toggle('flipped');
    this.addExp(10, 'Học thuộc Key Selling Point');
  }

  /* --------------------------------------------------------------------------
     MODULE 2: OBJECTION ARENA (ROLEPLAY SIMULATOR)
     -------------------------------------------------------------------------- */
  renderRoleplayArena() {
    const scenarioListEl = document.getElementById('roleplayScenarioList');
    if (!scenarioListEl || !window.PROJECT_DATA) return;

    const scenarios = window.PROJECT_DATA.roleplayScenarios || [];
    
    // Render left scenario selector
    scenarioListEl.innerHTML = scenarios.map((scen, index) => `
      <div class="scenario-card-item ${index === this.activeScenarioIndex ? 'active' : ''}" onclick="window.appManager.selectScenario(${index})">
        <div>
          <div class="scenario-profile-name">👤 ${scen.customerProfile}</div>
          <div class="scenario-objection-preview">"${scen.objectionText}"</div>
        </div>
        <span style="color: var(--gold-primary); font-size: 1.1rem;">➔</span>
      </div>
    `).join('');

    this.renderCurrentScenarioDetail();
  }

  selectScenario(index) {
    this.activeScenarioIndex = index;
    document.querySelectorAll('.scenario-card-item').forEach((item, idx) => {
      if (idx === index) item.classList.add('active');
      else item.classList.remove('active');
    });
    this.renderCurrentScenarioDetail();
  }

  renderCurrentScenarioDetail() {
    const arenaBoxEl = document.getElementById('roleplayArenaBox');
    if (!arenaBoxEl || !window.PROJECT_DATA) return;

    const scen = window.PROJECT_DATA.roleplayScenarios[this.activeScenarioIndex];
    if (!scen) return;

    arenaBoxEl.innerHTML = `
      <div class="customer-dialog-bubble">
        <div class="customer-tag">
          <span>💬 TÌNH HUỐNG KHÁCH HÀNG TỪ CHỐI:</span>
          <span>${scen.customerProfile}</span>
        </div>
        <div class="customer-quote">"${scen.objectionText}"</div>
      </div>

      <div class="tiger-coaching-box">
        <span>💡</span>
        <span>${scen.tigerTip}</span>
      </div>

      <h4 style="font-size: 0.95rem; margin-bottom: 12px; color: var(--text-gold);">
        🎯 Bạn sẽ chọn phương án đối đáp nào?
      </h4>

      <div class="options-list" id="roleplayOptionsList">
        ${scen.options.map((opt) => `
          <button class="option-btn" data-id="${opt.id}" onclick="window.appManager.chooseRoleplayOption('${opt.id}')">
            <span class="option-key">${opt.id}</span>
            <span>${opt.text}</span>
          </button>
        `).join('')}
      </div>

      <div id="roleplayFeedbackArea" style="display:none;"></div>
    `;
  }

  chooseRoleplayOption(optionId) {
    const scen = window.PROJECT_DATA.roleplayScenarios[this.activeScenarioIndex];
    const chosen = scen.options.find(o => o.id === optionId);
    if (!chosen) return;

    const optionsList = document.querySelectorAll('#roleplayOptionsList .option-btn');
    optionsList.forEach(btn => {
      btn.disabled = true;
      const optId = btn.getAttribute('data-id');
      const optData = scen.options.find(o => o.id === optId);
      if (optData.isCorrect) {
        btn.classList.add('selected-correct');
      } else if (optId === optionId) {
        btn.classList.add('selected-wrong');
      }
    });

    const feedbackArea = document.getElementById('roleplayFeedbackArea');
    if (feedbackArea) {
      feedbackArea.style.display = 'block';
      feedbackArea.className = `feedback-banner ${chosen.isCorrect ? 'success' : 'error'}`;
      feedbackArea.innerHTML = `
        <div style="font-weight: 700; font-size: 1rem; margin-bottom: 6px;">
          ${chosen.isCorrect ? '🏆 ĐÁNH GIÁ: XUẤT SẮC (+100 EXP)' : '⚠️ ĐÁNH GIÁ: CẦN CẢI THIỆN (+20 EXP)'}
        </div>
        <p style="margin-bottom: 8px;">${chosen.mascotFeedback}</p>
        <div style="text-align: right; margin-top: 14px;">
          <button class="btn btn-gold btn-sm" onclick="window.appManager.nextScenario()">
            ${this.activeScenarioIndex + 1 < window.PROJECT_DATA.roleplayScenarios.length ? 'Tình huống tiếp theo ➔' : 'Luyện lại từ đầu 🔄'}
          </button>
        </div>
      `;
    }

    if (chosen.isCorrect) {
      this.addExp(100, 'Xử lý từ chối xuất sắc');
    } else {
      this.addExp(20, 'Học hỏi từ sai lầm xử lý từ chối');
    }
  }

  nextScenario() {
    const total = window.PROJECT_DATA.roleplayScenarios.length;
    this.selectScenario((this.activeScenarioIndex + 1) % total);
  }

  /* --------------------------------------------------------------------------
     MODULE 5: SALES KIT & CHEAT SHEET
     -------------------------------------------------------------------------- */
  renderSalesKitDocs() {
    const docsContainer = document.getElementById('salesDocsList');
    if (!docsContainer || !window.PROJECT_DATA || !window.PROJECT_DATA.salesCheatSheet) return;

    const docs = window.PROJECT_DATA.salesCheatSheet.documents || [];
    docsContainer.innerHTML = docs.map(doc => `
      <div class="doc-item">
        <div class="doc-info">
          <span class="doc-badge">${doc.type}</span>
          <div>
            <div class="doc-name">${doc.name}</div>
            <div class="doc-size">${doc.size} • Đã kiểm duyệt nội bộ HKP</div>
          </div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.appManager.downloadFakeDoc('${doc.name}')">
          📥 Tải Về
        </button>
      </div>
    `).join('');
  }

  setupSalesKitCopy() {
    const copyPitchBtn = document.getElementById('copyPitchBtn');
    if (copyPitchBtn && window.PROJECT_DATA.salesCheatSheet) {
      copyPitchBtn.addEventListener('click', () => {
        const text = window.PROJECT_DATA.salesCheatSheet.samplePitch10s;
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('📋 Đã copy kịch bản Pitch 10s vào Clipboard!');
          this.addExp(15, 'Luyện tập Pitch 10s');
        });
      });
    }

    const copyBookingBtn = document.getElementById('copyBookingBtn');
    if (copyBookingBtn) {
      copyBookingBtn.addEventListener('click', () => {
        const info = `STK Nhận Booking The Royal Riverside:
Ngân hàng: Vietcombank - CN TP.HCM
Số TK: 9999 8888 6666
Chủ TK: CONG TY CO PHAN TAP DOAN HOANG KIM PHAT
Số tiền: 100.000.000 VNĐ / Căn
Nội dung: [Họ Tên] [Số Điện Thoại] Booking Royal Riverside`;
        navigator.clipboard.writeText(info).then(() => {
          this.showToast('🏦 Đã copy thông tin chuyển khoản Booking!');
        });
      });
    }
  }

  downloadFakeDoc(docName) {
    this.showToast(`📥 Đang chuẩn bị tải: ${docName}...`);
    setTimeout(() => {
      this.showToast(`✅ Đã tải xuống tài liệu đào tạo nội bộ thành công!`);
      this.addExp(15, 'Nghiên cứu tài liệu bán hàng');
    }, 800);
  }

  showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>🐯</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.appManager = new AppManager();
});
