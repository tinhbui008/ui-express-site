# Prompt cho Claude Code — Website U&I Express (Next.js)

Copy toàn bộ phần trong khung dưới và dán vào Claude Code (chạy trong thư mục dự án trống).

---

Xây dựng website marketing cho công ty giao nhận vận tải quốc tế **U&I LOGISTIC** (thương hiệu **U&I Express**), chuyên tuyến Việt Nam ⇄ Hoa Kỳ, hơn 15 năm kinh nghiệm.

## Tech stack (bắt buộc)

- **Next.js 15** (App Router) + **TypeScript**, `src/` directory
- **Tailwind CSS v4** (cấu hình token qua `@theme` trong `globals.css`, không dùng `tailwind.config.js` cho màu)
- **next/font/google** cho Montserrat + Be Vietnam Pro (subset `latin`, `vietnamese`)
- **next-intl** cho song ngữ VI/EN với routing `/[locale]/...`, mặc định `vi`
- **Framer Motion** cho animation vào-màn-hình và số liệu đếm lên
- **d3-geo + topojson-client + world-atlas** cho 2 bản đồ (KHÔNG vẽ tay đường bờ biển)
- **lucide-react** cho icon
- Không dùng UI library nặng (shadcn tùy chọn nếu cần form primitives)

## Design tokens (giữ nguyên tuyệt đối)

```css
--color-navy: #1B3A6B;    /* header, tiêu đề, footer */
--color-blue: #2E6BB8;    /* liên kết, icon, điểm nhấn */
--color-red: #C81E1E;     /* CTA: Báo giá, Tra cứu */
--color-orange: #F5820D;  /* điểm nhấn phụ, số liệu, nét logo */
--color-purple: #5B2A86;  /* dùng tiết chế cho gradient */
--color-ink: #2D3748;     /* chữ nội dung */
--color-surface: #F4F7FB; /* nền xám rất nhạt */
--color-line: #E5EBF4;    /* viền */
```

- Font tiêu đề: **Montserrat** 700/800, `letter-spacing: -0.02em`
- Font nội dung: **Be Vietnam Pro** 400/500/600
- Bo góc: 8px (nút), 12–14px (card), 999px (pill)
- Hover card: `translateY(-4px)` + `box-shadow: 0 18px 38px rgba(27,58,107,.13)`
- Section padding dọc: `clamp(48px, 6vw, 96px)`; container `max-width: 1280px`
- Gradient chỉ dùng 2 chỗ: khối số liệu (navy → tím than) và dải CTA (đỏ → tím than)
- Tương phản text tối thiểu 4.5:1; chữ trên ảnh phải có overlay tối

## Cấu trúc trang

```
/[locale]                        Trang chủ
/[locale]/dich-vu/[slug]         Chi tiết dịch vụ (7 slug)
/[locale]/tra-cuu-van-don        Tra cứu vận đơn
/[locale]/yeu-cau-bao-gia        Form báo giá nhiều bước
```

7 slug dịch vụ: `van-chuyen-hang-khong`, `van-chuyen-duong-bien`, `chuyen-phat-nhanh`, `khai-bao-hai-quan`, `trucking-hoa-ky`, `kho-cfs-hoa-ky`, `epack-amazon-fba`

### Header (sticky, `backdrop-blur`)

Logo trái (file PNG trong `/public/brand/`, click về trang chủ) · menu: Trang chủ, Về chúng tôi, Dịch vụ, Mạng lưới kho, Tin tức, Liên hệ (anchor scroll tới section tương ứng ở trang chủ) · toggle VN/EN · nút viền "Tra cứu vận đơn" · nút đỏ "Yêu cầu báo giá". Dưới 1060px chuyển sang hamburger + drawer, hai CTA vẫn hiển thị dạng gọn.

### Trang chủ — thứ tự section

1. **Hero**: ảnh nền máy bay cargo/tàu container + overlay navy→tím; badge "HƠN 15 NĂM…"; H1 "Giao nhận quốc tế — Chuyên tuyến Việt Nam ⇄ Hoa Kỳ"; phụ đề door-to-door; ô nhập mã vận đơn + nút đỏ "Tra cứu" (submit → điều hướng `/tra-cuu-van-don?code=...`); 3 điểm tin cậy có icon.
2. **Dải đối tác**: băng chạy vô tận (CSS keyframes, nhân đôi danh sách), mỗi logo trong thẻ nền `#FBFCFE` cao 88px bo 12px để logo lệch cỡ vẫn thẳng hàng; hai đầu dải `mask-image: linear-gradient` mờ dần. Logo: DHL, FedEx, UPS, Vietnam Airlines, Korean Air, EVA Air, Cathay Cargo, China Airlines, Maersk, ONE, Evergreen, CMA CGM.
3. **Khối số liệu** (nền gradient navy→tím, số màu cam, đếm lên khi vào viewport): 15+ Năm kinh nghiệm · 6 Chi nhánh · 150 Nhân viên · 11 Kho tại Hoa Kỳ · 200+ Quốc gia.
4. **Lưới 7 dịch vụ**: card nền trắng, icon trong ô vuông `#EDF3FB`, tiêu đề, mô tả 2 dòng, link "Xem chi tiết" màu đỏ → trang chi tiết. Ô thứ 8 là card viền nét đứt "Cần giải pháp riêng?" → trang báo giá.
5. **Quy trình Door-to-Door 8 bước**: card đánh số 01–08 có mũi tên `east` màu cam giữa các bước (bước cuối dùng icon `check_circle`).
6. **Mạng lưới kho tại Hoa Kỳ**: 2 cột — bản đồ nước Mỹ `geoAlbersUsa` với 11 ghim đỏ có hiệu ứng pulse + nhãn thành phố; cột phải là danh sách địa chỉ kho cuộn được. Điểm ghim: Los Angeles, Carson, Seattle/Kent, Houston, Dallas, Chicago, Savannah, Atlanta, Charlotte, New Jersey, Miami.
7. **Khách hàng tiêu biểu**: nền `#F4F7FB`, tiêu đề + câu dẫn ngắn ở giữa, lưới **7 cột × 2 hàng đều nhau** (mobile 2 cột) chứa 14 logo màu gốc trong thẻ trắng cao 116px, hover nâng nhẹ.
8. **Mạng lưới toàn cầu**: nền `#0F2748`, badge "THÀNH VIÊN HIỆP HỘI WCA", 3 chỉ số (200+ quốc gia · 2.400+ đại lý WCA · 48 bang), bên cạnh là bản đồ thế giới `geoNaturalEarth1` với đường bay từ TP.HCM tới các hub (Los Angeles, Savannah, New Jersey, Houston, Frankfurt, Thượng Hải, Singapore, Dubai, Sydney), đường nét đứt màu cam chạy động bằng `stroke-dashoffset`.
9. **Tin tức**: 3 card (tag, ngày, tiêu đề, mô tả, "Đọc tiếp").
10. **Dải CTA** gradient đỏ→tím: "Cần báo giá vận chuyển? Nhận tư vấn trong 24 giờ" + nút trắng "Yêu cầu báo giá" + hotline.
11. **Footer** nền `#0E1F3D`, 4 cột: logo (bản chữ trắng) + giới thiệu ngắn + icon social; Trụ sở Việt Nam (Tân Bình – TP.HCM, Thủ Dầu Một – Bình Dương); Trụ sở Hoa Kỳ (Carson – CA, Savannah – GA); Liên hệ nhanh (Mr. Henry Phạm — Chủ tịch HĐQT, hotline **08.1368.3468**, email **Henry.Pham@UILogistic.vn**) + menu nhanh.

### Trang chi tiết dịch vụ

Banner ảnh + overlay, breadcrumb (Trang chủ / Dịch vụ / tên dịch vụ), H1 + đoạn dẫn; 2 cột: mô tả 2 đoạn + 4 ô thông số (thời gian vận chuyển, trọng lượng, phạm vi, nhận hàng) + hàng pill chuyển nhanh sang 6 dịch vụ còn lại; cột phải là card checklist 6 lợi ích (icon check xanh) + nút đỏ "Yêu cầu báo giá". Dưới cùng: sơ đồ quy trình 5 bước dạng card đánh số. Nội dung mỗi slug phải KHÁC nhau — viết nội dung thật cho cả 7 dịch vụ, không dùng chung một đoạn.

### Trang tra cứu vận đơn

Ô nhập mã lớn ở giữa + nút "Tra cứu". Kết quả mẫu: header navy hiển thị mã + dịch vụ + tuyến (SGN → LAX) + số kiện/kg; dải xanh "Đã giao thành công — có POD"; dòng thời gian 4 mốc từ mới nhất: Đã giao (Los Angeles) → Đến hải quan Hoa Kỳ (LAX Gateway) → Đang vận chuyển (chuyến bay VN8622) → Đã lấy hàng (kho U&I Tân Bình), mỗi mốc có icon trong vòng tròn, đường nối dọc, thời gian, địa điểm, ghi chú. Dưới cùng 3 card hỗ trợ. Dữ liệu mock trong `src/data/`, mọi mã nhập vào đều trả về lô hàng mẫu này.

### Trang yêu cầu báo giá

Wizard 4 bước với thanh tiến trình gradient đỏ→cam và 4 badge bước (đang làm = đỏ, đã xong = xanh có dấu check):
1. Chọn dịch vụ (7 card chọn được, card đang chọn viền xanh + nền `#EDF3FB`)
2. Tuyến đi/đến (điểm đi, điểm đến, điều kiện giao hàng Door-to-Door/Door-to-Port/Port-to-Door, ngày hàng sẵn sàng)
3. Thông tin hàng (số kiện, trọng lượng thực, dài/rộng/cao, loại hàng) + callout cam giải thích trọng lượng quy đổi `D×R×C ÷ 5000`
4. Thông tin liên hệ (tên, công ty, điện thoại/Zalo, email, ghi chú) + callout xanh cam kết phản hồi trong 24 giờ

Validate bằng `react-hook-form` + `zod`, state giữ khi qua lại giữa các bước, bước cuối submit vào Server Action ghi log (chưa cần gửi mail thật).

## Yêu cầu chung

- **Responsive**: mobile-first, kiểm tra ở 360/390/768/1024/1440px. Không tràn ngang ở bất kỳ breakpoint nào — bản đồ dùng `viewBox` + `width:100%` (không đặt attribute width cứng) và vẽ lại theo `ResizeObserver`.
- **i18n**: mọi chuỗi nằm trong `messages/vi.json` + `messages/en.json`, không hardcode text trong component. Dịch đầy đủ cả hai ngôn ngữ, kể cả nội dung 7 trang dịch vụ và tin tức.
- **Nội dung thật**: viết copy tiếng Việt chuyên nghiệp cho toàn bộ site — tuyệt đối không Lorem Ipsum, không section trống, không "TODO".
- **Ảnh**: dùng `next/image` với ảnh placeholder trong `/public/images/` (kèm `README.md` liệt kê chỗ cần thay ảnh thật: hero, banner 7 dịch vụ, ảnh tin tức). Logo đặt trong `/public/brand/` và `/public/logos/`.
- **Accessibility**: HTML semantic, `alt` cho mọi ảnh, focus-visible rõ ràng, hit target ≥ 44px trên mobile, `aria-label` cho nút icon.
- **SEO**: `generateMetadata` cho từng trang, Open Graph, `sitemap.ts`, `robots.ts`, JSON-LD `Organization` + `LocalBusiness`.
- **Chất lượng**: `npm run build` sạch, không lỗi TypeScript, không cảnh báo hydration; Lighthouse ≥ 90 cả 4 mục.

## Thứ tự thực hiện

1. Khởi tạo project, cấu hình Tailwind token + font + next-intl
2. Layout dùng chung: Header, Footer, Container, Button, SectionHeading
3. Trang chủ theo đúng 11 section trên
4. 3 trang phụ
5. Hai component bản đồ d3
6. Rà soát responsive + i18n + build

Sau khi xong, chạy `npm run build` và báo cáo lại những chỗ tôi cần cung cấp ảnh/nội dung thật.

---

## Kèm theo prompt

Tải file `UI-Express-Prototype.html` trong project này và đặt cạnh thư mục code, rồi thêm một dòng vào đầu prompt:

> Prototype tham chiếu là `UI-Express-Prototype.html` trong thư mục này — đọc file đó để lấy chính xác bố cục, khoảng cách, nội dung và màu sắc trước khi viết code.

Nhớ copy luôn thư mục `logos/` và `brand/` vào `public/` của project Next.js.
