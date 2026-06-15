# Business Profile, Place And Menu

## Endpoint

- `GET /api/business/me`
- `PATCH /api/business/me`
- `GET /api/business/:slug/public`
- `GET /api/business/place`
- `PATCH /api/business/place`
- `PATCH /api/business/menu`

## Database

Migration `20260614000200_business_center` bổ sung:

- `business_profiles.slug`: nullable unique cho URL public.
- `places.menu_json`: JSON có cấu trúc category và menu item.

## Quyền và ownership

- Endpoint quản trị yêu cầu role `business` hoặc `admin`.
- Business luôn bị khóa vào profile theo `user_id`; truyền `business_id` khác
  nhận HTTP `403`.
- Admin phải truyền `business_id`.
- Business pending vẫn xem/cập nhật profile, nhưng place/menu/media/stats/
  reviews/promotions yêu cầu profile `approved`.
- `place_id` là query tùy chọn; nếu bỏ trống, API chọn place có id nhỏ nhất
  thuộc business làm place chính.

## Public profile

Chỉ profile approved của user active được công khai. Response không trả email,
status nội bộ hoặc dữ liệu nhạy cảm; chỉ place approved được hiển thị.
