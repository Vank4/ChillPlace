# Interactive Map Page `/map`

## Phần Vừa Hoàn Thành

Đã triển khai giao diện **Interactive Map Page** cho route `/map`.

Trang này dựa trên các prototype:

- `interface_design/interactive_map__responsive__polished/code.html`
- `interface_design/interactive_map__mobile__animated/code.html`
- `interface_design/interactive_map__desktop__base/code.html`
- `interface_design/interactive_map__desktop__animated/code.html`

Mục tiêu của trang là tạo trải nghiệm bản đồ khám phá địa điểm: search trên bản đồ, filter nhanh, marker địa điểm, vị trí hiện tại, preview địa điểm được chọn và CTA chỉ đường.

## File Được Thêm

- `apps/web/src/data/mockMap.js`
  - Chứa mock data cho Map Page.
  - Reuse `explorePlaces` từ `mockExplore.js`.
  - Thêm metadata riêng cho marker:
    - `x`
    - `y`
    - `icon`
    - `tone`
  - Export:
    - `mapFilters`
    - `mapPlaces`
    - `selectedMapPlace`

- `apps/web/src/features/map/pages/MapPage.jsx`
  - Page component chính cho route `/map`.
  - Render:
    - `MapCanvas`
    - `MapSearchBar`
    - `MapFilterBar`
    - summary địa điểm
    - `MapPlacePreview`

- `apps/web/src/features/map/pages/MapPage.css`
  - CSS riêng cho Map Page.
  - Tạo mock map visual bằng CSS:
    - grid nền
    - road lines
    - park blocks
    - current location radar
    - marker pulse
  - Responsive:
    - Mobile: map full screen, search/filter nổi trên map, preview bottom sheet.
    - Tablet/Desktop: search/filter nổi trái, preview panel bên phải.

- `apps/web/src/features/map/components/MapSearchBar.jsx`
  - Component search trên bản đồ.
  - Có input, icon search, nút filter và nút locate.
  - Có `label` ẩn cho accessibility.

- `apps/web/src/features/map/components/MapFilterBar.jsx`
  - Component filter chips cho Map.
  - Dùng `mapFilters`.

- `apps/web/src/features/map/components/MapCanvas.jsx`
  - Component canvas bản đồ mock.
  - Render nền map visual bằng CSS.
  - Render current location radar.
  - Render danh sách marker từ `mapPlaces`.

- `apps/web/src/features/map/components/MapMarker.jsx`
  - Component marker địa điểm.
  - Nhận `place` và `selected`.
  - Marker đặt vị trí bằng `left/top` theo phần trăm.
  - Có marker pulse, icon và label địa điểm.

- `apps/web/src/features/map/components/MapPlacePreview.jsx`
  - Component preview địa điểm được chọn.
  - Hiển thị ảnh, category, rating, tên, vị trí, trạng thái, giá, tags.
  - Có CTA `Chi tiết` và `Chỉ đường`.

## File Được Sửa

- `apps/web/src/app/App.jsx`
  - Import `MapPage`.
  - Thêm route:
    - `/map`

- `docs/frontend-implementation-notes.md`
  - Cập nhật mục lục, thêm link tới note này.

## File Bị Xóa

- Không xóa file nào.

## Chi Tiết Code Đã Triển Khai

- Tạo feature folder `features/map`.
- Dựng Map Page theo hướng mock visual trước, chưa dùng Leaflet thật.
- Map visual được tạo bằng CSS để demo nhanh:
  - nền gradient
  - grid đường phố
  - road lines
  - park shapes
  - marker pulse
  - current location radar
- Marker lấy dữ liệu từ `mapPlaces`.
- Preview địa điểm reuse dữ liệu place từ Explore/Search để tránh mock trùng lặp.
- Layout giữ đúng hướng tài liệu frontend:
  - mobile full-screen map
  - bottom sheet preview
  - desktop floating search/filter
  - desktop preview panel bên phải

## Route Liên Quan

- `/map`
  - Hiển thị `MapPage`.
  - Đây là route public cho bản đồ khám phá địa điểm.

## Dữ Liệu Mock Đang Có

Trong `apps/web/src/data/mockMap.js`:

- `mapFilters`
  - Filter chips: tất cả, cafe, ăn tối, đang mở, ưu đãi.

- `mapPlaces`
  - Dựa trên `explorePlaces`.
  - Bổ sung thông tin marker:
    - vị trí phần trăm trên map mock
    - icon marker
    - tone màu marker

- `selectedMapPlace`
  - Địa điểm đang được preview mặc định.

## API Dự Kiến Thay Mock Sau Này

- `GET /api/map/places`
  - Query dự kiến:
    - `north`
    - `south`
    - `east`
    - `west`
    - `category`
    - `open_now`
    - `lat`
    - `lng`
    - `radius`

- `GET /api/places/:slug`

Interaction dự kiến:

- Click marker để chọn địa điểm.
- Pan/zoom map bằng Leaflet.
- Lấy geolocation thật.
- Filter marker theo category/open now.
- Mở Place Detail.
- Mở chỉ đường qua app bản đồ ngoài.

## Kiểm Thử Cần Chạy

Sau khi triển khai, chạy:

```bash
cd apps/web
npm run build
```

## Cập Nhật Functional Mock Prototype

Map Page đã được nâng từ giao diện tĩnh sang prototype hoạt động bằng mock API/state, dùng chung service địa điểm với Explore.

- `apps/web/src/data/mockMap.js`
  - Đổi nguồn dữ liệu từ `explorePlaces` sang `mockPlaces`.
  - Giữ metadata riêng cho bản đồ:
    - `x`, `y` để đặt marker theo phần trăm trên mock map.
    - `icon`, `tone` để đổi icon/màu marker.
  - Tăng marker metadata để hỗ trợ toàn bộ danh sách 12 địa điểm mock.
  - `mapFilters` được sửa lại tiếng Việt có dấu.

- `apps/web/src/features/map/pages/MapPage.jsx`
  - Thêm state cho:
    - keyword search.
    - selected filter.
    - danh sách places.
    - selected place id.
    - loading/error.
  - Gọi `getPlaces(...)` từ `place.service.js` để lọc marker theo:
    - keyword.
    - category.
    - đang mở.
    - ưu đãi.
  - Đọc query param `?place=:id` để tự chọn marker/preview tương ứng.
  - Khi bấm marker sẽ cập nhật selected place và đồng bộ URL bằng `setSearchParams`.
  - Nút locate reset keyword/filter về trạng thái mặc định.
  - Search submit lưu recent search bằng `saveRecentSearch`.
  - Nút filter trong search bar dùng để giả lập lỗi API.

- `apps/web/src/features/map/components/MapSearchBar.jsx`
  - Đổi từ input tĩnh `defaultValue` sang controlled input.
  - Nhận `value`, `onChange`, `onSubmit`, `onLocate`, `onMockError`.

- `apps/web/src/features/map/components/MapFilterBar.jsx`
  - Nhận `selectedFilter` và `onSelect`.
  - Filter button có `aria-pressed`.

- `apps/web/src/features/map/components/MapCanvas.jsx`
  - Nhận `places`, `selectedPlaceId`, `onSelectPlace`.
  - Marker render theo dữ liệu đã lọc.

- `apps/web/src/features/map/components/MapMarker.jsx`
  - Marker bấm được.
  - Bấm marker gọi `onSelect(place.id)`.
  - Có `aria-pressed` cho trạng thái đang chọn.

- `apps/web/src/features/map/components/MapPlacePreview.jsx`
  - Preview nhận `onOpenDetail`, `onDirections`.
  - Bấm `Chi tiết` chuyển sang `/places/:id`.
  - Bấm `Chỉ đường` giữ route map và query `?place=:id`.
  - Có empty state khi không có địa điểm phù hợp.

- `apps/web/src/features/map/pages/MapPage.css`
  - Thêm style `.map-preview--empty` cho empty preview.

Build kiểm tra:

```text
✓ built in 2.05s
```

## Giải Thích Cho Giảng Viên

Nếu hỏi trang Map nằm ở đâu:

- `apps/web/src/features/map/pages/MapPage.jsx`
- `apps/web/src/features/map/pages/MapPage.css`

Nếu hỏi dữ liệu marker lấy từ đâu:

- `apps/web/src/data/mockMap.js`

Nếu hỏi nền bản đồ mock được dựng như thế nào:

- `apps/web/src/features/map/components/MapCanvas.jsx`
- `apps/web/src/features/map/pages/MapPage.css`

Nếu hỏi marker được render ở đâu:

- `apps/web/src/features/map/components/MapMarker.jsx`

Nếu hỏi search/filter map nằm ở đâu:

- `apps/web/src/features/map/components/MapSearchBar.jsx`
- `apps/web/src/features/map/components/MapFilterBar.jsx`

Nếu hỏi preview địa điểm nằm ở đâu:

- `apps/web/src/features/map/components/MapPlacePreview.jsx`

Nếu hỏi route `/map` khai báo ở đâu:

- `apps/web/src/app/App.jsx`

## Việc Cần Làm Tiếp Theo

- Thêm state chọn marker thật bằng `useState`.
- Thay mock map visual bằng Leaflet + OpenStreetMap.
- Kết nối geolocation thật.
- Nối API `GET /api/map/places`.
- Đồng bộ filter map với query params.
- Tạo route Place Detail `/places/:slug`.
