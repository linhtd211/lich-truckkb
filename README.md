# Lịch trực Khoa Khám bệnh, chữa bệnh

Ứng dụng web xem và quản lý **lịch trực** cho khoa Khám bệnh, chữa bệnh tuyến cơ sở. Giao diện theo kiểu lịch Việt Nam (xanh lá, hoa văn chữ hồi mờ, bo góc mềm), dùng tốt trên điện thoại. Không cần cài đặt, không cần máy chủ: chỉ gồm HTML, CSS và JavaScript thuần.

## Tính năng

- **Trang Hôm nay**: ngày dương, thứ, ngày lễ, người trực, giờ hiện tại, giờ hoàng đạo, ngày âm, can chi năm/tháng/ngày, ngày Hoàng đạo/Hắc đạo.
- **Lịch tháng**: mỗi ngày hiển thị ngày âm, người trực và dấu ngày lễ.
- **Ngày lễ**: ngày nghỉ theo quy định (Tết Dương lịch, Tết Nguyên đán, Giỗ Tổ Hùng Vương, 30/4, 1/5, 2/9) và các ngày kỷ niệm, lễ truyền thống.
- **Sự kiện**: thẻ "Sắp tới" đếm ngược, dòng thời gian theo tháng gồm ngày lễ, ngày truyền thông y tế (7/4, 31/5, 14/11, 1/12...), mùng 1, Rằm, 24 tiết khí và **hoạt động của khoa** (họp giao ban, tiêm chủng, khám sàng lọc, tập huấn) do quản trị viên thêm; có bộ lọc theo loại. Hoạt động của khoa được đồng bộ cùng lịch trực khi bật Firebase.
- **Lọc theo cá nhân** và thống kê số ca trực trong tháng.
- **Quản trị** (cần mã quản trị): xếp lịch trực xoay vòng theo danh sách cán bộ, thêm/xóa/đổi thứ tự cán bộ, đổi lịch (hoán đổi hai ngày hoặc chỉ định người trực), nhật ký đổi lịch, đổi mã quản trị. Người dùng khác chỉ xem.

## Cách xoay vòng lịch trực

Lịch trực được tính theo **giai đoạn**: từ một ngày áp dụng, người trực mỗi ngày là người kế tiếp trong danh sách xoay vòng. Khi thêm cán bộ mới, cho nghỉ trực, đổi thứ tự hoặc xếp lại vòng trong tab Quản trị, anh/chị chọn **ngày áp dụng** (ví dụ ngày cán bộ mới bắt đầu vào trực). App chỉ tạo giai đoạn mới từ ngày đó, **lịch các ngày trước đó không bị thay đổi**. Cán bộ mới có thể trực ngay từ ngày áp dụng hoặc nối tiếp vòng, đến lượt mới trực.

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

## Đồng bộ thời gian thực với Firebase

Mặc định app chạy **chế độ cục bộ** (dữ liệu nằm riêng trên từng máy). Để nhiều người cài app cùng xem một lịch, cập nhật tức thì khi quản trị viên thay đổi, bật Firebase (gói Spark miễn phí là đủ cho một khoa):

1. Vào https://console.firebase.google.com, tạo project mới.
2. **Project settings → Your apps → Web (</>)**, đăng ký app rồi chép đoạn `firebaseConfig` vào `js/firebase-config.js`.
3. **Authentication → Sign-in method**: bật **Email/Password**. Vào tab **Users** thêm tài khoản quản trị (email + mật khẩu). Nên tắt đăng ký mở nếu console cho phép (Settings → User actions).
4. **Firestore Database → Create database** (chọn khu vực gần, ví dụ `asia-southeast1`).
5. Tab **Rules**: dán nội dung `firestore.rules`, **sửa email trong danh sách `['admin@example.com']` thành email quản trị thật**, rồi Publish.
6. Đẩy mã lên GitHub Pages. Đăng nhập tab **Quản trị** bằng email và mật khẩu ở bước 3. Lần đầu, app tự tạo dữ liệu ban đầu (danh sách mẫu), anh/chị sửa lại theo khoa.
7. Nên giới hạn API key theo tên miền GitHub Pages trong Google Cloud Console (APIs & Services → Credentials).

Khi bật Firebase: ai cũng xem được lịch, chỉ email nằm trong rules mới ghi được (quyền ghi do máy chủ kiểm tra, không chỉ ở giao diện). Dấu chấm cạnh tiêu đề: xanh là đang đồng bộ, cam là ngoại tuyến (hiển thị lịch đã lưu gần nhất). Khi hai quản trị viên sửa cùng lúc, lần lưu sau cùng được giữ lại.

## Hình trang trí

Ứng dụng **không tự vẽ** hình trang trí bằng Canvas, CSS hay ghép hình học. Toàn bộ là tệp minh họa chuyên nghiệp nằm trong `assets/illustrations/` (decor, patterns, logo, icons), nên chạy được khi offline và không tải ảnh từ bên ngoài. Nguồn và giấy phép ghi trong `assets/LICENSES.md`.

Hình được chọn **ngẫu nhiên mỗi lần mở app**, theo ngày đang xem:
- **Ngày đặc biệt:** Tết Nguyên đán (kèm con giáp của năm), Tết Dương lịch, Trung thu, Vu Lan, Giỗ Tổ, 30/4, 1/5, Quốc khánh, 27/2, 8/3, 20/10, 20/11, 14/2, 1/6, Giáng sinh và các ngày truyền thông y tế (mỗi ngày y tế có hình riêng, ví dụ phổi cho Ngày phòng chống Lao).
- **Ngày thường:** theo mùa xuân, hạ, thu, đông.

Muốn thêm hoặc thay hình (kể cả ảnh do AI tạo): chép tệp `.webp` hoặc `.png` vào `assets/illustrations/decor/`, thêm tên tệp vào chủ đề tương ứng trong `js/decor.js`, và thêm đường dẫn vào danh sách `ASSETS` trong `sw.js` để dùng được offline.

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
js/cloud.js             Đồng bộ Firebase (Auth + Firestore)
js/firebase-config.js   Cấu hình Firebase (để trống = chế độ cục bộ)
firestore.rules         Quy tắc bảo mật Firestore
vendor/firebase/        Firebase SDK 10.14.1 (compat), đóng kèm
sw.js                   Service worker (chạy offline)
manifest.webmanifest    Khai báo PWA
assets/illustrations/   Hình minh họa, logo, họa tiết nền, biểu tượng (chạy offline)
js/decor.js             Chọn hình trang trí theo mùa và ngày đặc biệt
assets/LICENSES.md      Nguồn và giấy phép đồ họa
.github/workflows/      Tự triển khai lên GitHub Pages
```

## Cấu hình và dữ liệu

- Mã quản trị được lưu dưới dạng mã băm, không hiển thị trên màn hình và không lưu nguyên văn. Mã mặc định đặt bằng hằng `DEFAULT_PH` trong `js/app.js`. Để dùng mã riêng: mở Console của trình duyệt, chạy `pinHash('mã-của-bạn')` rồi dán kết quả vào `DEFAULT_PH`. Sau lần đăng nhập đầu, hãy đổi mã trong tab Quản trị.
- Danh sách cán bộ ban đầu là dữ liệu mẫu (biến `S.staff` và `S.rot` trong `js/app.js`), sửa trong tab Quản trị hoặc trực tiếp trong mã.
- Danh sách ngày lễ nằm ở hai bảng `SOL` (dương lịch) và `LUN` (âm lịch) trong `js/lunar.js`.

## Hạn chế cần biết

- Ở chế độ cục bộ (chưa cấu hình Firebase), dữ liệu lưu bằng `localStorage` **riêng trên từng thiết bị**. Muốn đồng bộ nhiều máy, bật Firebase theo hướng dẫn ở trên.
- Ở chế độ cục bộ, mã quản trị chỉ kiểm tra trong trình duyệt (mã băm chỉ để không lộ nguyên văn), **không phải bảo mật thật**. Ở chế độ Firebase, quyền ghi được chặn bằng Firebase Authentication và `firestore.rules`.
- Ngày nghỉ bù (Tết, Quốc khánh...) mỗi năm do Thủ tướng Chính phủ quyết định, ứng dụng chưa tự cập nhật. Cần đối chiếu với thông báo của năm đang dùng.
- Âm lịch tính theo thuật toán của Hồ Ngọc Đức (múi giờ UTC+7), có thể lệch rất hiếm ở một số ngày giáp ranh.

## Giấy phép

MIT, xem tệp `LICENSE`.
