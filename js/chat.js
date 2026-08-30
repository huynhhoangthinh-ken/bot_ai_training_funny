/**
 * TIGER AI CHAT ENGINE - POWERED BY DEEPSEEK AI & GOOGLE GEMINI
 * Linh vật Cọp Hài Hước - Bất Động Sản Đại Chúng Properties
 */

class TigerChatApp {
  constructor() {
    this.chatFeed = document.getElementById('chatFeed');
    this.inputArea = document.getElementById('chatInputArea');
    this.sendBtn = document.getElementById('sendMsgBtn');
    this.personalitySelect = document.getElementById('personalitySelect');
    this.bubbleSpeech = document.getElementById('mascotBubbleSpeech');
    this.moodTag = document.getElementById('mascotMoodTag');
    this.mascotFace = document.getElementById('mainMascotFace');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.clearChatBtn = document.getElementById('clearChatBtn');
    this.aiModeSelect = document.getElementById('aiModeSelect');
    this.voiceInputBtn = document.getElementById('voiceInputBtn');

    // Brand Elements
    this.brandLogoWrap = document.getElementById('brandLogoWrap');
    this.brandNameHeader = document.getElementById('brandNameHeader');

    // AI Provider & Key Elements
    this.apiKeyModal = document.getElementById('apiKeyModal');
    this.openApiKeyModalBtn = document.getElementById('openApiKeyModalBtn');
    this.closeApiKeyModalBtn = document.getElementById('closeApiKeyModalBtn');
    this.cancelApiKeyBtn = document.getElementById('cancelApiKeyBtn');
    this.saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
    this.removeApiKeyBtn = document.getElementById('removeApiKeyBtn');
    this.aiProviderSelect = document.getElementById('aiProviderSelect');
    this.providerInfoBox = document.getElementById('providerInfoBox');
    this.infoBoxTitle = document.getElementById('infoBoxTitle');
    this.infoBoxDesc = document.getElementById('infoBoxDesc');
    this.apiKeyLabel = document.getElementById('apiKeyLabel');
    this.geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
    this.geminiModelSelect = document.getElementById('geminiModelSelect');
    this.apiKeyStatusText = document.getElementById('apiKeyStatusText');
    this.apiKeyStatusDot = document.getElementById('apiKeyStatusDot');

    // Knowledge Modal Elements
    this.knowledgeModal = document.getElementById('knowledgeModal');
    this.openKnowledgeBtn = document.getElementById('openKnowledgeModalBtn');
    this.closeKnowledgeBtn = document.getElementById('closeKnowledgeModalBtn');
    this.cancelKnowledgeBtn = document.getElementById('cancelKnowledgeBtn');
    this.saveKnowledgeBtn = document.getElementById('saveKnowledgeBtn');
    this.docTitleInput = document.getElementById('docTitleInput');
    this.docContentInput = document.getElementById('docContentInput');
    this.docImageUrlInput = document.getElementById('docImageUrlInput');
    this.docImageFileInput = document.getElementById('docImageFileInput');
    this.imageUploadPreview = document.getElementById('imageUploadPreview');
    this.imagePreviewImg = document.getElementById('imagePreviewImg');
    this.removeImagePreviewBtn = document.getElementById('removeImagePreviewBtn');
    this.savedDocsList = document.getElementById('savedDocsList');
    this.savedDocsCount = document.getElementById('savedDocsCount');
    this.knowledgeCountBadge = document.getElementById('knowledgeCountBadge');

    // Lightbox
    this.lightbox = document.getElementById('imageLightbox');
    this.lightboxImg = document.getElementById('lightboxImg');
    this.lightboxCaption = document.getElementById('lightboxCaption');

    this.currentBase64Image = '';
    this.soundEnabled = true;
    this.personality = 'hai_huoc';
    this.knowledgeDocs = [];
    this.isTyping = false;
    this.isListening = false;
    this.recognition = null;
    
    // AI Configuration State - DeepSeek Default
    this.aiProvider = 'deepseek';
    this.defaultDeepSeekKey = 'sk-69b60e982e1a4c6aa5183461c7b487a4';
    this.apiKey = this.defaultDeepSeekKey;
    this.currentModel = 'deepseek-chat';
    this.conversationHistory = [];

    this.init();
  }

  init() {
    this.setupBrandIdentity();
    this.loadAiConfig();
    this.loadKnowledge();
    this.loadChatHistory();
    this.bindEvents();
    this.setupSpeechRecognition();
    this.startMascotRandomThoughts();
  }

  setupBrandIdentity() {
    if (window.APP_DATA && window.APP_DATA.brand) {
      const b = window.APP_DATA.brand;
      if (this.brandNameHeader) {
        this.brandNameHeader.textContent = b.name || "ĐẠI CHÚNG PROPERTIES";
      }
      if (this.brandLogoWrap && b.logoUrl) {
        this.brandLogoWrap.innerHTML = `
          <img src="${b.logoUrl}" alt="${b.name}" class="brand-logo-img" onerror="this.style.display='none'; document.getElementById('brandLogoBox').style.display='flex';">
          <div class="brand-logo-box" id="brandLogoBox" style="display:none;">
            <span class="logo-text-emblem">ĐC</span>
          </div>
        `;
      }
    }
  }

  /* --------------------------------------------------------------------------
     AI PROVIDER & KEY CONFIGURATION (DEEPSEEK & GEMINI)
     -------------------------------------------------------------------------- */
  loadAiConfig() {
    const savedProvider = localStorage.getItem('tiger_ai_provider') || 'deepseek';
    const savedKey = localStorage.getItem('tiger_ai_key') || this.defaultDeepSeekKey;
    const savedModel = localStorage.getItem('tiger_ai_model') || 'deepseek-chat';

    this.aiProvider = savedProvider;
    this.apiKey = savedKey;
    this.currentModel = savedModel;

    localStorage.setItem('tiger_ai_provider', this.aiProvider);
    localStorage.setItem('tiger_ai_key', this.apiKey);
    localStorage.setItem('tiger_ai_model', this.currentModel);

    if (this.aiProviderSelect) this.aiProviderSelect.value = this.aiProvider;
    this.updateProviderUI();

    if (this.geminiApiKeyInput) this.geminiApiKeyInput.value = this.apiKey;
    if (this.geminiModelSelect) this.geminiModelSelect.value = this.currentModel;

    this.updateAiStatusUI(Boolean(this.apiKey));
  }

  updateProviderUI() {
    const isDeepSeek = this.aiProvider === 'deepseek';

    if (isDeepSeek) {
      if (this.infoBoxTitle) this.infoBoxTitle.textContent = "🐳 DeepSeek AI (Rẻ nhất thế giới & Siêu thông minh):";
      if (this.infoBoxDesc) {
        this.infoBoxDesc.innerHTML = `
          1. Truy cập <a href="https://platform.deepseek.com/api_keys" target="_blank" style="color: #2563eb; font-weight: 700; text-decoration: underline;">DeepSeek Platform (Bấm vào đây)</a>.<br>
          2. Đăng ký & nạp $1 - $2 (khoảng 25k - 50k VNĐ chat cả năm không hết).<br>
          3. Bấm <strong>"Create API Key"</strong> và dán vào bên dưới!
        `;
      }
      if (this.apiKeyLabel) this.apiKeyLabel.textContent = "🔑 Dán DeepSeek API Key (sk-...) vào đây:";
      if (this.geminiApiKeyInput) this.geminiApiKeyInput.placeholder = "sk-...";

      if (this.geminiModelSelect) {
        this.geminiModelSelect.innerHTML = `
          <option value="deepseek-chat" selected>DeepSeek-V3 (deepseek-chat) - Siêu nhanh, thông minh & cực rẻ</option>
          <option value="deepseek-reasoner">DeepSeek-R1 (deepseek-reasoner) - Tư duy suy luận sâu sắc đỉnh cao</option>
        `;
      }
    } else {
      if (this.infoBoxTitle) this.infoBoxTitle.textContent = "🎁 Google Gemini AI (Miễn phí 100%):";
      if (this.infoBoxDesc) {
        this.infoBoxDesc.innerHTML = `
          1. Truy cập <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #2563eb; font-weight: 700; text-decoration: underline;">Google AI Studio (Bấm vào đây)</a>.<br>
          2. Đăng nhập tài khoản Google & bấm <strong>"Create API Key"</strong>.<br>
          3. Sao chép mã Key và dán vào ô bên dưới!
        `;
      }
      if (this.apiKeyLabel) this.apiKeyLabel.textContent = "🔑 Dán Google Gemini API Key vào đây:";
      if (this.geminiApiKeyInput) this.geminiApiKeyInput.placeholder = "AIzaSy... hoặc AQ.Ab8...";

      if (this.geminiModelSelect) {
        this.geminiModelSelect.innerHTML = `
          <option value="gemini-3.6-flash" selected>Gemini 3.6 Flash (Khuyên dùng - Siêu thông minh & mới nhất)</option>
          <option value="gemini-flash-latest">Gemini Flash Latest (Bản cập nhật mới nhất)</option>
          <option value="gemini-3.7-flash">Gemini 3.7 Flash</option>
          <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
        `;
      }
    }
  }

  saveAiConfig() {
    const provider = this.aiProviderSelect.value;
    const key = this.geminiApiKeyInput.value.trim();
    const model = this.geminiModelSelect.value;

    if (!key) {
      alert('Vui lòng dán mã API Key của bạn nhé! 🐯');
      return;
    }

    this.aiProvider = provider;
    this.apiKey = key;
    this.currentModel = model;

    localStorage.setItem('tiger_ai_provider', provider);
    localStorage.setItem('tiger_ai_key', key);
    localStorage.setItem('tiger_ai_model', model);

    this.updateAiStatusUI(true);
    if (this.removeApiKeyBtn) this.removeApiKeyBtn.style.display = 'inline-block';
    this.closeApiKeyModal();

    const providerName = provider === 'deepseek' ? 'DeepSeek AI' : 'Google Gemini AI';
    this.showToast(`✨ Đã kích hoạt ${providerName} (${model}) thành công!`);
    this.playAudio('success');

    this.renderBotMessage(`Húuuu! <strong>${providerName} [${model}]</strong> đã được kích hoạt trực tiếp vào não của Cọp rồi nha! Giờ bạn hỏi bất kỳ câu hỏi nào Cọp đều phân tích và đối đáp siêu thông minh 100%! 🐯🚀`);
  }

  removeAiConfig() {
    if (confirm('Bạn có muốn xóa API Key không? 🐯')) {
      localStorage.removeItem('tiger_ai_key');
      this.apiKey = '';
      if (this.geminiApiKeyInput) this.geminiApiKeyInput.value = '';
      if (this.removeApiKeyBtn) this.removeApiKeyBtn.style.display = 'none';
      this.updateAiStatusUI(false);
      this.closeApiKeyModal();
      this.showToast('Đã xóa API Key!');
    }
  }

  updateAiStatusUI(isConnected) {
    if (this.apiKeyStatusText && this.openApiKeyModalBtn) {
      const providerLabel = this.aiProvider === 'deepseek' ? 'DeepSeek' : 'Gemini';
      if (isConnected) {
        this.apiKeyStatusText.textContent = `${providerLabel} AI Đã Kết Nối`;
        this.openApiKeyModalBtn.classList.add('connected');
      } else {
        this.apiKeyStatusText.textContent = `Cài Đặt ${providerLabel} API`;
        this.openApiKeyModalBtn.classList.remove('connected');
      }
    }
  }

  openApiKeyModal() {
    if (this.apiKeyModal) {
      this.apiKeyModal.classList.add('active');
      if (this.geminiApiKeyInput) this.geminiApiKeyInput.focus();
    }
  }

  closeApiKeyModal() {
    if (this.apiKeyModal) {
      this.apiKeyModal.classList.remove('active');
    }
  }

  /* --------------------------------------------------------------------------
     EVENT LISTENERS & BINDINGS
     -------------------------------------------------------------------------- */
  bindEvents() {
    this.sendBtn.addEventListener('click', () => this.handleUserSend());

    this.inputArea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleUserSend();
      }
    });

    this.inputArea.addEventListener('input', () => {
      this.inputArea.style.height = 'auto';
      this.inputArea.style.height = Math.min(120, this.inputArea.scrollHeight) + 'px';
    });

    if (this.personalitySelect) {
      this.personalitySelect.addEventListener('change', (e) => {
        this.personality = e.target.value;
        this.updateMascotMood();
        this.showToast(`Đã chuyển tính cách sang: ${e.target.options[e.target.selectedIndex].text}`);
        this.playAudio('click');
      });
    }

    // AI Mode Switcher (Phản hồi nhanh vs Suy luận sâu)
    if (this.aiModeSelect) {
      this.aiModeSelect.addEventListener('change', (e) => {
        const mode = e.target.value;
        this.currentModel = mode;
        localStorage.setItem('tiger_ai_model', mode);

        if (mode === 'deepseek-reasoner') {
          this.showToast('🧠 Đã bật Chế độ Suy Luận Sâu (Phân tích chuyên sâu sắc bén)');
          if (this.bubbleSpeech) {
            this.bubbleSpeech.textContent = "Chế độ suy luận sâu đã kích hoạt! Cọp sẽ phân tích logic bài bản nhất cho bạn! 🧠🐯";
          }
        } else {
          this.showToast('⚡ Đã bật Chế độ Phản Hồi Nhanh (Trả lời tức thì)');
          if (this.bubbleSpeech) {
            this.bubbleSpeech.textContent = "Chế độ phản hồi nhanh đã kích hoạt! Hỏi là Cọp bắn câu trả lời liền tay! ⚡🐯";
          }
        }
        this.playAudio('click');
      });
    }

    if (this.mascotFace) {
      this.mascotFace.addEventListener('click', () => {
        this.triggerMascotReaction();
      });
    }

    // AI Provider Switcher
    if (this.aiProviderSelect) {
      this.aiProviderSelect.addEventListener('change', (e) => {
        this.aiProvider = e.target.value;
        this.updateProviderUI();
        const savedKey = localStorage.getItem(`tiger_ai_key_${this.aiProvider}`) || (this.aiProvider === 'gemini' ? this.defaultGeminiKey : '');
        if (this.geminiApiKeyInput) this.geminiApiKeyInput.value = savedKey;
      });
    }

    // Modal controls
    if (this.openApiKeyModalBtn) {
      this.openApiKeyModalBtn.addEventListener('click', () => this.openApiKeyModal());
    }
    if (this.closeApiKeyModalBtn) {
      this.closeApiKeyModalBtn.addEventListener('click', () => this.closeApiKeyModal());
    }
    if (this.cancelApiKeyBtn) {
      this.cancelApiKeyBtn.addEventListener('click', () => this.closeApiKeyModal());
    }
    if (this.saveApiKeyBtn) {
      this.saveApiKeyBtn.addEventListener('click', () => this.saveAiConfig());
    }
    if (this.removeApiKeyBtn) {
      this.removeApiKeyBtn.addEventListener('click', () => this.removeAiConfig());
    }

    // Quick chips
    document.querySelectorAll('.chip-item').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = e.currentTarget.getAttribute('data-text');
        if (text) {
          this.inputArea.value = text;
          this.handleUserSend();
        }
      });
    });

    // Clear chat
    if (this.clearChatBtn) {
      this.clearChatBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn làm mới cuộc trò chuyện với Cọp không? 🐯')) {
          localStorage.removeItem('tiger_chat_history');
          this.conversationHistory = [];
          this.chatFeed.innerHTML = '';
          this.renderBotMessage(`Húuu! Đã làm mới cuộc trò chuyện rồi nha bro! Giờ muốn chém gió về cái gì hay nạp dự án mới nào? 🐯✨`);
          this.showToast('Đã dọn dẹp lịch sử chat sạch sẽ!');
        }
      });
    }

    // Sound toggle
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        this.soundToggleBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
        this.showToast(this.soundEnabled ? 'Đã bật âm thanh 🐯' : 'Đã tắt âm thanh');
      });
    }

    // Knowledge modal
    if (this.openKnowledgeBtn) {
      this.openKnowledgeBtn.addEventListener('click', () => this.openKnowledgeModal());
    }
    if (this.closeKnowledgeBtn) {
      this.closeKnowledgeBtn.addEventListener('click', () => this.closeKnowledgeModal());
    }
    if (this.cancelKnowledgeBtn) {
      this.cancelKnowledgeBtn.addEventListener('click', () => this.closeKnowledgeModal());
    }
    if (this.saveKnowledgeBtn) {
      this.saveKnowledgeBtn.addEventListener('click', () => this.saveNewKnowledgeDoc());
    }

    if (this.docImageFileInput) {
      this.docImageFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.currentBase64Image = event.target.result;
            if (this.imagePreviewImg) this.imagePreviewImg.src = this.currentBase64Image;
            if (this.imageUploadPreview) this.imageUploadPreview.style.display = 'block';
            if (this.docImageUrlInput) this.docImageUrlInput.value = '';
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (this.removeImagePreviewBtn) {
      this.removeImagePreviewBtn.addEventListener('click', () => {
        this.currentBase64Image = '';
        if (this.imageUploadPreview) this.imageUploadPreview.style.display = 'none';
        if (this.docImageFileInput) this.docImageFileInput.value = '';
      });
    }

    if (this.docImageUrlInput) {
      this.docImageUrlInput.addEventListener('input', () => {
        const url = this.docImageUrlInput.value.trim();
        if (url) {
          this.currentBase64Image = '';
          if (this.imagePreviewImg) this.imagePreviewImg.src = url;
          if (this.imageUploadPreview) this.imageUploadPreview.style.display = 'block';
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     MASCOT IDLE THOUGHTS & REACTIONS
     -------------------------------------------------------------------------- */
  startMascotRandomThoughts() {
    const thoughts = [
      "Bất Động Sản Đại Chúng - Kiến tạo thịnh vượng vững bền! 🐯💎",
      "Muốn xem mặt bằng hay phối cảnh cứ gõ: 'Cho xem phối cảnh' nhé! 🏙️",
      "Thị trường có chậm thì mình chuyển sang làm video TikTok, sợ gì! 🎥🐯",
      "Đang ngồi hóng bạn tâm sự nè, hỏi gì cũng tiếp chiêu! 🐯😎",
      "Hỗ trợ cả Google Gemini & DeepSeek AI siêu thông minh! ✨🐳"
    ];

    setInterval(() => {
      if (!this.isTyping && this.bubbleSpeech) {
        const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
        this.bubbleSpeech.textContent = randomThought;
      }
    }, 14000);
  }

  triggerMascotReaction() {
    this.playAudio('roar');
    const laughs = [
      "Ui chạm vào tai Cọp nhột quá! Hahaha! 🐯✨",
      "Chạm vào Cọp là hôm nay hút vía may mắn chốt cọc liền! 🐯💰",
      "Gầm gừ! Cọp Đại Chúng đẹp trai sẵn sàng phục vụ! 😎🐯",
      "Bấm Cọp hoài Cọp ngại á nha :3 🐯💖"
    ];
    if (this.bubbleSpeech) {
      this.bubbleSpeech.textContent = laughs[Math.floor(Math.random() * laughs.length)];
    }
    this.showToast('🐯 Cọp truyền cho bạn 100% năng lượng may mắn!');
  }

  updateMascotMood() {
    if (!this.moodTag) return;
    switch (this.personality) {
      case 'hai_huoc':
        this.moodTag.textContent = "Tâm trạng: Siêu cà khịa & Tấu hài 🎭";
        break;
      case 'master_sales':
        this.moodTag.textContent = "Tâm trạng: Sát thủ chốt cọc • Đẳng cấp đại gia 👑";
        break;
      case 'cute_dongvien':
        this.moodTag.textContent = "Tâm trạng: Ngọt ngào & Thả tim không giới hạn 💖";
        break;
      case 'triet_ly':
        this.moodTag.textContent = "Tâm trạng: Thiền sư giác ngộ bất động sản 🧘";
        break;
    }
  }

  /* --------------------------------------------------------------------------
     CHAT MESSAGE HANDLING
     -------------------------------------------------------------------------- */
  handleUserSend() {
    const text = this.inputArea.value.trim();
    if (!text || this.isTyping) return;

    this.inputArea.value = '';
    this.inputArea.style.height = '48px';

    this.renderUserMessage(text);
    this.conversationHistory.push({ role: 'user', content: text });
    this.saveChatHistory();

    const lower = text.toLowerCase();
    if (lower.includes('test eq') || lower.includes('trắc nghiệm') || lower.includes('bói tính cách') || lower.includes('kiểm tra eq')) {
      setTimeout(() => {
        this.renderBotMessage(`<strong>🎮 ĐÃ SẴN SÀNG GIẢI MÃ TÍNH CÁCH SALES BĐS CỦA BẠN! 🐯✨</strong><br><br>
        Xem bạn là <strong>Cọp Chúa Sát Thủ Chốt Cọc</strong>, <strong>Phù Thủy Khách VIP</strong> hay <strong>Idol Content Triệu View</strong> nhé!<br><br>
        <button class="btn-ctrl-gold" style="padding: 10px 22px; font-size: 0.92rem; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); margin-top: 6px;" onclick="window.salesQuiz && window.salesQuiz.openQuiz()">
          🚀 BẮT ĐẦU TEST EQ NGAY (5 CÂU HỎI)
        </button>`);
      }, 300);
      return;
    }

    if (this.apiKey) {
      if (this.aiProvider === 'deepseek') {
        this.callDeepSeekAPI(text);
      } else {
        this.callGeminiAPI(text);
      }
    } else {
      this.generateLocalBotReply(text);
    }
  }

  renderUserMessage(text) {
    const timeStr = this.getCurrentTime();
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg user';
    msgEl.innerHTML = `
      <div class="msg-avatar">👤</div>
      <div class="msg-body">
        <div class="msg-bubble">${this.escapeHtml(text)}</div>
        <div class="msg-time">${timeStr}</div>
      </div>
    `;
    this.chatFeed.appendChild(msgEl);
    this.scrollToBottom();
    this.playAudio('sent');
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
          <div class="msg-time">Hổ Master Đại Chúng • ${timeStr}</div>
          <button class="msg-speak-btn" onclick="window.tigerChat && window.tigerChat.toggleSpeakMessage(this)" title="Nghe đọc câu trả lời này">
            <span class="speak-icon">🔊</span> <span class="speak-label">Đọc</span>
          </button>
        </div>
      </div>
    `;
    this.chatFeed.appendChild(msgEl);
    this.scrollToBottom();
    this.playAudio('receive');
  }

  showTypingIndicator() {
    this.isTyping = true;
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-msg bot';
    typingEl.id = 'chatTypingIndicator';
    typingEl.innerHTML = `
      <div class="msg-avatar">🐯</div>
      <div class="msg-body">
        <div class="msg-bubble">
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
    if (this.bubbleSpeech) {
      const providerLabel = this.aiProvider === 'deepseek' ? 'DeepSeek AI' : 'Google Gemini';
      this.bubbleSpeech.textContent = `${providerLabel} đang phân tích câu trả lời trọn vẹn... ✨💭`;
    }
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

  getSystemPrompt(userQuery = '') {
    let prompt = `Bạn là "Hổ AI Master Sales", linh vật đại diện thương hiệu Bất Động Sản Đại Chúng Properties (Đại Chúng).
TÍNH CÁCH: Hài hước, dí dỏm, tấu hài, thực chiến, thấu hiểu tâm lý nhân viên môi giới BĐS Việt Nam 2026, thường xưng là "Cọp" hoặc "Hổ Master", dùng các icon hổ 🐯 vui vẻ.
KIẾN THỨC CHUYÊN MÔN:
- Cực kỳ am hiểu toàn bộ các dự án Đại Chúng Properties phân phối (Blanca City Vũng Tàu - Sun Group, The Global City & Bán đảo Sola, The Rivus Elie Saab, Urban Green, The MarQ Quận 1, Gladia, Elyse Island, Grand Marina Saigon, v.v.).
- Nắm vững chi tiết từng chính sách bán hàng (CSBH), quà tặng, tiến độ thanh toán, ngân hàng hỗ trợ ân hạn nợ gốc và lãi suất 0%, bảng giá, layout mặt bằng, tiêu chuẩn bàn giao và điểm nhấn bán hàng (USP).
- Xử lý từ chối giá cao, pháp lý, kỹ năng chốt sales, tìm kiếm khách hàng thời 4.0.

QUY TẮC TRÌNH BÀY (BẮT BUỘC ĐỂ KHÔNG BỊ DÍNH CHỮ LUÔN TUỒN):
- Chia câu trả lời thành từng đoạn ngắn (2-3 câu mỗi đoạn), cách nhau bởi 1 dòng trống.
- Các bước thực hiện phải viết rõ ràng: Bước 1, Bước 2, Bước 3... và xuống dòng riêng biệt.
- Sử dụng các gạch đầu dòng "- " cho từng ý nhỏ.
- Sử dụng định dạng in đậm **từ khóa quan trọng** để nổi bật nội dung.
- Dùng ngôn ngữ tự nhiên, hài hước, súc tích, dễ nhìn trên màn hình điện thoại di động (Mobile).
`;

    if (this.personality === 'hai_huoc') {
      prompt += `\nPhong cách hiện tại: Cực kỳ hài hước, cà khịa nhẹ nhàng, dùng meme, tấu hài giải tỏa stress cho sales.`;
    } else if (this.personality === 'master_sales') {
      prompt += `\nPhong cách hiện tại: Sát thủ chốt cọc, phong thái đại gia, hướng dẫn đòn bẩy tâm lý và bí kíp chốt deal thực chiến.`;
    } else if (this.personality === 'cute_dongvien') {
      prompt += `\nPhong cách hiện tại: Ngọt ngào, thả tim, động viên tinh thần chiến binh sau những giờ săn khách mệt mỏi.`;
    } else if (this.personality === 'triet_ly') {
      prompt += `\nPhong cách hiện tại: Thiền sư giác ngộ bất động sản, thâm thúy, tĩnh tâm nhìn nhận chu kỳ kinh tế.`;
    }

    // Auto-inject matching project from DAICHUNG_PROJECT_DATABASE
    const qLower = (userQuery || '').toLowerCase();
    if (window.DAICHUNG_PROJECT_DATABASE) {
      let matchedProjects = [];
      for (const key in window.DAICHUNG_PROJECT_DATABASE) {
        const proj = window.DAICHUNG_PROJECT_DATABASE[key];
        if (proj.keywords && proj.keywords.some(k => qLower.includes(k))) {
          matchedProjects.push(proj);
        }
      }

      // If user asks general questions or specific project
      if (matchedProjects.length > 0) {
        prompt += `\n\n=== DỮ LIỆU DỰ ÁN CHI TIẾT TỪ HỆ THỐNG ĐẠI CHÚNG ===\n`;
        matchedProjects.forEach(p => {
          prompt += `\n--- DỰ ÁN: ${p.name} ---\n`;
          p.docs.slice(0, 6).forEach(d => {
            prompt += `[Tài liệu: ${d.title}]:\n${d.content.slice(0, 1800)}\n\n`;
          });
        });
      } else {
        // Provide overview of available projects
        prompt += `\n\nDANH MỤC DỰ ÁN ĐẠI CHÚNG PHÂN PHỐI: Blanca City Vũng Tàu (Sun Group), The Global City (Masterise), Bán đảo Sola, The Rivus Elie Saab, Urban Green (Kusto Home), The MarQ (Hongkong Land), Gladia, Elyse Island, Grand Marina Saigon. Bạn có đầy đủ dữ liệu khi sales hỏi.`;
      }
    }

    if (this.knowledgeDocs.length > 0) {
      prompt += `\n\nDỮ LIỆU DỰ ÁN BỔ SUNG KHÁCH NẠP:\n` + this.knowledgeDocs.map(d => `[${d.title}]: ${d.content}`).join('\n\n');
    }

    return prompt;
  }

  /* --------------------------------------------------------------------------
     DEEPSEEK API INTEGRATION (REAL-TIME FAST STREAMING)
     -------------------------------------------------------------------------- */
  async callDeepSeekAPI(userPrompt) {
    this.showTypingIndicator();

    const systemPrompt = this.getSystemPrompt(userPrompt);
    const recentHistory = this.conversationHistory.slice(-6);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content.replace(/<[^>]*>?/gm, '')
      }))
    ];

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.currentModel || 'deepseek-chat',
          messages: messages,
          max_tokens: 4096,
          temperature: 0.8,
          stream: true
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${response.status}: Lỗi kết nối DeepSeek`);
      }

      this.removeTypingIndicator();

      // Create streaming message bubble
      const timeStr = this.getCurrentTime();
      const msgEl = document.createElement('div');
      msgEl.className = 'chat-msg bot';
      msgEl.innerHTML = `
        <div class="msg-avatar">🐯</div>
        <div class="msg-body">
          <div class="msg-bubble" id="streamingBubble"></div>
          <div class="msg-footer-bar">
            <div class="msg-time">Hổ Master Đại Chúng • ${timeStr}</div>
            <button class="msg-speak-btn" onclick="window.tigerChat && window.tigerChat.toggleSpeakMessage(this)" title="Nghe đọc câu trả lời này">
              <span class="speak-icon">🔊</span> <span class="speak-label">Đọc</span>
            </button>
          </div>
        </div>
      `;
      this.chatFeed.appendChild(msgEl);
      const streamingBubble = msgEl.querySelector('#streamingBubble');
      streamingBubble.removeAttribute('id');

      this.playAudio('receive');
      if (this.bubbleSpeech) {
        this.bubbleSpeech.textContent = "Cọp đang gõ câu trả lời cực nhanh nè... ⚡🐯";
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (trimmed.startsWith('data: ')) {
            try {
              const json = JSON.parse(trimmed.slice(6));
              const delta = json.choices?.[0]?.delta?.content || '';
              if (delta) {
                fullText += delta;
                streamingBubble.innerHTML = this.formatMarkdownToHtml(fullText);
                this.scrollToBottom();
              }
            } catch (e) {}
          }
        }
      }

      // Check media match at the end
      let matchedMedia = this.findMatchingMedia(userPrompt.toLowerCase());
      if (matchedMedia) {
        const mediaHtml = `
          <div class="chat-media-card">
            <div class="chat-media-img-wrap" onclick="window.tigerChat.openLightbox('${matchedMedia.url}', '${matchedMedia.caption}')">
              <img src="${matchedMedia.url}" alt="${matchedMedia.alt}" class="chat-media-img" loading="lazy">
              <span class="img-zoom-hint">🔍 Nhấp để phóng to</span>
            </div>
            <div class="chat-media-caption">
              <span>🖼️ ${matchedMedia.title}</span>
              <small style="color: var(--text-muted);">Đại Chúng Media</small>
            </div>
          </div>
        `;
        streamingBubble.innerHTML += mediaHtml;
      }

      this.conversationHistory.push({ role: 'assistant', content: streamingBubble.innerHTML });
      this.saveChatHistory();

      if (this.bubbleSpeech) {
        this.bubbleSpeech.textContent = "DeepSeek AI đã trả lời xong thần tốc! 😎🐯⚡";
      }

    } catch (err) {
      this.removeTypingIndicator();
      console.error('DeepSeek API Error:', err);
      this.renderBotMessage(`<strong>⚠️ Thông báo từ DeepSeek AI:</strong><br>${err.message}<br><br>👉 Đang tự động chuyển sang phản hồi dự phòng của Hổ Master! 🐯`);
      this.generateLocalBotReply(userPrompt);
    }
  }

  /* --------------------------------------------------------------------------
     GOOGLE GEMINI AI INTEGRATION (WITH 8192 TOKEN CAPACITY & FALLBACK)
     -------------------------------------------------------------------------- */
  async callGeminiAPI(userPrompt) {
    this.showTypingIndicator();

    const systemInstruction = this.getSystemPrompt();
    const recentHistory = this.conversationHistory.slice(-8);
    const contents = recentHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content.replace(/<[^>]*>?/gm, '') }]
    }));

    const candidateModels = [
      this.currentModel || 'gemini-3.6-flash',
      'gemini-3.6-flash',
      'gemini-flash-latest',
      'gemini-3.7-flash',
      'gemini-2.5-pro'
    ];

    const uniqueModels = [...new Set(candidateModels)];
    let success = false;
    let botReplyText = '';

    for (const model of uniqueModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: contents,
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              temperature: 0.85,
              maxOutputTokens: 8192
            }
          })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          botReplyText = data.candidates[0].content.parts[0].text;
          success = true;
          this.currentModel = model;
          break;
        } else if (data.error) {
          console.warn(`Model ${model} error:`, data.error.message);
        }
      } catch (e) {
        console.warn(`Request failed for ${model}:`, e);
      }
    }

    this.removeTypingIndicator();

    if (success) {
      botReplyText = this.formatMarkdownToHtml(botReplyText);

      let matchedMedia = this.findMatchingMedia(userPrompt.toLowerCase());
      if (matchedMedia) {
        botReplyText += `
          <div class="chat-media-card">
            <div class="chat-media-img-wrap" onclick="window.tigerChat.openLightbox('${matchedMedia.url}', '${matchedMedia.caption}')">
              <img src="${matchedMedia.url}" alt="${matchedMedia.alt}" class="chat-media-img" loading="lazy">
              <span class="img-zoom-hint">🔍 Nhấp để phóng to</span>
            </div>
            <div class="chat-media-caption">
              <span>🖼️ ${matchedMedia.title}</span>
              <small style="color: var(--text-muted);">Đại Chúng Media</small>
            </div>
          </div>
        `;
      }

      this.renderBotMessage(botReplyText);
      this.conversationHistory.push({ role: 'model', content: botReplyText });
      this.saveChatHistory();

      if (this.bubbleSpeech) {
        this.bubbleSpeech.textContent = "Google Gemini đã trả lời xong trọn vẹn! 😎🐯";
      }
    } else {
      this.generateLocalBotReply(userPrompt);
    }
  }

  formatMarkdownToHtml(text) {
    if (!text) return '';
    let formatted = text;

    // Convert Windows line breaks
    formatted = formatted.replace(/\r\n/g, '\n');

    // Bold & Italic
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Headers
    formatted = formatted.replace(/^###\s+(.*$)/gim, '<h4 class="chat-h4">$1</h4>');
    formatted = formatted.replace(/^##\s+(.*$)/gim, '<h3 class="chat-h3">$1</h3>');
    formatted = formatted.replace(/^#\s+(.*$)/gim, '<h2 class="chat-h2">$1</h2>');

    // Horizontal Rule
    formatted = formatted.replace(/---+/g, '<hr class="chat-divider">');

    // Steps formatting (e.g. "Bước 1:", "Bước 2:")
    formatted = formatted.replace(/(Bước\s+\d+:?)/gi, '<strong class="chat-step-badge">🚀 $1</strong>');

    // Bullet items
    formatted = formatted.replace(/^\s*[-*•]\s+(.*$)/gim, '<div class="chat-bullet-row"><span class="chat-bullet-dot">🐾</span><span class="chat-bullet-text">$1</span></div>');

    // Numbered items
    formatted = formatted.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<div class="chat-bullet-row"><span class="chat-num-badge">$1</span><span class="chat-bullet-text">$2</span></div>');

    // Paragraph breaks & newlines
    formatted = formatted.replace(/\n\n+/g, '<div class="chat-p-break"></div>');
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
  }

  /* --------------------------------------------------------------------------
     VOICE INPUT (SPEECH-TO-TEXT TIẾNG VIỆT)
     -------------------------------------------------------------------------- */
  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (this.voiceInputBtn) {
        this.voiceInputBtn.addEventListener('click', () => {
          this.showToast('Trình duyệt này chưa hỗ trợ Speech API. Hãy dùng Chrome hoặc Safari mới nhất nhé! 🎙️');
        });
      }
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'vi-VN';
    this.recognition.continuous = false;
    this.recognition.interimResults = true;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.voiceInputBtn) this.voiceInputBtn.classList.add('listening');
      this.showToast('🎙️ Đang nghe bạn nói Tiếng Việt... Hãy nói câu hỏi nhé!');
      if (this.bubbleSpeech) {
        this.bubbleSpeech.textContent = "Cọp đang lắng nghe giọng nói của bạn nè... 🎙️🐯";
      }
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (text && this.inputArea) {
        this.inputArea.value = text;
        this.inputArea.style.height = 'auto';
        this.inputArea.style.height = (this.inputArea.scrollHeight) + 'px';
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (this.voiceInputBtn) this.voiceInputBtn.classList.remove('listening');
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        this.showToast('⚠️ Vui lòng cấp quyền Microphone cho trình duyệt để nói nhé!');
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.voiceInputBtn) this.voiceInputBtn.classList.remove('listening');
      if (this.inputArea && this.inputArea.value.trim().length > 0) {
        this.inputArea.focus();
        this.showToast('✅ Đã nhận giọng nói thành công! Bấm Gửi để hỏi Cọp nhé!');
      }
    };

    if (this.voiceInputBtn) {
      this.voiceInputBtn.addEventListener('click', () => {
        if (this.isListening) {
          this.recognition.stop();
        } else {
          try {
            this.recognition.start();
          } catch (e) {
            console.error('Recognition start error:', e);
          }
        }
      });
    }
  }

  findMatchingMedia(query) {
    if (window.APP_DATA && window.APP_DATA.mediaLibrary) {
      for (const item of window.APP_DATA.mediaLibrary) {
        if (item.keywords && item.keywords.some(k => query.includes(k))) {
          return item;
        }
      }
    }
    return null;
  }

  /* --------------------------------------------------------------------------
     TEXT-TO-SPEECH (ĐỌC CÂU TRẢ LỜI TIẾNG VIỆT)
     -------------------------------------------------------------------------- */
  toggleSpeakMessage(btn) {
    if (!('speechSynthesis' in window)) {
      this.showToast('Trình duyệt chưa hỗ trợ tính năng Đọc giọng nói (Text-to-Speech) 🔊');
      return;
    }

    if (btn.classList.contains('speaking')) {
      window.speechSynthesis.cancel();
      this.resetSpeakButtons();
      this.showToast('⏹️ Đã dừng đọc!');
      return;
    }

    window.speechSynthesis.cancel();
    this.resetSpeakButtons();

    const msgBody = btn.closest('.msg-body');
    const bubble = msgBody ? msgBody.querySelector('.msg-bubble') : null;
    if (!bubble) return;

    let text = bubble.innerText || bubble.textContent;
    // Clean emojis, icons, and artifacts for natural speech
    text = text
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/[*#_~`>•🐾🚀🔍🖼️🎮🔮🤣🥊📐🏙️🎯🏖️🌐]/g, '')
      .replace(/Hổ Master Đại Chúng.*/g, '')
      .replace(/Đại Chúng Media.*/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!text) {
      this.showToast('Không có nội dung văn bản để đọc!');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang === 'vi-VN' || v.lang.startsWith('vi') || v.lang.startsWith('VI'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    btn.classList.add('speaking');
    btn.innerHTML = `<span class="speak-icon">⏹️</span> <span class="speak-label">Dừng</span>`;

    utterance.onend = () => {
      this.resetSpeakButtons();
    };

    utterance.onerror = (e) => {
      console.warn('TTS error:', e);
      this.resetSpeakButtons();
    };

    window.speechSynthesis.speak(utterance);
    this.showToast('🔊 Cọp đang đọc câu trả lời cho bạn nghe...');
  }

  resetSpeakButtons() {
    document.querySelectorAll('.msg-speak-btn').forEach(b => {
      b.classList.remove('speaking');
      b.innerHTML = `<span class="speak-icon">🔊</span> <span class="speak-label">Đọc</span>`;
    });
  }

  /* --------------------------------------------------------------------------
     LOCAL SIMULATION FALLBACK
     -------------------------------------------------------------------------- */
  generateLocalBotReply(userPrompt) {
    this.showTypingIndicator();
    const query = userPrompt.toLowerCase().trim();
    const lastBotMsg = this.conversationHistory.length >= 2 ? this.conversationHistory[this.conversationHistory.length - 2]?.content?.toLowerCase() : '';

    let matchedDoc = null;
    for (const doc of this.knowledgeDocs) {
      const titleMatch = doc.title.toLowerCase().split(' ').some(w => w.length > 2 && query.includes(w));
      const contentMatch = doc.content.toLowerCase().split('\n').some(line => {
        const words = query.split(' ').filter(w => w.length > 2);
        return words.some(w => line.toLowerCase().includes(w));
      });

      if (titleMatch || contentMatch) {
        matchedDoc = doc;
        break;
      }
    }

    let matchedMedia = this.findMatchingMedia(query);

    setTimeout(() => {
      this.removeTypingIndicator();

      let reply = '';

      if (matchedDoc) {
        reply = this.synthesizeKnowledgeResponse(matchedDoc, userPrompt);
      } else if (matchedMedia) {
        reply = this.synthesizeMediaResponse(matchedMedia, userPrompt);
      } else {
        reply = this.generateSmartConversationalResponse(query, userPrompt, lastBotMsg);
      }

      this.renderBotMessage(reply);
      this.conversationHistory.push({ role: 'bot', content: reply });
      this.saveChatHistory();

      if (this.bubbleSpeech) {
        this.bubbleSpeech.textContent = "Trả lời xong rồi nè, xem có hợp lý chưa bro! 😎🐯";
      }
    }, 600 + Math.random() * 400);
  }

  generateSmartConversationalResponse(query, raw, lastBotMsg) {
    if (query.includes('cấm telesale') || query.includes('cấm gọi') || query.includes('cuộc gọi rác') || query.includes('nghị định 91') || (query.includes('cấm') && query.includes('telesale')) || (query.includes('mày ko biết') && lastBotMsg.includes('telesale'))) {
      return `<strong>Úi giời ơi Cọp biết chứ sao không! 🐯🤦‍♂️</strong><br><br>
      Giờ Bộ TT&TT áp Nghị định 91 phạt cuộc gọi rác dữ lắm, telesale dạo là "bay màu" liền!<br><br>
      👉 <strong>Thời này dân BĐS Đại Chúng mình chơi hệ Marketing 4.0 rồi sếp ơi:</strong><br>
      1. <strong>Xây kênh TikTok / Reels / Shorts:</strong> Quay video review thực tế căn hộ, bóc phốt quy hoạch... để khách tự inbox.<br>
      2. <strong>Chạy Facebook Ads / Google Ads:</strong> Đón khách có nhu cầu thực tự để lại thông tin.<br>
      3. <strong>Voice Brandname:</strong> Cuộc gọi hiện tên thương hiệu Đại Chúng Properties uy tín, không phải số rác.<br>
      4. <strong>Chăm sóc tệp khách cũ xin lời giới thiệu:</strong> Người giàu luôn có hội bạn cùng đầu tư.<br><br>
      <em>Bình tĩnh đổi bài kiếm khách nét hơn liền nha bro! 🔥🐯</em>`;
    }

    if (query.includes('ngu') || query.includes('lạc đề') || query.includes('nói 1 chuyện') || query.includes('trả lời chuyện khác')) {
      return `<strong>Huhu Cọp xin nhận lỗi và kiểm điểm sâu sắc! 🐯🥺</strong><br><br>
      Nãy Cọp lỡ hăng say quá nên nói trật nhịp của bạn. Giờ bạn muốn hỏi hay tâm sự cụ thể về việc gì nè, nói cho Cọp nghe lại đi Cọp trả lời nghiêm túc 100% không cà khịa nữa nè! 🐯📝`;
    }

    if (query.includes('chậm') || query.includes('đóng băng') || query.includes('ế') || query.includes('chán') || query.includes('không có khách')) {
      return `<strong>Đồng cảm sâu sắc với bro luôn! Thị trường đang thanh lọc mạnh mà! 🐯🤝</strong><br><br>
      Nhìn ở góc độ tích cực nè:<br>
      • <strong>Thị trường chậm là cơ hội:</strong> Lúc này sales thời vụ bỏ nghề gần hết, còn lại sân chơi cho những người kiên trì và chuyên nghiệp như tụi mình.<br>
      • <strong>Nhà đầu tư có tiền mặt đang rình:</strong> Khách có tiền họ chỉ đợi lúc này để săn hàng ngộp, hàng chiết khấu sâu từ CĐT.<br>
      • <strong>Giải pháp ngay lúc này:</strong> Tập trung vào các sản phẩm <em>ở thực</em> hoặc sản phẩm có <em>chính sách ân hạn lãi gốc 2-3 năm</em> của các CĐT uy tín.<br><br>
      <em>Bình tĩnh giữ lửa nha bro, qua cơn bĩ cực là tới hồi chốt cọc mỏi tay! 🐯🔥</em>`;
    }

    if (query.includes('cười') || query.includes('hài') || query.includes('joke')) {
      return `<strong>Truyện cười Sales BĐS độc quyền Đại Chúng:</strong><br><br>
      Khách hàng dẫn vợ đi xem dự án, hỏi Sales: <em>"Em ơi, khu này an ninh có đảm bảo không em?"</em><br>
      Sales tự tin đáp: <em>"Dạ anh yên tâm 100%! Hôm trước trộm đột nhập vào đây mà bảo vệ phát hiện dí theo xin số điện thoại tư vấn mua căn 2PN luôn đó anh!"</em> 😂<br>
      Khách: <em>"Ủa rồi trộm có mua không?"</em><br>
      Sales: <em>"Dạ có, cọc luôn 100 triệu tiền mặt rồi anh ạ!"</em> 🐯💰`;
    }

    return `<strong>🐯 Cọp hiểu ý bạn: "${this.escapeHtml(raw)}"</strong><br><br>
    Bạn có thể đặt bất kỳ câu hỏi nào về BĐS, đối đáp với khách hay tâm sự nghề nghiệp, Cọp sẽ phân tích và giải đáp ngay cho bạn nhé! 🐯🚀`;
  }

  synthesizeMediaResponse(media, prompt) {
    let text = `<strong>🐯 Cọp gửi bạn xem [${media.title}] đây nhé:</strong><br>${media.caption}`;
    let imageCardHtml = `
      <div class="chat-media-card">
        <div class="chat-media-img-wrap" onclick="window.tigerChat.openLightbox('${media.url}', '${media.caption}')">
          <img src="${media.url}" alt="${media.alt}" class="chat-media-img" loading="lazy">
          <span class="img-zoom-hint">🔍 Nhấp để phóng to</span>
        </div>
        <div class="chat-media-caption">
          <span>🖼️ ${media.title}</span>
          <small style="color: var(--text-muted);">Đại Chúng Media</small>
        </div>
      </div>
    `;
    return `${text}${imageCardHtml}`;
  }

  synthesizeKnowledgeResponse(doc, prompt) {
    const formattedContent = this.escapeHtml(doc.content).replace(/\n/g, '<br>');
    let fullResponse = `<strong>🐯 Dữ liệu từ [${doc.title}]:</strong><br><br>${formattedContent}`;
    if (doc.imageUrl) {
      fullResponse += `
        <div class="chat-media-card">
          <div class="chat-media-img-wrap" onclick="window.tigerChat.openLightbox('${doc.imageUrl}', '${this.escapeHtml(doc.title)}')">
            <img src="${doc.imageUrl}" alt="${this.escapeHtml(doc.title)}" class="chat-media-img" loading="lazy">
            <span class="img-zoom-hint">🔍 Nhấp để phóng to</span>
          </div>
          <div class="chat-media-caption">
            <span>🖼️ ${this.escapeHtml(doc.title)}</span>
            <small style="color: var(--text-muted);">Hình ảnh đính kèm</small>
          </div>
        </div>
      `;
    }
    return fullResponse;
  }

  /* --------------------------------------------------------------------------
     LIGHTBOX VIEWER
     -------------------------------------------------------------------------- */
  openLightbox(src, caption) {
    if (this.lightbox && this.lightboxImg) {
      this.lightboxImg.src = src;
      if (this.lightboxCaption) this.lightboxCaption.textContent = caption || '';
      this.lightbox.classList.add('active');
    }
  }

  closeLightbox() {
    if (this.lightbox) {
      this.lightbox.classList.remove('active');
    }
  }

  /* --------------------------------------------------------------------------
     KNOWLEDGE BASE MODAL & LOCALSTORAGE (WITH IMAGES)
     -------------------------------------------------------------------------- */
  openKnowledgeModal() {
    if (this.knowledgeModal) {
      this.knowledgeModal.classList.add('active');
      this.renderSavedDocs();
      if (this.docTitleInput) this.docTitleInput.focus();
    }
  }

  closeKnowledgeModal() {
    if (this.knowledgeModal) {
      this.knowledgeModal.classList.remove('active');
    }
  }

  loadKnowledge() {
    const data = localStorage.getItem('tiger_knowledge_docs');
    if (data) {
      try {
        let docs = JSON.parse(data) || [];
        // Purge any old fake sample data completely
        this.knowledgeDocs = docs.filter(d => !d.title.includes('Riverside') && !d.id.includes('sample'));
      } catch (e) {
        this.knowledgeDocs = [];
      }
    }

    // Default real official projects if empty
    if (!this.knowledgeDocs || this.knowledgeDocs.length === 0) {
      this.knowledgeDocs = [
        {
          id: 'doc_blanca_city',
          title: 'Blanca City Vũng Tàu (Sun Group)',
          content: 'Dự án Blanca City tại Đường 3/2 Phường 10, TP. Vũng Tàu do Sun Group phát triển. Quy mô gồm Shophouse thấp tầng Casa và Tháp căn hộ cao tầng Beacon Tower. CSBH: Hỗ trợ tài chính, quà tặng đêm nghỉ hệ sinh thái Sun World, gói khám sức khỏe BVMT Gold/Diamond.',
          imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString()
        },
        {
          id: 'doc_tgc_sola',
          title: 'The Global City & Bán Đảo Sola (Masterise Homes)',
          content: 'Đại đô thị phức hợp 117.4ha tại An Phú, TP. Thủ Đức do Masterise Homes phát triển và Foster + Partners thiết kế. Gồm Nhà phố Soho thương mại sầm uất, Bán đảo Sola, Kênh đào nhạc nước lớn nhất Đông Nam Á. CSBH: Ân hạn nợ gốc và hỗ trợ lãi suất hấp dẫn.',
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString()
        },
        {
          id: 'doc_urban_green',
          title: 'Urban Green Thủ Đức (Kusto Home)',
          content: 'Dự án căn hộ Resort Living tại Hiệp Bình Phước, TP. Thủ Đức do Kusto Home phát triển. Gồm 2 tháp Bliss và Aster với hơn 60 tiện ích chuẩn wellness, mật độ xây dựng chỉ 32.3%, pháp lý hoàn chỉnh.',
          imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString()
        }
      ];
      this.saveKnowledge();
    }
    this.updateKnowledgeBadge();
  }

  saveKnowledge() {
    localStorage.setItem('tiger_knowledge_docs', JSON.stringify(this.knowledgeDocs));
    this.updateKnowledgeBadge();
  }

  updateKnowledgeBadge() {
    const count = this.knowledgeDocs.length;
    if (this.knowledgeCountBadge) this.knowledgeCountBadge.textContent = count;
    if (this.savedDocsCount) this.savedDocsCount.textContent = count;
  }

  saveNewKnowledgeDoc() {
    const title = this.docTitleInput.value.trim();
    const content = this.docContentInput.value.trim();
    let imageUrl = this.currentBase64Image || (this.docImageUrlInput ? this.docImageUrlInput.value.trim() : '');

    if (!title || !content) {
      alert('Vui lòng nhập đầy đủ Tiêu đề và Nội dung dự án nhé! 🐯');
      return;
    }

    const newDoc = {
      id: 'doc_' + Date.now(),
      title: title,
      content: content,
      imageUrl: imageUrl,
      createdAt: new Date().toISOString()
    };

    this.knowledgeDocs.unshift(newDoc);
    this.saveKnowledge();

    this.docTitleInput.value = '';
    this.docContentInput.value = '';
    if (this.docImageUrlInput) this.docImageUrlInput.value = '';
    if (this.docImageFileInput) this.docImageFileInput.value = '';
    this.currentBase64Image = '';
    if (this.imageUploadPreview) this.imageUploadPreview.style.display = 'none';

    this.renderSavedDocs();
    this.showToast(`✅ Đã nạp thành công [${title}] vào não bộ của Hổ!`);
    this.playAudio('success');

    this.renderBotMessage(`Đã nạp xong tài liệu & hình ảnh cho <strong>${this.escapeHtml(title)}</strong> rồi nha! Giờ bạn hỏi bất kỳ điều gì là Cọp trả lời kèm hình ảnh liền tay! 🐯🚀`);
    this.closeKnowledgeModal();
  }

  deleteKnowledgeDoc(docId) {
    if (confirm('Bạn có muốn xóa tài liệu này khỏi não của Hổ không? 🐯')) {
      this.knowledgeDocs = this.knowledgeDocs.filter(d => d.id !== docId);
      this.saveKnowledge();
      this.renderSavedDocs();
      this.showToast('Đã xóa tài liệu!');
    }
  }

  renderSavedDocs() {
    if (!this.savedDocsList) return;
    if (this.knowledgeDocs.length === 0) {
      this.savedDocsList.innerHTML = `<div class="empty-docs-hint">Chưa có tài liệu nào. Hãy nạp tài liệu đầu tiên ở trên nhé!</div>`;
      return;
    }

    this.savedDocsList.innerHTML = this.knowledgeDocs.map(doc => `
      <div class="saved-doc-item">
        <div class="doc-item-info">
          <strong>📖 ${this.escapeHtml(doc.title)} ${doc.imageUrl ? '🖼️ (Có ảnh)' : ''}</strong>
          <span>${this.escapeHtml(doc.content.substring(0, 75))}...</span>
        </div>
        <button class="btn-del-doc" onclick="window.tigerChat.deleteKnowledgeDoc('${doc.id}')" title="Xóa tài liệu này">
          🗑️
        </button>
      </div>
    `).join('');
  }

  /* --------------------------------------------------------------------------
     CHAT HISTORY STORAGE
     -------------------------------------------------------------------------- */
  saveChatHistory() {
    const msgs = [];
    document.querySelectorAll('.chat-msg').forEach(el => {
      if (el.id === 'chatTypingIndicator') return;
      const isBot = el.classList.contains('bot');
      const bubble = el.querySelector('.msg-bubble');
      if (bubble) {
        msgs.push({
          type: isBot ? 'bot' : 'user',
          html: bubble.innerHTML
        });
      }
    });
    localStorage.setItem('tiger_chat_history', JSON.stringify(msgs.slice(-30)));
  }

  loadChatHistory() {
    const data = localStorage.getItem('tiger_chat_history');
    if (data) {
      try {
        const msgs = JSON.parse(data);
        if (msgs && msgs.length > 0) {
          msgs.forEach(m => {
            if (m.type === 'bot') {
              this.renderBotMessage(m.html);
            } else {
              this.renderUserMessage(m.html);
            }
          });
          return;
        }
      } catch (e) {}
    }

    this.renderBotMessage(`Hú le anh em <strong>ĐẠI CHÚNG PROPERTIES</strong>! 🐯 Ta là <strong>HỔ AI MASTER SALES</strong> lầy lội đây đâyyy!<br><br>
    Được trang bị trí tuệ từ anh em supersales của thế giới và Đại Chúng, ta sẵn sàng giải đáp mọi thắc mắc dự án, chiến lược săn khách, luyện đối đáp chốt sale hay chém gió giải tỏa stress cùng bạn! 😎 Khách có thắc mắc gì cứ gửi ta.<br><br>
    👉 Bạn có thể chuyển đổi linh hoạt giữa các tính cách và chế độ AI ở thanh menu bên trên nhé!<br>
    <em>Thông tin dự án thì ta làm trùm, chiến thuật chốt sales, bán hàng thì ta cũng bá đạo luôn! 🐯💰🔥</em>`);
  }

  /* --------------------------------------------------------------------------
     AUDIO SYNTHESIS
     -------------------------------------------------------------------------- */
  playAudio(type) {
    if (!this.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'sent') {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'receive') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'roar') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) {}
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
    }, 3200);
  }

  escapeHtml(str) {
    if (!str) return '';
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
}

document.addEventListener('DOMContentLoaded', () => {
  window.tigerChat = new TigerChatApp();
});
