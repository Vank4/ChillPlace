# Post Detail Page `/posts/:postId`

## Phần Vừa Hoàn Thành

Triển khai trang chi tiết bài viết thật cho nhóm `frontend-public-discovery`, thay thế route prototype `/posts/:postId`.

## File Được Thêm

- `apps/web/src/features/posts/pages/PostDetailPage.jsx`
  - Tạo page React cho Post Detail.
  - Lấy `postId` từ URL bằng `useParams`.
  - Resolve dữ liệu từ `mockFeedPosts`.
  - Có fallback cho id cũ từ Saved Post: `sp1`, `sp2`.
  - Thêm state tương tác:
    - thích bài viết
    - lưu bài viết
    - theo dõi tác giả
    - mở/đóng bình luận
    - thích bình luận
    - nhập bình luận mock
  - Desktop dùng bố cục media bên trái, thông tin/bình luận bên phải.
  - Mobile dùng trải nghiệm reel toàn màn hình, action rail nằm bên phải và comment dạng bottom sheet.

- `apps/web/src/features/posts/pages/PostDetailPage.css`
  - Style layout desktop 2 cột.
  - Style media frame theo `mediaRatio`: `portrait`, `square`, `landscape`.
  - Style action rail, comment panel, mobile reel, mobile comment bottom sheet.
  - Có animation mở media, mở comment sheet và animation thích bình luận.

## File Được Sửa

- `apps/web/src/app/App.jsx`
  - Import `PostDetailPage`.
  - Đổi route `/posts/:postId` từ `PrototypePage` sang `PostDetailPage`.

- `apps/web/src/components/layout/AppShell.jsx`
  - Thêm nhận diện route `/posts/*`.
  - Gắn class `app-shell--post` cho layout khi đang ở Post Detail.

- `apps/web/src/components/layout/AppShell.css`
  - Thêm style cho `app-shell--post`.
  - Ở mobile, ẩn `mobile-header` và `bottom-nav` để Post Detail hiển thị dạng reel toàn màn hình.

- `apps/web/src/features/saved/pages/SavedPlacesPage.jsx`
  - Đổi đường dẫn chi tiết của saved posts từ `/posts/sp1`, `/posts/sp2` sang `/posts/post-1`, `/posts/post-3`.
  - Giúp card bài viết đã lưu mở đúng dữ liệu mock trong `mockFeedPosts`.

## Luồng Hoạt Động

- Từ Saved Page, bấm card bài viết hoặc nút `Chi tiết` sẽ đi tới `/posts/post-1` hoặc `/posts/post-3`.
- Tại Post Detail:
  - Nút tim đổi trạng thái thích.
  - Nút bookmark đổi trạng thái lưu.
  - Nút theo dõi đổi trạng thái theo dõi.
  - Nút bình luận mở comment sheet trên mobile.
  - Bình luận trong panel có thể bấm tim.
  - Form bình luận đang ở mức mock, submit sẽ xóa nội dung nhập.

## Kiểm Tra

Đã chạy:

```text
npm run build
```

Kết quả: build thành công.
