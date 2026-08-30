/**
 * REAL ESTATE & BRAND KNOWLEDGE DATA
 * Chứa thông tin thương hiệu Đại Chúng Properties, kho hình ảnh dự án từ folder data/
 */

const APP_DATA = {
  brand: {
    name: "ĐẠI CHÚNG PROPERTIES",
    shortName: "ĐẠI CHÚNG",
    slogan: "Kết nối thành công — Kiến tạo di sản",
    positioning: "Sang trọng kín đáo (Quiet Luxury) • Phân khúc Trung - Cao cấp & Hạng sang",
    logoUrl: "data/logo/LOGO_Logo-Dai-Chung-Properties.png",
    logoWhiteUrl: "data/logo/LOGO_Logo-Dai-Chung-Property-Chu-Trang.png"
  },

  // Kho hình ảnh từ folder data/ và thư viện trực tuyến
  mediaLibrary: [
    {
      id: "img_logo_dc",
      title: "Logo Đại Chúng Properties Chính Thức",
      keywords: ["logo", "logo đại chúng", "thương hiệu", "nhận diện", "đại chúng properties"],
      url: "data/logo/LOGO_Logo-Dai-Chung-Properties.png",
      caption: "Logo chính thức Đại Chúng Properties - Kiến tạo giá trị bất động sản",
      alt: "Logo Đại Chúng Properties"
    },
    {
      id: "img_phoi_canh",
      title: "Phối Cảnh Dự Án Cao Cấp",
      keywords: ["phối cảnh", "hình ảnh dự án", "toàn cảnh", "view sông", "ngoại cảnh"],
      url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&auto=format&fit=crop&q=80",
      caption: "Phối cảnh tổng thể khu phức hợp cao cấp ven sông xanh mát",
      alt: "Phối cảnh dự án ven sông"
    },
    {
      id: "img_mat_bang",
      title: "Sơ Đồ Mặt Bằng & Layout Căn Hộ",
      keywords: ["mặt bằng", "layout", "sơ đồ", "bản vẽ", "thiết kế căn hộ", "1pn", "2pn", "3pn"],
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80",
      caption: "Layout mặt bằng thiết kế tối ưu ánh sáng tự nhiên và view panorama",
      alt: "Mặt bằng căn hộ"
    },
    {
      id: "img_tien_ich",
      title: "Hệ Thống Tiện Ích 5 Sao (Hồ Bơi & Du Thuyền)",
      keywords: ["tiện ích", "hồ bơi", "du thuyền", "công viên", "sky club"],
      url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&auto=format&fit=crop&q=80",
      caption: "Hồ bơi vô cực điện phân muối và tiện ích nghỉ dưỡng tại gia",
      alt: "Tiện ích hồ bơi cao cấp"
    },
    {
      id: "img_bang_gia",
      title: "Bảng Giá & Tiến Độ Thanh Toán Mẫu",
      keywords: ["bảng giá", "giá bán", "tiến độ", "thanh toán", "chiết khấu", "chính sách"],
      url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80",
      caption: "Bảng phân tích dòng tiền và chính sách hỗ trợ lãi suất 0%",
      alt: "Bảng giá và dòng tiền"
    },
    {
      id: "img_chot_coc",
      title: "Meme Hổ Chốt Cọc Thành Công",
      keywords: ["chốt cọc", "ăn mừng", "thành công", "chốt deal", "hổ thần tài", "hoa hồng"],
      url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=900&auto=format&fit=crop&q=80",
      caption: "Hổ Thần Tài chúc mừng chiến binh chốt cọc triệu đô! 🐯💰",
      alt: "Ăn mừng chốt deal"
    }
  ]
};

// Expose globally
if (typeof window !== 'undefined') {
  window.APP_DATA = APP_DATA;
}
