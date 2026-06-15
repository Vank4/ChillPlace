# ChillPlace Backend Implementation Notes

File này là mục lục tổng cho các ghi chú triển khai backend của dự án ChillPlace.

Mỗi nhóm backend có một thư mục riêng trong `docs/backend/`. Khi hoàn thành một module API, tạo hoặc cập nhật một file Markdown riêng trong đúng thư mục nhóm để ghi lại endpoint, file code, database table, service rule, middleware, test và các điểm cần giải thích khi báo cáo.

## Các Nhánh Công Việc

- `feature/backend-foundation-api`
- `feature/backend-auth-user`
- `feature/backend-public-discovery-api`
- `feature/backend-social-interactions`
- `feature/backend-creator-center`
- `feature/backend-business-center`
- `feature/backend-admin-moderation`
- `feature/backend-infra-testing`

## Quy Ước Lưu Ghi Chú

```text
docs/backend/<ten-nhom>/<ten-module>.md
```

Ví dụ:

- `docs/backend/foundation-api/project-setup-response-error.md`
- `docs/backend/auth-user/auth-register-login-me.md`
- `docs/backend/public-discovery-api/feed-places-search-map.md`

## Nhóm Backend Và Module

### Foundation API

Nhóm này phụ trách nền tảng backend dùng chung cho toàn bộ API.

| Module / Hạng mục | Endpoint / Phạm vi | Note | Trạng thái |
| --- | --- | --- | --- |
| Project Setup | Express app, server, env | [project-setup.md](foundation-api/project-setup.md) | Đã triển khai |
| Database Setup | MySQL, ORM, migration, seed | [database-setup.md](foundation-api/database-setup.md) | Đã triển khai nền tảng |
| Response Helper | `success`, `message`, `data`, `pagination` | [response-helper.md](foundation-api/response-helper.md) | Đã triển khai |
| Error Handling | `AppError`, `errorHandler`, `notFoundHandler` | [error-handling.md](foundation-api/error-handling.md) | Đã triển khai |
| Validation Middleware | request params/query/body | [validation-middleware.md](foundation-api/validation-middleware.md) | Đã triển khai |
| Security Middleware | helmet, cors, rate limit | [security-middleware.md](foundation-api/security-middleware.md) | Đã triển khai |
| Upload Foundation | multer/local/cloudinary config | [upload-foundation.md](foundation-api/upload-foundation.md) | Đã triển khai local foundation |

Nội dung chính:

- Cấu trúc Express theo module: route, controller, service, validation.
- Chuẩn response thống nhất cho frontend.
- Kết nối MySQL 8.x qua Prisma hoặc Sequelize.
- `.env.example` cho local Laragon/MySQL.
- Middleware chung: auth, role, validation, upload, rate limit, error.
- Logging cơ bản: method, path, status, duration, user id nếu có.

### Auth User

Nhóm này phụ trách xác thực, tài khoản, profile và phân quyền người dùng.

| Module / Hạng mục | Endpoint / Phạm vi | Note | Trạng thái |
| --- | --- | --- | --- |
| Register | `POST /api/auth/register` | [auth-register-login-me.md](auth-user/auth-register-login-me.md) | Đã triển khai |
| Login | `POST /api/auth/login` | [auth-register-login-me.md](auth-user/auth-register-login-me.md) | Đã triển khai |
| Current User | `GET /api/auth/me` | [auth-register-login-me.md](auth-user/auth-register-login-me.md) | Đã triển khai |
| Update Profile | `PATCH /api/users/me` | [profile-public-follow.md](auth-user/profile-public-follow.md) | Đã triển khai |
| Public Profile | `GET /api/users/:username/public` | [profile-public-follow.md](auth-user/profile-public-follow.md) | Đã triển khai |
| Follow User | `POST /api/users/:id/follow` | [profile-public-follow.md](auth-user/profile-public-follow.md) | Đã triển khai |

Nội dung chính:

- JWT access token.
- Hash password bằng bcrypt.
- Middleware `requireAuth`.
- Role-based access control: `user`, `creator`, `business`, `admin`.
- Không trả `password_hash` hoặc dữ liệu nhạy cảm.
- User status: `active`, `locked`, `deleted`.

### Role Requests

Nhóm này phụ trách yêu cầu nâng cấp Creator/Business và admin duyệt role.

| Module / Hạng mục | Endpoint / Phạm vi | Note | Trạng thái |
| --- | --- | --- | --- |
| Creator Request | `POST /api/role-requests/creator` | [role-requests.md](admin-moderation/role-requests.md) | Đã triển khai |
| Business Request | `POST /api/role-requests/business` | [role-requests.md](admin-moderation/role-requests.md) | Đã triển khai |
| My Requests | `GET /api/role-requests/me` | [role-requests.md](admin-moderation/role-requests.md) | Đã triển khai |
| Admin List Requests | `GET /api/admin/role-requests` | [role-requests.md](admin-moderation/role-requests.md) | Đã triển khai |
| Approve Request | `PATCH /api/admin/role-requests/:id/approve` | [role-requests.md](admin-moderation/role-requests.md) | Đã triển khai |
| Reject Request | `PATCH /api/admin/role-requests/:id/reject` | [role-requests.md](admin-moderation/role-requests.md) | Đã triển khai |

Nội dung chính:

- Duyệt Creator tạo `creator_profiles`.
- Duyệt Business tạo/cập nhật `business_profiles`.
- Transaction khi approve/reject.
- Gửi notification cho user.
- Ghi `audit_logs` cho admin action.

### Public Discovery API

Nhóm này phụ trách API cho luồng khám phá công khai: feed, explore, search, map, place detail, post detail, saved và tag detail.

| Module / Hạng mục | Endpoint / Phạm vi | Note | Trạng thái |
| --- | --- | --- | --- |
| Categories | `GET /api/categories` | [places-map-detail.md](public-discovery-api/places-map-detail.md) | Đã triển khai |
| Places List/Search | `GET /api/places` | [places-map-detail.md](public-discovery-api/places-map-detail.md) | Đã triển khai |
| Nearby Places | `GET /api/places/nearby` | [places-map-detail.md](public-discovery-api/places-map-detail.md) | Đã triển khai |
| Map Places | `GET /api/map/places` | [places-map-detail.md](public-discovery-api/places-map-detail.md) | Đã triển khai |
| Place Detail | `GET /api/places/:slug` | [places-map-detail.md](public-discovery-api/places-map-detail.md) | Đã triển khai |
| Place Reviews | `GET /api/places/:id/reviews` | [places-map-detail.md](public-discovery-api/places-map-detail.md) | Đã triển khai |
| Place Promotions | `GET /api/places/:id/promotions` | [places-map-detail.md](public-discovery-api/places-map-detail.md) | Đã triển khai |
| Related Posts | `GET /api/places/:id/related-posts` | [places-map-detail.md](public-discovery-api/places-map-detail.md) | Đã triển khai |
| Feed | `GET /api/feed` | [feed-post-search.md](public-discovery-api/feed-post-search.md) | Đã triển khai |
| Post Detail | `GET /api/posts/:id` | [feed-post-search.md](public-discovery-api/feed-post-search.md) | Đã triển khai |
| Unified Search | `GET /api/search` | [feed-post-search.md](public-discovery-api/feed-post-search.md) | Đã triển khai |
| Trending Tags | `GET /api/tags/trending` | [tags-recommendations.md](public-discovery-api/tags-recommendations.md) | Đã triển khai |
| Tag Search | `GET /api/tags/search` | [tags-recommendations.md](public-discovery-api/tags-recommendations.md) | Đã triển khai |
| Tag Detail | `GET /api/tags/:slug` | [tags-recommendations.md](public-discovery-api/tags-recommendations.md) | Đã triển khai |
| Related Tags | `GET /api/tags/:slug/related` | [tags-recommendations.md](public-discovery-api/tags-recommendations.md) | Đã triển khai |
| Recommendations | `GET /api/recommendations` | [tags-recommendations.md](public-discovery-api/tags-recommendations.md) | Đã triển khai |

Nội dung chính:

- Public API chỉ trả dữ liệu `approved`, `active`, `public`.
- Feed dùng cursor pagination.
- Places/search/map dùng page/limit hoặc bounding box.
- Search trả grouped result: places, posts, tags.
- Tag detail trả thông tin tag, bài viết liên quan, địa điểm liên quan.
- Query hỗ trợ: `q`, `category`, `city`, `district`, `rating_min`, `open_now`, `lat`, `lng`, `radius`, `sort`, `page`, `limit`.

### Media And Posts

Nhóm này phụ trách upload media, tạo/sửa/xóa post và gắn tag/media.

| Module / Hạng mục | Endpoint / Phạm vi | Note | Trạng thái |
| --- | --- | --- | --- |
| Upload Media | `POST /api/media/upload` | Chưa có | Chưa triển khai |
| Create Post | `POST /api/posts` | Chưa có | Chưa triển khai |
| Update Post | `PATCH /api/posts/:id` | Chưa có | Chưa triển khai |
| Delete Post | `DELETE /api/posts/:id` | Chưa có | Chưa triển khai |
| Share Post | `POST /api/posts/:id/share` | Chưa có | Chưa triển khai |
| Attach Tags | `POST /api/posts/:id/tags` | Chưa có | Chưa triển khai |

Nội dung chính:

- Upload ảnh/video qua multer.
- Ảnh: jpg, jpeg, png, webp.
- Video: mp4.
- Không upload file script/executable.
- Tạo post bằng transaction: post, media, tags, counters/analytics.
- Creator tạo review post; Business tạo promotion/event post.
- Kiểm tra owner trước update/delete.

### Social Interactions

Nhóm này phụ trách like, comment, save, favorite, follow, review và report từ phía người dùng.

| Module / Hạng mục | Endpoint / Phạm vi | Note | Trạng thái |
| --- | --- | --- | --- |
| Like Post | `POST /api/posts/:id/like` | [like-save-favorite.md](social-interactions/like-save-favorite.md) | Đã triển khai |
| Save Post | `POST /api/posts/:id/save` | [like-save-favorite.md](social-interactions/like-save-favorite.md) | Đã triển khai |
| Favorite Place | `POST /api/places/:id/favorite` | [like-save-favorite.md](social-interactions/like-save-favorite.md) | Đã triển khai |
| Favorites List | `GET /api/favorites` | [like-save-favorite.md](social-interactions/like-save-favorite.md) | Đã triển khai |
| Saved List | `GET /api/users/me/saved` | [like-save-favorite.md](social-interactions/like-save-favorite.md) | Đã triển khai |
| List Comments | `GET /api/posts/:id/comments` | [comments-reviews.md](social-interactions/comments-reviews.md) | Đã triển khai |
| Create Comment | `POST /api/posts/:id/comments` | [comments-reviews.md](social-interactions/comments-reviews.md) | Đã triển khai |
| Create Review | `POST /api/places/:id/reviews` | [comments-reviews.md](social-interactions/comments-reviews.md) | Đã triển khai |
| Update Review | `PATCH /api/reviews/:id` | [comments-reviews.md](social-interactions/comments-reviews.md) | Đã triển khai |
| Review Reply | `POST /api/reviews/:id/reply` | [comments-reviews.md](social-interactions/comments-reviews.md) | Đã triển khai |
| Report | `POST /api/reports` | [reports.md](social-interactions/reports.md) | Đã triển khai |

Nội dung chính:

- Mutation trả counter/state mới nhất để frontend sync optimistic UI.
- Like/save/favorite dùng unique constraint để tránh duplicate.
- Comment hỗ trợ `parent_id` cho reply.
- Review place dùng unique `(user_id, place_id)` và recalculate rating.
- Report chống spam cùng target quá nhanh.

### Creator Center API

Nhóm này phụ trách API cho Creator dashboard và quản lý nội dung.

| Module / Hạng mục | Endpoint / Phạm vi | Note | Trạng thái |
| --- | --- | --- | --- |
| Creator Stats | `GET /api/creator/stats` | [creator-dashboard-analytics.md](creator-center/creator-dashboard-analytics.md) | Đã triển khai |
| Creator Posts | `GET /api/creator/posts` | [creator-posts.md](creator-center/creator-posts.md) | Đã triển khai |
| Top Posts | `GET /api/creator/top-posts` | [creator-dashboard-analytics.md](creator-center/creator-dashboard-analytics.md) | Đã triển khai |
| Creator Analytics | `GET /api/creator/analytics` | [creator-dashboard-analytics.md](creator-center/creator-dashboard-analytics.md) | Đã triển khai |
| Post Analytics | `GET /api/analytics/posts/:id` | [creator-dashboard-analytics.md](creator-center/creator-dashboard-analytics.md) | Đã triển khai |

Nội dung chính:

- `requireRole("creator", "admin")`.
- Creator chỉ xem post và analytics của mình.
- Analytics có thể dùng counters trước, aggregate event sau.
- Sort top posts theo view/like/save/comment.

### Business Center API

Nhóm này phụ trách API cho Business quản lý địa điểm, menu, media, promotion và review.

| Module / Hạng mục | Endpoint / Phạm vi | Note | Trạng thái |
| --- | --- | --- | --- |
| Business Me | `GET /api/business/me` | [profile-place-menu.md](business-center/profile-place-menu.md) | Đã triển khai |
| Update Business | `PATCH /api/business/me` | [profile-place-menu.md](business-center/profile-place-menu.md) | Đã triển khai |
| Business Public | `GET /api/business/:slug/public` | [profile-place-menu.md](business-center/profile-place-menu.md) | Đã triển khai |
| Business Place | `GET /api/business/place` | [profile-place-menu.md](business-center/profile-place-menu.md) | Đã triển khai |
| Update Place | `PATCH /api/business/place` | [profile-place-menu.md](business-center/profile-place-menu.md) | Đã triển khai |
| Update Menu | `PATCH /api/business/menu` | [profile-place-menu.md](business-center/profile-place-menu.md) | Đã triển khai |
| Business Media | `GET /api/business/media` | [business-media.md](business-center/business-media.md) | Đã triển khai |
| Add Business Media | `POST /api/business/media` | [business-media.md](business-center/business-media.md) | Đã triển khai |
| Reorder Media | `PATCH /api/business/media/order` | [business-media.md](business-center/business-media.md) | Đã triển khai |
| Delete Media | `DELETE /api/business/media/:id` | [business-media.md](business-center/business-media.md) | Đã triển khai |
| Business Stats | `GET /api/business/stats` | [stats-reviews-promotions.md](business-center/stats-reviews-promotions.md) | Đã triển khai |
| Business Reviews | `GET /api/business/reviews` | [stats-reviews-promotions.md](business-center/stats-reviews-promotions.md) | Đã triển khai |
| Promotions List | `GET /api/business/promotions` | [stats-reviews-promotions.md](business-center/stats-reviews-promotions.md) | Đã triển khai |
| Create Promotion | `POST /api/business/promotions` | [stats-reviews-promotions.md](business-center/stats-reviews-promotions.md) | Đã triển khai |
| Update Promotion | `PATCH /api/business/promotions/:id` | [stats-reviews-promotions.md](business-center/stats-reviews-promotions.md) | Đã triển khai |
| Delete Promotion | `DELETE /api/business/promotions/:id` | [stats-reviews-promotions.md](business-center/stats-reviews-promotions.md) | Đã triển khai |

Nội dung chính:

- `requireRole("business", "admin")`.
- Business chỉ sửa place thuộc `business_profile_id` của mình.
- Business chỉ hoạt động đầy đủ khi profile `approved`.
- Promotion có `valid_from`, `valid_to`, `status`.
- Review reply giới hạn một reply chính cho mỗi review nếu dùng bảng `review_replies`.

### Notifications API

Nhóm này phụ trách thông báo và unread count.

| Module / Hạng mục | Endpoint / Phạm vi | Note | Trạng thái |
| --- | --- | --- | --- |
| List Notifications | `GET /api/notifications` | Chưa có | Chưa triển khai |
| Unread Count | `GET /api/notifications/unread-count` | Chưa có | Chưa triển khai |
| Mark One Read | `PATCH /api/notifications/:id/read` | Chưa có | Chưa triển khai |
| Mark All Read | `PATCH /api/notifications/read-all` | Chưa có | Chưa triển khai |

Nội dung chính:

- User chỉ xem notification của mình.
- Unread count dùng cho badge ở navigation/header.
- `data_json` chỉ chứa thông tin an toàn cho frontend.

### Admin Moderation API

Nhóm này phụ trách quản trị, kiểm duyệt và audit logs.

| Module / Hạng mục | Endpoint / Phạm vi | Note | Trạng thái |
| --- | --- | --- | --- |
| Admin Stats | `GET /api/admin/stats` | [users-places-content.md](admin-moderation/users-places-content.md) | Đã triển khai |
| Audit Logs | `GET /api/admin/audit-logs` | [reports-tags-categories-audit.md](admin-moderation/reports-tags-categories-audit.md) | Đã triển khai |
| Admin Users | `GET /api/admin/users` | [users-places-content.md](admin-moderation/users-places-content.md) | Đã triển khai |
| User Status | `PATCH /api/admin/users/:id/status` | [users-places-content.md](admin-moderation/users-places-content.md) | Đã triển khai |
| Admin Places | `GET /api/admin/places` | [users-places-content.md](admin-moderation/users-places-content.md) | Đã triển khai |
| Place Status | `PATCH /api/admin/places/:id/status` | [users-places-content.md](admin-moderation/users-places-content.md) | Đã triển khai |
| Admin Reports | `GET /api/admin/reports` | [reports-tags-categories-audit.md](admin-moderation/reports-tags-categories-audit.md) | Đã triển khai |
| Resolve Report | `PATCH /api/admin/reports/:id/resolve` | [reports-tags-categories-audit.md](admin-moderation/reports-tags-categories-audit.md) | Đã triển khai |
| Post Status | `PATCH /api/admin/posts/:id/status` | [users-places-content.md](admin-moderation/users-places-content.md) | Đã triển khai |
| Comment Status | `PATCH /api/admin/comments/:id/status` | [users-places-content.md](admin-moderation/users-places-content.md) | Đã triển khai |
| Admin Tags | `GET /api/admin/tags` | [reports-tags-categories-audit.md](admin-moderation/reports-tags-categories-audit.md) | Đã triển khai |
| Tag Status | `PATCH /api/admin/tags/:id/status` | [reports-tags-categories-audit.md](admin-moderation/reports-tags-categories-audit.md) | Đã triển khai |
| Merge Tags | `POST /api/admin/tags/merge` | [reports-tags-categories-audit.md](admin-moderation/reports-tags-categories-audit.md) | Đã triển khai |
| Admin Categories | `GET /api/admin/categories` | [reports-tags-categories-audit.md](admin-moderation/reports-tags-categories-audit.md) | Đã triển khai |
| Create Category | `POST /api/admin/categories` | [reports-tags-categories-audit.md](admin-moderation/reports-tags-categories-audit.md) | Đã triển khai |
| Update Category | `PATCH /api/admin/categories/:id` | [reports-tags-categories-audit.md](admin-moderation/reports-tags-categories-audit.md) | Đã triển khai |

Nội dung chính:

- Tất cả `/api/admin/*` yêu cầu `role=admin`.
- Admin action quan trọng phải ghi `audit_logs`.
- Không cho admin tự khóa chính mình nếu là admin cuối cùng.
- Admin list phải có pagination/filter.
- Public query không trả dữ liệu pending/hidden/rejected.

### Analytics Recommendation Jobs

Nhóm này phụ trách analytics event, recommendation basic và background jobs.

| Module / Hạng mục | Endpoint / Phạm vi | Note | Trạng thái |
| --- | --- | --- | --- |
| Analytics Events | `analytics_events` service | Chưa có | Chưa triển khai |
| User Tag Preference | `user_tag_preferences` | Chưa có | Chưa triển khai |
| Trending Tags Job | `trendingTags.job.js` | Chưa có | Chưa triển khai |
| Expire Promotions Job | `expirePromotions.job.js` | Chưa có | Chưa triển khai |
| Cleanup Media Job | `cleanupMedia.job.js` | Chưa có | Chưa triển khai |
| Analytics Aggregate Job | `analyticsAggregate.job.js` | Chưa có | Chưa triển khai |

Nội dung chính:

- Ghi event khi view/like/save/comment/share/direction/follow.
- Tăng điểm tag preference theo hành vi.
- Feed For You ưu tiên tag sở thích, độ gần, độ mới và tương tác.
- Promotion quá hạn chuyển sang `expired`.
- Cleanup media chưa gắn resource sau 24h.

### Infra Testing Deployment

Nhóm này phụ trách seed data, test, tài liệu API và deployment.

| Module / Hạng mục | Phạm vi | Note | Trạng thái |
| --- | --- | --- | --- |
| Seed Accounts | admin/user/creator/business | Chưa có | Chưa triển khai |
| Seed Demo Data | categories, places, posts, tags | Chưa có | Chưa triển khai |
| API Tests | Jest/Vitest + Supertest | Chưa có | Chưa triển khai |
| Swagger/OpenAPI | API contract | Chưa có | Chưa triển khai |
| README Backend | setup Laragon/MySQL | Chưa có | Chưa triển khai |
| Deployment Config | Render/Railway/Cloudinary | Chưa có | Chưa triển khai |

Nội dung chính:

- Seed đủ dữ liệu để frontend bỏ mock.
- Test auth, permission, validation, pagination, transaction rollback.
- README hướng dẫn chạy local bằng Laragon/MySQL.
- `.env.example` đầy đủ biến môi trường.

## Quy Trình Làm Một Module Backend

1. Đọc contract endpoint trong tài liệu backend và màn hình frontend liên quan.
2. Xác định bảng database, quan hệ, index, constraint và migration cần thêm.
3. Tạo validation schema cho params, query, body và file upload nếu có.
4. Tạo route, controller, service và repository/ORM query.
5. Gắn middleware phù hợp: `requireAuth`, `requireRole`, `validateRequest`, `upload`, `rateLimit`.
6. Xử lý rule nghiệp vụ trong service: ownership, status, role, transaction, counters, notification, audit log.
7. Trả response chuẩn:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

8. Viết test happy path và các lỗi phổ biến: validation, 401, 403, 404, conflict.
9. Test bằng Postman/Thunder Client hoặc automated test.
10. Tạo hoặc cập nhật note riêng trong `docs/backend/<ten-nhom>/`.

## Nội Dung Cần Có Trong Note Riêng

- Tên module/API đã hoàn thành.
- Endpoint liên quan.
- File được thêm/sửa/xóa.
- Database table/migration liên quan.
- Controller/service/repository đã triển khai.
- Middleware và validation đã dùng.
- Rule nghiệp vụ quan trọng.
- Quyền truy cập theo role.
- Response mẫu success/error.
- Transaction/counter/notification/audit log nếu có.
- Test case đã chạy.
- Các điểm quan trọng để giải thích khi giảng viên hỏi.
- Những phần còn chờ frontend hoặc chờ backend module khác.

## Definition Of Done Cho Một Endpoint

- Có route, controller, service, validation schema.
- Có middleware auth/role nếu endpoint cần bảo vệ.
- Có response success/error đúng format.
- Có xử lý 400, 401, 403, 404, 409 hoặc 422 khi phù hợp.
- Có pagination/cursor nếu là list API.
- Có ownership/status check nếu update/delete hoặc xem dữ liệu riêng tư.
- Có transaction nếu thao tác nhiều bảng.
- Có audit log nếu là admin action hoặc thay đổi dữ liệu nhạy cảm.
- Có test tối thiểu cho happy path và lỗi phổ biến.
- Frontend có thể gọi endpoint mà không cần đổi contract.

## Checklist Bàn Giao Backend

- README backend có hướng dẫn chạy local.
- `.env.example` đầy đủ.
- Migration chạy được từ máy sạch.
- Seed data tạo đủ account demo và dữ liệu cho frontend.
- API contract khớp tài liệu frontend.
- Response format thống nhất toàn hệ thống.
- Không trả dữ liệu nhạy cảm.
- RoleGuard, ownership và status filter được test.
- Upload media validate type/size.
- Admin action ghi audit logs.
- Feed/search/map/place detail/post detail/tag detail chạy được với dữ liệu thật.
- Có integration test tối thiểu cho Auth, Places, Posts, Interactions và Admin.
