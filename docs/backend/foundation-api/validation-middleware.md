# Validation Middleware

## Công nghệ

- Zod `4.x`

## File liên quan

- `apps/api/src/middlewares/validate.middleware.js`

## Cách sử dụng

```js
router.post(
  "/resource",
  validateRequest({
    params: paramsSchema,
    query: querySchema,
    body: bodySchema
  }),
  controller
);
```

Middleware hỗ trợ `params`, `query`, `body`, chạy schema async và lưu dữ liệu đã
parse tại `req.validated`. Lỗi trả `422` với object `errors` theo đường dẫn field
để frontend hiển thị inline.

## Kiểm tra

Test xác nhận coercion dữ liệu hợp lệ và lỗi nhiều field.
