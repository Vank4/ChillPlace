# Search Results Page

## Giao Diện Hoàn Thành

Trang kết quả tìm kiếm `/search` trong nhóm `public-discovery`.

Trang này tách riêng khỏi Explore/Search để xử lý luồng người dùng đã nhập từ khóa và muốn xem kết quả tổng hợp theo nhiều loại dữ liệu: địa điểm, bài viết và hashtag.

## File Được Thêm

- `apps/web/src/features/search/pages/SearchResultsPage.jsx`
  - Component chính của trang Search Results.
  - Đọc từ khóa từ query URL `?q=...`.
  - Gọi mock service `getPlaces()` để lấy danh sách địa điểm.
  - Lọc bài viết từ `mockFeedPosts`.
  - Lọc hashtag từ `mockTrendingTags`.
  - Có tab chuyển giữa `Địa điểm`, `Bài viết`, `Hashtag`.
  - Có bộ lọc nhanh: `Gần tôi`, `Đang mở`, `4.5+ sao`, `Có ưu đãi`.
  - Có recent searches lấy từ localStorage qua `getRecentSearches()`.
  - Cho phép lưu/bỏ lưu địa điểm bằng `toggleSavedPlace()`.
  - Click card địa điểm chuyển sang `/places/:placeId`.
  - Click bài viết chuyển sang `/posts/:postId`.
  - Click `Xem trên map` chuyển sang `/map?q=<keyword>`.

- `apps/web/src/features/search/pages/SearchResultsPage.css`
  - Style riêng cho trang Search Results.
  - Thiết kế layout 2 cột desktop: nội dung chính và cột gợi ý bên phải.
  - Mobile ẩn cột gợi ý, thu nhỏ typography và giữ grid địa điểm 2 cột.
  - Bổ sung style cho tab, filter, search bar, post card, hashtag card, loading/error/empty state.

## File Được Sửa

- `apps/web/src/app/App.jsx`
  - Import thêm `SearchResultsPage`.
  - Route `/search` không còn dùng lại `ExplorePage`.
  - Route mới:

```jsx
<Route path="search" element={<SearchResultsPage />} />
```

- `apps/web/src/features/explore/components/ExploreSearchBar.jsx`
  - Bổ sung nút submit tìm kiếm dạng icon nằm cạnh nút filter.
  - Người dùng có thể nhấn Enter hoặc bấm icon search để chuyển sang trang `/search?q=<keyword>`.

- `apps/web/src/features/explore/pages/ExplorePage.css`
  - Chỉnh grid của search bar Explore để chứa 2 nút action: tìm kiếm và filter.

- `apps/web/src/features/search/pages/SearchResultsPage.css`
  - Giảm scale tổng của trang Search cho gần nhịp với Explore.
  - Chuyển nút tìm kiếm từ nút chữ lớn sang nút icon gọn.
  - Thu nhỏ hero, searchbar, tab, sidebar và card kết quả để giao diện chuyên nghiệp hơn.

## Luồng Hoạt Động

1. Người dùng vào `/search?q=cafe`.
2. Trang đọc query `q` và đặt từ khóa hiện tại.
3. Component gọi:

```js
getPlaces({
  keyword: submittedKeyword,
  nearby,
  openNow,
  minRating,
  hasDeal
});
```

4. Kết quả địa điểm hiển thị bằng `PlaceCard` đã dùng ở Explore.
5. Tab `Bài viết` lọc dữ liệu từ `mockFeedPosts` theo tên tác giả, địa điểm, caption và tag.
6. Tab `Hashtag` lọc từ `mockTrendingTags`.
7. Khi submit từ khóa mới, trang cập nhật URL và lưu recent search vào localStorage.

## Điểm Kết Nối Điều Hướng

- Từ `/explore`: submit ô tìm kiếm sẽ chuyển sang `/search?q=<keyword>`.
- Từ bottom navigation mobile: nút `Search` trỏ trực tiếp tới `/search`.
- Từ chính trang `/search`: submit từ khóa mới sẽ cập nhật query URL và reload kết quả theo mock API.

## Trạng Thái Đã Có

- Loading state: hiển thị khi mock API đang trả dữ liệu.
- Error state: hiển thị khi service lỗi.
- Empty state: hiển thị khi không có địa điểm hoặc bài viết phù hợp.
- Saved state: bookmark địa điểm lưu vào localStorage.
- Keyboard access: card bài viết và card địa điểm có thể mở bằng Enter/Space.

## Ghi Chú Kỹ Thuật

- Trang vẫn dùng mock frontend động, chưa cần backend thật.
- Khi backend sẵn sàng, chỉ cần thay implementation trong `place.service.js`, component Search Results gần như giữ nguyên.
- Trang tái sử dụng `PlaceCard` và CSS của Explore để giữ thống nhất thiết kế card địa điểm.
