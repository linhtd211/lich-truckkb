# Cập nhật Lịch Trực KCB Visual 2.1

## Cập nhật website đang chạy

1. Dùng gói `LichTrucKCB_Visual_2.1_UpdateOnly.zip` cho repository đang chạy. Giải nén **nội dung bên trong ZIP** vào đúng thư mục hiện chứa `index.html`, cho phép ghi đè các file trùng trong gói.
2. Giữ file `js/firebase-config.js` đang dùng trên repository. Gói cập nhật đã loại file này và quy tắc Firestore. Cấu hình Firebase trong gói đầy đủ là mẫu trống đã có trong gói Visual 2.0.
3. Commit các thay đổi lên nhánh đang dùng cho GitHub Pages. Với nhiều file trong `assets`, có thể dùng GitHub Desktop để commit trong một lần và đẩy lên nhánh, thay vì tải từng file qua nút Upload files.
4. GitHub Pages hỗ trợ hai nguồn xuất bản. Nếu trang đang dùng **Deploy from a branch**, giữ nhánh và thư mục đã chọn. Nếu trang đang dùng **GitHub Actions**, dùng workflow Pages đang chạy của repository. Xem [tài liệu GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
5. Khi Pages báo triển khai thành công, mở lại đúng địa chỉ cũ. Với PWA đang mở từ trước, đóng rồi mở lại khi có mạng để trình duyệt nhận bản 2.1. Có thể cần tải lại trang một lần sau lần mở đầu.
6. Mở ngày 24/11/2026 và đối chiếu tên người trực với bản đang sử dụng. Kiểm tra tab Sự kiện, lịch tháng và kết nối đồng bộ quản trị trước khi dùng thường xuyên.

Nếu repository hiện tại cũ hơn Visual 2.0, dùng gói đầy đủ làm nguồn file ứng dụng. Sao lưu và giữ đúng file cấu hình Firebase, thư mục xuất bản, workflow hoặc quy tắc Firestore của website hiện hữu.

## Mở bản đầy đủ để kiểm tra cục bộ

Giải nén ZIP, mở cửa sổ lệnh ngay thư mục chứa `index.html`, chạy `python -m http.server 8080` rồi mở `http://localhost:8080/`. Thử PWA và offline trên localhost hoặc HTTPS. Báo cáo và bộ kiểm tra nằm trong thư mục `nghiem-thu` của bản đầy đủ.
