# Tag Detail Page

## Trang vừa hoàn thành

Tag Detail Page cho nhóm `public-discovery`.

Route:

- `/tags/:tag`

Ví dụ:

- `/tags/cafe`
- `/tags/rooftop`
- `/tags/studyspot`

## File được thêm/sửa

### File thêm mới

- `apps/web/src/features/tags/pages/TagDetailPage.jsx`
- `apps/web/src/features/tags/pages/TagDetailPage.css`
- `docs/frontend/public-discovery/tag-detail-page.md`

### File chỉnh sửa

- `apps/web/src/app/App.jsx`
- `apps/web/src/components/common/TagChip.jsx`
- `apps/web/src/components/layout/AppShell.css`
- `apps/web/src/features/explore/components/PlaceCard.jsx`
- `apps/web/src/features/map/components/MapPlacePreview.jsx`
- `apps/web/src/features/places/pages/PlaceDetailPage.jsx`
- `apps/web/src/features/posts/pages/PostDetailPage.jsx`
- `apps/web/src/features/posts/pages/PostDetailPage.css`
- `apps/web/src/features/feed/pages/HomeFeedPage.jsx`
- `apps/web/src/features/feed/components/TrendingPanel.jsx`
- `apps/web/src/features/search/pages/SearchResultsPage.jsx`
- `docs/frontend/frontend-implementation-notes.md`

## Nội dung code đã triển khai

### `TagDetailPage.jsx`

Trang mới dùng `useParams()` để lấy `tag` từ URL, ví dụ `/tags/cafe` sẽ lấy `cafe`.

Luồng dữ liệu:

- Lọc bài viết từ `mockFeedPosts` theo `post.tags`, tên tác giả, tên địa điểm, caption và khu vực.
- Gọi `getPlaces({ keyword: cleanTag })` để lấy danh sách địa điểm liên quan từ mock API.
- Dùng `getSavedPlaceIds()` và `toggleSavedPlace()` để lưu/bỏ lưu địa điểm bằng localStorage.
- Dùng `PlaceCard` hiện có để hiển thị địa điểm, tránh viết lại card khác.

Các phần chính trên giao diện:

- Hero hashtag: tên hashtag, mô tả, nút `Tìm sâu hơn`.
- Thống kê: số bài viết, số địa điểm, tổng lượt thích ước tính.
- Hashtag liên quan: bấm vào chuyển sang `/tags/<tag-khac>`.
- Tab nội dung: `Tất cả`, `Bài viết`, `Địa điểm`.
- Bài nổi bật: lấy bài viết đầu tiên khớp hashtag.
- Grid bài viết: bấm vào bài viết chuyển sang `/posts/:postId`.
- Grid địa điểm: bấm card chuyển sang `/places/:placeId`, bấm chỉ đường chuyển sang `/map?place=<placeId>`.
- Sidebar: xu hướng liên quan, gợi ý dùng hashtag, CTA mở map theo hashtag.

### `TagDetailPage.css`

CSS tập trung vào layout gọn và chuyên nghiệp:

- Desktop dùng 2 cột: nội dung chính + sidebar phải.
- Hero không dùng nhiều khung bo tròn nặng, chỉ dùng đường chia mảnh và typography lớn.
- Đã giảm kích thước tổng thể của trang: max-width, padding, hero title, stats, featured card, sidebar card và post card.
- Grid địa điểm trong Tag Detail hiển thị 3 cột trên desktop để giống mật độ trình bày của Explore/Search.
- Related tags hiển thị một hàng có thể lướt ngang.
- Post cards dùng overlay gradient để chữ luôn đọc được.
- Place cards tái sử dụng style của Explore.
- Mobile chuyển về một cột, giảm padding, giảm chiều cao card và chừa khoảng cho bottom navigation.

### `App.jsx`

Thêm import:

```jsx
import { TagDetailPage } from "../features/tags/pages/TagDetailPage.jsx";
```

Thêm route:

```jsx
<Route path="tags/:tag" element={<TagDetailPage />} />
```

### `SearchResultsPage.jsx`

Hành vi hashtag đã đổi:

- Trước đây bấm hashtag chỉ đổi keyword trong trang Search.
- Hiện tại bấm hashtag sẽ điều hướng sang trang chi tiết hashtag:

```jsx
navigate(`/tags/${encodeURIComponent(nextKeyword)}`);
```

Vẫn lưu từ khóa vào recent searches bằng `saveRecentSearch(nextKeyword)`.

### Điều hướng hashtag toàn dự án

Đã nâng cấp `TagChip` để khi truyền `onClick`, component sẽ render thành button nhưng vẫn giữ style chip cũ. Button tự `stopPropagation()` để khi tag nằm trong card, bấm tag không làm kích hoạt click của card cha.

Các vị trí tag đã được nối về `/tags/:tag`:

- Tag trong card địa điểm `PlaceCard`.
- Tag trong preview địa điểm ở Map.
- Tag trong Place Detail.
- Tag trong Post Detail, cả desktop và mobile caption.
- Tag trong Home Feed sidebar mục `Xu hướng`.
- Tag trong `TrendingPanel`.
- Tag trong Tag Detail featured post và related tags.

## Mock data/service sử dụng

- `apps/web/src/data/mockFeed.js`
  - `mockFeedPosts`
  - `mockTrendingTags`
- `apps/web/src/services/place.service.js`
  - `getPlaces`
  - `getSavedPlaceIds`
  - `toggleSavedPlace`

## Tương tác đã hoạt động

- Truy cập trực tiếp `/tags/:tag`.
- Bấm hashtag trong Search Results để mở Tag Detail.
- Chuyển tab giữa tất cả/bài viết/địa điểm.
- Bấm bài viết để mở Post Detail.
- Bấm địa điểm để mở Place Detail.
- Bấm chỉ đường để mở Map.
- Bấm lưu địa điểm trong PlaceCard để lưu localStorage.
- Bấm hashtag liên quan để chuyển sang tag khác.
- Bấm `Tìm sâu hơn` để chuyển sang `/search?q=<tag>`.

## Điểm cần giải thích khi báo cáo

Trang này giúp hoàn thiện luồng discovery theo hashtag:

- Home/Search có hashtag.
- Search trả kết quả hashtag.
- Tag Detail gom nội dung theo hashtag.
- Từ Tag Detail có thể đi tiếp sang Post Detail, Place Detail, Map hoặc Search.

Thiết kế hiện tại vẫn dùng mock data nhưng tổ chức giống app thật. Sau này khi có backend, chỉ cần thay phần lấy dữ liệu bằng API như:

```js
GET /api/tags/:tag
GET /api/tags/:tag/posts
GET /api/tags/:tag/places
```

Component UI gần như không cần sửa nhiều.

## Kiểm tra

- Đã chạy `npm run build` trong `apps/web`.
- Kết quả: build thành công.
