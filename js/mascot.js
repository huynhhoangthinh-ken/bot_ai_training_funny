/**
 * TIGER MASCOT & AI CHATBOT LOGIC
 * Chú Cọp Master Sales với tính cách hóm hỉnh, hỗ trợ nhân viên BĐS
 */

class TigerMascotManager {
  constructor() {
    this.speechBubbleEl = document.getElementById('mascotSpeechBubble');
    this.speechTextEl = document.getElementById('mascotSpeechText');
    this.chatModalEl = document.getElementById('chatbotModal');
    this.chatBodyEl = document.getElementById('chatMessagesBody');
    this.chatInputEl = document.getElementById('chatUserInput');
    this.chatSendBtn = document.getElementById('chatSendBtn');
    this.mascotAvatarEl = document.getElementById('mascotTrigger');
    this.closeChatBtn = document.getElementById('closeChatBtn');
    
    this.quoteIndex = 0;
    this.quoteTimer = null;
    this.isChatOpen = false;

    this.init();
  }

  init() {
    this.startSpeechRotation();
    this.bindEvents();
    this.appendBotGreeting();
  }

  bindEvents() {
    // Click on Mascot avatar opens/toggles chat
    if (this.mascotAvatarEl) {
      this.mascotAvatarEl.addEventListener('click', () => this.toggleChat());
    }

    // Click on speech bubble opens chat
    if (this.speechBubbleEl) {
      this.speechBubbleEl.addEventListener('click', () => this.openChat());
    }

    // Close chat button
    if (this.closeChatBtn) {
      this.closeChatBtn.addEventListener('click', () => this.closeChat());
    }

    // Send button
    if (this.chatSendBtn) {
      this.chatSendBtn.addEventListener('click', () => this.handleUserSend());
    }

    // Enter key
    if (this.chatInputEl) {
      this.chatInputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleUserSend();
        }
      });
    }

    // Quick prompts
    document.querySelectorAll('.quick-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const query = e.currentTarget.getAttribute('data-query');
        if (query) {
          this.sendUserMessage(query);
          this.processBotResponse(query);
        }
      });
    });
  }

  startSpeechRotation() {
    const quotes = (window.PROJECT_DATA && window.PROJECT_DATA.mascotQuotes) || [
      "Học chăm chỉ lên em ơi! Khách VIP đang cầm tiền tỷ chờ kìa! 🐯💰"
    ];

    const updateQuote = () => {
      if (this.isChatOpen) return;
      this.quoteIndex = (this.quoteIndex + 1) % quotes.length;
      if (this.speechTextEl) {
        this.speechTextEl.textContent = quotes[this.quoteIndex];
      }
      if (this.speechBubbleEl) {
        this.speechBubbleEl.style.animation = 'none';
        void this.speechBubbleEl.offsetWidth; // Trigger reflow
        this.speechBubbleEl.style.animation = 'bubblePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }
    };

    // Initial quote
    if (this.speechTextEl) {
      this.speechTextEl.textContent = quotes[0];
    }

    this.quoteTimer = setInterval(updateQuote, 8000);
  }

  toggleChat() {
    if (this.isChatOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isChatOpen = true;
    if (this.chatModalEl) {
      this.chatModalEl.classList.add('active');
    }
    if (this.speechBubbleEl) {
      this.speechBubbleEl.style.display = 'none';
    }
    if (this.chatInputEl) {
      setTimeout(() => this.chatInputEl.focus(), 300);
    }
    this.playChime('pop');
  }

  closeChat() {
    this.isChatOpen = false;
    if (this.chatModalEl) {
      this.chatModalEl.classList.remove('active');
    }
    if (this.speechBubbleEl) {
      this.speechBubbleEl.style.display = 'block';
    }
  }

  appendBotGreeting() {
    const greeting = `Chào chiến binh Sales! 🐯 Ta là <strong>Hổ Master BĐS</strong> đây! Có thắc mắc gì về dự án <em>The Royal Riverside</em>, chính sách bán hàng, bảng giá hay cách đối đáp khách nhà giàu khó tính thì hỏi ta liền nha! 😎`;
    this.renderBotMessage(greeting);
  }

  handleUserSend() {
    const text = this.chatInputEl.value.trim();
    if (!text) return;
    this.chatInputEl.value = '';
    this.sendUserMessage(text);
    this.processBotResponse(text);
  }

  sendUserMessage(text) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg user';
    msgEl.innerHTML = `<div class="chat-bubble">${this.escapeHtml(text)}</div>`;
    this.chatBodyEl.appendChild(msgEl);
    this.scrollToBottom();
    this.playChime('sent');
  }

  renderBotMessage(htmlContent) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg bot';
    msgEl.innerHTML = `
      <div class="bot-avatar-stamp">🐯</div>
      <div class="chat-bubble">${htmlContent}</div>
    `;
    this.chatBodyEl.appendChild(msgEl);
    this.scrollToBottom();
    this.playChime('receive');
  }

  showTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-msg bot typing-indicator-item';
    typingEl.id = 'botTypingIndicator';
    typingEl.innerHTML = `
      <div class="bot-avatar-stamp">🐯</div>
      <div class="chat-bubble">
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    this.chatBodyEl.appendChild(typingEl);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const typingEl = document.getElementById('botTypingIndicator');
    if (typingEl) {
      typingEl.remove();
    }
  }

  processBotResponse(userText) {
    this.showTypingIndicator();
    const query = userText.toLowerCase();

    setTimeout(() => {
      this.removeTypingIndicator();
      let responseHtml = this.generateAIResponse(query);
      this.renderBotMessage(responseHtml);
      
      // Award EXP for asking questions
      if (window.appManager) {
        window.appManager.addExp(10, 'Hỏi đáp với Hổ Master');
      }
    }, 600);
  }

  generateAIResponse(query) {
    const data = window.PROJECT_DATA || {};
    const overview = data.overview || {};

    // 1. Policy & Sale Terms
    if (query.includes('chính sách') || query.includes('csbh') || query.includes('chiết khấu') || query.includes('thanh toán')) {
      return `<strong>Chính sách bán hàng đợt 1 siêu hot:</strong><br>
      • Vốn tự có chỉ <strong>15%</strong> ký HĐMB (~700tr - 1.08 tỷ).<br>
      • Ngân hàng hỗ trợ vay <strong>70%</strong>, miễn lãi <strong>0% & ân hạn gốc suốt 24 tháng</strong>.<br>
      • Chiết khấu khủng <strong>9.5%</strong> khi thanh toán sớm 95%.<br>
      • Tặng ngay <strong>2 lượng vàng SJC</strong> cho 50 booking sớm nhất! 🐯💰 Mau chốt không hết suất nha!`;
    }

    // 2. Objection Handling
    if (query.includes('từ chối') || query.includes('giá cao') || query.includes('đắt') || query.includes('xử lý')) {
      return `<strong>Bí kíp xử lý khách chê đắt từ Hổ Master:</strong><br>
      1. Đừng cãi tay đôi! Hãy đồng cảm: <em>"Dạ em hiểu băn khoăn của anh/chị..."</em><br>
      2. Bóc tách bàn giao: Full nội thất Châu Âu Kohler/Hafele trị giá 20tr/m².<br>
      3. Vị trí 3 mặt sông vĩnh viễn không bao giờ có dự án thứ hai.<br>
      4. Vốn chỉ 15%, 2 năm sau giá tăng 25% thì tỷ suất lợi nhuận trên vốn tự có lên tới 100%+! 🐯🔥 Khách nghe xong gật đầu cái rụp!`;
    }

    // 3. 10s Pitch
    if (query.includes('10s') || query.includes('pitch') || query.includes('tập nói') || query.includes('giới thiệu')) {
      return `<strong>Câu Pitch 10s thần thánh:</strong><br>
      <em>"${data.salesCheatSheet ? data.salesCheatSheet.samplePitch10s : 'Dự án ven sông đẳng cấp chỉ 15% sở hữu ngay!'}"</em><br>
      👉 Đọc trơn tru câu này 5 lần trước gương mỗi sáng là doanh số x3 liền nha em! 🐯👑`;
    }

    // 4. Booking & Deposit Procedure
    if (query.includes('booking') || query.includes('cọc') || query.includes('thủ tục') || query.includes('lock')) {
      return `<strong>Quy trình Booking & Lock Căn:</strong><br>
      • Số tiền booking: <strong>100.000.000 VNĐ / Căn</strong> (Có hoàn lại 100% nếu ngày mở bán không ưng căn).<br>
      • Cú pháp chuyển khoản: [Họ tên KH] - [Số CMND/CCCD] - Booking The Royal Riverside.<br>
      • Giữ chỗ ưu tiên chọn căn đẹp tầng đẹp trước ngày ráp căn 15/09! 🐯📑`;
    }

    // 5. Legal & Sổ hồng
    if (query.includes('pháp lý') || query.includes('sổ hồng') || query.includes('quy hoạch') || query.includes('an toàn')) {
      return `<strong>Pháp lý chuẩn chỉ 100%:</strong><br>
      • Sổ hồng <strong>lâu dài</strong> cho người Việt Nam.<br>
      • Đã có Giấy phép Xây dựng số 128/GPXD và nghiệm thu phần móng.<br>
      • Thư bảo lãnh tiến độ từng căn từ Vietcombank.<br>
      👉 Cứ mở tệp hồ sơ pháp lý CĐT đóng mộc đỏ ra cho khách xem là an tâm 1000% nha! 🐯📜`;
    }

    // 6. Price & Units
    if (query.includes('giá') || query.includes('bảng giá') || query.includes('1pn') || query.includes('2pn') || query.includes('3pn')) {
      return `<strong>Bảng giá gốc đợt 1 từ CĐT:</strong><br>
      • Căn 1PN (52m²): từ <strong>4.5 tỷ</strong> (~675tr vốn tự có).<br>
      • Căn 2PN (78m²): từ <strong>7.2 tỷ</strong> (~1.08 tỷ vốn tự có).<br>
      • Căn 3PN (110m²): từ <strong>11.5 tỷ</strong> (~1.72 tỷ vốn tự có).<br>
      • Đơn giá trung bình: <strong>110 - 165 triệu/m²</strong> (Đã gồm full nội thất cao cấp). 🐯💎`;
    }

    // 7. Location & Scale
    if (query.includes('vị trí') || query.includes('ở đâu') || query.includes('quy mô') || query.includes('tiện ích')) {
      return `<strong>Vị thế Kim Cương:</strong><br>
      • Vị trí: Mặt tiền Đại lộ Hoàng Kim, Quận 2 (TP. Thủ Đức), kết nối Metro số 2 chỉ 3 phút.<br>
      • Quy mô: 5.2 Hecta, 4 tháp 45 tầng, 50+ tiện ích đặc quyền: bến du thuyền riêng, hồ bơi điện phân muối, Sky Club 6 sao... 🐯🏰`;
    }

    // 8. Default Humorous Reply
    const defaultJokes = [
      `Câu hỏi này hay đấy! 🐯 Nhưng trước hết em nhớ thuộc <strong>5 Key Selling Points</strong> ở Tab 1 chưa? Lật thẻ ôn bài liền tay đi nè!`,
      `Hổ nghe rõ rồi nha! Em muốn tính toán dòng tiền chi tiết cho khách thì ghé qua <strong>Module Công Cụ Tính Dòng Tiền</strong> ở Tab 4 kìa, có bảng Excel tự động xịn lắm! 🐯📊`,
      `Chuẩn phong thái Sales tinh hoa! Cần luyện tập xử lý tình huống hóc búa hơn nữa thì mở <strong>Module 2: Đấu Trí Xử Lý Từ Chối</strong> nha bro! 🐯🥊`,
      `Khách hỏi câu này là chuẩn bị xuống tiền rồi đó! Mau gửi bảng phân tích lợi nhuận 25%/năm cho họ chốt deal liền nha! 🐯🚀`
    ];

    return defaultJokes[Math.floor(Math.random() * defaultJokes.length)];
  }

  escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m];
    });
  }

  playChime(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'sent') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'receive') {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch(e) {
      // Audio not permitted without interaction, ignore
    }
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.tigerMascot = new TigerMascotManager();
});
