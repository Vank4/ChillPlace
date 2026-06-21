# Animation And Interaction Polish

## Thay đổi

- Route loading spinner thống nhất khi tải lazy chunk.
- Giữ phản hồi hover/active/focus riêng cho mouse, keyboard và touch.
- Bổ sung global `touch-action: manipulation` cho control trên màn cảm ứng.
- Tôn trọng `prefers-reduced-motion`; spinner chuyển thành trạng thái tĩnh khi giảm chuyển động.
- Dark mode và focus state dùng token, không tạo flash nền trắng.

## Nguyên tắc

- Animation chỉ dùng transform/opacity khi có thể.
- Không phụ thuộc hover để hiển thị nội dung bắt buộc trên mobile.
- Không ép hover transform toàn cục, tránh phá animation riêng của từng feature.

## Kết quả

- Build production pass.
