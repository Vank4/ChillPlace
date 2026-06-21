# Performance Polish

## Route Code Splitting

- Chuyển toàn bộ page route sang `React.lazy` và `Suspense`.
- CSS của từng trang được Vite tách theo chunk thay vì dồn vào entry bundle.
- Entry JavaScript giảm từ khoảng `489 kB` xuống `259 kB` trước gzip.

## Image Loading

- Hero/LCP của Feed, Auth, Profile và Place Detail dùng eager/high priority.
- Card, gallery, avatar và danh sách ngoài viewport dùng lazy loading và async decoding.
- Feed item đầu tiên được ưu tiên; các item còn lại lazy-load.

## Rendering

- Card dài dùng `content-visibility: auto` và intrinsic fallback ở trình duyệt hỗ trợ.
- Không thêm chart library; biểu đồ Admin dùng CSS/SVG nhẹ.

## Kết quả

- Vite tạo page chunks riêng.
- Build production pass.
