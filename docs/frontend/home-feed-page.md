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
- Feed card giữ tinh thần thiết kế:
  - media-first
  - card bo lớn
  - overlay trên ảnh
  - badge thịnh hành
  - action rail nổi trên media
  - hashtag chip
  - CTA địa điểm/chỉ đường

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

