/**
 * FUN SALES PERSONALITY & EQ ASSESSMENT ENGINE
 * Trắc nghiệm tính cách & đo chỉ số EQ hài hước cho Sales Bất Động Sản Đại Chúng
 */

class SalesPersonalityQuiz {
  constructor() {
    this.quizModal = document.getElementById('quizModal');
    this.modalBody = document.getElementById('quizModalBody');
    this.openBtn = document.getElementById('openQuizModalBtn');
    this.closeBtn = document.getElementById('closeQuizModalBtn');

    this.currentStep = 0;
    this.scores = {
      hunter: 0,    // Sát thủ chốt cọc
      vip_care: 0,  // Phù thủy khách VIP
      creator: 0,   // Idol Content
      negotiator: 0,// Thánh Đàm Phán
      warrior: 0    // Chiến Binh Bất Tử
    };

    this.questions = [
      {
        id: 1,
        scenario: "🎣 Khách Hàng Hẹn Đi Xem Dự Án",
        question: "Bạn hẹn khách 8h sáng đi xem dự án tại Vũng Tàu. Bạn có mặt lúc 7h45 nhưng đến 9h30 khách nhắn: 'Anh bận đột xuất đi câu cá rồi em ơi'. Bạn sẽ:",
        options: [
          {
            letter: "A",
            text: "Nhắn ngay: 'Dạ anh câu ở hồ nào em xách hợp đồng ra câu chung với anh luôn!'",
            type: "hunter",
            points: 40
          },
          {
            letter: "B",
            text: "Nhẹ nhàng gửi ảnh hoàng hôn dự án: 'Anh câu cá vui vẻ nhé, em giữ căn view biển đẹp nhất cho anh đến tối nay ạ!'",
            type: "vip_care",
            points: 40
          },
          {
            letter: "C",
            text: "Mở máy quay ngay clip TikTok: 'Nỗi khổ đi tour khách bùng kèo' kiếm 200k view.",
            type: "creator",
            points: 40
          },
          {
            letter: "D",
            text: "Điềm tĩnh ghé ăn bánh khọt Vũng Tàu, tranh thủ gọi chăm sóc 5 khách tiềm năng khác.",
            type: "warrior",
            points: 40
          }
        ]
      },
      {
        id: 2,
        scenario: "🥊 Xử Lý Khách Chê Đắt",
        question: "Khách xem xong căn hộ The Global City bảo: 'Dự án đẹp thật nhưng giá chát quá, để anh về bàn lại với vợ'. Bạn tung chiêu gì?",
        options: [
          {
            letter: "A",
            text: "'Anh ơi đàn ông bản lĩnh quyết luôn đi anh, đảm bảo chị nhà sẽ khen anh có tầm nhìn đón đầu hạ tầng!'",
            type: "hunter",
            points: 40
          },
          {
            letter: "B",
            text: "'Dạ em xin phép add Zalo chị nhà để gửi chị xem phối cảnh bếp và phòng tắm Master chuẩn resort nhé!'",
            type: "vip_care",
            points: 40
          },
          {
            letter: "C",
            text: "Bật ngay bảng tính Excel phân tích dòng tiền ân hạn gốc lãi 0%: 'Mỗi tháng anh bỏ ra chưa bằng tiền cafe nhậu nhẹt!'",
            type: "negotiator",
            points: 40
          },
          {
            letter: "D",
            text: "'Dạ anh bàn với chị sớm nhé, bảng hàng đợt 1 chỉ còn đúng 2 căn vị trí hoa hậu này thôi ạ!'",
            type: "warrior",
            points: 40
          }
        ]
      },
      {
        id: 3,
        scenario: "📱 Đối Phó Hater Trên Mạng Xã Hội",
        question: "Bạn vừa đăng bài bán shophouse lên mạng, 5 phút sau có người comment: 'Dự án này làm gì có giá đó, lừa đảo à?'. Bạn xử lý sao?",
        options: [
          {
            letter: "A",
            text: "Reply cực duyên: 'Cảm ơn bác đã kéo tương tác, inbox em gửi bác xem bảng giá gốc CĐT để mở mang tầm mắt nha!'",
            type: "hunter",
            points: 40
          },
          {
            letter: "B",
            text: "Quay ngay video review thực tế tại công trường bóc phốt tin đồn và chứng minh giá trị thực.",
            type: "creator",
            points: 40
          },
          {
            letter: "C",
            text: "Gửi link văn bản pháp lý 1/500 và giấy phép xây dựng lịch sự, chuẩn mực không đôi co.",
            type: "negotiator",
            points: 40
          },
          {
            letter: "D",
            text: "Thả tim nhẹ nhàng rồi tập trung gọi điện cho khách nét, không tốn thời gian với anh hùng bàn phím.",
            type: "warrior",
            points: 40
          }
        ]
      },
      {
        id: 4,
        scenario: "❄️ Tâm Thế Khi Thị Trường Chậm Lại",
        question: "Khi thị trường BĐS có dấu hiệu đi chậm và trầm lắng, hành động của bạn tại sàn là:",
        options: [
          {
            letter: "A",
            text: "Rà soát toàn bộ tệp khách cũ, mời đi cafe tâm sự, hỏi thăm danh mục đầu tư để xin lời giới thiệu.",
            type: "vip_care",
            points: 40
          },
          {
            letter: "B",
            text: "Đây là thời điểm vàng để săn hàng ngộp và lọc khách có tiền mặt thực sự, chốt deal không nghỉ!",
            type: "hunter",
            points: 40
          },
          {
            letter: "C",
            text: "Cày ngày cày đêm làm video ngắn, xây dựng thương hiệu cá nhân để đón trọn con sóng bùng nổ tiếp theo.",
            type: "creator",
            points: 40
          },
          {
            letter: "D",
            text: "Nâng cấp kiến thức tài chính, học sâu về chu kỳ kinh tế và chính sách vĩ mô để tư vấn đẳng cấp hơn.",
            type: "negotiator",
            points: 40
          }
        ]
      },
      {
        id: 5,
        scenario: "💰 Cầm Trong Tay Hoa Hồng Khủng",
        question: "Bạn vừa chốt thành công 1 căn biệt thự triệu đô và nhận cục hoa hồng to đùng, việc đầu tiên bạn làm là:",
        options: [
          {
            letter: "A",
            text: "Tự thưởng một món đồ hiệu nâng cấp profile và trích tiền tái đầu tư chạy Ads săn khách tiếp theo.",
            type: "hunter",
            points: 40
          },
          {
            letter: "B",
            text: "Mua quà sang xịn gửi tặng tri ân khách hàng và người đã kết nối thương vụ này.",
            type: "vip_care",
            points: 40
          },
          {
            letter: "C",
            text: "Khao anh em trong team một bữa linh đình rồi quay vlog 'Một ngày đi nhận hoa hồng của Sales Đại Chúng'.",
            type: "creator",
            points: 40
          },
          {
            letter: "D",
            text: "Đập luôn vào mua 1 suất đầu tư cùng khách hàng để vừa sinh lời vừa gia tăng tài sản vững bền.",
            type: "negotiator",
            points: 40
          }
        ]
      }
    ];

    this.profiles = {
      hunter: {
        title: "🐯 CỌP CHÚA SÁT THỦ CHỐT DEAL",
        eqScore: "EQ 200/200",
        badge: "👑 Đẳng Cấp Thần Tốc",
        color: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
        desc: "Bạn sở hữu khứu giác săn deal siêu nhạy bén! Khách hàng chỉ cần thở một nhịp là bạn biết họ ưng căn nào. Tự tin, quyết đoán, chốt cọc dứt khoát không để khách có cơ hội do dự.",
        advice: "Tuyệt chiêu: Giữ vững ngọn lửa nhiệt huyết, bạn chính là đầu tàu kéo doanh số của cả sàn Đại Chúng!"
      },
      vip_care: {
        title: "💎 PHÙ THỦY CHĂM SÓC KHÁCH VIP",
        eqScore: "EQ 195/200",
        badge: "✨ Nghệ Thuật Đắc Nhân Tâm",
        color: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
        desc: "Bạn là bậc thầy của sự tinh tế và thấu cảm! Khách hàng đến với bạn không chỉ vì mua nhà mà vì xem bạn như người nhà. Một khi khách đã mua qua bạn thì cả họ hàng, đối tác đều được giới thiệu mua theo.",
        advice: "Tuyệt chiêu: Tiếp tục khai thác tệp khách cũ và xin lời giới thiệu, bạn sẽ không bao giờ thiếu deal!"
      },
      creator: {
        title: "🎥 IDOL BĐS HỆ TRIỆU VIEW",
        eqScore: "EQ 188/200",
        badge: "🚀 Vua Marketing 4.0",
        color: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
        desc: "Thời thế cấm telesale rác sinh ra để bạn tỏa sáng! Khả năng kể chuyện, quay video review và tạo xu hướng của bạn khiến khách hàng tự động xếp hàng inbox xin tư vấn mà không cần chào mời.",
        advice: "Tuyệt chiêu: Đẩy mạnh các chuỗi video bóc phốt quy hoạch và phân tích view thực tế để bùng nổ khách nét!"
      },
      negotiator: {
        title: "🧘 THÁNH ĐÀM PHÁN TÂM BẤT BIẾN",
        eqScore: "EQ 192/200",
        badge: "📊 Bác Học Tài Chính",
        color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        desc: "Điềm tĩnh như thiền sư, bạn dùng số liệu, bài toán dòng tiền và sự am hiểu pháp lý để chinh phục những nhà đầu tư sành sỏi khó tính nhất. Khách muốn ép giá cỡ nào cũng bị bạn thuyết phục tâm phục khẩu phục.",
        advice: "Tuyệt chiêu: Hãy là quân sư tài chính đáng tin cậy cho các đại gia sành sỏi!"
      },
      warrior: {
        title: "🥊 CHIẾN BINH THÉP BẤT KHẢ CHIẾN BẠI",
        eqScore: "EQ 182/200",
        badge: "🔥 Năng Lượng Bất Tận",
        color: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
        desc: "Năng lượng của bạn là vô tận! Bị từ chối 99 lần thì bạn vẫn tràn trề năng lượng cho khách thứ 100. Tinh thần kỷ luật thép và sự kiên trì phi thường chính là bệ phóng đưa bạn lên top doanh số.",
        advice: "Tuyệt chiêu: Kiên định với mục tiêu, thành công rực rỡ chỉ là vấn đề thời gian!"
      }
    };

    this.init();
  }

  init() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.openQuiz());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeQuiz());
    }
  }

  openQuiz() {
    this.currentStep = 0;
    this.scores = { hunter: 0, vip_care: 0, creator: 0, negotiator: 0, warrior: 0 };
    if (this.quizModal) {
      this.quizModal.classList.add('active');
      this.renderIntro();
    }
  }

  closeQuiz() {
    if (this.quizModal) {
      this.quizModal.classList.remove('active');
    }
  }

  renderIntro() {
    this.modalBody.innerHTML = `
      <div style="text-align: center; padding: 20px 10px;">
        <div style="font-size: 3.5rem; margin-bottom: 12px; animation: bounce 1s infinite alternate;">🐯🎯</div>
        <h2 style="font-size: 1.35rem; color: #0f172a; font-weight: 800; margin-bottom: 8px;">
          BẠN LÀ HỆ CHIẾN BINH NÀO TRONG LÀNG CHỐT DEAL?
        </h2>
        <p style="color: #475569; font-size: 0.92rem; line-height: 1.6; max-width: 480px; margin: 0 auto 24px;">
          Trả lời 5 tình huống thực tế hài hước của nghề BĐS để Hổ AI giải mã tính cách, đo chỉ số EQ và cấp Danh Hiệu Sales độc quyền Đại Chúng!
        </p>
        <button class="btn-ctrl-gold" style="font-size: 1rem; padding: 12px 32px; margin: 0 auto; display: inline-flex;" onclick="window.salesQuiz.startQuiz()">
          🚀 BẮT ĐẦU BÓI TÍNH CÁCH NGAY
        </button>
      </div>
    `;
  }

  startQuiz() {
    this.currentStep = 0;
    this.renderQuestion(0);
  }

  renderQuestion(index) {
    if (index >= this.questions.length) {
      this.renderResults();
      return;
    }

    const q = this.questions[index];
    const progressPercent = ((index + 1) / this.questions.length) * 100;

    let optionsHtml = q.options.map(opt => `
      <button class="quiz-option-card" onclick="window.salesQuiz.selectOption('${opt.type}')">
        <span class="quiz-opt-letter">${opt.letter}</span>
        <span class="quiz-opt-text">${opt.text}</span>
      </button>
    `).join('');

    this.modalBody.innerHTML = `
      <div class="quiz-progress-bar-wrap">
        <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
      </div>
      <div class="quiz-step-indicator">
        <span>Tình huống ${index + 1}/${this.questions.length}: ${q.scenario}</span>
        <span>${Math.round(progressPercent)}%</span>
      </div>

      <h3 class="quiz-q-title">${q.question}</h3>

      <div class="quiz-options-list">
        ${optionsHtml}
      </div>
    `;
  }

  selectOption(type) {
    if (this.scores[type] !== undefined) {
      this.scores[type] += 1;
    }
    if (window.tigerChat) {
      window.tigerChat.playAudio('click');
    }
    this.currentStep++;
    this.renderQuestion(this.currentStep);
  }

  renderResults() {
    // Find dominant personality
    let maxType = 'hunter';
    let maxScore = -1;
    for (const key in this.scores) {
      if (this.scores[key] > maxScore) {
        maxScore = this.scores[key];
        maxType = key;
      }
    }

    const profile = this.profiles[maxType] || this.profiles.hunter;

    this.modalBody.innerHTML = `
      <div class="quiz-result-container">
        <div class="quiz-badge-pill" style="background: ${profile.color};">${profile.badge}</div>
        <h2 class="quiz-result-title">${profile.title}</h2>
        <div class="quiz-eq-tag">Chỉ số cảm xúc: <strong>${profile.eqScore}</strong> 🔥</div>

        <div class="quiz-result-card-box">
          <p class="quiz-result-desc">${profile.desc}</p>
          <div class="quiz-result-advice">
            <strong>💡 Lời Khuyên Từ Hổ Master:</strong><br>
            ${profile.advice}
          </div>
        </div>

        <div class="quiz-result-actions">
          <button class="btn-modal-cancel" onclick="window.salesQuiz.startQuiz()">🔄 Làm Lại Test</button>
          <button class="btn-modal-save" style="background: ${profile.color};" onclick="window.salesQuiz.shareResultToChat('${profile.title}', '${profile.eqScore}')">
            💬 Gửi Danh Hiệu Vào Khung Chat 🐯
          </button>
        </div>
      </div>
    `;

    if (window.tigerChat) {
      window.tigerChat.playAudio('success');
    }
  }

  shareResultToChat(title, eq) {
    this.closeQuiz();
    if (window.tigerChat) {
      const shareMsg = `🏆 <strong>KẾT QUẢ TEST EQ SALES BĐS CỦA TÔI:</strong><br>
      • Danh Hiệu: <strong>${title}</strong><br>
      • Chỉ Số Cảm Xúc: <strong>${eq}</strong><br><br>
      <em>Hổ Master nhận xét xem tính cách này tháng này chốt được mấy căn nào! 😎🐯</em>`;
      
      window.tigerChat.renderUserMessage("Tôi vừa hoàn thành bài test EQ Sales và đạt danh hiệu: " + title);
      window.tigerChat.callDeepSeekAPI("Tôi vừa hoàn thành trắc nghiệm tính cách Sales và đạt danh hiệu: " + title + ". Hãy chúc mừng và nhận xét hài hước theo phong cách Hổ Master Đại Chúng nhé!");
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.salesQuiz = new SalesPersonalityQuiz();
});
