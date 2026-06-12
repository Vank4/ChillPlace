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
- URL ảnh đại diện.
- URL ảnh bìa.

Tên và username là trường bắt buộc. Sau khi lưu:

1. Service mô phỏng thời gian gọi API.
2. Profile được lưu vào localStorage.
3. Page cập nhật state.
4. AppShell nhận custom event và cập nhật sidebar.

## Logic Tab

- `Bài viết`: hiển thị bento grid nội dung mock.
- `Đã lưu`: CTA dẫn sang `/saved`.
- `Đánh giá`: danh sách đánh giá mock với rating sao.
- `Được gắn thẻ`: hiển thị tập con bài viết được gắn tag.

## Responsive

- Desktop:
  - Cover lớn, avatar vuông bo góc nổi trên cover.
  - Profile actions nằm bên phải.
  - Bento grid ba cột.

- Mobile:
  - Ẩn cover để bám prototype responsive.
  - Avatar tròn và thông tin căn giữa.
  - Chỉ giữ nút chỉnh sửa hồ sơ.
  - Tab gọn, ẩn tab tagged.
  - Grid hai cột, bài nổi bật full width.

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

Kết quả:

```text
✓ built in 2.20s
```

