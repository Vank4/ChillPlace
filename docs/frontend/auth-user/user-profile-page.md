# User Profile Page `/profile`

## Trang Đã Hoàn Thành

Đã thay placeholder `/profile` bằng User Profile Page hoạt động bằng state, auth session và localStorage.

Trang dựa trên:

- `interface_design/user_profile__desktop__base/code.html`
- `interface_design/user_profile__desktop__fixed/code.html`
- `interface_design/user_profile__desktop__fixed/screen.png`
- `interface_design/user_profile__responsive__base/code.html`
- `interface_design/user_profile__responsive__base/screen.png`

Trang nằm trong `AppShell` để tiếp tục sử dụng sidebar desktop, mobile header và bottom navigation chung của ứng dụng.

## File Được Thêm

- `apps/web/src/features/profile/pages/UserProfilePage.jsx`
  - Profile header với cover, avatar, tên, username, bio, vị trí và membership.
  - Thống kê bài viết, người theo dõi và đang theo dõi.
  - Tab:
    - Bài viết.
    - Đã lưu.
    - Đánh giá.
    - Được gắn thẻ.
  - Grid bài viết responsive.
  - Nút mở Saved Page và Map Page.
  - Chia sẻ bằng Web Share API hoặc sao chép URL.
  - Modal chỉnh sửa hồ sơ.

- `apps/web/src/features/profile/pages/UserProfilePage.css`
  - Desktop dùng cover card và bento media grid.
  - Mobile chuyển sang avatar tròn, thống kê ngang, tab gọn và grid hai cột.
  - Style modal edit, toast share, review list và empty/action state.

- `apps/web/src/services/profile.service.js`
  - `getUserProfile()` kết hợp auth session, profile đã lưu và dữ liệu fallback.
  - `updateUserProfile()` mô phỏng API update.
  - Lưu hồ sơ vào:

```text
chillplace.userProfile
```

  - Phát event `chillplace:profile-updated` để AppShell cập nhật avatar/tên ngay.

## File Được Sửa

- `apps/web/src/app/App.jsx`
  - Import `UserProfilePage`.
  - Thay `PrototypePage` bằng:

```jsx
<Route path="profile" element={<UserProfilePage />} />
```

- `apps/web/src/components/layout/AppShell.jsx`
  - Sidebar profile đọc dữ liệu từ `profile.service.js`.
  - Avatar/tên/username tự cập nhật sau khi sửa hồ sơ.
  - Profile block trở thành link tới `/profile`.

- `docs/frontend/frontend-implementation-notes.md`
  - Thêm link note và cập nhật Profile thành `Đã triển khai`.

## Logic Chỉnh Sửa Hồ Sơ

Modal cho phép cập nhật:

- Tên hiển thị.
- Username.
- Bio.
- Khu vực.

Tên và username là trường bắt buộc. Sau khi lưu:

1. Service mô phỏng thời gian gọi API.
2. Profile được lưu vào localStorage.
3. Page cập nhật state.
4. AppShell nhận custom event và cập nhật sidebar.

## Logic Tab

- `Bài viết`: hiển thị bento grid nội dung mock.
- `Đã lưu`: nhúng trực tiếp thư viện Saved với tìm kiếm, chuyển tab Địa điểm/Bài viết, empty state và danh sách dùng chung dữ liệu với `/saved`.
- `Đánh giá`: danh sách đánh giá mock với rating sao.
- `Được gắn thẻ`: hiển thị tập con bài viết được gắn tag.

## Responsive

- Desktop:
  - Cover được nén chiều cao, avatar vuông bo góc nổi trên cover.
  - Profile actions nằm bên phải.
  - Thông tin, thống kê, tab và bento grid ba cột được trình bày liên tục với khoảng cách gọn.

- Mobile:
  - Cover ngắn và avatar bo góc tạo thành một khối nhận diện gọn.
  - Thông tin căn trái để giảm chiều cao phần đầu trang.
  - Giữ nút chỉnh sửa và nút chia sẻ dạng icon.
  - Tab gọn, sticky bên dưới mobile header và ẩn tab tagged.
  - Grid hai cột, bài nổi bật full width.
  - Overlay bài viết luôn hiển thị để không phụ thuộc hover trên màn hình cảm ứng.

## Tối ưu giao diện bổ sung

- Hợp nhất CSS thành một hệ quy tắc duy nhất, loại bỏ lớp compact override trùng lặp.
- Giảm khoảng trắng bao quanh, chiều cao cover/header và khoảng cách giữa header, tab, nội dung.
- Thêm hover cho action, tab, bài viết, review, CTA và map shortcut.
- Modal chỉnh sửa được rút gọn còn các trường người dùng thực sự cần thao tác.
- Hỗ trợ `prefers-reduced-motion`.

## Điểm Giải Thích Khi Báo Cáo

- Profile ưu tiên dữ liệu đã chỉnh sửa trong localStorage và dùng auth session cho tài khoản vừa đăng nhập/đăng ký.
- `profile.service.js` giúp UI không phụ thuộc trực tiếp localStorage, dễ thay bằng `GET/PATCH /api/users/me`.
- Custom event giữ AppShell và Profile đồng bộ mà chưa cần thêm state management library.
- Web Share API được dùng khi trình duyệt hỗ trợ; nếu không sẽ sao chép liên kết.

## Kiểm Tra

Đã chạy:

```bash
cd apps/web
npm run build
```

Kết quả: build thành công với 1.650 modules.

