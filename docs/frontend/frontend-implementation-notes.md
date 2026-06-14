# ChillPlace Frontend Implementation Notes

File này là mục lục tổng cho các ghi chú triển khai frontend của dự án ChillPlace.

Mỗi nhóm giao diện có một thư mục riêng trong `docs/frontend/`. Khi hoàn thành một trang, tạo hoặc cập nhật một file Markdown riêng trong đúng thư mục nhóm để ghi lại route, file code, mock data/service, component và các điểm cần giải thích khi báo cáo.

## Các Nhánh Công Việc

- `feature/frontend-foundation-layout`
- `feature/frontend-public-discovery`
- `feature/frontend-auth-user`
- `feature/frontend-creator-center`
- `feature/frontend-business-center`
- `feature/frontend-admin-dashboard`
- `feature/frontend-polish-responsive`

## Quy Ước Lưu Ghi Chú

```text
docs/frontend/<ten-nhom>/<ten-giao-dien>.md
```

Ví dụ:

- `docs/frontend/foundation-layout/design-system-appshell-layout.md`
- `docs/frontend/public-discovery/home-feed-page.md`
- `docs/frontend/public-discovery/explore-search-page.md`

## Nhóm Giao Diện Và Trang

### Foundation Layout

Nhóm này phụ trách nền tảng giao diện dùng chung cho toàn bộ frontend.

| Trang / Hạng mục                     | Route    | Note                                                                                   | Trạng thái    |
| ------------------------------------ | -------- | -------------------------------------------------------------------------------------- | ------------- |
| Design System + AppShell/Layout Tổng | Toàn app | [design-system-appshell-layout.md](foundation-layout/design-system-appshell-layout.md) | Đã triển khai |

Nội dung chính:

- Design tokens chung: màu, font, radius, shadow, spacing.
- AppShell tổng: desktop sidebar, mobile header, bottom navigation.
- Component dùng chung: button, icon button, avatar, tag chip.
- Responsive base cho desktop/mobile.

### Public Discovery

Nhóm này phụ trách luồng khám phá công khai: xem feed, tìm kiếm, xem địa điểm, bản đồ, lưu nội dung và xem chi tiết bài viết.

| Trang / Hạng mục      | Route                            | Note                                                                  | Trạng thái    |
| --------------------- | -------------------------------- | --------------------------------------------------------------------- | ------------- |
| Home Feed Page        | `/`                              | [home-feed-page.md](public-discovery/home-feed-page.md)               | Đã triển khai |
| Explore/Search Page   | `/explore`                       | [explore-search-page.md](public-discovery/explore-search-page.md)     | Đã triển khai |
| Search Results Page   | `/search`, `/search?q=<keyword>` | [search-results-page.md](public-discovery/search-results-page.md)     | Đã triển khai |
| Nearby Discovery Page | `/nearby`                        | [nearby-discovery-page.md](public-discovery/nearby-discovery-page.md) | Đã triển khai |
| Interactive Map Page  | `/map`, `/map?place=<placeId>`   | [interactive-map-page.md](public-discovery/interactive-map-page.md)   | Đã triển khai |
| Place Detail Page     | `/places/:placeId`               | [place-detail-page.md](public-discovery/place-detail-page.md)         | Đã triển khai |
| Post Detail Page      | `/posts/:postId`                 | [post-detail-page.md](public-discovery/post-detail-page.md)           | Đã triển khai |
| Favorites/Saved Page  | `/saved`, `/favorites`           | [favorites-saved-page.md](public-discovery/favorites-saved-page.md)   | Đã triển khai |
| Tag Detail Page       | `/tags/:tag`                     | [tag-detail-page.md](public-discovery/tag-detail-page.md)             | Đã triển khai |
| Notifications Page    | `/notifications`                 | [notifications-page.md](public-discovery/notifications-page.md)       | Đã triển khai |

Nội dung chính:

- Feed dạng Reels vertical snap.
- Bộ lọc feed: For You, Gần bạn, Đang hot, Xu hướng, Theo dõi.
- Search và Explore tách vai trò rõ ràng.
- Nearby Discovery ưu tiên danh sách địa điểm gần người dùng.
- Mock API cho địa điểm, search, filter, saved state.
- localStorage cho địa điểm đã lưu, tìm kiếm gần đây, filter đã chọn.
- Điều hướng giữa Home, Explore, Search, Nearby, Map, Place Detail, Post Detail, Saved.

### Auth User

Nhóm này phụ trách các màn hình xác thực và tài khoản người dùng.

| Trang / Hạng mục     | Route dự kiến      | Note                                                         | Trạng thái        |
| -------------------- | ------------------ | ------------------------------------------------------------ | ----------------- |
| Login Page           | `/login`           | [login-page.md](auth-user/login-page.md)                     | Đã triển khai     |
| Register Page        | `/register`        | [register-page.md](auth-user/register-page.md)               | Đã triển khai     |
| Forgot Password Page | `/forgot-password` | [forgot-password-page.md](auth-user/forgot-password-page.md) | Đã triển khai     |
| User Profile Page    | `/profile`         | [user-profile-page.md](auth-user/user-profile-page.md)       | Đã triển khai     |
| Settings Page        | `/settings`        | [settings-page.md](auth-user/settings-page.md)               | Đã triển khai     |

### Creator Center

Nhóm này phụ trách luồng người dùng tạo nội dung.

| Trang / Hạng mục       | Route dự kiến        | Note    | Trạng thái        |
| ---------------------- | -------------------- | ------- | ----------------- |
| Create Post Page       | `/creator/posts/new` | Chưa có | Placeholder route |
| My Posts Page          | `/creator/posts`     | Chưa có | Chưa triển khai   |
| Drafts Page            | `/creator/drafts`    | Chưa có | Chưa triển khai   |
| Creator Analytics Page | `/creator/analytics` | Chưa có | Chưa triển khai   |

### Business Center

Nhóm này phụ trách luồng chủ địa điểm/doanh nghiệp.

| Trang / Hạng mục     | Route dự kiến          | Note    | Trạng thái      |
| -------------------- | ---------------------- | ------- | --------------- |
| Business Dashboard   | `/business`            | Chưa có | Chưa triển khai |
| Place Management     | `/business/places`     | Chưa có | Chưa triển khai |
| Promotion Management | `/business/promotions` | Chưa có | Chưa triển khai |
| Business Reviews     | `/business/reviews`    | Chưa có | Chưa triển khai |

### Admin Dashboard

Nhóm này phụ trách giao diện quản trị hệ thống.

| Trang / Hạng mục  | Route dự kiến    | Note    | Trạng thái      |
| ----------------- | ---------------- | ------- | --------------- |
| Admin Dashboard   | `/admin`         | Chưa có | Chưa triển khai |
| User Management   | `/admin/users`   | Chưa có | Chưa triển khai |
| Place Moderation  | `/admin/places`  | Chưa có | Chưa triển khai |
| Post Moderation   | `/admin/posts`   | Chưa có | Chưa triển khai |
| Report Management | `/admin/reports` | Chưa có | Chưa triển khai |

### Polish Responsive

Nhóm này phụ trách tối ưu cuối cùng sau khi các trang chính đã hoàn thiện.

| Trang / Hạng mục             | Phạm vi       | Note    | Trạng thái      |
| ---------------------------- | ------------- | ------- | --------------- |
| Responsive Audit             | Toàn frontend | Chưa có | Chưa triển khai |
| Accessibility Pass           | Toàn frontend | Chưa có | Chưa triển khai |
| Animation/Interaction Polish | Toàn frontend | Chưa có | Chưa triển khai |
| Performance Polish           | Toàn frontend | Chưa có | Chưa triển khai |

## Quy Trình Làm Một Trang Giao Diện

1. Xem bản thiết kế trong `interface_design/<ten-man-hinh>/`.
2. Đọc `code.html` và `screen.png` để phân tích layout, responsive và component cần tách.
3. Triển khai React: page component, component con, route, mock data/service, CSS responsive.
4. Làm giao diện hoạt động như prototype thật: search/filter/state, localStorage, loading/empty/error, điều hướng route.
5. Tối ưu desktop/mobile: kích thước, khoảng trắng, tránh tràn chữ, mobile header/bottom nav, hành vi tương tác.
6. Chạy kiểm tra:

```bash
npm run build
```

7. Tạo hoặc cập nhật note riêng trong `docs/frontend/<ten-nhom>/`.

## Nội Dung Cần Có Trong Note Riêng

- Tên trang đã hoàn thành.
- Route liên quan.
- File được thêm/sửa/xóa.
- Component chính và component con.
- Mock data/service đã dùng.
- Logic tương tác đã triển khai.
- Responsive desktop/mobile.
- Các điểm quan trọng để giải thích khi giảng viên hỏi.
- Kết quả kiểm tra build.
