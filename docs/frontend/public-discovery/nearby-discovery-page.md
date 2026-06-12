# Nearby Discovery Page

## Giao Diện Hoàn Thành

Trang khám phá địa điểm gần bạn trong nhóm `public-discovery`.

Route:

```text
/nearby
```

Trang này dùng cho luồng người dùng muốn xem nhanh các địa điểm gần vị trí hiện tại. Giao diện được chuyển từ thiết kế tĩnh `interface_design/nearby_discovery__desktop__base` sang React page hoạt động bằng mock API.

## File Được Thêm

- `apps/web/src/features/nearby/pages/NearbyDiscoveryPage.jsx`
  - Page component chính của trang `/nearby`.
  - Gọi `getPlaces()` để lấy địa điểm gần người dùng.
  - Sắp xếp kết quả theo `distanceValue`.
  - Có search, category filter và quick filter.
  - Đồng bộ selected place giữa danh sách card và mini map.
  - Cho phép lưu/bỏ lưu địa điểm bằng `toggleSavedPlace()`.
  - Click card chuyển sang `/places/:placeId`.
  - Click chỉ đường chuyển sang `/map?place=:placeId`.

- `apps/web/src/features/nearby/pages/NearbyDiscoveryPage.css`
  - Layout desktop 2 cột: danh sách bên trái, map panel sticky bên phải.
  - Mobile chuyển thành một cột, ẩn mini map để ưu tiên danh sách card.
  - Style riêng cho banner định vị, chip filter, selected place, suggestions và insight card.

## File Được Sửa

- `apps/web/src/app/App.jsx`
  - Import `NearbyDiscoveryPage`.
  - Thêm route:

```jsx
<Route path="nearby" element={<NearbyDiscoveryPage />} />
```

- `apps/web/src/features/feed/pages/HomeFeedPage.jsx`
  - Nút `Xem thêm` trong section `Gần bạn` chuyển sang `/nearby`.

## Mock Data / Service

- Dùng `getPlaces()` từ `apps/web/src/services/place.service.js`.
- Dùng `mockPlaces` gián tiếp qua service.
- Dùng `mapPlaces` từ `apps/web/src/data/mockMap.js` để lấy tọa độ marker cho mini map.
- Dùng `getSavedPlaceIds()` và `toggleSavedPlace()` cho saved state bằng localStorage.

## Logic Chính

- `keyword`: từ khóa tìm kiếm trong trang Nearby.
- `activeCategory`: category hiện tại, ví dụ `all`, `cafe`, `food`, `rooftop`.
- `activeFilters`: filter nhanh như `Đang mở`, `4.5+ sao`, `Có ưu đãi`.
- `selectedPlaceId`: địa điểm đang được chọn để highlight card và marker.
- `places`: danh sách địa điểm đã lọc và sắp xếp theo khoảng cách.

## Trạng Thái Đã Có

- Loading state khi mock API đang tải.
- Error state khi service lỗi.
- Empty state khi không có địa điểm phù hợp.
- Selected state cho card và marker.
- Saved state cho PlaceCard.

## Responsive

- Desktop:
  - Grid 2 cột.
  - Danh sách card 2 cột.
  - Map panel sticky bên phải.

- Mobile:
  - Giao diện 1 cột.
  - Card địa điểm giữ 2 cột như Explore.
  - Ẩn mini map để tránh chiếm chiều cao màn hình.
  - Selected place card được đưa lên trước phần gợi ý.

## Ghi Chú Giải Thích

Trang `/nearby` khác `/map` ở mục đích sử dụng:

- `/nearby`: ưu tiên danh sách địa điểm gần người dùng, có map hỗ trợ.
- `/map`: ưu tiên tương tác trên bản đồ, có preview địa điểm.

Sau này khi có backend, chỉ cần thay `getPlaces()` bằng API thật có query theo location/radius, component gần như không cần đổi nhiều.
