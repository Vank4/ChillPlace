# Responsive Audit

## Phạm vi

- Rà toàn bộ route Public Discovery, Auth, Creator, Business và Admin.
- Kiểm tra breakpoint, fixed viewport, overflow ngang, safe-area và touch target.

## Thay đổi

- Thêm `styles/polish.css` làm lớp bảo vệ responsive toàn ứng dụng.
- Chuẩn hóa `100dvh` cho shell/full-screen page có hỗ trợ dynamic viewport.
- Thêm safe fallback cho màn hình rất nhỏ dưới `360px`.
- Touch target tối thiểu 36px trên thiết bị coarse pointer.
- Vô hiệu hiệu ứng filter hover gây trạng thái dính trên màn cảm ứng.
- Các danh sách/card dài dùng `content-visibility: auto` khi trình duyệt hỗ trợ.

## Kết quả

- Desktop, tablet và mobile giữ layout hiện có nhưng tránh tràn ngang ngoài chủ đích.
- Map vẫn nhận chiều cao từ AppShell, không bị cộng thêm mobile header.
- Build production pass.
