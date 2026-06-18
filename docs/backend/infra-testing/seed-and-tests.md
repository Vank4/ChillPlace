# Seed And API Tests

## Seed

Script chính: `apps/api/src/scripts/seed.js`.

Lệnh chạy:

```bash
npm run prisma:seed
```

Seed dùng upsert hoặc find-or-create nên có thể chạy lặp. Dữ liệu gồm:

- tài khoản `admin`, `user`, `creator`, `business`;
- creator profile và business profile approved;
- categories, places, media, tags và post tags;
- review post, promotion post, review, comment;
- like, favorite, saved post, follow và promotion.

Mật khẩu demo chung là `ChillPlace@123`.

## Tests

Test dùng `node:test`, chạy tuần tự và gọi HTTP thật vào Express:

```bash
npm test
npm run test:infra
npm run verify
```

Ngoài workflow từng module, test hạ tầng kiểm tra:

- OpenAPI JSON và API catalog;
- transaction rollback không để lại dữ liệu;
- Cloudinary URL mapping;
- env validation, health check, CORS, rate limit và upload.
