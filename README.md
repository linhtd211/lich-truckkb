# Lịch trực Khoa Khám bệnh, chữa bệnh

Ứng dụng web xem và quản lý **lịch trực** cho khoa Khám bệnh, chữa bệnh tuyến cơ sở. Giao diện theo kiểu lịch Việt Nam (xanh lá, hoa văn chữ hồi mờ, bo góc mềm), dùng tốt trên điện thoại. Không cần cài đặt, không cần máy chủ: chỉ gồm HTML, CSS và JavaScript thuần.

## Tính năng

- **Trang Hôm nay**: ngày dương, thứ, ngày lễ, người trực, giờ hiện tại, giờ hoàng đạo, ngày âm, can chi năm/tháng/ngày, ngày Hoàng đạo/Hắc đạo.
- **Lịch tháng**: mỗi ngày hiển thị ngày âm, người trực và dấu ngày lễ.
- **Ngày lễ**: ngày nghỉ theo quy định (Tết Dương lịch, Tết Nguyên đán, Giỗ Tổ Hùng Vương, 30/4, 1/5, 2/9) và các ngày kỷ niệm, lễ truyền thống.
- **Lọc theo cá nhân** và thống kê số ca trực trong tháng.
- **Quản trị** (cần mã quản trị): xếp lịch trực xoay vòng theo danh sách cán bộ, thêm/xóa/đổi thứ tự cán bộ, đổi lịch (hoán đổi hai ngày hoặc chỉ định người trực), nhật ký đổi lịch, đổi mã quản trị. Người dùng khác chỉ xem.

## Chạy thử

Mở trực tiếp `index.html` bằng trình duyệt (service worker chỉ hoạt động qua http/https), hoặc chạy máy chủ tĩnh:

```bash
python3 -m http.server 8080
# mở http://localhost:8080
```

## Đưa lên GitHub Pages

1. Tạo repository mới trên GitHub rồi đẩy mã nguồn lên nhánh `main`.
2. Vào **Settings → Pages**, mục **Source** chọn **GitHub Actions**.
3. Workflow `.github/workflows/pages.yml` sẽ tự triển khai sau mỗi lần push. Địa chỉ có dạng `https://<tài-khoản>.github.io/<tên-repo>/`.

## Cài như ứng dụng (PWA)

Sau khi triển khai lên GitHub Pages (https), mở địa chỉ trên điện thoại:

- **Android (Chrome)**: menu ⋮ → *Cài đặt ứng dụng* (hoặc *Thêm vào màn hình chính*).
- **iPhone (Safari)**: nút Chia sẻ → *Thêm vào MH chính*.

Ứng dụng có logo riêng, mở toàn màn hình, dùng được khi mất mạng, và đã khóa phóng to/thu nhỏ trang.

## Cấu trúc thư mục

```
index.html              Khung trang
css/style.css           Giao diện
js/lunar.js             Âm lịch, ngày lễ, can chi, hoàng đạo
js/app.js               Dữ liệu, xoay vòng, giao diện, quản trị
js/pwa.js               Đăng ký service worker
sw.js                   Service worker (chạy offline)
manifest.webmanifest    Khai báo PWA
icons/                  Logo (SVG, PNG 192/512, maskable, apple-touch)
.github/workflows/      Tự triển khai lên GitHub Pages
```

## Cấu hình và dữ liệu

- Mã quản trị được lưu dưới dạng mã băm, không hiển thị trên màn hình và không lưu nguyên văn. Mã mặc định đặt bằng hằng `DEFAULT_PH` trong `js/app.js`. Để dùng mã riêng: mở Console của trình duyệt, chạy `pinHash('mã-của-bạn')` rồi dán kết quả vào `DEFAULT_PH`. Sau lần đăng nhập đầu, hãy đổi mã trong tab Quản trị.
- Danh sách cán bộ ban đầu là dữ liệu mẫu (biến `S.staff` trong `js/app.js`), sửa trong tab Quản trị hoặc trực tiếp trong mã.
- Danh sách ngày lễ nằm ở hai bảng `SOL` (dương lịch) và `LUN` (âm lịch) trong `js/lunar.js`.

## Hạn chế cần biết

- Dữ liệu lưu bằng `localStorage` **riêng trên từng thiết bị**, chưa đồng bộ giữa các máy.
- Mã quản trị chỉ kiểm tra ở phía trình duyệt (mã băm chỉ để không lộ nguyên văn), **không phải bảo mật thật**. Muốn một quản trị viên xếp lịch cho cả khoa cùng xem, cần thêm máy chủ và xác thực (ví dụ Firebase, Supabase hoặc API riêng).
- Ngày nghỉ bù (Tết, Quốc khánh...) mỗi năm do Thủ tướng Chính phủ quyết định, ứng dụng chưa tự cập nhật. Cần đối chiếu với thông báo của năm đang dùng.
- Âm lịch tính theo thuật toán của Hồ Ngọc Đức (múi giờ UTC+7), có thể lệch rất hiếm ở một số ngày giáp ranh.

## Giấy phép

MIT, xem tệp `LICENSE`.
