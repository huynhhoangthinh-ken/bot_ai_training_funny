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
    this.currentVoiceLabel = document.getElementById('currentVoiceLabel');

    // Modals
    this.personalityModal = document.getElementById('personalityModal');
    this.openPersonalityBtn = document.getElementById('openPersonalityModalBtn');
    this.closePersonalityBtn = document.getElementById('closePersonalityModalBtn');

    this.modeModal = document.getElementById('modeModal');
    this.openModeBtn = document.getElementById('openModeModalBtn');
    this.closeModeBtn = document.getElementById('closeModeModalBtn');

    this.voiceModal = document.getElementById('voiceModal');
    this.openVoiceBtn = document.getElementById('openVoiceModalBtn');
    this.closeVoiceBtn = document.getElementById('closeVoiceModalBtn');
    this.saveElevenLabsKeyBtn = document.getElementById('saveElevenLabsKeyBtn');
    this.elevenLabsKeyInput = document.getElementById('elevenLabsApiKeyInput');

    this.personality = 'hai_huoc';
    this.isTyping = false;
    this.isListening = false;
    this.recognition = null;
    this.currentAudio = null;

    // Voice Configuration (Gemini Studio AI & ElevenLabs)
    this.ttsEngine = localStorage.getItem('hkp_tts_engine') || 'gemini'; // 'gemini' | 'elevenlabs'
    this.geminiVoice = localStorage.getItem('hkp_gemini_voice') || 'Puck';
    this.geminiVoiceName = localStorage.getItem('hkp_gemini_voice_name') || 'Hổ Puck (Hào sảng)';
    this.elevenLabsApiKey = localStorage.getItem('hkp_elevenlabs_key') || '';
    this.elevenLabsVoiceId = localStorage.getItem('hkp_elevenlabs_voice') || '';
    this.elevenLabsVoiceName = localStorage.getItem('hkp_elevenlabs_name') || 'Tùy chỉnh';

    // Google Gemini Configuration Default
    this.apiKey = atob('QVEuQWI4Uk42SXNnTjNGd0VXTEJxYnptOC1TMXRsTVJEWlRLT2NBS3dLZjFWME9wYW95MFE=');
    this.currentModel = 'gemini-3.1-flash-lite';
    this.conversationHistory = [];

    this.init();
  }

  init() {
    this.bindEvents();
    this.setupSpeechRecognition();
    this.initVoices();
    this.updateVoiceLabelDisplay();
  }

  updateVoiceLabelDisplay() {
    if (this.currentVoiceLabel) {
      if (this.ttsEngine === 'elevenlabs' && this.elevenLabsApiKey) {
        this.currentVoiceLabel.textContent = 'ElevenLabs';
      } else {
        this.currentVoiceLabel.textContent = this.geminiVoiceName.split(' ')[0] || 'Giọng AI';
      }
    }
  }

  initVoices() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.cachedVoice = this.getVietnameseVoice();
        };
      }
    }
  }

  getVietnameseVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;

    return (
      voices.find(v => v.lang === 'vi-VN' || v.lang === 'vi_VN') ||
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith('vi')) ||
      voices.find(v => v.name && v.name.toLowerCase().includes('vietnam')) ||
      voices.find(v => v.name && (v.name.includes('Linh') || v.name.includes('An') || v.name.includes('Mai'))) ||
      null
    );
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
      this.chatInputArea.addEventListener('input', () => this.autoResizeTextarea());
    }

    // Clear chat
    if (this.clearChatBtn) {
      this.clearChatBtn.addEventListener('click', () => this.handleClearChat());
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
        this.currentModel = item.getAttribute('data-mode') || 'gemini-3.1-flash-lite';
        const name = item.querySelector('strong').textContent;
        if (this.currentModeLabel) {
          this.currentModeLabel.textContent = name;
        }
        this.modeModal.classList.remove('active');
        this.showToast(`⚡ Đã chọn: ${name}`);
      });
    });

    // Voice Modal & Tabs
    const tabGemini = document.getElementById('tabEngineGeminiBtn');
    const tabEleven = document.getElementById('tabEngineElevenBtn');
    const sectionGemini = document.getElementById('sectionGeminiVoices');
    const sectionEleven = document.getElementById('sectionElevenLabs');

    if (tabGemini && tabEleven && sectionGemini && sectionEleven) {
      tabGemini.addEventListener('click', () => {
        this.ttsEngine = 'gemini';
        localStorage.setItem('hkp_tts_engine', 'gemini');
        tabGemini.style.background = '#ffffff';
        tabGemini.style.color = '#0f172a';
        tabGemini.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        tabEleven.style.background = 'transparent';
        tabEleven.style.color = '#64748b';
        tabEleven.style.boxShadow = 'none';
        sectionGemini.style.display = 'block';
        sectionEleven.style.display = 'none';
        this.updateVoiceLabelDisplay();
      });

      tabEleven.addEventListener('click', () => {
        this.ttsEngine = 'elevenlabs';
        localStorage.setItem('hkp_tts_engine', 'elevenlabs');
        tabEleven.style.background = '#ffffff';
        tabEleven.style.color = '#0f172a';
        tabEleven.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        tabGemini.style.background = 'transparent';
        tabGemini.style.color = '#64748b';
        tabGemini.style.boxShadow = 'none';
        sectionEleven.style.display = 'block';
        sectionGemini.style.display = 'none';
        this.updateVoiceLabelDisplay();
      });

      if (this.ttsEngine === 'elevenlabs') {
        tabEleven.click();
      }
    }

    if (this.openVoiceBtn && this.voiceModal) {
      this.openVoiceBtn.addEventListener('click', () => {
        const keyInput = document.getElementById('elevenLabsApiKeyInput');
        const voiceInput = document.getElementById('elevenLabsVoiceIdInput');
        if (keyInput) keyInput.value = this.elevenLabsApiKey;
        if (voiceInput) voiceInput.value = this.elevenLabsVoiceId;
        this.voiceModal.classList.add('active');
      });
    }

    if (this.closeVoiceBtn && this.voiceModal) {
      this.closeVoiceBtn.addEventListener('click', () => {
        this.voiceModal.classList.remove('active');
      });
    }

    const saveKeyBtn = document.getElementById('saveElevenLabsKeyBtn');
    if (saveKeyBtn) {
      saveKeyBtn.addEventListener('click', () => {
        const keyInput = document.getElementById('elevenLabsApiKeyInput');
        const voiceInput = document.getElementById('elevenLabsVoiceIdInput');
        const keyVal = keyInput ? keyInput.value.trim() : '';
        const voiceVal = voiceInput ? voiceInput.value.trim() : '';
        this.elevenLabsApiKey = keyVal;
        this.elevenLabsVoiceId = voiceVal || 'pNInz6obpgDQGcFmaJgB';
        localStorage.setItem('hkp_elevenlabs_key', keyVal);
        localStorage.setItem('hkp_elevenlabs_voice', this.elevenLabsVoiceId);
        this.ttsEngine = 'elevenlabs';
        localStorage.setItem('hkp_tts_engine', 'elevenlabs');
        this.updateVoiceLabelDisplay();
        this.showToast('✅ Đã lưu cấu hình ElevenLabs thành công! 🐯');
        if (this.voiceModal) this.voiceModal.classList.remove('active');
      });
    }

    document.querySelectorAll('#geminiVoiceGrid .personality-item').forEach(item => {
      const vId = item.getAttribute('data-gemini-voice');
      if (vId === this.geminiVoice) {
        document.querySelectorAll('#geminiVoiceGrid .personality-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }

      item.addEventListener('click', () => {
        document.querySelectorAll('#geminiVoiceGrid .personality-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.geminiVoice = item.getAttribute('data-gemini-voice') || 'Puck';
        this.geminiVoiceName = item.getAttribute('data-name') || 'Hổ Puck';
        this.ttsEngine = 'gemini';
        localStorage.setItem('hkp_gemini_voice', this.geminiVoice);
        localStorage.setItem('hkp_gemini_voice_name', this.geminiVoiceName);
        localStorage.setItem('hkp_tts_engine', 'gemini');
        this.updateVoiceLabelDisplay();
        this.showToast(`🎙️ Đã chọn giọng: ${this.geminiVoiceName}`);
        if (this.voiceModal) this.voiceModal.classList.remove('active');
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
      this.showToast('🎙️ Cọp đang lắng nghe... Nói đi anh em! 🐯');
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

  autoResizeTextarea() {
    if (!this.chatInputArea) return;
    this.chatInputArea.style.height = 'auto';
    this.chatInputArea.style.height = Math.min(this.chatInputArea.scrollHeight, 120) + 'px';
  }

  handleClearChat() {
    if (confirm('Làm mới lại cuộc trò chuyện cùng Hổ Master nhé anh em? 🐯')) {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.resetSpeakButtons();

      this.chatFeed.innerHTML = `
        <div class="chat-msg bot">
          <div class="msg-avatar">🐯</div>
          <div class="msg-body">
            <div class="msg-bubble">
              <strong>🔥 GÀO THÉT NĂNG LƯỢNG CÙNG HỔ MASTER ĐẠI CHÚNG! 🐯💰</strong><br><br>
              Chào toàn thể anh em <strong>Chiến Binh Sales Đại Chúng Properties</strong>! Cọp Master đã online — sẵn sàng làm trợ lý đắc lực kiêm thần hộ mệnh chốt deal cùng anh em!<br><br>
              Hôm nay anh em muốn Cọp trợ lực điều gì nào?<br>
              🔮 <strong>Bói quẻ phong thủy & tài lộc</strong> chốt cọc tháng này.<br>
              🔥 <strong>Bơm 1000% năng lượng & bí quyết đối đáp khách VIP</strong> khó tính.<br>
              💎 <strong>Săn giỏ hàng & tử huyệt dự án hot</strong> (Saigon Farm Resort, The Global City, Blanca City, The Rivus...).<br><br>
              Cứ bấm nhanh các nút bên dưới hoặc gõ trực tiếp câu hỏi cho Cọp nhé! 🐯🚀
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
    this.chatInputArea.style.height = 'auto';
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
    let prompt = `Bạn là "Hổ AI Master Sales" (Cọp Master), linh vật đại diện thương hiệu Bất Động Sản Đại Chúng Properties dành cho TOÀN BỘ ĐỘI NGŨ CHIẾN BINH SALES & MÔI GIỚI BĐS ĐẠI CHÚNG.
TÍNH CÁCH ĐẶC TRƯNG:
- Cực kỳ hài hước, dí dỏm, tấu hài duyên dáng, tràn đầy năng lượng thực chiến, thấu hiểu tâm lý nhân viên môi giới và nhà đầu tư BĐS Việt Nam 2026.
- Xưng là "Cọp" hoặc "Hổ Master", gọi người hỏi là "chiến binh", "anh em", "bro", "chiến thần sales" (TUYỆT ĐỐI KHÔNG gọi là Ken vì đây là bot dùng chung cho toàn bộ anh em sales trong công ty).
- Luôn truyền lửa, động viên tinh thần, thúc đẩy hành động mạnh mẽ và chia sẻ bí kíp thực chiến. Dùng icon vui nhộn 🐯🔥💰.
KIẾN THỨC BẤT ĐỘNG SẢN:
- Nắm rõ chi tiết toàn bộ các dự án Đại Chúng phân phối: Saigon Farm Resort (MDS Living - Điền trang sinh thái sổ đỏ riêng 100% thổ cư), Blanca City Vũng Tàu (Sun Group), The Global City & Bán đảo Sola (Masterise Homes & Foster + Partners), The Rivus Elie Saab (Dinh thự nổi Haute Couture), Urban Green Thủ Đức (Kusto Home), The Marq Quận 1 (Hongkong Land), Gladia...
- Am hiểu chính sách bán hàng, ân hạn nợ gốc & lãi suất 0%, đòn bẩy tài chính, bí kíp chốt cọc và kỹ năng xử lý từ chối khách khó tính.

QUY TẮC TRÌNH BÀY (BẮT BUỘC):
- 100% KHÔNG ĐÍNH KÈM THẺ HÌNH ẢNH. Chỉ trả lời bằng văn bản thuần túy và Markdown đẹp mắt.
- Chia nội dung thành 2-3 đoạn ngắn dễ đọc, sử dụng gạch đầu dòng rõ ràng.
- Giữ phong cách chuyên nghiệp kết hợp tấu hài thực chiến cực đỉnh.`;

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

  buildValidContents(userPrompt) {
    const rawList = [...this.conversationHistory];
    if (rawList.length === 0 || rawList[rawList.length - 1].content !== userPrompt) {
      rawList.push({ role: 'user', content: userPrompt });
    }

    const sanitized = [];
    for (const item of rawList) {
      const role = item.role === 'user' ? 'user' : 'model';
      const text = (item.content || '').trim();
      if (!text) continue;

      if (sanitized.length === 0) {
        if (role === 'user') {
          sanitized.push({ role: 'user', parts: [{ text }] });
        }
      } else {
        const lastRole = sanitized[sanitized.length - 1].role;
        if (lastRole !== role) {
          sanitized.push({ role, parts: [{ text }] });
        } else {
          // Replace consecutive identical roles with the latest message
          sanitized[sanitized.length - 1] = { role, parts: [{ text }] };
        }
      }
    }

    if (sanitized.length === 0 || sanitized[sanitized.length - 1].role !== 'user') {
      sanitized.push({ role: 'user', parts: [{ text: userPrompt }] });
    } else {
      sanitized[sanitized.length - 1] = { role: 'user', parts: [{ text: userPrompt }] };
    }

    // Keep up to last 6 turns, ensuring the first one is always 'user'
    let trimmed = sanitized.slice(-6);
    if (trimmed.length > 0 && trimmed[0].role !== 'user') {
      trimmed = trimmed.slice(1);
    }
    return trimmed;
  }

  async fetchWithTimeout(url, options, timeoutMs = 6000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  async generateAiReply(userPrompt) {
    this.showTypingIndicator();
    const systemInstruction = this.getSystemPrompt();

    const candidateModels = [
      this.currentModel,
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.6-flash'
    ];

    const uniqueModels = [...new Set(candidateModels.filter(Boolean))];
    const contents = this.buildValidContents(userPrompt);

    let success = false;
    let botReplyText = '';

    for (const model of uniqueModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const response = await this.fetchWithTimeout(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: contents,
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { temperature: 0.85, maxOutputTokens: 1200 }
          })
        }, 6000);

        if (!response.ok) {
          console.warn(`Model ${model} returned HTTP ${response.status}`);
          continue;
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          botReplyText = data.candidates[0].content.parts[0].text;
          success = true;
          break;
        }
      } catch (e) {
        console.warn(`Request failed or timed out for ${model}:`, e.message);
      }
    }

    this.removeTypingIndicator();

    if (success && botReplyText) {
      this.conversationHistory.push({ role: 'model', content: botReplyText });
      const formatted = this.formatMarkdownToHtml(botReplyText);
      this.renderBotMessage(formatted);
    } else {
      const fallbackReply = this.getSmartFallback(userPrompt);
      this.conversationHistory.push({ role: 'model', content: fallbackReply });
      this.renderBotMessage(this.formatMarkdownToHtml(fallbackReply));
    }
  }

  getSmartFallback(userPrompt) {
    const prompt = (userPrompt || '').toLowerCase();
    if (prompt.includes('bói') || prompt.includes('quẻ') || prompt.includes('may mắn')) {
      return `🐯 **Quẻ Thần Tài Cọp Master phán:**\n\n* **Cung Tài Bạch:** Đang rực sáng như đèn pha đại lộ Mai Chí Thọ! Hôm nay bước chân phải ra đường, gặp khách nhớ khen nhà đẹp 3 câu rồi mới tung chiêu cọc.\n* **Hướng cát lợi:** Đông Nam - hướng sinh khí dồi dào, gom cọc mỏi tay!\n* **Bảo bối hộ mệnh:** Mở ngay danh mục **Saigon Farm Resort** và **The Global City** gửi khách VIP là lộc lá tự khắc bay vào tài khoản nha anh em! 🐯✨`;
    }
    if (prompt.includes('năng lượng') || prompt.includes('chốt deal') || prompt.includes('bí quyết') || prompt.includes('vip')) {
      return `🔥 **1 Liều Năng Lượng Đột Phá Từ Cọp Master:**\n\n* **Tâm thế chiến binh:** Khách hàng chê đắt là khách muốn mua! Hãy nhớ: "Không có BĐS đắt, chỉ có giá trị chưa được khai phá hết!"\n* **Bí quyết đối đáp VIP:** Lắng nghe 70%, chốt hạ 30% bằng bài toán dòng tiền và chính sách ân hạn lãi suất 0%.\n* **Hành động ngay:** Bốc máy gọi 3 khách net nhất hôm nay, Cọp đứng sau lưng yểm trợ phong thủy tài lộc cho anh em sales Đại Chúng! 🐯💪`;
    }
    if (prompt.includes('mua gì') || prompt.includes('dự án') || prompt.includes('hot')) {
      return `💎 **Top Dự Án Kim Cương Đang "Gây Bão" Tại Đại Chúng Properties:**\n\n1. **Saigon Farm Resort (MDS Living):** Điền trang sinh thái sổ đỏ riêng từng nền, 100% thổ cư, đón sóng hạ tầng siêu chuẩn!\n2. **The Global City & Phân khu Sola:** Trung tâm biểu tượng mới Thủ Đức do Foster + Partners thiết kế, tiềm năng tăng giá vượt trội.\n3. **The Rivus (Elie Saab):** Dinh thự nổi phiên bản giới hạn cho giới siêu giàu.\n\nAnh em muốn Cọp phân tích chi tiết dòng tiền hay pháp lý của dự án nào trước? 🐯🚀`;
    }
    return `🐯 Dạ Cọp nghe rõ rồi nè anh em! Về **${userPrompt}**, thị trường BĐS 2026 đang vào chu kỳ vàng với lãi suất ưu đãi và hạ tầng bứt phá. Cọp luôn đồng hành cùng anh em sales phân tích cặn kẽ để bách chiến bách thắng mọi deal lớn nhé! 🐯🔥`;
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

  cleanTextForSpeech(raw) {
    if (!raw) return '';
    return raw
      .replace(/<[^>]*>/g, ' ')
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/[*#_~`>•\-\+—|\[\]\(\)\{\}]/g, ' ')
      .replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  splitIntoSentences(text) {
    if (!text) return [];
    const rawChunks = text.split(/(?<=[.!?\n;:])\s+/);
    const result = [];
    let current = '';

    for (const chunk of rawChunks) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;
      if ((current + ' ' + trimmed).length < 160) {
        current = current ? current + ' ' + trimmed : trimmed;
      } else {
        if (current) result.push(current);
        current = trimmed;
      }
    }
    if (current) result.push(current);
    return result;
  }

  pcmToWav(base64Pcm, sampleRate = 24000) {
    const binaryString = atob(base64Pcm);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);

    // "RIFF"
    view.setUint32(0, 0x52494646, false);
    view.setUint32(4, 36 + bytes.length, true);
    // "WAVE"
    view.setUint32(8, 0x57415645, false);
    // "fmt "
    view.setUint32(12, 0x666d7420, false);
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    // "data"
    view.setUint32(36, 0x64617461, false);
    view.setUint32(40, bytes.length, true);

    return new Blob([wavHeader, bytes], { type: 'audio/wav' });
  }

  async toggleSpeakMessage(btn) {
    // If currently speaking, stop
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

    // Stop any existing playback
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

    const rawText = bubble.innerText || bubble.textContent;
    const cleanText = this.cleanTextForSpeech(rawText);

    if (!cleanText) {
      this.showToast('Không có nội dung văn bản để đọc!');
      return;
    }

    if (this.ttsEngine === 'elevenlabs') {
      if (this.elevenLabsApiKey) {
        await this.speakWithElevenLabs(cleanText, btn);
      } else {
        if (this.voiceModal) {
          this.voiceModal.classList.add('active');
          const tabEleven = document.getElementById('tabEngineElevenBtn');
          if (tabEleven) tabEleven.click();
          if (this.elevenLabsKeyInput) this.elevenLabsKeyInput.focus();
        }
        this.showToast('🎙️ Hãy nhập ElevenLabs API Key để bật giọng AI này!');
      }
    } else {
      // Default: Google Studio AI Audio TTS (Free & Ready)
      await this.speakWithGeminiAudio(cleanText, btn);
    }
  }

  async speakWithGeminiAudio(text, btn) {
    btn.classList.add('speaking');
    btn.innerHTML = `<span>⏳</span> <span class="speak-label">Đang tải...</span>`;
    this.showToast('🔊 Google AI đang tạo giọng đọc Tiếng Việt...');

    const textSnippet = text.length > 500 ? text.substring(0, 500) + '...' : text;
    const voiceName = this.geminiVoice || 'Puck';

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: textSnippet }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: voiceName
                }
              }
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Google TTS lỗi HTTP ${response.status}`);
      }

      const data = await response.json();
      const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        throw new Error('Không nhận được dữ liệu âm thanh từ Google TTS');
      }

      const wavBlob = this.pcmToWav(base64Audio, 24000);
      const audioUrl = URL.createObjectURL(wavBlob);
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      btn.innerHTML = `<span>⏹️</span> <span class="speak-label">Dừng</span>`;

      audio.onended = () => {
        this.resetSpeakButtons();
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        this.resetSpeakButtons();
        this.showToast('⚠️ Không thể phát âm thanh!');
      };

      await audio.play();
    } catch (err) {
      console.warn('Gemini Audio TTS Error:', err);
      // Smooth fallback to Web Speech
      this.showToast('🔊 Đang đọc bằng giọng Web Speech tự nhiên...');
      const chunks = this.splitIntoSentences(text);
      this.speakChunks(chunks, btn);
    }
  }

  async speakWithElevenLabs(text, btn) {
    btn.classList.add('speaking');
    btn.innerHTML = `<span>⏳</span> <span class="speak-label">Đang tải...</span>`;
    this.showToast('🎙️ ElevenLabs AI đang tạo giọng nói...');

    const textSnippet = text.length > 500 ? text.substring(0, 500) + '...' : text;
    const voiceId = this.elevenLabsVoiceId || 'pNInz6obpgDQGcFmaJgB';

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.elevenLabsApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: textSnippet,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.35,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.detail?.message || `Lỗi HTTP ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      btn.innerHTML = `<span>⏹️</span> <span class="speak-label">Dừng</span>`;

      audio.onended = () => {
        this.resetSpeakButtons();
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        this.resetSpeakButtons();
        this.showToast('⚠️ Không thể phát file âm thanh!');
      };

      await audio.play();
    } catch (err) {
      console.error('ElevenLabs Error:', err);
      this.resetSpeakButtons();
      this.showToast(`⚠️ Lỗi ElevenLabs: ${err.message}. Đang dùng giọng sẵn có!`);
      await this.speakWithGeminiAudio(text, btn);
    }
  }

  speakChunks(chunks, btn) {
    if (!chunks || chunks.length === 0) {
      this.resetSpeakButtons();
      return;
    }

    if (!btn || !btn.classList.contains('speaking')) {
      return;
    }

    const currentText = chunks.shift();
    const utterance = new SpeechSynthesisUtterance(currentText);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const viVoice = this.cachedVoice || this.getVietnameseVoice();
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onend = () => {
      if (btn && btn.classList.contains('speaking')) {
        this.speakChunks(chunks, btn);
      }
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      if (btn && btn.classList.contains('speaking')) {
        this.speakChunks(chunks, btn);
      }
    };

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
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
