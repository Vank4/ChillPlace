# Notifications Page

## Trang vừa hoàn thành

- Tên giao diện: Notifications Page.
- Route: `/notifications`.
- Nhóm: `public-discovery`.
- Mục tiêu: hiển thị trung tâm thông báo công khai cho người dùng, có filter, trạng thái đọc/chưa đọc, ẩn thông báo và điều hướng sang nội dung liên quan.

## File thêm/sửa

- `apps/web/src/app/App.jsx`
  - Import `NotificationsPage`.
  - Thêm route `path="notifications"` để icon chuông trong header đi tới trang thông báo thật.
- `apps/web/src/features/notifications/pages/NotificationsPage.jsx`
  - Tạo page React cho danh sách thông báo.
  - Dùng mock data nội bộ cho các loại thông báo: tương tác, địa điểm, hệ thống.
  - Dùng `localStorage` cho trạng thái đã đọc và thông báo đã ẩn.
- `apps/web/src/features/notifications/pages/NotificationsPage.css`
  - Tạo layout desktop 2 cột: danh sách chính + panel tổng quan bên phải.
  - Tối ưu mobile thành một cột, giảm kích thước card và chừa khoảng cho bottom navigation.
- `docs/frontend/frontend-implementation-notes.md`
  - Cập nhật dòng `Notifications Page` trong nhóm Public Discovery.
- `docs/frontend/public-discovery/notifications-page.md`
  - File note chi tiết cho trang này.

## Logic đã triển khai

- Lọc thông báo theo:
  - `Tất cả`
  - `Chưa đọc`
  - `Tương tác`
  - `Địa điểm`
  - `Hệ thống`
- Tìm kiếm trong danh sách thông báo:
  - Nhập từ khóa để lọc theo tiêu đề, nội dung, loại thông báo hoặc tên người tương tác.
- Quản lý hàng loạt:
  - `Chọn trang`: chọn toàn bộ thông báo đang hiển thị theo filter/search hiện tại.
  - `Đọc mục chọn`: đánh dấu các thông báo đã chọn là đã đọc.
  - `Ẩn mục chọn`: ẩn nhiều thông báo cùng lúc và lưu vào localStorage.
  - `Khôi phục`: đưa các thông báo đã ẩn quay lại danh sách.
- Click vào một thông báo:
  - Đánh dấu thông báo đó là đã đọc.
  - Điều hướng tới route liên quan như `/posts/post-1`, `/places/p2`, `/nearby`, `/tags/cafe`.
- Nút `Đọc tất cả`:
  - Đánh dấu toàn bộ thông báo đang hiển thị là đã đọc.
  - Disable khi không còn thông báo chưa đọc.
- Nút ẩn từng thông báo:
  - Lưu id vào `localStorage`.
  - Không làm mất dữ liệu mock gốc.
- Empty state:
  - Hiển thị khi filter không còn thông báo phù hợp.

## Mock data/localStorage

- Mock data đặt trực tiếp trong `NotificationsPage.jsx` để phục vụ prototype.
- Key localStorage:
  - `chillplace.readNotifications`: danh sách id thông báo đã đọc.
  - `chillplace.hiddenNotifications`: danh sách id thông báo đã ẩn.
  - `chillplace.notificationSettings`: trạng thái bật/tắt các cài đặt nhanh.
- Khi backend sẵn sàng, có thể thay mock bằng:
  - `GET /api/notifications`
  - `PATCH /api/notifications/:id/read`
  - `PATCH /api/notifications/read-all`
  - `DELETE /api/notifications/:id`

## Component/chức năng chính

- `NotificationsPage`
  - Quản lý state filter, read ids, hidden ids.
  - Tính số lượng unread và count theo từng filter.
  - Render danh sách notification card.
- Notification card
  - Có avatar nếu là thông báo từ người dùng.
  - Có icon màu theo loại nếu là thông báo hệ thống/địa điểm.
  - Có trạng thái `is-unread` với thanh nhấn màu cam.
- Side panel
  - Tổng số thông báo chưa đọc.
  - Thống kê theo nhóm.
  - Cài đặt nhanh có thể bật/tắt và lưu localStorage.

## Responsive

- Desktop:
  - Main content rộng, side panel sticky bên phải.
  - Card dùng layout ngang để đọc nhanh.
- Tablet:
  - Side panel chuyển xuống dưới main content.
- Mobile:
  - Header, tab và card giảm kích thước.
  - Card chuyển sang layout gọn hơn.
  - Padding dưới đủ để không bị bottom navigation che.

## Điểm cần giải thích khi báo cáo

- Trang này hoàn thiện phần cuối của nhóm `public-discovery`.
- Dù chưa có backend, người dùng vẫn có thể thao tác thật:
  - Lọc thông báo.
  - Đọc từng thông báo.
  - Đọc tất cả.
  - Ẩn thông báo.
  - Click chuyển trang liên quan.
- Thiết kế đã chuẩn bị cho backend bằng cách tách rõ các hành vi cần API.

## Kiểm tra

- Chạy build sau khi triển khai:

```bash
npm run build
```
