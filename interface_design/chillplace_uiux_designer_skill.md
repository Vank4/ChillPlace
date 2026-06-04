---
name: chillplace-uiux-designer
description: chuyên phân tích đặc tả dự án chillplace/vibemap và tạo tài liệu, prompt, checklist hoặc hướng dẫn thiết kế ui/ux frontend chuyên nghiệp. dùng khi người dùng yêu cầu thiết kế giao diện, phân tích từng trang, tạo frontend ui/ux guide, chia nhóm màn hình, đề xuất bố cục, theme, design system, animation, icon động, component, responsive, hoặc roadmap triển khai giao diện cho dự án chillplace hoặc các dự án social + map + food review tương tự.
---

# ChillPlace UI/UX Designer

## Mục tiêu

Dùng skill này để biến file đặc tả ChillPlace/VibeMap thành tài liệu hoặc hướng dẫn thiết kế giao diện chuyên nghiệp cho dev frontend, UI designer, hoặc người làm đồ án React. Kết quả phải giống một bản đặc tả UI/UX có thể triển khai ngay: rõ số lượng trang, nhóm giao diện, bố cục từng trang, component cần dùng, animation, icon, responsive, state, dữ liệu cần hiển thị và thứ tự triển khai.

## Bối cảnh sản phẩm mặc định

ChillPlace/VibeMap là nền tảng khám phá địa điểm ăn uống, cafe, vui chơi, check-in và sự kiện dạng Social + Map. Trải nghiệm lõi gồm:

- Feed/Reels: lướt video, album ảnh, review, ưu đãi, sự kiện.
- Search/Explore: tìm kiếm địa điểm theo tên, danh mục, khu vực, giá, rating, khoảng cách, giờ mở cửa và hashtag.
- Map: xem địa điểm trên bản đồ, tìm gần tôi, marker, popup preview.
- Place Detail: chi tiết địa điểm, media, review, menu, ưu đãi, bản đồ mini.
- Creator Center: đăng review, quản lý bài, xem analytics.
- Business Center: quản lý trang quán, media, menu, promotion, phản hồi review.
- Admin Dashboard: duyệt role, place, post, report, user, tag.
- Content & Tag Management: hashtag, trending tag, tag detail, tag selector, recommendation theo tag.

Nếu người dùng chưa cung cấp đủ thông tin, mặc định thiết kế theo hướng: modern social travel app, mobile-first, visual-first, video/image-heavy, trẻ trung, sinh động, có thể demo tốt trong đồ án React.

## Công nghệ UI mặc định

Ưu tiên stack sau khi lập tài liệu hoặc hướng dẫn triển khai:

- React + Vite cho SPA.
- React Router cho routing public/protected/role-based.
- Tailwind CSS cho styling, responsive, token hóa giao diện.
- shadcn/ui hoặc Headless/Radix pattern cho component có accessibility tốt.
- Motion for React/Framer Motion cho page transition, modal, card hover, shared layout, scroll animation, gesture.
- Lucide React cho icon tĩnh rõ nét.
- LottieFiles, Lordicon hoặc Rive cho icon động, empty state, success state, onboarding, loading minh họa.
- Leaflet + OpenStreetMap cho Map UI.
- TanStack Query cho server state nếu tài liệu cần đề xuất implementation frontend.
- Zustand hoặc Context API cho auth, role, theme, location, favorites cache.

Không lạm dụng animation. Motion phải phục vụ feedback, định hướng chú ý, trạng thái hệ thống và cảm giác app-like; tránh làm chậm thao tác chính.

## Design direction bắt buộc

Thiết kế ChillPlace theo phong cách:

- Modern social travel app: giống tinh thần TikTok/Reels + Foody + Google Maps, nhưng không sao chép nguyên xi.
- Mobile-first: ưu tiên màn hình điện thoại, feed vertical, bottom nav, bottom sheet filter/map.
- Visual-first: ảnh/video chiếm vai trò trung tâm; text ngắn, rõ; card nhiều không gian trắng.
- Friendly & energetic: dùng màu nóng cho CTA, gradient nhẹ, badge, chip, emoji/animated icon có kiểm soát.
- Trustworthy dashboard: Admin/Business/Creator dùng bố cục sạch, data table rõ, stats card, trạng thái màu chuẩn.

### Token màu mặc định

- Primary: `#FF6B35` dùng cho CTA, tab active, icon active, highlight hashtag.
- Primary hover: `#F45A24`.
- Secondary: `#1F4E79` dùng cho header, dashboard, link quan trọng.
- Accent: `#14B8A6` dùng cho map/location, trạng thái khám phá, chip phụ.
- Background light: `#F8FAFC`.
- Surface: `#FFFFFF`.
- Surface soft: `#FFF7ED` hoặc `#F1F5F9`.
- Background dark: `#0F172A`.
- Text: `#111827`.
- Muted text: `#6B7280`.
- Border: `#E5E7EB`.
- Success: `#22C55E`.
- Warning: `#F59E0B`.
- Danger: `#EF4444`.

### Typography mặc định

- Font: Inter, Manrope, Plus Jakarta Sans hoặc Be Vietnam Pro.
- Heading: đậm, tracking chặt nhẹ, dùng size rõ tầng bậc.
- Body: dễ đọc, line-height thoáng.
- Caption/metadata: nhỏ hơn, màu muted, không làm rối card.

### Shape, spacing, shadow

- Radius: `16px`, `20px`, `24px`; dashboard card có thể `16px`, social/feed card `24px`.
- Spacing: dùng hệ 4px/8px; khoảng cách giữa section tối thiểu 24px.
- Shadow: mềm, không quá đậm; ưu tiên elevation nhẹ và border tinh tế.
- Glass/blur: chỉ dùng cho floating nav, bottom sheet, map controls, overlay trên media.

## Accessibility và hiệu năng

Luôn thêm phần accessibility nếu tạo tài liệu triển khai:

- Đảm bảo contrast text/background đạt mức dễ đọc.
- Nút/tap target mobile tối thiểu khoảng 44px.
- Có trạng thái focus-visible rõ ràng.
- Animation cần tôn trọng `prefers-reduced-motion`.
- Icon không được là nguồn thông tin duy nhất; cần label, tooltip hoặc aria-label.
- Form phải có label, error message rõ, helper text.
- Skeleton/loading không gây layout shift.
- Lazy-load ảnh/video, dùng thumbnail, pause video ngoài viewport.
- Với feed video, chỉ autoplay item đang active; cho phép mute/unmute rõ ràng.

## Quy trình tạo tài liệu UI/UX

Khi người dùng yêu cầu phân tích hoặc tạo tài liệu giao diện, làm theo thứ tự:

1. Đọc file đặc tả hoặc nội dung dự án nếu có.
2. Xác định actor, module, route, workflow và dữ liệu hiển thị.
3. Lập danh sách toàn bộ giao diện, tách thành giao diện chung tái sử dụng và giao diện riêng.
4. Gom giao diện thành nhóm triển khai theo thứ tự trước sau.
5. Với mỗi nhóm, viết mục tiêu, màn hình thuộc nhóm, component dùng chung, API/data cần, animation, icon động, trạng thái cần xử lý.
6. Với mỗi trang/màn hình, viết tối thiểu các phần: giới thiệu, mục đích, người dùng, route, layout, nội dung hiển thị, component chính, interaction, animation/icon, responsive, state, empty/loading/error, lưu ý triển khai.
7. Kết thúc bằng roadmap triển khai UI, checklist nghiệm thu, thư viện icon/animation đề xuất và tiêu chuẩn chất lượng.

Không chỉ liệt kê tên trang. Phải phân tích để dev frontend đọc là hiểu phải xây gì, nhìn như thế nào, dữ liệu lấy từ đâu và thứ tự làm ra sao.

## Phân loại giao diện mặc định cho ChillPlace

Nếu không có yêu cầu khác, dùng inventory mặc định gồm 39 giao diện/trang. Có thể điều chỉnh theo file đặc tả mới hơn.

### A. Giao diện chung tái sử dụng

1. AppShell/Layout tổng
2. Navbar/Header
3. Sidebar desktop
4. Bottom Navigation mobile
5. Auth Modal/Login Required Modal
6. Search Overlay/Command Search
7. Filter Panel/Bottom Sheet
8. Media Viewer/Lightbox
9. Confirm Modal
10. Toast/Notification UI
11. Empty State
12. Loading/Skeleton State
13. Error State
14. DataTable Layout
15. Form Layout
16. Detail Page Template

### B. Public và discovery

17. Home Feed Page `/`
18. Explore/Search Page `/explore`
19. Map Page `/map`
20. Place Detail Page `/places/:slug`
21. Post Detail/Reel Page `/posts/:id`
22. Tag Detail/Hashtag Feed Page `/tags/:slug`
23. Trending Tags Page hoặc section mở rộng

### C. Auth và user

24. Login Page `/login`
25. Register Page `/register`
26. Profile Page `/profile`
27. Edit Profile Page `/profile/edit`
28. Favorites/Saved Places Page `/favorites`
29. Notifications Page `/notifications`
30. Upgrade Creator Page `/upgrade/creator`
31. Upgrade Business Page `/upgrade/business`

### D. Creator

32. Creator Dashboard `/creator`
33. Create Review Page `/creator/posts/new`
34. Edit Creator Post Page `/creator/posts/:id/edit`
35. Creator Analytics Page `/creator/analytics`

### E. Business

36. Business Dashboard `/business`
37. Business Place Profile Page `/business/place`
38. Promotion/Event Form Page `/business/promotions/new`
39. Business Reviews/Replies Page `/business/reviews`

### F. Admin

Nếu phạm vi admin cần tách sâu, bổ sung các màn hình sau và tăng tổng số trang tương ứng:

- Admin Dashboard `/admin`
- Admin Users `/admin/users`
- Admin Role Requests `/admin/role-requests`
- Admin Places `/admin/places`
- Admin Posts `/admin/posts`
- Admin Reports `/admin/reports`
- Admin Tags `/admin/tags`
- Admin Categories `/admin/categories`

Khi người dùng yêu cầu “tổng cộng bao nhiêu trang”, phải nêu rõ cách đếm: nếu gộp admin thành một dashboard nhiều tab thì tổng khác; nếu tách route admin riêng thì tổng tăng.

## Nhóm triển khai mặc định theo thứ tự

### Nhóm 1: Design system và layout nền

Làm trước để các màn hình sau thống nhất.

Bao gồm: AppShell, Navbar, Sidebar, BottomNav, Button, Input, Card, Badge, TagChip, Avatar, RatingStars, Modal, Toast, Skeleton, Empty State, Error State, DataTable, Form Layout.

Yêu cầu thiết kế: token màu, typography, spacing, shadow, dark mode foundation, responsive breakpoints, animation variants chuẩn.

### Nhóm 2: Public discovery MVP

Bao gồm: Home Feed, Explore/Search, Map, Place Detail, Post Detail, Tag Detail.

Mục tiêu: Guest có thể khám phá nội dung chính của sản phẩm. Ưu tiên giao diện đẹp, nhiều media, filter rõ, map dễ dùng.

### Nhóm 3: Auth và user workflow

Bao gồm: Login, Register, Profile, Edit Profile, Favorites, Notifications, Upgrade Creator, Upgrade Business.

Mục tiêu: User có tài khoản, tương tác được, gửi yêu cầu nâng cấp role.

### Nhóm 4: Creator experience

Bao gồm: Creator Dashboard, Create Review, Edit Post, Creator Analytics.

Mục tiêu: Creator tạo nội dung review hấp dẫn, gắn địa điểm/tag, xem hiệu quả nội dung.

### Nhóm 5: Business experience

Bao gồm: Business Dashboard, Business Place Profile, Promotion/Event Form, Business Reviews/Replies.

Mục tiêu: Business quản lý trang quán, media, ưu đãi và phản hồi khách hàng.

### Nhóm 6: Admin và moderation

Bao gồm: Admin Dashboard, Users, Role Requests, Places, Posts, Reports, Tags, Categories.

Mục tiêu: Admin kiểm duyệt dữ liệu, đảm bảo nội dung đáng tin cậy, xử lý report/tag vi phạm.

### Nhóm 7: Polish, animation, responsive, demo

Bao gồm: microinteraction, page transition, empty/loading/error, mobile bottom sheet, dark mode, performance pass, accessibility pass, demo data.

## Template phân tích từng giao diện

Khi viết mô tả cho từng trang, dùng cấu trúc sau:

```markdown
### [Tên giao diện] `[route]`

**Loại giao diện:** chung tái sử dụng / public / user / creator / business / admin.

**Mục tiêu:** giao diện này giúp ai làm việc gì.

**Người dùng:** Guest/User/Creator/Business/Admin.

**Bố cục desktop:** mô tả theo vùng: header, sidebar, content, right rail, card/grid/table/modal.

**Bố cục mobile:** mô tả bottom nav, bottom sheet, scroll behavior, sticky CTA.

**Nội dung hiển thị:** danh sách dữ liệu, field, trạng thái, badge, chip, media.

**Component chính:** liệt kê component cần tạo/tái sử dụng.

**Interaction:** click, hover, tap, drag, filter, search, save, like, comment, upload, approve/reject.

**Animation/icon động:** animation nên dùng, icon tĩnh/động gợi ý, trạng thái nào cần Lottie/Lordicon/Rive.

**State cần xử lý:** loading, empty, error, permission denied, unauthenticated, optimistic update nếu có.

**Dữ liệu/API liên quan:** endpoint hoặc service frontend cần gọi.

**Lưu ý triển khai:** responsive, accessibility, performance, role guard, validation.
```

## Animation guideline cho ChillPlace

Sử dụng animation theo nguyên tắc “nhanh, rõ, có mục đích”.

- Page transition: fade + slight slide 8-16px, duration 180-280ms.
- Card hover desktop: lift 2-4px, shadow tăng nhẹ, image zoom 1.03.
- Tap mobile: scale 0.96-0.98, ripple/glow nhẹ.
- Feed item: snap scroll, active video fade-in, action button pop khi like/save.
- Like animation: heart burst hoặc confetti nhỏ, không quá 700ms.
- Save animation: bookmark fill + bounce nhẹ.
- Map marker: pulse nhẹ cho selected marker; marker clustering nếu mở rộng.
- Modal/bottom sheet: overlay fade, sheet slide-up, drag handle.
- Dashboard stats: count-up number, chart reveal, skeleton shimmer.
- Upload media: drag-over glow, upload progress ring, success check animation.
- Empty state: dùng Lottie/Rive minh họa nhỏ, text và CTA rõ.
- Error state: icon cảnh báo động nhẹ, nút retry.

Luôn cung cấp tùy chọn tắt/giảm motion qua `prefers-reduced-motion`.

## Icon và animated asset guideline

Nguồn đề xuất:

- Lucide React: navigation, action, dashboard, map, search, user, admin.
- Lordicon: animated icon cho search empty, map pin, notification, upload, success, warning.
- LottieFiles: empty state, onboarding, loading, success, no internet, no results.
- Rive: mascot hoặc icon tương tác nâng cao nếu dự án muốn nổi bật.

Quy tắc dùng:

- Icon động chỉ dùng ở trạng thái quan trọng: onboarding, empty, success, upload, notification, map/location, achievement.
- Không dùng icon động dày đặc trong table/admin vì gây nhiễu.
- Kích thước icon động thông thường: 48-96px trong empty state, 20-28px trong button/notification nếu thật cần.
- Luôn có fallback icon SVG tĩnh nếu animation không tải được.

## Component system cần khuyến nghị

Khi tạo guide, luôn đề xuất component theo nhóm:

### Foundation

- AppShell
- PageHeader
- SectionHeader
- Container
- ResponsiveGrid
- Card
- Button
- IconButton
- Input
- Textarea
- Select
- Badge
- TagChip
- Avatar
- RatingStars

### Feedback

- ToastProvider
- ConfirmModal
- LoadingSkeleton
- EmptyState
- ErrorState
- ProgressBar
- UploadProgress

### Media/Social

- FeedItem
- VideoPlayer
- ImageCarousel
- MediaViewer
- InteractionBar
- CommentDrawer
- SaveButton
- FollowButton
- ShareSheet

### Discovery/Map

- SearchBar
- SearchOverlay
- SearchFilters
- FilterBottomSheet
- PlaceCard
- PlacePreviewPopup
- MapView
- PlaceMarker
- NearbyButton

### Dashboard/Form

- StatsCard
- DataTable
- StatusBadge
- ActionMenu
- FormSection
- UploadMediaBox
- TagSelector
- AnalyticsChart

## Output expectations

Khi người dùng yêu cầu tạo file/tài liệu, nội dung phải có:

1. Executive summary cho dev frontend.
2. Design direction và UI theme.
3. Công nghệ UI/UX/frontend đề xuất.
4. Tổng số giao diện và cách phân loại.
5. Danh sách route/pages.
6. Nhóm triển khai theo thứ tự.
7. Phân tích chi tiết từng giao diện bằng template chuẩn.
8. Component architecture.
9. Animation/icon động guideline.
10. Responsive guideline.
11. Accessibility/performance checklist.
12. Roadmap frontend.
13. Checklist nghiệm thu UI/UX.

Nếu người dùng yêu cầu “chuyên nghiệp, hiện đại, thịnh hành”, phải cụ thể hóa bằng token, component, layout, motion, icon source, responsive behavior và ví dụ triển khai; không dùng mô tả chung chung.

## Quality checklist trước khi trả lời

Trước khi hoàn tất, tự kiểm tra:

- Có nêu rõ tổng số trang/giao diện và cách đếm chưa?
- Có tách giao diện chung và giao diện riêng chưa?
- Có xếp nhóm triển khai trước sau chưa?
- Mỗi giao diện có mục đích, bố cục, component, animation/icon, state, responsive chưa?
- Có phù hợp ChillPlace: Feed + Search + Map + Place Detail + Creator + Business + Admin + Tags chưa?
- Có tránh lạm dụng animation và có accessibility chưa?
- Có đủ để dev frontend đọc và triển khai không cần hỏi lại quá nhiều chưa?
