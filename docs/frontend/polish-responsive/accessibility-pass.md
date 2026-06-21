# Accessibility Pass

## Thay đổi

- Thêm skip navigation cho AppShell và AdminLayout.
- Main landmark có `id` và `tabIndex=-1` để nhận focus từ skip-link.
- Chuẩn hóa `:focus-visible` cho button, link, input, select và phần tử `role=button`.
- Thêm hỗ trợ `prefers-contrast` và Windows forced-colors.
- Cập nhật document title theo route.
- Route fallback dùng `role=status` và `aria-live=polite`.
- Biểu đồ Admin có nhãn ngữ nghĩa thay vì chỉ phụ thuộc màu/hình.
- Button component mặc định `type=button`, props vẫn có thể ghi đè thành submit.

## Keyboard

- Card tương tác chính hỗ trợ Enter/Space.
- Focus ring không bị tắt bởi các rule `outline: none` cục bộ.
- Skip-link chỉ hiện khi nhận focus.

## Kết quả

- Build production pass.
