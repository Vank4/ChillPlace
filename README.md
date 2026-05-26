# ChillPlace (VibeMap)

Nền tảng khám phá địa điểm ăn uống, vui chơi theo mô hình **Social + Map**: lướt feed video/ảnh kiểu reels, tìm kiếm theo nhu cầu, xem địa điểm trên bản đồ, review và ưu đãi theo vai trò người dùng.

## 1. Project Overview

ChillPlace được thiết kế theo định hướng:
- Social discovery: feed review/promotion giàu media.
- Location intelligence: map, nearby, filter theo khu vực/khoảng cách.
- Role-based workflow: `guest`, `user`, `creator`, `business`, `admin`.
- Moderation-first: report, duyệt role, duyệt nội dung, quản lý tag.

## 2. Current Repository Status

Hiện repo đã hoàn thành **Project Setup & Core Infrastructure** cho backend:
- Scaffold backend theo module với Express.
- Prisma schema cho các bảng cốt lõi.
- Migration init + database bootstrap automation.
- Health check có kiểm tra kết nối DB và latency.
- Chuẩn hóa error/response middleware.

## 3. Monorepo Structure

```text
ChillPlace/
├─ apps/
│  ├─ web/                    # Frontend React (scaffold thư mục)
│  └─ api/                    # Backend Node.js + Express + Prisma
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ seeds/
├─ packages/
│  ├─ shared/
│  └─ config/
├─ docs/
├─ infra/
└─ scripts/
```

## 4. Tech Stack

- Frontend: React + Vite (đang ở mức cấu trúc thư mục)
- Backend: Node.js, Express
- Database: MySQL 8.x (Laragon local)
- ORM: Prisma
- Auth (planned): JWT + bcrypt
- API style: REST JSON

## 5. Backend Core Modules (Implemented Foundation)

Trong `apps/api/src`:
- `config/`: env, cors
- `middlewares/`: not found, error handler, role/auth placeholders
- `routes/`: router composition
- `modules/health`: `/api/health`
- `common/`: `AppError`, helpers, prisma client
- `scripts/db/bootstrap.js`: tự tạo database nếu chưa tồn tại

## 6. Database Core Schema

Prisma schema đã có các nhóm bảng chính:
- User & Role: `users`, `creator_profiles`, `business_profiles`, `role_requests`
- Place & Content: `categories`, `places`, `place_media`, `posts`, `post_media`, `promotions`
- Social: `comments`, `likes`, `favorites`, `follows`, `reviews`
- Governance: `reports`, `notifications`, `audit_logs`
- Tag & recommendation base: `tags`, `post_tags`, `user_tag_preferences`

## 7. Local Setup (Laragon + MySQL)

### Prerequisites
- Node.js 20+
- npm 10+
- Laragon (MySQL 8.x đang chạy tại `127.0.0.1:3306`)

### Steps

```bash
# 1) vào backend
cd apps/api

# 2) cài dependencies
npm install

# 3) tạo file môi trường
copy .env.example .env

# 4) setup tự động (bootstrap DB + prisma generate + migrate deploy)
npm run setup

# 5) chạy server
npm run dev
```

Health check:

```bash
GET http://localhost:5000/api/health
```

## 8. Available Scripts (apps/api)

- `npm run dev`: chạy API mode watch
- `npm run start`: chạy API production mode
- `npm run db:bootstrap`: tạo DB từ `DATABASE_URL` nếu chưa có
- `npm run prisma:generate`: generate Prisma client
- `npm run prisma:migrate`: migrate dev (tạo migration mới)
- `npm run prisma:deploy`: apply migration hiện có
- `npm run prisma:studio`: mở Prisma Studio
- `npm run setup`: setup 1 lệnh cho local

## 9. API Response Convention

Success:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {}
}
```

## 10. Development Roadmap

Phase tiếp theo:
1. Authentication & User Profile (register/login/me/update profile)
2. Role-based authorization middleware hoàn chỉnh
3. Places + Search + Map APIs
4. Posts/Feed + Interactions
5. Admin moderation workflow

## 11. Security Notes

- Không commit `.env` thật lên git.
- Secret/JWT key chỉ lưu local hoặc secret manager.
- Backend luôn kiểm tra role từ token/DB, không tin dữ liệu role từ frontend.

## 12. License

Dự án phục vụ học tập và phát triển sản phẩm mẫu. Có thể điều chỉnh license theo nhu cầu nhóm.

