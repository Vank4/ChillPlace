# Create Post Page

## Tổng quan

- Nhóm giao diện: `creator-center`
- Route: `/creator/posts/new`
- Thiết kế tham chiếu:
  - `interface_design/create_post__desktop__base/`
  - `interface_design/create_post__responsive__base/`
- Trạng thái: Đã triển khai frontend responsive và tương tác mock.

## File triển khai

- `apps/web/src/features/creator/pages/CreatePostPage.jsx`
- `apps/web/src/features/creator/pages/CreatePostPage.css`
- `apps/web/src/services/creator.service.js`
- `apps/web/src/app/App.jsx`
- `docs/frontend/frontend-implementation-notes.md`

## Thành phần chính

- Header tạo bài với nút thoát, trạng thái nháp tự động và avatar người dùng.
- Upload zone mock cho ảnh/video, hỗ trợ click chọn file, drag/drop và preview local bằng object URL.
- Thumbnail media có thao tác xóa.
- Form tiêu đề, nội dung review và đếm từ/ký tự.
- Tìm kiếm/gắn địa điểm từ dữ liệu mock của `place.service.js`.
- Hashtag suggestions có chọn/bỏ chọn.
- Thanh hành động cố định: trạng thái autosave, xem trước và đăng bài.
- Dialog preview bài viết trước khi đăng.

## Mock data và lưu trữ

- `chillplace.creatorDraft`: lưu bản nháp tự động bằng `localStorage`.
- `chillplace.creatorPosts`: lưu bài đã publish mock.
- Dùng `getPlaces()` để gợi ý địa điểm.
- Dùng `getUserProfile()` để lấy avatar người tạo.

## Tương tác đã có

- Autosave draft sau khi người dùng thay đổi nội dung.
- Validate trước khi đăng: cần tiêu đề, tối thiểu 20 từ, media và địa điểm.
- Publish mock có loading state, lưu bài vào localStorage rồi điều hướng sang route post detail mock.
- Preview bài viết hiển thị media đầu tiên, nội dung, địa điểm và hashtag.

## Responsive và scale

- Desktop dùng container `1180px`, chia 2 cột compact: media trái, form phải.
- Mobile giảm upload zone còn khoảng `220px-260px`, gom form một cột và dùng footer action gọn.
- Không bê nguyên kích thước prototype; padding, font, nút, card được scale theo chuẩn hiện tại trong Profile/Settings/Saved.

## Lưu ý khi trình bày

- Chưa upload file thật lên server; file chỉ được preview tại browser.
- Bài publish được lưu mock trong localStorage để sau này thay bằng API `POST /api/posts`.
- Route Post Detail hiện chưa có dữ liệu thật cho bài publish mới, nên điều hướng mock chủ yếu kiểm tra flow.

## Kiểm tra

- `npm run build`: thành công, Vite build 1.652 modules.
