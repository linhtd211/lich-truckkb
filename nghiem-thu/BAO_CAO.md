# Báo cáo kiểm thử Lịch Trực KCB Visual 2.1.2

## Kết quả

- Kiểm tra mở ô sửa tên, từ chối tên chỉ có khoảng trắng, lưu tên mới, mở lại dữ liệu, hiển thị trên ca trước và sau ngày áp dụng, và giữ nguyên ID cán bộ, vòng trực, các ca đã đổi và nhật ký lưu. Mục Nhật ký đổi lịch đã được bỏ khỏi giao diện Quản trị.

- Chủ đề 22/12 trỏ tới ảnh Đội danh dự do Lahuutrung chụp năm 2019. Đã kiểm tra mã hiển thị đường dẫn ảnh, liên kết nguồn trong chi tiết và việc giữ ảnh đã đối chiếu khi nâng cấp bộ nhớ đệm giao diện.

- So sánh lịch âm và ID người trực với Visual 2.0 trên 10.958 ngày từ 2010 đến 2039. Kết quả của hai phiên bản giống nhau trong bộ dữ liệu đối chiếu.
- Rà đủ 53 chủ đề, gồm 4 mùa và 49 chủ đề sự kiện. Mọi chủ đề sự kiện có tranh riêng, icon hiển thị và lời chúc. 24 icon tiết khí được kiểm tra nội dung tệp và mã băm khác nhau.
- Mở thử mã hiển thị trong môi trường DOM mô phỏng. Kiểm tra các ngày mục tiêu, âm nhuận, ngày trùng sự kiện, 23/11 và 24/11, xếp lại vòng, thêm cán bộ, hoán đổi, chỉ định, nhật ký, thống kê, phân quyền cục bộ và dữ liệu lưu từ bản cũ.
- Kiểm tra Firebase bằng snapshot và luồng ghi mô phỏng. Luồng ghi dùng tài khoản kiểm thử, dữ liệu nhân tạo và đối tượng mô phỏng.
- Kiểm tra các sự kiện cài đặt, kích hoạt và đọc bộ nhớ đệm của Service Worker bằng mô phỏng. Đã kiểm tra đường dẫn con, dữ liệu cache cũ theo đúng phạm vi, ảnh đã xem khi mất mạng và tài nguyên chuyển sang ảnh mùa khi cần.
- Đọc và kiểm tra định dạng của các tệp PNG và WebP. Đối chiếu tài nguyên di sản và giấy phép theo [ASSET_SOURCES.md](../ASSET_SOURCES.md).

## Các kiểm tra cần nghiệm thu trên bản chạy

Trình duyệt của phiên này không mở được ứng dụng từ địa chỉ thử cục bộ. Chính sách truy cập chặn URL file cục bộ và trình duyệt tự động hóa không thể tạo phiên kiểm thử từ tiến trình cục bộ. Vì vậy báo cáo chưa có ảnh chụp ứng dụng thật và chưa xác minh trực quan ở 320, 375, 390, 430, 520 px hoặc desktop. Safari iPhone, PWA iOS cài thật, Chrome Android và Edge Windows cần kiểm tra trên thiết bị thực tế. Đồng bộ Firebase, đăng nhập quản trị và triển khai Pages thực tế cần kiểm thử trên môi trường của đơn vị.

Mốc 03/02 dùng Đảng kỳ đúng quy cách cùng Quốc kỳ và tranh trang trí. Tư liệu ảnh trực tiếp của hội nghị thành lập Đảng năm 1930 chưa tích hợp. Không còn mục chủ đề hoặc icon tiết khí thiếu tệp trong danh mục.

## Tái lập kiểm tra mã

Chạy `node nghiem-thu/kiem-tra.cjs` từ thư mục ứng dụng với Node.js 22+. Để so sánh với Visual 2.0, đặt biến môi trường `VISUAL20_BASELINE` đến thư mục đã giải nén gói 2.0, thư mục đó chứa `index.html` và `js/`. Kết quả lần bàn giao nằm trong `ket-qua.json`.

## Nghiệm thu theo chủ đề

Ngày kiểm tra ghi một mốc kích hoạt trong năm 2026. Nhóm 4 mùa được đối chiếu trên ngày thường. Cột nguồn định danh tư liệu ảnh, tranh sáng tạo hoặc tài nguyên 2.0.

| Chủ đề | Ngày kiểm tra | Tranh riêng | Icon sự kiện | Lời chúc | Nguồn | Mã hiển thị | Trình duyệt |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Mùa xuân | 11/03/2026 | Có | Theo sự kiện | Theo ngày | Gói 2.0 | Đạt | Chưa chạy |
| Mùa hè | 09/06/2026 | Có | Theo sự kiện | Theo ngày | Gói 2.0 | Đạt | Chưa chạy |
| Mùa thu | 13/10/2026 | Có | Theo sự kiện | Theo ngày | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Mùa đông | 26/11/2026 | Có | Theo sự kiện | Theo ngày | Gói 2.0 | Đạt | Chưa chạy |
| Tết Dương lịch | 01/01/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Tết Nguyên đán | 16/02/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Giỗ Tổ Hùng Vương | 26/04/2026 | Có | Có | Riêng | Đã đối chiếu tư liệu | Đạt | Chưa chạy |
| Ngày Giải phóng miền Nam, thống nhất đất nước | 30/04/2026 | Có | Có | Riêng | Đã đối chiếu tư liệu | Đạt | Chưa chạy |
| Ngày Quốc tế Lao động | 01/05/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Quốc khánh | 31/08/2026 | Có | Có | Riêng | Đã đối chiếu tư liệu | Đạt | Chưa chạy |
| Ngày Văn hóa Việt Nam | 24/11/2026 | Có | Có | Riêng | Đã đối chiếu tư liệu | Đạt | Chưa chạy |
| Ngày thành lập Đảng Cộng sản Việt Nam | 03/02/2026 | Có | Có | Riêng | Đã đối chiếu tư liệu | Đạt | Chưa chạy |
| Valentine | 14/02/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Quốc tế Phụ nữ | 08/03/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày thành lập Đoàn TNCS Hồ Chí Minh | 26/03/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Sách và Văn hóa đọc Việt Nam | 21/04/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Kỷ niệm ngày sinh Chủ tịch Hồ Chí Minh | 19/05/2026 | Có | Có | Riêng | Đã đối chiếu tư liệu | Đạt | Chưa chạy |
| Ngày Quốc tế Thiếu nhi | 01/06/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Gia đình Việt Nam | 28/06/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Thương binh – Liệt sĩ | 27/07/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Lễ Vu Lan | 27/08/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Kỷ niệm Cách mạng Tháng Tám | 19/08/2026 | Có | Có | Riêng | Đã đối chiếu tư liệu | Đạt | Chưa chạy |
| Tết Trung thu | 25/09/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Phụ nữ Việt Nam | 20/10/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày hội Đại đoàn kết toàn dân tộc | 18/11/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Nhà giáo Việt Nam | 20/11/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Di sản Văn hóa Việt Nam | 23/11/2026 | Có | Có | Riêng | Đã đối chiếu tư liệu | Đạt | Chưa chạy |
| Ngày thành lập Quân đội nhân dân Việt Nam | 22/12/2026 | Có | Có | Riêng | Đã đối chiếu tư liệu | Đạt | Chưa chạy |
| Giáng sinh | 24/12/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Tết Đoan Ngọ | 19/06/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Rằm tháng Giêng | 03/03/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ông Công Ông Táo | 10/02/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Thế giới phòng chống ung thư | 04/02/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Thầy thuốc Việt Nam | 27/02/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Thế giới phòng chống lao | 24/03/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Sức khỏe thế giới | 07/04/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Thế giới phòng chống sốt rét | 25/04/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Vệ sinh tay thế giới | 05/05/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Chữ thập đỏ và Trăng lưỡi liềm đỏ thế giới | 08/05/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Quốc tế Điều dưỡng | 12/05/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Tăng huyết áp thế giới | 17/05/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Thế giới không thuốc lá | 31/05/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Thế giới tôn vinh người hiến máu | 14/06/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Dân số thế giới | 11/07/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Viêm gan thế giới | 28/07/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Tuần lễ Nuôi con bằng sữa mẹ | 01/08/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày An toàn người bệnh thế giới | 17/09/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Tim mạch thế giới | 29/09/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Sức khỏe tâm thần thế giới | 10/10/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Đột quỵ thế giới | 29/10/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Đái tháo đường thế giới | 14/11/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Thế giới phòng chống AIDS | 01/12/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
| Ngày Quốc tế phòng chống dịch bệnh | 27/12/2026 | Có | Có | Riêng | Tranh tạo cho 2.1 | Đạt | Chưa chạy |
