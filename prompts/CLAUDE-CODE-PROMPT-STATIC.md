# Prompt cho Claude Code — Website tĩnh U&I Express (HTML / CSS / JS)

**Chuẩn bị trước khi chạy:** tạo thư mục trống, đặt vào đó:
- `UI-Express-Prototype.html` (bản prototype tải từ project này), dùng làm tham chiếu
- thư mục `logos/` và `brand/` (tải ở mục "Toàn bộ hình ảnh")

Sau đó copy toàn bộ phần giữa hai dấu `---` dán vào Claude Code.

---

Xây dựng **website tĩnh** (không framework, không build step) cho **U&I LOGISTIC**, thương hiệu **U&I Express**, là doanh nghiệp giao nhận quốc tế hơn 15 năm, chuyên tuyến Việt Nam ⇄ Hoa Kỳ.

**Tham chiếu bắt buộc:** file `UI-Express-Prototype.html` trong thư mục này là prototype đã được duyệt. Mở và đọc kỹ để lấy chính xác bố cục, khoảng cách, màu, nội dung chữ (VI + EN) và tương tác. Không tự ý thiết kế lại. Ảnh logo nằm sẵn trong `logos/` và `brand/`.

## 1. Cấu trúc thư mục

```
/
├── index.html                    Trang chủ
├── dich-vu/
│   ├── van-chuyen-hang-khong.html
│   ├── van-chuyen-duong-bien.html
│   ├── chuyen-phat-nhanh.html
│   ├── khai-bao-hai-quan.html
│   ├── trucking-hoa-ky.html
│   ├── kho-cfs-hoa-ky.html
│   └── epack-amazon-fba.html
├── assets/
│   ├── css/
│   │   ├── base.css              reset, biến màu, font, typography
│   │   ├── layout.css            container, grid, section, header, footer
│   │   ├── components.css        button, card, chip, badge, marquee, timeline
│   │   └── pages.css             style riêng trang chủ / trang dịch vụ
│   ├── js/
│   │   ├── main.js               khởi tạo chung, header sticky, menu mobile, smooth scroll
│   │   ├── i18n.js               chuyển VN/EN
│   │   ├── counter.js            đếm số khi vào viewport
│   │   ├── maps.js               bản đồ kho Mỹ + bản đồ thế giới (d3)
│   │   └── data/
│   │       ├── i18n-vi.js        từ điển tiếng Việt
│   │       ├── i18n-en.js        từ điển tiếng Anh
│   │       └── warehouses.js     11 kho + toạ độ
│   └── img/
│       ├── brand/                ui-express-logo.png, ui-express-logo-light.png
│       └── logos/                logo đối tác + khách hàng
├── favicon.ico
├── robots.txt
└── sitemap.xml
```

Chuyển `logos/` và `brand/` vào `assets/img/`.

## 2. Nguyên tắc kỹ thuật

- HTML5 semantic (`header`, `nav`, `main`, `section`, `footer`), mỗi section có `id` để menu cuộn tới.
- CSS thuần, dùng **CSS custom properties** + Grid/Flex + `clamp()`. Mobile-first, breakpoint chính **1060px** (dưới mức này header chuyển sang hamburger), phụ 768px và 480px. Không dùng Bootstrap/Tailwind.
- JS thuần ES6, nạp bằng `<script defer>`, không jQuery. Mỗi file một trách nhiệm như cấu trúc trên.
- Header và footer **viết lặp lại giống hệt nhau** trong từng file HTML (site tĩnh, tốt cho SEO, chạy được cả khi tắt JS). Giữ đồng bộ tuyệt đối.
- Chạy được bằng cách mở trực tiếp `index.html` hoặc bất kỳ static host nào (Netlify, GitHub Pages, cPanel). Dùng đường dẫn tương đối.
- Thư viện ngoài chỉ qua CDN: Google Fonts, Material Symbols Outlined (icon), d3 v7 + topojson-client + world-atlas (bản đồ).

## 3. Design tokens (`base.css`)

```css
:root {
  --navy: #1B3A6B;      /* tiêu đề, header, nền khối đậm */
  --blue: #2E6BB8;      /* liên kết, icon */
  --red: #C81E1E;       /* nút hành động chính */
  --red-hover: #A81717;
  --orange: #F5820D;    /* số liệu, điểm nhấn, đường tuyến */
  --purple: #5B2A86;    /* chỉ dùng trong gradient */
  --ink: #2D3748;       /* chữ nội dung */
  --muted: #5A6B84;
  --surface: #F4F7FB;
  --line: #E5EBF4;
  --dark: #0E1F3D;      /* footer */
  --font-head: 'Montserrat', sans-serif;      /* 700/800, letter-spacing -0.02em */
  --font-body: 'Be Vietnam Pro', sans-serif;  /* 400/500/600 */
  --radius-btn: 8px; --radius-card: 14px;
  --container: 1280px;
}
```

- Hover card: `translateY(-4px)` + `box-shadow: 0 18px 38px rgba(27,58,107,.13)`.
- Nền các section luân phiên trắng ↔ `--surface` ↔ navy/tối, không để hai khối cùng màu nằm liền nhau.
- Chỉ dùng gradient ở: hero, khối số liệu, dải CTA, banner trang dịch vụ.

## 4. Trang chủ (`index.html`), theo thứ tự

1. **Header sticky** (nền trắng mờ + `backdrop-filter: blur`): logo `ui-express-logo.png` (bấm về trang chủ) · menu: Trang chủ, Về chúng tôi, Dịch vụ, Mạng lưới kho, Tin tức, Liên hệ (cuộn mượt tới section) · nút VN/EN · nút viền hotline **0982.17.6789** (`tel:0982176789`) · nút đỏ **"Liên hệ tư vấn"** (cuộn tới footer). Mobile: logo + nút VN/EN + nút gọi dạng icon 40×40 + hamburger mở drawer menu.
2. **Hero**: nền gradient `#0B1F3D → #16355F → #3A2668` + lớp lưới chấm (`radial-gradient` 24px) + SVG cung tuyến **SGN → USA** nét đứt màu cam chạy động (`stroke-dashoffset`). Cột trái: badge "HƠN 15 NĂM GIAO NHẬN QUỐC TẾ", H1, phụ đề, 2 nút ("Liên hệ tư vấn" đỏ, "Xem dịch vụ" viền trắng), 3 điểm tin cậy có icon. Cột phải: **bảng lịch trình kiểu bảng giờ khởi hành**, nền tối mờ, header "LỊCH TRÌNH TIÊU BIỂU" + chấm xanh nhấp nháy "ĐANG KHAI THÁC", 5 dòng:
   - SGN → LAX · Hàng không · 3–5 ngày
   - SGN → ORD · Hàng không · 4–6 ngày
   - SGN → LAX · Đường biển · 22–26 ngày
   - SGN → SAV · Đường biển · 26–30 ngày
   - SGN → USA · Chuyển phát · 2–5 ngày

   Chip phương thức phân màu: Hàng không xanh, Đường biển trắng mờ, Chuyển phát đỏ. Dưới 1060px hai cột xếp chồng.
3. **Dải đối tác**: băng logo chạy vô tận (CSS `@keyframes`, danh sách nhân đôi, dừng khi hover), mỗi logo trong thẻ cao 88px, rộng tối thiểu 184px, nền `#FBFCFE`, bo 12px; hai đầu mờ dần bằng `mask-image`. Nhãn "ĐỐI TÁC HÃNG BAY, HÃNG TÀU & CHUYỂN PHÁT" có gạch cam bên trái.
4. **Khối số liệu** (id `about`, gradient navy → tím, số màu cam, đếm lên khi vào viewport bằng `IntersectionObserver`): 15+ Năm kinh nghiệm · 6 Chi nhánh · 150 Nhân viên · 11 Kho tại Hoa Kỳ · 200+ Quốc gia.
5. **Lưới 7 dịch vụ** (id `services`): card trắng, icon trong ô `#EDF3FB`, tiêu đề, mô tả, link đỏ "Xem chi tiết →" dẫn tới trang `dich-vu/*.html`. Ô thứ 8 viền nét đứt "Cần giải pháp riêng cho lô hàng của bạn?" → cuộn tới liên hệ.
6. **Quy trình Door-to-Door 8 bước**: dạng **timeline dọc có đường nối**, desktop chia 2 cột (bước 1–4 | 5–8), mobile 1 cột. Mỗi bước: node icon vuông bo góc nền navy (bước cuối nền đỏ), số thứ tự màu cam, nhãn giai đoạn xám bên phải (TẠI VIỆT NAM / CHỨNG TỪ / TẠI KHO U&I / BÀN GIAO HÃNG / ĐẾN HOA KỲ), tiêu đề, mô tả.
7. **Mạng lưới kho tại Mỹ** (id `network`): trái là bản đồ `d3.geoAlbersUsa` với 11 ghim đỏ nhấp nháy + nhãn thành phố; phải là danh sách 11 địa chỉ kho cuộn được.
8. **Khách hàng tiêu biểu**: tiêu đề + câu dẫn căn giữa, lưới **7 cột × 2 hàng đều nhau** (tablet 4 cột, mobile 2 cột) chứa 14 logo **giữ nguyên màu gốc**, thẻ cao 116px bo 12px, hover nâng nhẹ.
9. **Mạng lưới toàn cầu**: nền `#0F2748`, badge "THÀNH VIÊN HIỆP HỘI WCA", 3 chỉ số (200+ · 2.400+ · 48), bản đồ `d3.geoNaturalEarth1` với các đường bay nét đứt màu cam từ TP.HCM tới Los Angeles, Savannah, New Jersey, Houston, Frankfurt, Thượng Hải, Singapore, Dubai, Sydney.
10. **Tin tức** (id `news`): 3 card (tag, ngày, tiêu đề, mô tả, "Đọc tiếp").
11. **Dải CTA** gradient đỏ → tím: "Cần tư vấn phương án vận chuyển? Phản hồi trong 24 giờ." + nút trắng "Liên hệ tư vấn" + nút hotline.
12. **Footer** (id `contact`, nền `#0E1F3D`), 4 cột:
    - Logo `ui-express-logo-light.png` + mô tả ngắn + 4 icon mạng xã hội (hover nền cam)
    - **Trụ sở Việt Nam**: Tân Bình, TP. HCM; Thủ Dầu Một, Bình Dương
    - **Trụ sở Hoa Kỳ**: Carson, California; Savannah, Georgia
    - **Liên hệ nhanh**: **Mr. Khoi**, hotline **0982.17.6789**, email **chuyenphatnhanh.ui@gmail.com** + menu nhanh

    Dòng bản quyền © 2026 U&I LOGISTIC.

## 5. Trang chi tiết dịch vụ (7 file `dich-vu/*.html`)

Dùng chung một bố cục, **nội dung mỗi trang khác nhau** (lấy từ prototype):
- Banner gradient + lưới chấm + cung tuyến nhỏ, breadcrumb (Trang chủ / Dịch vụ / tên dịch vụ), H1, một câu dẫn ngắn riêng.
- Hai cột: trái là "Về dịch vụ" (2 đoạn) + 4 ô thông số + hàng pill chuyển nhanh sang 6 dịch vụ còn lại (pill trang hiện tại nền navy); phải là card checklist 6 lợi ích (icon check xanh `#1E9E5A`) + nút đỏ "Liên hệ tư vấn".
- Dưới: sơ đồ quy trình 5 bước dạng card đánh số.
- Header và footer y hệt trang chủ; các link menu trỏ về `../index.html#section`.

## 6. Song ngữ VN/EN (`i18n.js`)

- Mọi chuỗi hiển thị gắn `data-i18n="key"` (hoặc `data-i18n-attr="placeholder:key"` cho thuộc tính). Từ điển nằm trong `data/i18n-vi.js` và `data/i18n-en.js`.
- Nút VN/EN đổi `document.documentElement.lang`, thay nội dung theo key, lưu lựa chọn vào `localStorage` và áp dụng lại khi tải trang.
- Mặc định tiếng Việt, và HTML gốc viết sẵn tiếng Việt để trang vẫn đầy đủ khi tắt JS.
- Dịch đầy đủ cả trang chủ, 7 trang dịch vụ, tin tức, footer.

## 7. Bản đồ (`maps.js`)

- Nạp dữ liệu `world-atlas@2/countries-110m.json`. **Không vẽ tay đường bờ biển.**
- SVG dùng `viewBox` + `width:100%; height:auto` (không đặt thuộc tính width/height cố định), vẽ lại qua `ResizeObserver` (debounce 60ms), để không bao giờ tràn ngang trên mobile.
- Nếu tải dữ liệu thất bại thì ẩn khung bản đồ, giữ nguyên danh sách kho.

## 8. Chất lượng

- Không Lorem Ipsum, không khối trống, không TODO. Copy lấy từ prototype.
- Không tràn ngang ở 360 / 390 / 768 / 1024 / 1440px.
- Hover cho mọi nút, link menu, card, logo; `:focus-visible` rõ ràng; vùng bấm tối thiểu 44px trên mobile.
- Mọi `<img>` có `alt`, `width`, `height`, `loading="lazy"` (trừ logo header).
- Mỗi trang có `<title>`, `meta description`, Open Graph riêng; `index.html` có JSON-LD `Organization` (tên, logo, hotline, email, 2 địa chỉ).
- `prefers-reduced-motion`: tắt marquee, đếm số, đường tuyến chạy động.
- Validate HTML (W3C) không lỗi; console không lỗi.

## 9. Thứ tự làm

1. Dựng cấu trúc thư mục + `base.css` + `layout.css`
2. Header + footer hoàn chỉnh (desktop + mobile drawer)
3. Trang chủ theo đúng 12 mục ở phần 4
4. `i18n.js` + 2 từ điển
5. `maps.js` + `counter.js`
6. 7 trang dịch vụ
7. Rà responsive, accessibility, SEO; tạo `sitemap.xml`, `robots.txt`

Xong thì liệt kê các file đã tạo và những chỗ cần tôi cung cấp nội dung/ảnh thật (địa chỉ kho chính xác, link mạng xã hội, bài tin tức).

---
