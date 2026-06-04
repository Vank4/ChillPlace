# Design System + AppShell/Layout Tổng

## Phần Vừa Hoàn Thành

Đây là phần nền cho frontend React của ChillPlace. Mục tiêu là tạo khung ứng dụng dùng chung cho các màn hình sau: sidebar desktop, header mobile, bottom navigation mobile, route shell, design tokens, button/icon/tag/avatar cơ bản.

## File Được Thêm

- `apps/web/package.json`
  - Khai báo frontend package `@chillplace/web`.
  - Thêm script `dev`, `build`, `preview`.
  - Thêm dependency: `react`, `react-dom`, `react-router-dom`, `vite`, `@vitejs/plugin-react`, `lucide-react`.

- `apps/web/package-lock.json`
  - Sinh ra sau khi chạy `npm install`.
  - Ghi lock version dependency cho frontend.

- `apps/web/index.html`
  - Entry HTML cho React app.
  - Mount app vào `<div id="root"></div>`.

- `apps/web/vite.config.js`
  - Cấu hình Vite với React plugin.
  - Dev server dùng port `5173`.

- `apps/web/src/main.jsx`
  - Entry JavaScript chính.
  - Render React bằng `createRoot`.
  - Bọc app bằng `BrowserRouter`.
  - Import global CSS.

- `apps/web/src/app/App.jsx`
  - Khai báo route app.
  - Dùng `AppShell` làm layout cha.
  - Route `/` render `HomeFeedPage`.
  - Route khác redirect về `/`.

- `apps/web/src/styles/tokens.css`
  - Khai báo design tokens bằng CSS variables.
  - Token chính: primary orange, trust blue, accent teal, background, surface, text, radius, spacing, shadow.
  - Chuyển từ design system `interface_design/vibrant_urban_explorer__responsive__system/DESIGN.md`.

- `apps/web/src/styles/global.css`
  - Import font `Plus Jakarta Sans`.
  - Import `tokens.css`.
  - Reset CSS cơ bản.
  - Thêm `.sr-only`, animation `pulseSoft`, `slideUpFade`.
  - Có `prefers-reduced-motion`.

- `apps/web/src/constants/routes.js`
  - Khai báo navigation data:
    - `publicNavItems`
    - `mobileNavItems`
    - `headerActions`
  - Dùng icon từ `lucide-react`.

- `apps/web/src/components/common/Avatar.jsx`
  - Component avatar dùng chung.
  - Có lazy loading ảnh.

- `apps/web/src/components/common/Button.jsx`
  - Component button dùng chung.
  - Có variant `primary` và `ghost`.

- `apps/web/src/components/common/IconButton.jsx`
  - Component nút icon dùng chung.
  - Có `aria-label`, `title`, badge.

- `apps/web/src/components/common/TagChip.jsx`
  - Component tag/hashtag dùng chung.
  - Variant: `default`, `trending`, `location`.

- `apps/web/src/components/layout/AppShell.jsx`
  - Component layout tổng.
  - Gồm desktop sidebar, mobile header, mobile bottom navigation và `<Outlet />`.
  - Dùng `NavLink` để active navigation theo route.

- `apps/web/src/components/layout/AppShell.css`
  - CSS cho layout nền.
  - Desktop: grid 2 cột, sidebar sticky full height.
  - Mobile: header fixed, bottom nav floating.
  - Style chung cho `.avatar`, `.button`, `.icon-button`, `.tag-chip`.

## File Được Sửa

- Không sửa file backend.
- Không sửa file prototype trong `interface_design`.
- Không sửa README.

## File Bị Xóa

- Không xóa file nào.

## Chi Tiết Code Đã Triển Khai

- Tạo frontend React SPA trong `apps/web`.
- Thiết lập routing bằng `react-router-dom`.
- Dựng layout tổng theo hướng:
  - Desktop dùng sidebar.
  - Mobile dùng top header + bottom navigation.
  - Page con render qua `<Outlet />`.
- Tạo design tokens chung bằng CSS variables.
- Dùng `lucide-react` thay cho Material Symbols trong prototype HTML.
- Tạo component nền có thể tái sử dụng cho các màn hình sau.

## Route Liên Quan

- `/`
  - Route đầu tiên của app.
  - Hiện render `HomeFeedPage`.

## Kiểm Thử Đã Chạy

```bash
cd apps/web
npm install
npm run build
```

Kết quả:

```text
✓ built in 2.26s
```

Dev server:

```text
http://localhost:5173/
```

## Giải Thích Cho Giảng Viên

Nếu hỏi layout tổng nằm ở đâu:

- `apps/web/src/components/layout/AppShell.jsx`
- `apps/web/src/components/layout/AppShell.css`

Nếu hỏi màu sắc, font, spacing nằm ở đâu:

- `apps/web/src/styles/tokens.css`
- `apps/web/src/styles/global.css`

Nếu hỏi route được khai báo ở đâu:

- `apps/web/src/app/App.jsx`
- `apps/web/src/main.jsx`

Nếu hỏi navigation gồm những mục nào:

- `apps/web/src/constants/routes.js`

