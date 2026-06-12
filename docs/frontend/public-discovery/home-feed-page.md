# Home Feed Page `/`

## Phần Vừa Hoàn Thành

Đây là giao diện route đầu tiên có nội dung thật. Màn hình được triển khai dựa trên các prototype:

- `interface_design/home_feed__responsive__polished/code.html`
- `interface_design/home_feed__mobile__animated/code.html`
- `interface_design/home_feed__desktop__base/code.html`

Mục tiêu là tạo màn hình demo rõ nhất cho ChillPlace: feed khám phá địa điểm dạng social, có ảnh lớn, thông tin địa điểm, hashtag, creator, like/comment/save/share và panel gợi ý.

## File Được Thêm

- `apps/web/src/data/mockFeed.js`
  - Chứa dữ liệu mock cho Home Feed.
  - Gồm `mockCurrentUser`, `mockStories`, `mockTrendingTags`, `mockFeedPosts`.
  - Dữ liệu mô phỏng user, place, post, media, tag, interaction counts.

- `apps/web/src/features/feed/pages/HomeFeedPage.jsx`
  - Page component cho route `/`.
  - Render hero section, tab filter mock, `StoryRail`, danh sách `FeedItem`, `TrendingPanel`.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - CSS riêng cho Home Feed.
  - Mobile: 1 cột.
  - Tablet: feed có max-width.
  - Desktop: layout 2 cột, feed chính + side panel.
  - Style cho hero, story rail, feed card, media overlay, action rail, tag list, trending/map side panel.

- `apps/web/src/features/feed/components/StoryRail.jsx`
  - Component hiển thị avatar/story ngang.
  - Dùng `mockStories`.

- `apps/web/src/features/feed/components/FeedItem.jsx`
  - Component card bài viết chính.
  - Hiển thị author, media, badge thịnh hành, badge địa điểm, place, rating, caption, hashtag và CTA.
  - Dùng `Avatar`, `Button`, `TagChip`, `FeedActionRail`.

- `apps/web/src/features/feed/components/FeedActionRail.jsx`
  - Component action rail cho bài viết.
  - Action gồm like, comment, save, share.
  - Dùng icon `Heart`, `MessageCircle`, `Bookmark`, `Send`.

- `apps/web/src/features/feed/components/TrendingPanel.jsx`
  - Panel phụ trên desktop.
  - Hiển thị hashtag đang hot và card gợi ý mở bản đồ.

## File Được Sửa

- `apps/web/src/app/App.jsx`
  - Import và render `HomeFeedPage` ở route `/`.

## File Bị Xóa

- Không xóa file nào.

## Chi Tiết Code Đã Triển Khai

- Tạo feature folder `features/feed`.
- Tách page và component con:
  - Page chịu trách nhiệm render bố cục tổng và truyền dữ liệu.
  - Component con nhận props và hiển thị UI.
- Dữ liệu feed hiện dùng mock data trong `mockFeed.js`.
- Media tạm dùng ảnh remote từ prototype để giữ cảm giác thiết kế.
- CSS dùng token chung, không dùng Tailwind CDN.
- Home Feed đã được chỉnh từ dạng social card feed sang **Reels vertical snap feed**:
  - Mỗi `FeedItem` chiếm một khung reel trong viewport feed.
  - Container `.home-feed-page__list` dùng `overflow-y: auto` và `scroll-snap-type: y mandatory`.
  - Mỗi `.feed-item` dùng `scroll-snap-align: start` và `scroll-snap-stop: always`.
  - Media chiếm toàn bộ reel frame.
  - Author, caption, place, hashtag và CTA được overlay ở phía dưới media.
  - Action rail like/comment/save/share nằm bên phải media.
  - Badge thịnh hành và địa điểm nằm overlay phía trên media.
  - Desktop giữ sidebar trái và panel gợi ý phải; phần giữa là reel frame gọn, không còn card feed dài như Instagram.

## Cập Nhật Hoàn Thiện Reels Toolbar

Sau khi chuyển Home Feed sang Reels vertical snap feed, giao diện desktop 100% bị chiếm nhiều chiều cao bởi cụm `ChillPlace Reels`, tab filter và story rail. Phần này đã được tinh chỉnh lại để chuyên nghiệp hơn:

- `apps/web/src/features/feed/pages/HomeFeedPage.jsx`
  - Thêm `useState` để quản lý trạng thái mở/thu story rail.
  - Thay cụm hero cũ bằng `.home-feed-page__toolbar`.
  - Toolbar hiện cố định các thông tin quan trọng gồm:
    - Nhãn `ChillPlace Reels`.
    - Tiêu đề `Dành cho bạn`.
    - Bộ lọc `For You`, `Gần bạn`, `Đang hot`.
    - Nút `Stories` để mở/thu story rail khi cần.
  - Story rail không còn luôn chiếm diện tích phía trên feed, chỉ render khi `showStories = true`.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - Thêm style cho `.home-feed-page__toolbar`, `.home-feed-page__toolbar-actions`, `.home-feed-page__stories-toggle`, `.home-feed-page__stories`.
  - Tăng chiều cao hữu dụng của `.home-feed-page__list` khi story rail đang đóng:
    - Mặc định: `height: clamp(560px, calc(100dvh - 150px), 780px)`.
    - Khi mở Stories: `.home-feed-page.has-stories .home-feed-page__list` giảm chiều cao để không vỡ bố cục.
  - Sửa lỗi avatar trong Reels bị phóng to che media:
    - Đổi selector từ `.feed-item__media img` sang `.feed-item__media > img`.
    - Đổi hover selector từ `.feed-item:hover .feed-item__media img` sang `.feed-item:hover .feed-item__media > img`.
    - Lý do: trong `.feed-item__media` có cả ảnh media chính và avatar nằm trong overlay. Selector cũ áp dụng `width: 100%; height: 100%` cho toàn bộ ảnh con, nên avatar bị kéo full khung.
  - Bổ sung z-index cho scrim, badge và action rail để overlay xếp lớp rõ ràng.
  - Giảm nhẹ kích thước overlay text/CTA để reel không bị chật ở desktop.

## Cập Nhật Reels Theo Kiểu TikTok

Sau khi review giao diện ở desktop, phần Reels được chỉnh tiếp để ưu tiên trải nghiệm xem bài đăng rõ ràng hơn:

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - Toolbar phía trên đổi sang nền trong suốt:
    - `.home-feed-page__toolbar` bỏ border, background, shadow và blur.
    - Cụm `ChillPlace Reels`, `Dành cho bạn`, tab filter và nút `Stories` vẫn nằm cùng vùng trên cùng nhưng không còn dạng card.
  - Reel frame chiếm nhiều chiều cao hơn:
    - `.home-feed-page__list` dùng `height: calc(100dvh - 118px)`.
    - Khi mở Stories, `.home-feed-page.has-stories .home-feed-page__list` tự giảm chiều cao để không vỡ layout.
  - Action rail được đặt gọn bên phải, giảm kích thước nút để hạn chế che media.

- `apps/web/src/features/feed/components/FeedActionRail.jsx`
  - Thêm avatar creator lên đầu action rail.
  - Thêm nút follow nhỏ dạng dấu `+` đè dưới avatar giống pattern TikTok.
  - Thêm action `Xem địa điểm` dạng icon định vị `MapPin`, nằm dưới nút comment.
  - Thứ tự action rail hiện tại:
    - Avatar + follow.
    - Like.
    - Comment.
    - Xem địa điểm.
    - Save.
    - Share.

- `apps/web/src/features/feed/components/FeedItem.jsx`
  - Bỏ avatar và nút `Theo dõi` khỏi overlay nội dung dưới bài đăng.
  - Bỏ cụm CTA đáy `Xem địa điểm` và `Chỉ đường`.
  - Overlay chỉ còn thông tin cần đọc:
    - Tên creator.
    - Username + thời gian.
    - Tên địa điểm, khu vực, khoảng cách.
    - Rating.
    - Caption.
    - Hashtag.
  - Nút `Chỉ đường` sẽ được xử lý sau trong flow `Xem địa điểm` như yêu cầu.

## Cập Nhật Full-Card Reels Overlay

Theo mẫu Reels mới, Home Feed được chuyển tiếp sang dạng full-card giống TikTok/mobile reels:

- `apps/web/src/features/feed/pages/HomeFeedPage.jsx`
  - Bỏ toolbar ngoài của page.
  - Bỏ `StoryRail` và `TrendingPanel` khỏi route Home để màn hình tập trung vào bài đăng.
  - Page chỉ render `.home-feed-page__list` và từng `FeedItem`.

- `apps/web/src/features/feed/components/FeedItem.jsx`
  - Thêm topbar nằm trong media:
    - Text `ChillPlace Reels`.
    - Icon tìm kiếm.
    - Icon menu.
  - Thêm tab filter nằm trong media:
    - `For You`.
    - `Gần bạn`.
    - `Đang hot`.
  - Chuyển badge `Thịnh hành` và thông tin vị trí xuống cụm pill ở đáy bài đăng.
  - Nội dung đáy giữ ngắn hơn để hạn chế che hình:
    - Creator.
    - Tên địa điểm.
    - Rating.
    - Caption giới hạn 2 dòng.
    - Pill `Thịnh hành` và `khu vực · khoảng cách`.

- `apps/web/src/features/feed/components/FeedActionRail.jsx`
  - Dải nút bên phải theo thứ tự:
    - Avatar + follow dấu `+`.
    - Like.
    - Comment.
    - Vị trí.
    - Share.
    - More.
  - Bỏ save khỏi dải nút ở bản này để sát mẫu hơn và giảm icon che media.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - `.home-feed-page` chuyển thành một cột, max-width `520px`.
  - `.home-feed-page__list` rộng `430px`, cao `calc(100dvh - 36px)`.
  - Thêm style cho `.feed-item__topbar`, `.feed-item__top-actions`, `.feed-item__tabs`, `.feed-item__meta-pills`.
  - Action rail nhỏ hơn, nền tối trong suốt hơn để ít che nội dung.
  - Overlay đáy chuyển sát góc dưới, giới hạn caption 2 dòng.

## Cập Nhật Section Phụ Bên Phải Home Feed

Home Feed được bổ sung thêm một section nằm trong `.home-feed-page`, đặt bên phải section reel chính trên desktop:

- `apps/web/src/features/feed/pages/HomeFeedPage.jsx`
  - Import thêm `Search`, `TrendingUp`, `Plus` từ `lucide-react`.
  - Import thêm `mockTrendingTags`.
  - Thêm `<section className="home-feed-page__side" aria-label="Gợi ý khám phá">`.
  - Section phụ gồm:
    - Ô search giả lập `.home-feed-page__search`.
    - Card `Xu hướng` dùng `mockTrendingTags`.
    - Card `Gần bạn` dùng 2 bài trong `mockFeedPosts`.
    - Nút tạo bài nhanh `.home-feed-page__quick-add`.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - `.home-feed-page__side` mặc định `display: none` trên màn nhỏ để không phá trải nghiệm Reels.
  - Ở desktop `min-width: 1180px`, `.home-feed-page` đổi thành grid 2 cột:
    - Cột trái `430px` cho Reels.
    - Cột phải `178px` cho panel gợi ý.
  - Thêm style cho:
    - `.home-feed-page__search`.
    - `.home-feed-page__side-card`.
    - `.home-feed-page__trend-tags`.
    - `.home-feed-page__map-preview`.
    - `.home-feed-page__nearby-list`.
    - `.home-feed-page__nearby-item`.
    - `.home-feed-page__quick-add`.
  - Panel phải dùng `position: sticky` để bám theo viewport khi desktop lướt feed.

## Cập Nhật Chiều Cao Viewport

Sau khi kiểm tra giao diện desktop, phần dưới cùng còn một khoảng trắng do Home Feed đang trừ chiều cao bằng `calc(100dvh - 36px)`.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - `.home-feed-page` đổi `min-height` sang `100dvh`.
  - `.home-feed-page__list` đổi `height` sang `100dvh`.
  - Bỏ giới hạn `max-height` của reel bằng `max-height: none`.
  - Desktop `.home-feed-page__side` đổi `min-height` sang `100dvh`, `top: 0`.
  - Mục tiêu: section reel và section phụ bên phải chạm hết chiều cao vùng content, không còn dải trắng dưới cùng.

## Cập Nhật Cải Thiện Bố Cục Desktop

Sau khi review các điểm còn yếu của Home Feed desktop, giao diện được tinh chỉnh tiếp để cân bằng hơn và dễ hiểu hơn:

- `apps/web/src/features/feed/pages/HomeFeedPage.jsx`
  - Import thêm `Flame`, `SlidersHorizontal`, `Sparkles`.
  - Thêm `quickFilters` gồm `Cafe`, `Rooftop`, `Study`, `Ăn uống`.
  - Cột phải `.home-feed-page__side` bổ sung:
    - Card `Bộ lọc nhanh`.
    - Card `Địa điểm hot`.
    - Card `Gợi ý cho anh`.
  - Nút tạo bài nhanh đổi từ nút icon `+` đơn lẻ sang nút có nhãn `Tạo bài viết`.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - Desktop grid đổi từ `430px 178px` sang `430px 210px` để cột phải có đủ không gian hiển thị nội dung.
  - Thêm style cho:
    - `.home-feed-page__quick-filters`.
    - `.home-feed-page__hot-list`.
    - `.home-feed-page__hot-item`.
    - `.home-feed-page__interest-card`.
  - `.home-feed-page__quick-add` đổi thành nút pill full-width có icon và nhãn.
  - `.feed-item__scrim` tăng bottom gradient để chữ ở đáy video luôn rõ trên ảnh sáng.
  - `.feed-item__tabs button` tăng tương phản cho tab chưa active:
    - Nền tối hơn.
    - Border trắng mờ rõ hơn.
    - Chữ trắng hơn.
  - `.feed-item__tabs button.is-active` giữ màu cam nhưng tăng shadow nhẹ để trạng thái active rõ hơn.

- Chưa triển khai sidebar compact trong lần này.
  - Lý do: sidebar thuộc `AppShell`, ảnh hưởng toàn bộ route như Explore, Map, Favorites.
  - Nên tách thành task responsive layout riêng sau khi hoàn thiện nhóm giao diện Home/Public Discovery.

## Cập Nhật Giảm Nội Dung Cột Phải

Sau khi thêm nhiều module vào cột phải, trang desktop xuất hiện thanh cuộn dọc do tổng chiều cao panel vượt viewport.

- `apps/web/src/features/feed/pages/HomeFeedPage.jsx`
  - Xóa card `Gợi ý cho anh`.
  - Xóa import icon `Sparkles`.
  - Giữ lại các module có giá trị thao tác cao hơn:
    - `Xu hướng`.
    - `Bộ lọc nhanh`.
    - `Gần bạn`.
    - `Địa điểm hot`.
    - Nút `Tạo bài viết`.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - Xóa style `.home-feed-page__interest-card`.
  - Giảm gap cột phải desktop từ `10px` xuống `9px`.
  - Giảm `padding-top` cột phải từ `8px` xuống `6px`.
  - Mục tiêu: bỏ phần nội dung ít cần thiết để tránh body scrollbar, thay vì ép panel tự cuộn riêng.

## Cập Nhật Responsive Section Phải

Section phụ bên phải được cải thiện để co giãn tốt hơn khi zoom trình duyệt hoặc dùng màn hình laptop nhỏ:

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - Desktop breakpoint đổi từ `min-width: 1180px` xuống `min-width: 1080px`.
  - Grid desktop đổi từ kích thước cố định `430px 210px` sang:
    - Reel: `minmax(380px, 430px)`.
    - Section phải: `minmax(170px, clamp(170px, 18vw, 240px))`.
  - `.home-feed-page` dùng `width/max-width: min(100%, 760px)` để layout không tràn khi viewport thu hẹp.
  - Gap giữa reel và panel phải dùng `clamp(10px, 1.3vw, 18px)`.
  - Các phần trong cột phải dùng kích thước linh hoạt:
    - Search height: `clamp(28px, 3.2dvh, 32px)`.
    - Card padding: `clamp(9px, 1vw, 12px)`.
    - Map preview: `clamp(74px, 8.5vw, 96px)`.
    - Button tạo bài: `clamp(36px, 4dvh, 40px)`.
  - Thêm media query `max-width: 1240px` để thu nhỏ thumbnail/list item.
  - Thêm media query `max-height: 820px` để giảm padding, map preview và chiều cao item khi zoom làm viewport thấp hơn.

## Cập Nhật Vị Trí Section Phải

Section phụ bên phải được chỉnh để nằm gần mép phải màn hình hơn thay vì đi sát cụm reel ở giữa:

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - Desktop grid đổi từ 2 cột sang 4 cột:
    - Cột đệm trái co giãn.
    - Cột reel chính.
    - Cột khoảng trống co giãn.
    - Cột section phải.
  - `.home-feed-page__main` được đặt ở `grid-column: 2`.
  - `.home-feed-page__side` được đặt ở `grid-column: 4`.
  - `.home-feed-page` dùng `width: 100%`, `max-width: none` để tận dụng toàn bộ vùng content.
  - Thêm `padding-right: clamp(12px, 2vw, 28px)` để section phải gần mép phải nhưng không dính sát mép.

## Cập Nhật Tách Reels Chrome Khỏi Bài Đăng

Topbar `ChillPlace Reels` và tab `For You / Gần bạn / Đang hot` được chuyển ra khỏi `FeedItem` để không bị render lặp lại ở từng bài khi lướt feed:

- `apps/web/src/features/feed/components/FeedItem.jsx`
  - Xóa import `Menu`, `Search`.
  - Xóa markup:
    - `.feed-item__topbar`.
    - `.feed-item__top-actions`.
    - `.feed-item__tabs`.
  - `FeedItem` hiện chỉ còn nội dung thuộc riêng từng bài:
    - Media.
    - Scrim.
    - Action rail.
    - Author/place/rating/caption/meta pills.

- `apps/web/src/features/feed/pages/HomeFeedPage.jsx`
  - Import thêm `Menu`.
  - Thêm `.home-feed-page__reels-chrome` trong `.home-feed-page__main`, nằm ngoài `.home-feed-page__list`.
  - Bên trong gồm:
    - `.home-feed-page__reels-topbar`.
    - `.home-feed-page__reels-actions`.
    - `.home-feed-page__reels-tabs`.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - `.home-feed-page__main` đổi thành `position: relative` để chứa chrome overlay.
  - `.home-feed-page__reels-chrome` dùng `position: absolute`, `z-index: 20`, phủ phía trên khung reel.
  - Đổi selector CSS từ `.feed-item__topbar`, `.feed-item__top-actions`, `.feed-item__tabs` sang các class `home-feed-page__reels-*`.
  - Mục tiêu: chrome Reels hiển thị một lần cố định trên khung feed, không lặp theo từng `FeedItem`.

## Cập Nhật Ẩn Hiện Reels Tabs

Ba tab `For You`, `Gần bạn`, `Đang hot` được chuyển thành popover mở từ icon menu 3 gạch để giao diện reel gọn hơn:

- `apps/web/src/features/feed/pages/HomeFeedPage.jsx`
  - Thêm `useState`, `useEffect`, `useRef`.
  - Thêm state `tabsPinned`, `tabsHovered`.
  - Hover vào icon menu 3 gạch:
    - `tabsHovered = true`, tabs hiện ra.
    - Rời chuột khỏi icon/menu tabs thì tabs tự ẩn sau một delay ngắn.
  - Click icon menu 3 gạch:
    - `tabsPinned = true`, tabs giữ mở.
  - Click ra ngoài `.home-feed-page__reels-menu-button` và `.home-feed-page__reels-tabs`:
    - `tabsPinned = false`, tabs đóng lại.
  - Thêm `aria-expanded` và `aria-controls` cho nút menu.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - `.home-feed-page__reels-tabs` chuyển sang `position: absolute`.
  - Mặc định tabs có `opacity: 0`, `pointer-events: none`, `transform: translateY(-8px) scale(0.98)`.
  - Khi có class `.is-visible`, tabs hiện bằng opacity/transform transition.
  - `.home-feed-page__reels-menu-button.is-open` đổi nền cam để báo menu đang mở.

## Cập Nhật Bỏ Hover Zoom Media

Hiệu ứng hover làm ảnh trong reel phóng to đã được gỡ để phù hợp hơn với feed kiểu TikTok:

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - Xóa `transition: transform 700ms ease` khỏi `.feed-item__media > img`.
  - Xóa selector `.feed-item:hover .feed-item__media > img`.
  - Lý do: bài đăng sau này có thể là video hoặc album nhiều ảnh; hover zoom media có thể làm lệch cảm giác xem nội dung và ảnh hưởng khung hiển thị.

## Cập Nhật Media Stage Theo Ratio

Feed item được chuyển sang mô hình media stage giống TikTok hơn, để ảnh/video dọc, ngang, vuông giữ đúng tỉ lệ thay vì luôn bị crop full khung:

- `apps/web/src/data/mockFeed.js`
  - Thêm metadata `mediaRatio` cho từng post:
    - `post-1`: `portrait`.
    - `post-2`: `square`.
    - `post-3`: `landscape`.

- `apps/web/src/features/feed/components/FeedItem.jsx`
  - Thêm `supportedRatios`.
  - `FeedItem` gắn class theo ratio: `feed-item--portrait`, `feed-item--square`, `feed-item--landscape`.
  - Thêm wrapper `.feed-item__stage`.
  - Chuyển `FeedActionRail` ra ngoài `.feed-item__media`, đặt cạnh media thay vì overlay trong media.
  - `.feed-item__media` chỉ chứa media, scrim và overlay nội dung bài.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - `.feed-item` đổi thành stage căn giữa bằng `display: grid; place-items: center`.
  - `.feed-item__stage` dùng grid 2 cột:
    - Cột media.
    - Cột action rail.
  - `.feed-item__media` dùng `aspect-ratio: var(--feed-media-ratio)`.
  - Các ratio được định nghĩa bằng CSS custom properties:
    - `.feed-item--portrait`: `9 / 16`.
    - `.feed-item--square`: `1 / 1`.
    - `.feed-item--landscape`: `16 / 9`.
  - `.feed-item__media > img` đổi sang `object-fit: contain`.
  - `.feed-actions` đổi từ `position: absolute` sang flow layout cạnh media.
  - `.home-feed-page__main` và desktop grid được nới rộng để landscape media có đủ không gian hiển thị.

## Route Liên Quan

- `/`
  - Hiển thị `HomeFeedPage`.
  - Đây là route public đầu tiên.

## Dữ Liệu Mock Đang Có

Trong `apps/web/src/data/mockFeed.js`:

- `mockCurrentUser`: dùng cho sidebar profile.
- `mockStories`: dùng cho story rail.
- `mockTrendingTags`: dùng cho panel hashtag.
- `mockFeedPosts`: dữ liệu post gồm `id`, `type`, `author`, `place`, `mediaUrl`, `alt`, `caption`, `tags`, `createdAt`, `isTrending`, `stats`.

## API Dự Kiến Thay Mock Sau Này

- `GET /api/feed`
- `GET /api/tags/trending`
- `GET /api/auth/me`
- `GET /api/notifications/unread-count`

Interaction dự kiến:

- Like post.
- Comment post.
- Save post/place.
- Share post.
- Follow creator.
- Open place detail.
- Open map direction.

## Kiểm Thử Đã Chạy

```bash
cd apps/web
npm run build
```

Kết quả:

```text
✓ built in 2.26s
```

Dev server:

```text
http://localhost:5173/
```

## Giải Thích Cho Giảng Viên

Nếu hỏi Home Feed nằm ở đâu:

- `apps/web/src/features/feed/pages/HomeFeedPage.jsx`
- `apps/web/src/features/feed/pages/HomeFeedPage.css`

Nếu hỏi dữ liệu bài viết lấy từ đâu:

- `apps/web/src/data/mockFeed.js`

Nếu hỏi một bài post được render như thế nào:

- `apps/web/src/features/feed/components/FeedItem.jsx`

Nếu hỏi logic lướt từng reel kiểu TikTok nằm ở đâu:

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
- Các class quan trọng:
  - `.home-feed-page__list`
  - `.feed-item`
  - `.feed-item__media`
  - `.feed-item__overlay`

Nếu hỏi nút like/comment/save/share nằm ở đâu:

- `apps/web/src/features/feed/components/FeedActionRail.jsx`

Nếu hỏi story/avatar hàng ngang nằm ở đâu:

- `apps/web/src/features/feed/components/StoryRail.jsx`

Nếu hỏi panel hashtag/map bên phải desktop nằm ở đâu:

- `apps/web/src/features/feed/components/TrendingPanel.jsx`

## Việc Cần Làm Tiếp Theo

- Thêm state thật cho like/save optimistic update.
- Thêm loading/empty/error state cho feed.
- Thêm skeleton component dùng chung.
- Tạo route placeholder cho `/explore`, `/map`, `/favorites`, `/profile`.
- Sau khi backend có API, thay `mockFeed.js` bằng service/hook như `feed.service.js`, `useFeedQuery`, `useTrendingTagsQuery`.

## Cập Nhật Media Tự Co Giãn Theo Kích Thước Thật

Home Feed tiếp tục được chỉnh để phần bài đăng không còn chỉ co theo nhóm mặc định `portrait`, `square`, `landscape`.

- `apps/web/src/features/feed/components/FeedItem.jsx`
  - Giữ `post.mediaRatio` trong mock data làm fallback khi media chưa tải xong.
  - Thêm đo kích thước thật của ảnh bằng `naturalWidth` và `naturalHeight` trong `onLoad`.
  - Tự phân loại media sau khi tải:
    - `landscape` nếu ảnh ngang.
    - `portrait` nếu ảnh dọc.
    - `square` nếu ảnh gần vuông.
  - Ghi đè CSS variables trực tiếp trên `.feed-item__media`:
    - `--feed-media-ratio`: tỉ lệ thật dạng `naturalWidth / naturalHeight`.
    - `--feed-media-width`: chiều rộng tính theo chiều cao viewport và tỉ lệ thật của media.
  - Kết quả: media tự co giãn theo khung khổ thật trong phạm vi stage lớn, còn metadata chỉ là phương án dự phòng trước khi ảnh load.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - `.feed-item__media` vẫn dùng `aspect-ratio: var(--feed-media-ratio)`.
  - `.feed-item__media` dùng `width: min(100%, var(--feed-media-width, 430px))`.
  - `.feed-item__media > img` giữ `object-fit: contain` để không crop nội dung video/ảnh ngoài ý muốn.
  - `.feed-item__stage` đổi sang `align-items: center` để ảnh dọc, ngang, vuông được căn giữa tự nhiên.
  - `.home-feed-page__list`, `.feed-item`, `.feed-item__stage` đổi nền sang `#000000` để khu vực reels không còn nền xanh đậm.

Build kiểm tra:

```bash
cd apps/web
npm run build
```

Kết quả:

```text
✓ built in 2.04s
```

## Cập Nhật Tối Ưu Mobile Home Feed

Home Feed được chỉnh riêng cho màn hình điện thoại để trải nghiệm giống Reels/TikTok hơn, tránh tình trạng header đẩy nội dung xuống và media bị bóp nhỏ.

- `apps/web/src/components/layout/AppShell.jsx`
  - Thêm `useLocation`.
  - Khi route hiện tại là `/`, `AppShell` thêm class `app-shell--home`.
  - Mục tiêu: cho phép CSS tối ưu riêng Home Feed mà không ảnh hưởng các trang khác như Explore, Map, Favorites.

- `apps/web/src/components/layout/AppShell.css`
  - Với `.app-shell--home` trên mobile:
    - Đổi nền app sang đen.
    - Xóa padding mặc định của `.app-shell__content`.
    - Ẩn `.mobile-header` để Reels topbar trong Home Feed trở thành header chính.
    - Thu gọn `.bottom-nav` để bớt che media và overlay nội dung.
  - Desktop vẫn giữ layout sidebar/app shell như cũ.

- `apps/web/src/features/feed/components/FeedItem.jsx`
  - Công thức chiều rộng media đổi sang dùng biến `--feed-media-available-height`.
  - Nhờ đó mobile có thể cấp chiều cao khả dụng riêng, không bị khóa theo công thức desktop `100dvh - 114px`.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - Thêm media query `@media (max-width: 759px)`.
  - `.home-feed-page` và `.home-feed-page__list` chiếm toàn bộ `100dvh`, nền đen, không còn card/khung trắng.
  - `.home-feed-page__reels-chrome` dùng `env(safe-area-inset-top)` để tránh vùng tai thỏ/notch.
  - `.feed-item__stage` dùng padding mobile riêng:
    - Trên: chừa chỗ cho Reels topbar.
    - Dưới: chừa chỗ cho bottom navigation.
  - `.feed-item__media` dùng `--feed-media-available-height` riêng cho mobile để ảnh/video tự co giãn tốt hơn theo viewport.
  - Action rail căn giữa theo media, nút nhỏ hơn nhẹ trên mobile.
  - Overlay text giảm font và spacing để hạn chế bị bottom nav hoặc action rail che.

Build kiểm tra:

```bash
cd apps/web
npm run build
```

Kết quả:

```text
✓ built in 2.03s
```

## Cập Nhật Mobile Reels Overlay

Sau khi kiểm tra bằng responsive viewport khoảng `400px`, mobile Home Feed được chỉnh tiếp để đúng hành vi Reels/TikTok hơn:

- `apps/web/src/components/layout/AppShell.css`
  - Thu nhỏ `.app-shell--home .bottom-nav`:
    - Giảm `min-height`.
    - Giảm `padding`.
    - Giảm font và icon trong item.
  - Mục tiêu: thanh điều hướng nằm gọn dưới màn hình, không chiếm quá nhiều chiều cao bài đăng.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - Trong media query mobile `max-width: 759px`:
    - `.feed-item__stage` đổi từ grid 2 cột sang `position: relative; display: block`.
    - `.feed-item__media` phủ toàn bộ reel bằng `width: 100%; height: 100%`.
    - `.feed-item__media > img` dùng `object-fit: cover` trên mobile để media lấp đầy màn hình reels.
    - `.feed-actions` chuyển sang `position: absolute`, overlay bên phải media thay vì chiếm một cột layout riêng.
    - `.feed-item__overlay` nằm góc dưới trái, có `bottom` tính theo chiều cao bottom nav và `safe-area`, đồng thời `right: 78px` để tránh đụng action rail.
  - Kết quả: lướt từng bài vẫn theo `scroll-snap`, nhưng bố cục mobile không còn bị chia thành 2 phần media/action riêng biệt.

Build kiểm tra:

```text
✓ built in 2.04s
```
## Cap Nhat Functional Feed Channel Va Reels Topbar

Da quay lai nang cap Home Feed de trang khong con la giao dien tinh:

- `apps/web/src/features/feed/pages/HomeFeedPage.jsx`
  - Viet lai logic page Home Feed sach hon.
  - Them state `activeFeed` de quan ly kenh feed dang xem.
  - Them 5 kenh feed:
    - `For You`
    - `Gan ban`
    - `Dang hot`
    - `Xu huong`
    - `Theo doi`
  - Moi kenh feed co logic loc mock posts:
    - `For You`: hien tat ca mock posts.
    - `Gan ban`: loc cac post co khoang cach <= 3km.
    - `Dang hot` va `Xu huong`: loc cac post `isTrending`.
    - `Theo doi`: loc theo danh sach author dang theo doi mock.
  - Khi doi kenh feed, danh sach reels tu dong scroll ve dau.
  - Side panel ben phai cung co interaction:
    - Bam hashtag se chuyen sang kenh `Xu huong`.
    - Bam `Gan ban` se chuyen sang kenh `Gan ban`.
    - Bam `Dia diem hot` se chuyen sang kenh `Dang hot`.

- `apps/web/src/features/feed/components/FeedActionRail.jsx`
  - Them state cuc bo cho follow author.
  - Nut tim co the bat/tat active state.
  - Follow button co trang thai `is-following`.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - Bo cach hien thi 3 tab lon nam ben duoi topbar.
  - Them `.home-feed-page__reels-channel-rail`.
  - 5 nut feed channel nam cung hang voi `ChillPlace Reels`, nam giua brand va cum icon search/menu.
  - Channel rail co the scroll ngang khi man hinh hep.
  - Active channel co mau cam, hover va active feedback.
  - Them style active cho like/follow trong action rail.

Build kiem tra:

```text
✓ built in 2.26s
```

## Cap Nhat Interaction Like, Comment Dock Va Side Panel

Da tiep tuc nang cap Home Feed theo yeu cau:

- `apps/web/src/features/feed/components/FeedActionRail.jsx`
  - Nut tim khong con dung nen cam khi active.
  - Khi bam tim:
    - icon trai tim duoc fill mau do.
    - giu nen trong suot/den mo nhu cac nut con lai.
  - Nut comment co the bao nguoc len `HomeFeedPage` de mo/tat comment dock.
  - Nut follow van co state cuc bo `isFollowing`.

- `apps/web/src/features/feed/components/FeedItem.jsx`
  - Nhan them props:
    - `isCommentsOpen`
    - `onToggleComments`
  - Truyen props xuong `FeedActionRail`.

- `apps/web/src/features/feed/pages/HomeFeedPage.jsx`
  - Bo icon search o topbar reels, chi giu menu icon.
  - Them state cho side panel:
    - `sideQuery`
    - `activeQuickFilter`
    - `activeTag`
  - Side panel khong con tinh:
    - Search trong side panel loc danh sach goi y.
    - Bam hashtag se active tag va chuyen feed sang `Xu huong`.
    - Bam quick filter se active filter va chuyen feed tuong ung.
    - Gan ban / Dia diem hot lay du lieu tu danh sach da filter.
  - Them state `commentPostId` de mo/tat dock binh luan theo post.
  - Them form comment mock:
    - input comment.
    - nut gui comment.
    - submit se clear input, chua goi backend.

- `apps/web/src/features/feed/pages/HomeFeedPage.css`
  - Them `.home-feed-page__comments`.
  - Desktop:
    - Khi mo comment, layout them mot cot comment nam giua reels va side panel.
    - Comment dock khong de len side panel ben phai.
  - Mobile:
    - Comment hien dang bottom sheet, giong hanh vi mobile app.
  - Side panel:
    - Search input co style rieng.
    - Tag/filter active co mau cam.
  - Like active:
    - `.feed-actions__button.is-liked` fill tim mau do.
    - Khong dung khung cam ben ngoai.

Build kiem tra:

```text
✓ built in 2.27s
```
