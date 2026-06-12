# Response Helper

## File liên quan

- `apps/api/src/common/utils/apiResponse.js`

## Helper

- `success`: response success tổng quát.
- `ok`: response `200`.
- `created`: response `201`.
- `noContent`: response `204`.
- `fail`: response lỗi thống nhất.
- `createPagination`: metadata `page`, `limit`, `total`, `total_pages`.
- `createCursor`: metadata `next_cursor`, `has_more`.

## Contract

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 41,
    "total_pages": 3
  }
}
```

Error không trả trường `errors` khi không có lỗi theo field.

## Kiểm tra

Test bao phủ response `200`, `201`, pagination và cursor.
