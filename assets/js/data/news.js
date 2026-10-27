/* news.js (data) — article index for the news list, filtering, search and the
   "related articles" block. Each article is also a full static HTML file in
   tin-tuc/<slug>.html; this list only powers rendering/discovery.
   Ordered newest-first by date. */
window.UIE_NEWS = [
  {
    slug: 'mo-them-chuyen-gom-lcl-savannah',
    category: 'lane',
    date: '2026-08-28',
    readMin: 4,
    featured: true,
    vi: {
      title: 'U&I mở thêm chuyến gom hàng LCL đi Savannah mỗi tuần',
      excerpt: 'Từ tháng 9/2026, hàng LCL đi bờ Đông Hoa Kỳ được gom cố định vào thứ Tư tại kho Tân Bình, rút ngắn 4 ngày so với lịch cũ.'
    },
    en: {
      title: 'U&I adds a weekly LCL consolidation to Savannah',
      excerpt: 'From September 2026, LCL cargo to the US East Coast consolidates every Wednesday at our Tan Binh warehouse, cutting 4 days off the previous schedule.'
    }
  },
  {
    slug: 'kho-cfs-thu-11-kent-washington',
    category: 'warehouse',
    date: '2026-08-15',
    readMin: 3,
    featured: false,
    vi: {
      title: 'Kho CFS thứ 11 tại Kent, Washington đi vào hoạt động',
      excerpt: 'Kho 4.500 m² phục vụ khách hàng khu vực Tây Bắc Hoa Kỳ, kết nối trực tiếp cảng Seattle và Tacoma.'
    },
    en: {
      title: '11th CFS warehouse opens in Kent, Washington',
      excerpt: 'A 4,500 m² facility serving the US Northwest, connected directly to the ports of Seattle and Tacoma.'
    }
  },
  {
    slug: 'quy-dinh-ghi-nhan-hang-go-noi-that',
    category: 'regulation',
    date: '2026-08-02',
    readMin: 5,
    featured: false,
    vi: {
      title: 'Cập nhật quy định ghi nhãn hàng gỗ nội thất xuất Hoa Kỳ',
      excerpt: 'Hướng dẫn mới về chứng nhận Lacey Act và cách khai báo nguồn gốc gỗ để tránh bị CBP giữ hàng.'
    },
    en: {
      title: 'New labelling rules for wooden furniture into the USA',
      excerpt: 'Updated guidance on Lacey Act declarations and how to document timber origin to avoid CBP holds.'
    }
  },
  {
    slug: 'lich-chot-hang-cao-diem-q4-2026',
    category: 'lane',
    date: '2026-07-20',
    readMin: 4,
    featured: false,
    vi: {
      title: 'Lịch chốt hàng cao điểm Q4/2026 tuyến Việt Nam → Hoa Kỳ',
      excerpt: 'Các mốc cut-off hàng không và đường biển cho mùa cao điểm cuối năm — đặt chỗ sớm để tránh nghẽn tải và phụ phí mùa vụ.'
    },
    en: {
      title: 'Q4 2026 peak-season cut-off schedule, Vietnam → USA',
      excerpt: 'Air and ocean cut-off dates for the year-end peak — book early to avoid space crunch and seasonal surcharges.'
    }
  },
  {
    slug: 'huong-dan-dong-goi-hang-di-amazon-fba',
    category: 'guide',
    date: '2026-07-05',
    readMin: 6,
    featured: false,
    vi: {
      title: 'Hướng dẫn đóng gói & dán nhãn hàng gửi vào Amazon FBA',
      excerpt: 'Từ nhãn FNSKU, thùng carton đến giới hạn trọng lượng và ghi nhãn kiện — checklist để hàng không bị trung tâm hoàn tất đơn (FC) từ chối.'
    },
    en: {
      title: 'Packing & labelling guide for Amazon FBA inbound',
      excerpt: 'From FNSKU labels and cartons to weight limits and box marking — a checklist so fulfilment centres don’t reject your shipment.'
    }
  },
  {
    slug: 'phu-phi-nhien-lieu-thang-10-2026',
    category: 'market',
    date: '2026-06-18',
    readMin: 4,
    featured: false,
    vi: {
      title: 'Biến động phụ phí nhiên liệu tháng 10/2026, doanh nghiệp cần lưu ý gì',
      excerpt: 'Cập nhật mức BAF/FSC của các hãng bay và hãng tàu tuyến Hoa Kỳ, cùng cách tối ưu chi phí khi giá nhiên liệu tăng.'
    },
    en: {
      title: 'October 2026 fuel-surcharge changes: what shippers should note',
      excerpt: 'Updated BAF/FSC levels from airlines and carriers on the US lane, plus how to optimise cost as fuel prices rise.'
    }
  }
];

/* Category → Material Symbol icon for the generated cover graphic. */
window.UIE_NEWS_CAT_ICON = {
  lane: 'route', warehouse: 'warehouse', regulation: 'gavel', guide: 'menu_book', market: 'trending_up'
};
