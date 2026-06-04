# Explore/Search Page `/explore`

## Phần Vừa Hoàn Thành

Đã triển khai giao diện **Explore/Search Page** cho route `/explore` và `/search`.

Trang này dựa trên các prototype:

- `interface_design/explore_search__responsive__base/code.html`
- `interface_design/explore_search__desktop__base/code.html`
- `interface_design/search_result__responsive__base/code.html`
- `interface_design/search_result__desktop__base/code.html`

Mục tiêu của trang là giúp người dùng tìm địa điểm theo từ khóa, danh mục, filter nhanh, rating, khoảng cách và tag. Đây là màn hình lõi thứ hai sau Home Feed, chuẩn bị dữ liệu và component cho các trang tiếp theo như Map và Place Detail.

## File Được Thêm

- `apps/web/src/data/mockExplore.js`
  - Chứa mock data cho Explore/Search.
  - Gồm:
    - `exploreCategories`
    - `exploreFilters`
    - `explorePlaces`
    - `exploreStats`
  - Dữ liệu mô phỏng place/search API:
    - địa điểm
    - category
    - rating
    - số review
    - khoảng giá
    - trạng thái mở cửa
    - tag
    - ảnh địa điểm

- `apps/web/src/features/explore/pages/ExplorePage.jsx`
  - Page component chính cho `/explore` và `/search`.
  - Render:
    - hero section
    - search bar
    - category chips
    - filter chips
    - result header
    - grid địa điểm
    - side panel desktop

- `apps/web/src/features/explore/pages/ExplorePage.css`
  - CSS riêng cho Explore/Search.
  - Mobile:
    - 1 cột
    - chip scroll ngang
    - place card full width
  - Tablet:
    - grid 2 cột
  - Desktop:
    - grid 3 cột cho place cards
    - side panel bên phải
  - Có style cho search bar, filter chips, place card, map mock panel, stats panel.

- `apps/web/src/features/explore/components/ExploreSearchBar.jsx`
  - Component search form.
  - Gồm input search, icon search và nút filter.
  - Có `role="search"` và `label` ẩn cho accessibility.

- `apps/web/src/features/explore/components/FilterChips.jsx`
  - Component chip list dùng chung cho category và filter.
  - Nhận `items` và `variant`.
  - Hỗ trợ icon và active state.

- `apps/web/src/features/explore/components/PlaceCard.jsx`
  - Component card địa điểm.
  - Hiển thị:
    - ảnh địa điểm
    - nút save
    - trạng thái mở cửa
    - category
    - rating
    - tên địa điểm
    - khu vực/khoảng cách
    - khoảng giá
    - số review
    - hashtag
    - CTA `Chi tiết` và `Chỉ đường`

- `apps/web/src/features/explore/components/ExploreSidePanel.jsx`
  - Panel phụ trên desktop.
  - Gồm:
    - mock map khu vực
    - nút mở Map
    - thống kê địa điểm/đang mở/review mới
    - ghi chú demo dùng mock data

## File Được Sửa

- `apps/web/src/app/App.jsx`
  - Import `ExplorePage`.
  - Thêm route:
    - `/explore`
    - `/search`

- `docs/frontend-implementation-notes.md`
  - Cập nhật mục lục, thêm link tới note này.

## File Bị Xóa

- Không xóa file nào.

## Chi Tiết Code Đã Triển Khai

- Tạo feature folder `features/explore`.
- Tách page và component con:
  - `ExplorePage` quản lý bố cục tổng.
  - `ExploreSearchBar` xử lý vùng search input.
  - `FilterChips` tái sử dụng cho category và filter.
  - `PlaceCard` render từng địa điểm.
  - `ExploreSidePanel` render panel phụ desktop.
- Dữ liệu chưa gọi API thật, đang dùng `mockExplore.js`.
- Style dùng CSS thuần + design tokens chung, không dùng Tailwind CDN từ prototype.
- Dùng icon `lucide-react`.
- Layout giữ đúng hướng tài liệu frontend:
  - mobile-first
  - chip filter scroll ngang
  - card grid responsive
  - desktop có panel phụ/map preview

## Route Liên Quan

- `/explore`
  - Route chính cho trang Explore/Search.

- `/search`
  - Route alias, hiện render cùng `ExplorePage`.

## Dữ Liệu Mock Đang Có

Trong `apps/web/src/data/mockExplore.js`:

- `exploreCategories`
  - Category chips: phổ biến, cafe, nhà hàng, sự kiện, chill, ưu đãi.

- `exploreFilters`
  - Filter chips: gần tôi, đang mở, giá tốt, 4.5+ sao, có review creator.

- `explorePlaces`
  - Danh sách địa điểm mock.
  - Mỗi place gồm:
    - `id`
    - `name`
    - `slug`
    - `category`
    - `area`
    - `distance`
    - `rating`
    - `reviewCount`
    - `priceRange`
    - `status`
    - `tags`
    - `imageUrl`
    - `alt`

- `exploreStats`
  - Thống kê nhỏ cho side panel desktop.

## API Dự Kiến Thay Mock Sau Này

- `GET /api/places`
  - Query dự kiến:
    - `q`
    - `category`
    - `city`
    - `district`
    - `price_min`
    - `price_max`
    - `rating_min`
    - `open_now`
    - `lat`
    - `lng`
    - `radius`
    - `sort`
    - `page`
    - `limit`

- `GET /api/tags/trending`
- `GET /api/map/places`

Interaction dự kiến:

- Save/favorite place.
- Mở Place Detail.
- Mở Map direction.
- Apply filter.
- Đồng bộ filter lên URL search params.

## Kiểm Thử Cần Chạy

Sau khi triển khai, chạy:

```bash
cd apps/web
npm run build
```

## Giải Thích Cho Giảng Viên

Nếu hỏi trang Explore/Search nằm ở đâu:

- `apps/web/src/features/explore/pages/ExplorePage.jsx`
- `apps/web/src/features/explore/pages/ExplorePage.css`

Nếu hỏi dữ liệu địa điểm lấy từ đâu:

- `apps/web/src/data/mockExplore.js`

Nếu hỏi search bar nằm ở đâu:

- `apps/web/src/features/explore/components/ExploreSearchBar.jsx`

Nếu hỏi filter/category chips nằm ở đâu:

- `apps/web/src/features/explore/components/FilterChips.jsx`

Nếu hỏi một card địa điểm được render như thế nào:

- `apps/web/src/features/explore/components/PlaceCard.jsx`

Nếu hỏi panel bên phải desktop nằm ở đâu:

- `apps/web/src/features/explore/components/ExploreSidePanel.jsx`

Nếu hỏi route `/explore` được khai báo ở đâu:

- `apps/web/src/app/App.jsx`

## Việc Cần Làm Tiếp Theo

- Đồng bộ search/filter vào URL search params.
- Thêm empty state khi không có kết quả.
- Thêm loading/skeleton cho place grid.
- Tạo route `/places/:slug` và dùng `slug` trong `PlaceCard`.
- Nối API `GET /api/places` khi backend hoàn thiện.

