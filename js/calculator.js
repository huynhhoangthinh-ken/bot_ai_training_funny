/**
 * REAL ESTATE FINANCIAL & CASHFLOW CALCULATOR
 * Công cụ tính toán dòng tiền, lãi suất vay ngân hàng và lịch thanh toán cho Sales
 */

class LoanCalculatorManager {
  constructor() {
    this.unitSelect = document.getElementById('calcUnitSelect');
    this.customPriceInput = document.getElementById('calcCustomPrice');
    this.loanPercentInput = document.getElementById('calcLoanPercent');
    this.loanPercentSlider = document.getElementById('calcLoanPercentSlider');
    this.loanTermInput = document.getElementById('calcLoanTerm');
    this.interestRateInput = document.getElementById('calcInterestRate');
    this.gracePeriodSelect = document.getElementById('calcGracePeriod');
    
    // Result elements
    this.totalPriceDisplay = document.getElementById('calcResTotalPrice');
    this.equityDisplay = document.getElementById('calcResEquity');
    this.loanAmountDisplay = document.getElementById('calcResLoanAmount');
    this.graceMonthlyDisplay = document.getElementById('calcResGraceMonthly');
    this.postGraceMonthlyDisplay = document.getElementById('calcResPostGraceMonthly');
    this.scheduleTableBody = document.getElementById('calcScheduleTableBody');
    this.copyCashflowBtn = document.getElementById('calcCopySummaryBtn');

    this.init();
  }

  init() {
    this.bindEvents();
    this.calculate();
  }

  bindEvents() {
    // Unit presets
    if (this.unitSelect) {
      this.unitSelect.addEventListener('change', () => {
        const val = parseFloat(this.unitSelect.value);
        if (val > 0) {
          this.customPriceInput.value = val;
          this.calculate();
        }
      });
    }

    if (this.customPriceInput) {
      this.customPriceInput.addEventListener('input', () => this.calculate());
    }

    if (this.loanPercentSlider && this.loanPercentInput) {
      this.loanPercentSlider.addEventListener('input', () => {
        this.loanPercentInput.value = this.loanPercentSlider.value;
        this.calculate();
      });
      this.loanPercentInput.addEventListener('input', () => {
        this.loanPercentSlider.value = this.loanPercentInput.value;
        this.calculate();
      });
    }

    if (this.loanTermInput) {
      this.loanTermInput.addEventListener('input', () => this.calculate());
    }

    if (this.interestRateInput) {
      this.interestRateInput.addEventListener('input', () => this.calculate());
    }

    if (this.gracePeriodSelect) {
      this.gracePeriodSelect.addEventListener('change', () => this.calculate());
    }

    if (this.copyCashflowBtn) {
      this.copyCashflowBtn.addEventListener('click', () => this.copySummaryToClipboard());
    }
  }

  calculate() {
    const totalPriceBillion = parseFloat(this.customPriceInput ? this.customPriceInput.value : 7.2) || 7.2;
    const totalPrice = totalPriceBillion * 1000000000;
    const loanPercent = parseFloat(this.loanPercentInput ? this.loanPercentInput.value : 70) || 70;
    const loanTermYears = parseInt(this.loanTermInput ? this.loanTermInput.value : 20, 10) || 20;
    const annualInterestRate = parseFloat(this.interestRateInput ? this.interestRateInput.value : 9.5) || 9.5;
    const graceMonths = parseInt(this.gracePeriodSelect ? this.gracePeriodSelect.value : 24, 10) || 24;

    const loanAmount = totalPrice * (loanPercent / 100);
    const equityAmount = totalPrice - loanAmount;
    const totalMonths = loanTermYears * 12;
    const remainingMonthsAfterGrace = Math.max(1, totalMonths - graceMonths);
    const monthlyRate = (annualInterestRate / 100) / 12;

    // Monthly principal after grace
    const monthlyPrincipalAfterGrace = loanAmount / remainingMonthsAfterGrace;
    // First month interest after grace
    const firstMonthInterestAfterGrace = loanAmount * monthlyRate;
    const firstMonthPaymentAfterGrace = monthlyPrincipalAfterGrace + firstMonthInterestAfterGrace;

    // Update Highlights
    if (this.totalPriceDisplay) {
      this.totalPriceDisplay.textContent = this.formatCurrency(totalPrice);
    }
    if (this.equityDisplay) {
      this.equityDisplay.textContent = `${this.formatCurrency(equityAmount)} (${100 - loanPercent}%)`;
    }
    if (this.loanAmountDisplay) {
      this.loanAmountDisplay.textContent = `${this.formatCurrency(loanAmount)} (${loanPercent}%)`;
    }
    if (this.graceMonthlyDisplay) {
      this.graceMonthlyDisplay.textContent = graceMonths > 0 ? "0 VNĐ (Ân hạn 100% gốc & lãi)" : "Không áp dụng";
    }
    if (this.postGraceMonthlyDisplay) {
      this.postGraceMonthlyDisplay.textContent = `~ ${this.formatCurrency(firstMonthPaymentAfterGrace)} / tháng`;
    }

    // Build preview schedule for first 12 entries post-grace
    this.renderSchedule(loanAmount, monthlyPrincipalAfterGrace, monthlyRate, graceMonths, remainingMonthsAfterGrace);
  }

  renderSchedule(loanAmount, monthlyPrincipal, monthlyRate, graceMonths, remainingMonths) {
    if (!this.scheduleTableBody) return;

    let rowsHtml = '';
    
    // Grace period row representation
    if (graceMonths > 0) {
      rowsHtml += `
        <tr style="background: rgba(16, 185, 129, 0.1);">
          <td><strong>Tháng 1 - ${graceMonths}</strong></td>
          <td colspan="4" style="text-align: center; color: #34d399; font-weight: 600;">
            🐯 Giai đoạn ưu đãi CĐT: 0đ Gốc + 0đ Lãi (Miễn phí hoàn toàn)
          </td>
        </tr>
      `;
    }

    let currentBalance = loanAmount;
    const sampleDisplayMonths = Math.min(8, remainingMonths);

    for (let i = 1; i <= sampleDisplayMonths; i++) {
      const monthNumber = graceMonths + i;
      const interest = currentBalance * monthlyRate;
      const totalPay = monthlyPrincipal + interest;
      const endingBalance = Math.max(0, currentBalance - monthlyPrincipal);

      rowsHtml += `
        <tr>
          <td>Tháng ${monthNumber}</td>
          <td>${this.formatCurrency(monthlyPrincipal)}</td>
          <td>${this.formatCurrency(interest)}</td>
          <td style="color: var(--text-gold); font-weight:700;">${this.formatCurrency(totalPay)}</td>
          <td>${this.formatCurrency(endingBalance)}</td>
        </tr>
      `;

      currentBalance = endingBalance;
    }

    if (remainingMonths > sampleDisplayMonths) {
      rowsHtml += `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); font-style: italic;">
            ... Và giảm dần đều qua các tháng tiếp theo đến tháng ${graceMonths + remainingMonths} ...
          </td>
        </tr>
      `;
    }

    this.scheduleTableBody.innerHTML = rowsHtml;
  }

  formatCurrency(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + ' tỷ';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + ' triệu';
    }
    return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + ' đ';
  }

  copySummaryToClipboard() {
    const totalPriceBillion = parseFloat(this.customPriceInput.value) || 7.2;
    const loanPercent = this.loanPercentInput.value;
    const equityText = this.equityDisplay ? this.equityDisplay.textContent : '';
    const loanText = this.loanAmountDisplay ? this.loanAmountDisplay.textContent : '';
    const gracePeriod = this.gracePeriodSelect ? this.gracePeriodSelect.value : '24';
    const postGraceText = this.postGraceMonthlyDisplay ? this.postGraceMonthlyDisplay.textContent : '';

    const summary = `📊 BẢNG TÍNH DÒNG TIỀN DỰ ÁN THE ROYAL RIVERSIDE
━━━━━━━━━━━━━━━━━━━━
🏢 Giá trị căn hộ: ${totalPriceBillion} Tỷ VNĐ
💰 Vốn tự có (${100 - loanPercent}%): ${equityText}
🏦 Ngân hàng hỗ trợ (${loanPercent}%): ${loanText}
✨ Ưu đãi ân hạn: 0% Lãi & 0 đồng Gốc trong ${gracePeriod} tháng!
💳 Dự tính trả sau ưu đãi: ${postGraceText} (Dư nợ giảm dần)
━━━━━━━━━━━━━━━━━━━━
👉 Đăng ký tư vấn chọn căn đẹp: Hotline 1900 888 999`;

    navigator.clipboard.writeText(summary).then(() => {
      if (window.appManager) {
        window.appManager.showToast('📋 Đã sao chép bảng tính dòng tiền vào Clipboard! Gửi khách ngay!');
        window.appManager.addExp(20, 'Tính toán phương án tài chính cho khách');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.loanCalculator = new LoanCalculatorManager();
});
