/* ==========================================================================
   ĐẠI CHÚNG PROPERTIES — CHAT ENGINE (APPLE UI + GEMINI AI + GOOGLE TTS)
   ========================================================================== */

class TigerChatEngine {
  constructor() {
    this.chatFeed = document.getElementById('chatFeed');
    this.chatInputArea = document.getElementById('chatInputArea');
    this.sendMsgBtn = document.getElementById('sendMsgBtn');
    this.voiceInputBtn = document.getElementById('voiceInputBtn');
    this.clearChatBtn = document.getElementById('clearChatBtn');
    this.heroWelcomeCard = document.getElementById('heroWelcomeCard');

    // Modals
    this.personalityModal = document.getElementById('personalityModal');
    this.openPersonalityBtn = document.getElementById('openPersonalityModalBtn');
    this.closePersonalityBtn = document.getElementById('closePersonalityModalBtn');
    this.toggleExpertBtn = document.getElementById('toggleExpertModeBtn');

    this.personality = 'hai_huoc';
    this.isTyping = false;
    this.isListening = false;
    this.recognition = null;
    this.currentAudio = null;

    // Google Gemini Configuration Default
    this.apiKey = atob('QVEuQWI4Uk42SXNnTjNGd0VXTEJxYnptOC1TMXRsTVJEWlRLT2NBS3dLZjFWME9wYW95MFE=');
    this.currentModel = 'gemini-2.5-flash';
    this.conversationHistory = [];

    this.init();
  }

  init() {
    this.bindEvents();
    this.setupSpeechRecognition();
  }

  bindEvents() {
    // Send message on click & enter
    if (this.sendMsgBtn) {
      this.sendMsgBtn.addEventListener('click', () => this.handleSendMessage());
    }

    if (this.chatInputArea) {
      this.chatInputArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
    }

    // Clear chat
    if (this.clearChatBtn) {
      this.clearChatBtn.addEventListener('click', () => {
        if (confirm('Xóa sạch lịch sử chat để bắt đầu phiên mới nhé Ken?')) {
          this.chatFeed.innerHTML = '';
          if (this.heroWelcomeCard) {
            this.chatFeed.appendChild(this.heroWelcomeCard);
          }
          this.conversationHistory = [];
          this.showToast('✨ Đã làm mới cuộc trò chuyện!');
        }
      });
    }

    // Quick Action Hero Grid Buttons
    document.querySelectorAll('.hero-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-prompt');
        if (prompt) {
          this.sendUserPrompt(prompt);
        }
      });
    });

    // Bottom Dock Tabs
    document.querySelectorAll('.dock-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.dock-tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const prompt = tab.getAttribute('data-prompt');
        if (prompt) {
          this.sendUserPrompt(prompt);
        }
      });
    });

    // Personality Modal
    if (this.openPersonalityBtn && this.personalityModal) {
      this.openPersonalityBtn.addEventListener('click', () => {
        this.personalityModal.classList.add('active');
      });
    }

    if (this.closePersonalityBtn && this.personalityModal) {
      this.closePersonalityBtn.addEventListener('click', () => {
        this.personalityModal.classList.remove('active');
      });
    }

    // Personality items selection
    document.querySelectorAll('.personality-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.personality-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.personality = item.getAttribute('data-value') || 'hai_huoc';
        this.personalityModal.classList.remove('active');
        this.showToast(`✨ Đã đổi tính cách sang: ${item.querySelector('strong').textContent}`);
      });
    });

    // Toggle Expert Mode
    if (this.toggleExpertBtn) {
      this.toggleExpertBtn.addEventListener('click', () => {
        this.personality = this.personality === 'master_sales' ? 'hai_huoc' : 'master_sales';
        const label = this.personality === 'master_sales' ? 'Sát Thủ Chốt Deal (Thổ Địa)' : 'Hổ Hài Hước';
        this.showToast(`🧭 Đã bật chế độ: ${label}`);
      });
    }
  }

  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (this.voiceInputBtn) this.voiceInputBtn.style.display = 'none';
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'vi-VN';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.voiceInputBtn) this.voiceInputBtn.classList.add('listening');
      this.showToast('🎙️ Đang lắng nghe... Nói đi Ken!');
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (this.chatInputArea) {
        this.chatInputArea.value = transcript;
        this.handleSendMessage();
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.voiceInputBtn) this.voiceInputBtn.classList.remove('listening');
    };

    this.recognition.onerror = () => {
      this.isListening = false;
      if (this.voiceInputBtn) this.voiceInputBtn.classList.remove('listening');
    };

    if (this.voiceInputBtn) {
      this.voiceInputBtn.addEventListener('click', () => {
        if (this.isListening) {
          this.recognition.stop();
        } else {
          this.recognition.start();
        }
      });
    }
  }

  sendUserPrompt(text) {
    if (!text.trim()) return;
    this.renderUserMessage(text);
    this.conversationHistory.push({ role: 'user', content: text });
    this.generateAiReply(text);
  }

  handleSendMessage() {
    if (!this.chatInputArea) return;
    const text = this.chatInputArea.value.trim();
    if (!text) return;
    this.chatInputArea.value = '';
    this.sendUserPrompt(text);
  }

  renderUserMessage(text) {
    const timeStr = this.getCurrentTime();
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg user';
    msgEl.innerHTML = `
      <div class="msg-content-wrap">
        <div class="msg-text">${this.escapeHtml(text)}</div>
        <div class="msg-meta-row">
          <span>${timeStr}</span>
          <span>✓</span>
        </div>
      </div>
    `;
    this.chatFeed.appendChild(msgEl);
    this.scrollToBottom();
  }

  renderBotMessage(htmlContent, title = 'Một lựa chọn đáng xem', sub = 'Đại Chúng Properties') {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg bot';
    msgEl.innerHTML = `
      <div class="msg-card-wrap">
        <div class="bot-card-top">
          <div class="bot-avatar-mini">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a8 8 0 0 0-8 8c0 3.5 2.2 6.5 5.5 7.6V20a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-2.4c3.3-1.1 5.5-4.1 5.5-7.6a8 8 0 0 0-8-8z"/>
              <path d="M9 10a3 3 0 0 1 6 0"/>
            </svg>
          </div>
          <div class="bot-title-head">
            <h4>${this.escapeHtml(title)}</h4>
            <p>${this.escapeHtml(sub)}</p>
          </div>
        </div>

        <div class="bot-body-text">${htmlContent}</div>

        <div class="bot-card-footer">
          <button class="action-link-btn" onclick="window.location.href='https://huynhhoangthinh.com'">
            <span>Xem chi tiết dự án</span> &gt;
          </button>
          <button class="bot-speak-btn" onclick="window.tigerChat && window.tigerChat.toggleSpeakMessage(this)" title="Nghe đọc nội dung này">
            <span>🔊</span> <span class="speak-label">Đọc</span>
          </button>
        </div>
      </div>
    `;
    this.chatFeed.appendChild(msgEl);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    this.isTyping = true;
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-msg bot';
    typingEl.id = 'chatTypingIndicator';
    typingEl.innerHTML = `
      <div class="msg-card-wrap" style="padding: 12px 16px;">
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    this.chatFeed.appendChild(typingEl);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    this.isTyping = false;
    const el = document.getElementById('chatTypingIndicator');
    if (el) el.remove();
  }

  scrollToBottom() {
    this.chatFeed.scrollTop = this.chatFeed.scrollHeight;
  }

  getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  async generateAiReply(userPrompt) {
    this.showTypingIndicator();

    const systemInstruction = `Bạn là Trợ lý AI Bất Động Sản cao cấp của Đại Chúng Properties, hỗ trợ tư vấn trực tiếp cho khách hàng và đối tác (như Ken).
TÍNH CÁCH: Chuyên nghiệp, am hiểu sâu sắc thị trường BĐS Việt Nam 2026, tinh tế và súc tích theo phong cách Apple Minimalist.
DỰ ÁN ĐẠI CHÚNG PHÂN PHỐI:
- Saigon Farm Resort (MDS Living - Đất nền biệt phủ điền trang 100% thổ cư sổ đỏ riêng)
- The Marq Quận 1 (Hongkong Land - Căn hộ hạng sang trung tâm Q1)
- The Global City & Bán đảo Sola (Masterise Homes & Foster + Partners)
- The Rivus Elie Saab (Dinh thự nổi Haute Couture 121 căn)
- Blanca City Vũng Tàu (Sun Group - Căn hộ Beacon & Casa)
- Urban Green Thủ Đức (Kusto Home - Phong cách Singapore)
- Gladia / Gladia Heights, Elyse Island.

QUY TẮC TRÌNH BÀY (BẮT BUỘC):
- 100% KHÔNG ĐÍNH KÈM THẺ HÌNH ẢNH. Chỉ trả lời bằng văn bản thuần túy và định dạng Markdown đẹp.
- Trình bày ngắn gọn, chia thành 2-3 đoạn súc tích, gạch đầu dòng rõ ràng.
- Đưa ra khuyến nghị thực tế về mức giá, chính sách bán hàng và tiềm năng tăng trưởng.`;

    const candidateModels = [
      this.currentModel,
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ];

    let success = false;
    let botReplyText = '';

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
          })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          botReplyText = data.candidates[0].content.parts[0].text;
          success = true;
          break;
        }
      } catch (e) {
        console.warn(`Request failed for ${model}:`, e);
      }
    }

    this.removeTypingIndicator();

    if (success) {
      const formatted = this.formatMarkdownToHtml(botReplyText);
      this.renderBotMessage(formatted, 'Phân tích từ Trợ Lý Đại Chúng', 'Đại Chúng Properties');
    } else {
      this.renderBotMessage(
        `<p>Dạ em chào Ken! Về <strong>${this.escapeHtml(userPrompt)}</strong>, hiện tại các dự án trọng điểm như <strong>Saigon Farm Resort</strong> (Điền trang sổ đỏ riêng), <strong>The Global City</strong> (Thủ Đức) và <strong>The Marq</strong> (Quận 1) đang có chính sách thanh toán và ân hạn lãi gốc rất hấp dẫn. Em luôn sẵn sàng phân tích chuyên sâu cho anh bất cứ lúc nào!</p>`,
        'Gợi ý bất động sản phù hợp',
        'Đại Chúng Properties'
      );
    }
  }

  formatMarkdownToHtml(text) {
    if (!text) return '';
    let formatted = text.replace(/
/g, '
');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/^\s*[-•]\s+(.*)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    formatted = formatted.replace(/

+/g, '</p><p>');
    formatted = formatted.replace(/
/g, '<br>');
    return `<p>${formatted}</p>`;
  }

  toggleSpeakMessage(btn) {
    if (btn.classList.contains('speaking')) {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.resetSpeakButtons();
      this.showToast('⏹️ Đã dừng đọc!');
      return;
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.resetSpeakButtons();

    const card = btn.closest('.msg-card-wrap');
    const body = card ? card.querySelector('.bot-body-text') : null;
    if (!body) return;

    let text = body.innerText || body.textContent;
    text = text.replace(/[*#_~`>•]/g, '').replace(/\s+/g, ' ').trim();

    if (!text) {
      this.showToast('Không có nội dung văn bản để đọc!');
      return;
    }

    btn.classList.add('speaking');
    btn.innerHTML = `<span>⏹️</span> <span class="speak-label">Dừng</span>`;
    this.showToast('🔊 Đang đọc giọng Google AI...');

    try {
      const cleanSnippet = encodeURIComponent(text.substring(0, 200));
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${cleanSnippet}&tl=vi&client=tw-ob`;
      
      const audio = new Audio(googleTtsUrl);
      this.currentAudio = audio;

      audio.onended = () => {
        if (text.length > 200 && 'speechSynthesis' in window) {
          const remainingText = text.substring(200);
          const utterance = new SpeechSynthesisUtterance(remainingText);
          utterance.lang = 'vi-VN';
          utterance.rate = 1.05;
          const voices = window.speechSynthesis.getVoices();
          const viVoice = voices.find(v => v.lang === 'vi-VN' || v.lang.startsWith('vi'));
          if (viVoice) utterance.voice = viVoice;
          utterance.onend = () => this.resetSpeakButtons();
          utterance.onerror = () => this.resetSpeakButtons();
          window.speechSynthesis.speak(utterance);
        } else {
          this.resetSpeakButtons();
        }
      };

      audio.onerror = () => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'vi-VN';
          utterance.rate = 1.05;
          const voices = window.speechSynthesis.getVoices();
          const viVoice = voices.find(v => v.lang === 'vi-VN' || v.lang.startsWith('vi'));
          if (viVoice) utterance.voice = viVoice;
          utterance.onend = () => this.resetSpeakButtons();
          utterance.onerror = () => this.resetSpeakButtons();
          window.speechSynthesis.speak(utterance);
        } else {
          this.resetSpeakButtons();
        }
      };

      audio.play().catch(() => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'vi-VN';
          utterance.rate = 1.05;
          const voices = window.speechSynthesis.getVoices();
          const viVoice = voices.find(v => v.lang === 'vi-VN' || v.lang.startsWith('vi'));
          if (viVoice) utterance.voice = viVoice;
          utterance.onend = () => this.resetSpeakButtons();
          utterance.onerror = () => this.resetSpeakButtons();
          window.speechSynthesis.speak(utterance);
        }
      });
    } catch (e) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 1.05;
        const voices = window.speechSynthesis.getVoices();
        const viVoice = voices.find(v => v.lang === 'vi-VN' || v.lang.startsWith('vi'));
        if (viVoice) utterance.voice = viVoice;
        utterance.onend = () => this.resetSpeakButtons();
        utterance.onerror = () => this.resetSpeakButtons();
        window.speechSynthesis.speak(utterance);
      } else {
        this.resetSpeakButtons();
      }
    }
  }

  resetSpeakButtons() {
    document.querySelectorAll('.bot-speak-btn').forEach(b => {
      b.classList.remove('speaking');
      b.innerHTML = `<span>🔊</span> <span class="speak-label">Đọc</span>`;
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.tigerChat = new TigerChatEngine();
});
