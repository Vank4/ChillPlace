# Comments, Reviews And Review Reply

## Endpoint

- `GET /api/posts/:id/comments`
- `POST /api/posts/:id/comments`
- `POST /api/places/:id/reviews`
- `PATCH /api/reviews/:id`
- `POST /api/reviews/:id/reply`

## Quy tắc comment

- Comment public chỉ trả status `approved` của user `active`.
- Reply dùng `parentId`, phải thuộc cùng post và chỉ hỗ trợ một cấp.
- Tạo comment/reply cập nhật `comment_count` bằng count thật trong transaction.
- Notification gửi cho tác giả post hoặc chủ comment cha, trừ tương tác với
  chính mình.

## Quy tắc review

- Mỗi user chỉ có một review trên mỗi place theo unique
  `(user_id, place_id)`.
- Rating từ 1 đến 5; chỉ chủ review được cập nhật.
- Sau create/update, `rating_avg` và `rating_count` được aggregate lại trong
  transaction.
- Migration tạo `review_replies` với unique `review_id`, nên mỗi review có
  tối đa một phản hồi chính.
- Chỉ business owner của place đã approved hoặc admin được reply.
- Reply approved được trả kèm `GET /api/places/:id/reviews`.
- Review/comment/reply mới tạo notification phù hợp.

## Kiểm thử

Integration test kiểm tra counter, reply một cấp, duplicate review, review
ownership, business ownership, duplicate reply và public reply serialization.
