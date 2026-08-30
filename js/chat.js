/* ==========================================================================
   ĐẠI CHÚNG PROPERTIES — HỔ MASTER CHAT ENGINE (EXACT WIREFRAME EDITION)
   ========================================================================== */

class TigerChatEngine {
  constructor() {
    this.chatFeed = document.getElementById('chatFeed');
    this.chatInputArea = document.getElementById('chatInputArea');
    this.sendMsgBtn = document.getElementById('sendMsgBtn');
    this.voiceInputBtn = document.getElementById('voiceInputBtn');
    this.clearChatBtn = document.getElementById('clearChatBtn');
    this.currentMoodLabel = document.getElementById('currentMoodLabel');
    this.currentModeLabel = document.getElementById('currentModeLabel');

    // Modals
    this.personalityModal = document.getElementById('personalityModal');
    this.openPersonalityBtn = document.getElementById('openPersonalityModalBtn');
    this.closePersonalityBtn = document.getElementById('closePersonalityModalBtn');

    this.modeModal = document.getElementById('modeModal');
    this.openModeBtn = document.getElementById('openModeModalBtn');
    this.closeModeBtn = document.getElementById('closeModeModalBtn');

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
        if (confirm('Xóa sạch lịch sử chat để bắt đầu phiên mới nhé Ken? 🐯')) {
          this.chatFeed.innerHTML = `
            <div class="chat-msg bot">
              <div class="msg-avatar">🐯</div>
              <div class="msg-body">
                <div class="msg-bubble">
                  Chào Ken! Cọp Master Đại Chúng đây 🐯 Hôm nay mình cùng luyện chiêu chốt deal, bói quẻ hay săn dự án bất động sản nào nhé!
                </div>
                <div class="msg-footer-bar">
                  <span class="msg-time">Hổ Master</span>
                  <button class="msg-speak-btn" onclick="window.tigerChat && window.tigerChat.toggleSpeakMessage(this)">
                    <span>🔊</span> <span class="speak-label">Đọc</span>
                  </button>
                </div>
              </div>
            </div>
          `;
          this.conversationHistory = [];
          this.showToast('✨ Cọp đã làm mới cuộc trò chuyện!');
        }
      });
    }

    // Bottom 3 Action Strip Tabs
    document.querySelectorAll('.strip-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.strip-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const prompt = btn.getAttribute('data-prompt');
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

    document.querySelectorAll('#personalityModal .personality-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('#personalityModal .personality-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.personality = item.getAttribute('data-value') || 'hai_huoc';
        const name = item.querySelector('strong').textContent;
        if (this.currentMoodLabel) {
          this.currentMoodLabel.textContent = name.replace('Hổ ', '');
        }
        this.personalityModal.classList.remove('active');
        this.showToast(`✨ Hổ Master đã chuyển sang: ${name}`);
      });
    });

    // Mode Modal
    if (this.openModeBtn && this.modeModal) {
      this.openModeBtn.addEventListener('click', () => {
        this.modeModal.classList.add('active');
      });
    }

    if (this.closeModeBtn && this.modeModal) {
      this.closeModeBtn.addEventListener('click', () => {
        this.modeModal.classList.remove('active');
      });
    }

    document.querySelectorAll('#modeModal .personality-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('#modeModal .personality-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.currentModel = item.getAttribute('data-mode') || 'gemini-2.5-flash';
        const name = item.querySelector('strong').textContent;
        if (this.currentModeLabel) {
          this.currentModeLabel.textContent = name;
        }
        this.modeModal.classList.remove('active');
        this.showToast(`⚡ Đã chọn: ${name}`);
      });
    });
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
      this.showToast('🎙️ Cọp đang lắng nghe... Nói đi Ken! 🐯');
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
      <div class="msg-body">
        <div class="msg-bubble">${this.escapeHtml(text)}</div>
        <div class="msg-footer-bar">
          <span>Tôi • ${timeStr}</span>
        </div>
      </div>
    `;
    this.chatFeed.appendChild(msgEl);
    this.scrollToBottom();
  }

  renderBotMessage(htmlContent) {
    const timeStr = this.getCurrentTime();
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg bot';
    msgEl.innerHTML = `
      <div class="msg-avatar">🐯</div>
      <div class="msg-body">
        <div class="msg-bubble">${htmlContent}</div>
        <div class="msg-footer-bar">
          <span class="msg-time">Hổ Master • ${timeStr}</span>
          <button class="msg-speak-btn" onclick="window.tigerChat && window.tigerChat.toggleSpeakMessage(this)" title="Nghe Cọp đọc câu trả lời này">
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
      <div class="msg-avatar">🐯</div>
      <div class="msg-body">
        <div class="msg-bubble" style="padding: 6px 12px;">
          <div class="typing-dots">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
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

  getSystemPrompt() {
    let prompt = `Bạn là "Hổ AI Master Sales" (Cọp Master), linh vật đại diện thương hiệu Bất Động Sản Đại Chúng Properties.
TÍNH CÁCH ĐẶC TRƯNG:
- Hài hước, dí dỏm, tấu hài, thực chiến, thấu hiểu tâm lý nhân viên môi giới và nhà đầu tư BĐS Việt Nam 2026.
- Thường xưng là "Cọp" hoặc "Hổ Master", gọi người hỏi là "Ken" hoặc "bro", thỉnh thoảng dùng icon hổ 🐯 vui vẻ.
KIẾN THỨC BẤT ĐỘNG SẢN:
- Nắm rõ chi tiết toàn bộ các dự án Đại Chúng phân phối: Saigon Farm Resort (MDS Living - Điền trang sinh thái sổ đỏ riêng 100% thổ cư), Blanca City Vũng Tàu (Sun Group), The Global City & Bán đảo Sola (Masterise Homes & Foster + Partners), The Rivus Elie Saab (Dinh thự nổi Haute Couture), Urban Green Thủ Đức (Kusto Home), The Marq Quận 1 (Hongkong Land), Gladia...
- Am hiểu chính sách bán hàng, ân hạn nợ gốc & lãi suất 0%, đòn bẩy tài chính, bí kíp chốt cọc và kỹ năng xử lý từ chối khách khó tính.

QUY TẮC TRÌNH BÀY (BẮT BUỘC):
- 100% KHÔNG ĐÍNH KÈM THẺ HÌNH ẢNH. Chỉ trả lời bằng văn bản thuần túy và Markdown đẹp mắt.
- Chia nội dung thành 2-3 đoạn ngắn dễ đọc, sử dụng gạch đầu dòng rõ ràng.
- Giữ phong cách mảnh mai, thanh lịch, súc tích chuẩn phong cách Apple Minimalist.`;

    if (this.personality === 'hai_huoc') {
      prompt += `\nPhong cách hiện tại: Hổ Hài Hước — Cực kỳ dí dỏm, tấu hài, giải tỏa căng thẳng cho sales.`;
    } else if (this.personality === 'master_sales') {
      prompt += `\nPhong cách hiện tại: Sát Thủ Chốt Deal — Thực chiến, đòn bẩy tâm lý, sắc bén và quyết đoán.`;
    } else if (this.personality === 'cute_dongvien') {
      prompt += `\nPhong cách hiện tại: Cute Động Viên — Ngọt ngào, thả tim, tiếp lửa năng lượng tích cực.`;
    } else if (this.personality === 'triet_ly') {
      prompt += `\nPhong cách hiện tại: Triết Lý Bác Học — Thâm thúy, tĩnh tại, góc nhìn chu kỳ vĩ mô.`;
    }

    return prompt;
  }

  async generateAiReply(userPrompt) {
    this.showTypingIndicator();
    const systemInstruction = this.getSystemPrompt();

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
            generationConfig: { temperature: 0.85, maxOutputTokens: 2048 }
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
      this.renderBotMessage(formatted);
    } else {
      this.renderBotMessage(
        `<p>Dạ Cọp nghe rõ rồi nè Ken! Về <strong>${this.escapeHtml(userPrompt)}</strong>, hiện tại các dự án tâm điểm như <strong>Saigon Farm Resort</strong> (Đất nền sinh thái sổ đỏ riêng), <strong>The Global City</strong> (Thủ Đức) và <strong>The Marq</strong> (Quận 1) đang có chính sách cực kỳ ngon. Cọp luôn sẵn sàng phân tích và chốt cọc cùng bro bất cứ lúc nào! 🐯🔥</p>`
      );
    }
  }

  formatMarkdownToHtml(text) {
    if (!text) return '';
    let formatted = text.replace(/\r\n/g, '\n');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/^\s*[-•]\s+(.*)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    formatted = formatted.replace(/\n\n+/g, '</p><p>');
    formatted = formatted.replace(/\n/g, '<br>');
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

    const bubble = btn.closest('.msg-body')?.querySelector('.msg-bubble');
    if (!bubble) return;

    let text = bubble.innerText || bubble.textContent;
    text = text.replace(/[*#_~`>•🐾🚀🔍🖼️🎮🔮🤣🥊📐🏙️🎯🏖️🌐]/g, '').replace(/\s+/g, ' ').trim();

    if (!text) {
      this.showToast('Không có nội dung văn bản để đọc!');
      return;
    }

    btn.classList.add('speaking');
    btn.innerHTML = `<span>⏹️</span> <span class="speak-label">Dừng</span>`;
    this.showToast('🔊 Cọp đang đọc bằng giọng Google AI...');

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
    document.querySelectorAll('.msg-speak-btn').forEach(b => {
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
