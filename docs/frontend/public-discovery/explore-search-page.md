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

## Cập Nhật Tối Ưu Nút Place Card

Trang Explore/Search được chỉnh phần CTA trong từng card địa điểm để hạn chế lỗi xuống dòng khi màn hình bị thu hẹp hoặc trình duyệt zoom:

- `apps/web/src/features/explore/pages/ExplorePage.css`
  - `.place-card__actions` đổi sang `repeat(2, minmax(0, 1fr))` để hai nút được phép co giãn trong card.
  - Gap giữa hai nút dùng `clamp(...)` thay vì kích thước cố định.
  - `.place-card__actions .button` được override riêng:
    - `min-width: 0`.
    - `white-space: nowrap`.
    - Font nhỏ hơn bằng `clamp(11px, 0.92vw, 13px)`.
    - Padding ngang co giãn bằng `clamp(8px, 1vw, 14px)`.
    - Chiều cao dùng `clamp(36px, 3.4vw, 42px)`.
  - Thêm breakpoint `1180px - 1320px` để ở layout desktop 3 cột, nút nhỏ gọn hơn khi card bị hẹp.

Build kiểm tra:

```text
✓ built in 2.08s
```

## Cập Nhật Functional Mock Prototype

Explore/Search đã được nâng từ giao diện mock tĩnh thành frontend functional prototype. Chưa cần backend thật, nhưng các thao tác chính đã chạy giống app thật bằng mock API, state và localStorage.

- `apps/web/src/mocks/places.mock.js`
  - Tạo mock data riêng cho địa điểm.
  - Mỗi place có các trường phục vụ UI và filter:
    - `id`, `slug`, `name`, `category`, `categoryId`.
    - `area`, `distance`, `distanceValue`.
    - `rating`, `reviewCount`, `priceRange`.
    - `status`, `statusCode`.
    - `tags`, `hasCreatorReview`, `hasDeal`.
    - `imageUrl`, `alt`, `description`.

- `apps/web/src/services/place.service.js`
  - Tạo service giả lập API:
    - `getPlaces(params)`.
    - `getPlaceById(placeId)`.
    - `toggleSavedPlace(placeId)`.
    - `getSavedPlaceIds()`.
    - `saveRecentSearch(keyword)`.
    - `getRecentSearches()`.
    - `saveSelectedFilters(filters)`.
    - `getSelectedFilters()`.
  - `getPlaces` có delay giả lập network.
  - Có filter theo:
    - keyword.
    - category.
    - open now.
    - rating tối thiểu.
    - ưu đãi.
    - review creator.
    - saved only.
  - Dữ liệu người dùng được giả lập bằng localStorage:
    - `chillplace.savedPlaces`.
    - `chillplace.recentSearches`.
    - `chillplace.selectedFilters`.

- `apps/web/src/features/explore/pages/ExplorePage.jsx`
  - Thêm state cho:
    - search keyword.
    - selected category.
    - selected filters.
    - places result.
    - saved place ids.
    - loading/error.
  - Gọi `getPlaces(params)` mỗi khi search/filter đổi.
  - Có loading state: `Dang tai du lieu...`.
  - Có empty state: `Khong tim thay dia diem phu hop.`.
  - Có error state giả lập bằng nút filter icon trong search bar.
  - Bấm category/filter sẽ lọc danh sách thật trong mock service.
  - Submit search sẽ lưu recent search vào localStorage.
  - Bấm bookmark sẽ lưu/bỏ lưu place trong localStorage.
  - Bấm `Chi tiet` chuyển sang `/places/:placeId`.
  - Bấm `Chi duong` chuyển sang `/map?place=:placeId`.

- `apps/web/src/features/explore/components/ExploreSearchBar.jsx`
  - Đổi từ input `defaultValue` sang controlled input.
  - Nhận `value`, `onChange`, `onSubmit`, `onMockError`.

- `apps/web/src/features/explore/components/FilterChips.jsx`
  - Nhận `selectedIds` và `onSelect`.
  - Button có `aria-pressed` để phản ánh active state.

- `apps/web/src/features/explore/components/PlaceCard.jsx`
  - Nhận `isSaved`, `onOpenDetail`, `onOpenMap`, `onToggleSave`.
  - Bookmark đổi màu khi đã lưu.
  - CTA `Chi tiet` và `Chi duong` đã có hành động thật.

- `apps/web/src/features/explore/components/ExploreSidePanel.jsx`
  - Nhận `resultCount`, `keyword`, `onOpenMap`.
  - Nút `Mo Map` chuyển sang route `/map`.

- `apps/web/src/features/places/pages/PlaceDetailPage.jsx`
  - Thêm route chi tiết địa điểm.
  - Lấy dữ liệu bằng `getPlaceById(placeId)`.
  - Có loading/not found state.
  - Có nút lưu địa điểm và chỉ đường.

- `apps/web/src/features/saved/pages/SavedPlacesPage.jsx`
  - Thêm trang danh sách địa điểm đã lưu.
  - Lấy dữ liệu bằng `getPlaces({ savedOnly: true })`.
  - Dữ liệu phụ thuộc localStorage bookmark.

- `apps/web/src/features/prototype/pages/PrototypePage.jsx`
  - Tạo placeholder route dùng chung cho các trang chưa làm sâu.

- `apps/web/src/app/App.jsx`
  - Thêm routes:
    - `/places/:placeId`.
    - `/favorites`.
    - `/saved`.
    - `/settings`.
    - `/creator/posts/new`.
    - `/profile`.

Build kiểm tra:

```text
✓ built in 2.11s
```

## Cập Nhật Dữ Liệu Có Dấu Và Mock Phong Phú Hơn

Sau khi kiểm tra giao diện Explore, một số chuỗi mới thêm trong functional mock prototype đang bị mất dấu vì trước đó dùng ASCII để tránh lỗi encoding. Phần này đã được sửa lại:

- `apps/web/src/mocks/places.mock.js`
  - Khôi phục dữ liệu hiển thị tiếng Việt có dấu:
    - `Cà phê`, `Nhà hàng`, `Sự kiện`, `Đang mở`, `Sắp đóng`, `Thảo Điền`, `Bình Thạnh`, `Phú Nhuận`, ...
  - Tăng mock data từ 6 địa điểm lên 12 địa điểm.
  - Bổ sung thêm các địa điểm để kết quả mặc định nhộn nhịp hơn:
    - `Mưa Coffee Lab`.
    - `Nắng Rooftop Cafe`.
    - `Sách & Sip Study Cafe`.
    - `Bếp Nhỏ Brunch`.
    - `Acoustic Alley`.
    - `Hidden Tea Garden`.

- `apps/web/src/services/place.service.js`
  - `normalizeText` được nâng cấp để bỏ dấu tiếng Việt khi search:
    - Người dùng gõ `cafe`, `ca phe`, hoặc `cà phê` đều có thể match dữ liệu có dấu.
    - Có xử lý riêng ký tự `đ` thành `d`.

- Các file UI được sửa lại text tiếng Việt có dấu:
  - `apps/web/src/features/explore/pages/ExplorePage.jsx`.
  - `apps/web/src/features/explore/components/ExploreSearchBar.jsx`.
  - `apps/web/src/features/explore/components/FilterChips.jsx`.
  - `apps/web/src/features/explore/components/PlaceCard.jsx`.
  - `apps/web/src/features/explore/components/ExploreSidePanel.jsx`.
  - `apps/web/src/features/places/pages/PlaceDetailPage.jsx`.
  - `apps/web/src/features/saved/pages/SavedPlacesPage.jsx`.
  - `apps/web/src/features/prototype/pages/PrototypePage.jsx`.
  - `apps/web/src/app/App.jsx`.

Build kiểm tra:

```text
✓ built in 2.07s
```

## Cập Nhật Explore Mobile Compact Grid

Sau khi test responsive viewport điện thoại, giao diện Explore bị phồng to do hero, search, chips và place card dùng kích thước gần desktop. Đã tối ưu lại riêng cho mobile:

- `apps/web/src/features/explore/pages/ExplorePage.css`
  - Thêm media query `@media (max-width: 759px)`.
  - Giảm padding tổng của `.explore-page` xuống `12px`.
  - Thu nhỏ hero:
    - Eyebrow `10px`.
    - H1 dùng `clamp(26px, 8vw, 34px)`.
    - Mô tả `12px`, line-height thấp hơn.
  - Thu nhỏ search bar:
    - Height khoảng `42px`.
    - Icon/button nhỏ hơn.
    - Border radius nhỏ hơn.
  - Thu nhỏ filter chips:
    - Height `32px - 34px`.
    - Font `11px`.
    - Padding ngang nhỏ hơn.
  - `.explore-page__grid` trên mobile đổi thành `repeat(2, minmax(0, 1fr))`.
  - Place card mobile compact:
    - Radius `16px`.
    - Media thấp hơn.
    - Save button/status nhỏ hơn.
    - Body padding `9px`.
    - Title `13px`, giới hạn 2 dòng.
    - Location/meta `10px`.
    - Ẩn tag list trên mobile để card không quá cao.
    - CTA button nhỏ lại còn khoảng `30px` chiều cao.

Build kiểm tra:

```text
✓ built in 2.17s
```

## Cập Nhật Mobile Card Và Bottom Nav Gọn Hơn

Sau khi test tiếp ở responsive viewport điện thoại, card địa điểm vẫn có nguy cơ lấn nút `Chỉ đường` ra ngoài, đồng thời bottom navigation còn hơi cao.

- `apps/web/src/features/explore/pages/ExplorePage.css`
  - Giảm thêm kích thước text trong place card mobile:
    - Title từ `13px` xuống `12px`.
    - Location/meta xuống `9px`.
    - CTA button xuống `9px`, icon `11px`.
  - Thêm breakpoint `max-width: 430px`:
    - CTA button font `8px`.
    - Padding nhỏ hơn.
    - Icon `10px`.
  - Mục tiêu: giữ `Chi tiết` và `Chỉ đường` trên một dòng, tránh tràn khỏi card.

- `apps/web/src/components/layout/AppShell.css`
  - Thêm media query mobile cho `.bottom-nav`.
  - Giảm chiều cao, padding, border radius, font và icon.
  - Mục tiêu: thanh điều hướng dưới nằm gọn sát đáy hơn, ít che nội dung card.

Build kiểm tra:

```text
✓ built in 2.08s
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
