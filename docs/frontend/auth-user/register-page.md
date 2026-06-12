# Register Page `/register`

## Trang Đã Hoàn Thành

Đã triển khai Register Page cho nhóm `frontend-auth-user`, dựa trên:

- `interface_design/register__desktop__base/code.html`
- `interface_design/register__desktop__base/screen.png`
- `interface_design/register__responsive__base/code.html`
- `interface_design/register__responsive__base/screen.png`

Route `/register` nằm ngoài `AppShell` để giữ trải nghiệm xác thực toàn trang.

## File Được Thêm

- `apps/web/src/features/auth/pages/RegisterPage.jsx`
  - Form họ, tên, email, số điện thoại và mật khẩu.
  - Validation từng trường.
  - Hiện/ẩn mật khẩu.
  - Thanh đánh giá độ mạnh mật khẩu.
  - Checkbox đồng ý điều khoản.
  - Loading và error state.
  - Đăng ký mock bằng Google hoặc Facebook.
  - Tự tạo phiên và điều hướng về Home khi thành công.

- `apps/web/src/features/auth/pages/RegisterPage.css`
  - Desktop dùng ảnh cộng đồng bên trái và form bên phải.
  - Mobile dùng header thương hiệu, hero image và form card.
  - Responsive cho field tên, social button, safe area và màn hình nhỏ.

## File Được Sửa

- `apps/web/src/services/auth.service.js`
  - Thêm `registerWithEmail()`.
  - Lưu tài khoản đăng ký vào localStorage key:

```text
chillplace.registeredUsers
```

  - Login đọc cả tài khoản demo và tài khoản do người dùng đăng ký.
  - Kiểm tra email trùng trước khi tạo tài khoản.
  - Tạo username mock từ họ tên.
  - Tự tạo và lưu auth session sau khi đăng ký.

- `apps/web/src/app/App.jsx`
  - Import `RegisterPage`.
  - Thêm route:

```jsx
<Route path="register" element={<RegisterPage />} />
```

- `docs/frontend/frontend-implementation-notes.md`
  - Thêm link note và cập nhật Register Page thành `Đã triển khai`.

## Logic Validation

- Họ và tên không được để trống.
- Email bắt buộc, đúng định dạng và không được trùng tài khoản đã có.
- Số điện thoại hỗ trợ định dạng Việt Nam bắt đầu bằng `0` hoặc `+84`.
- Mật khẩu tối thiểu 8 ký tự.
- Thanh độ mạnh kiểm tra:
  - Độ dài tối thiểu.
  - Chữ hoa.
  - Chữ số.
  - Ký tự đặc biệt.
- Người dùng phải đồng ý điều khoản trước khi đăng ký.

## Luồng Hoạt Động

1. Người dùng nhập thông tin và submit.
2. Frontend kiểm tra validation.
3. `registerWithEmail()` mô phỏng thời gian gọi API.
4. Service kiểm tra email trùng.
5. Tài khoản mới được lưu vào localStorage.
6. Auth session được tạo và lưu.
7. Người dùng được điều hướng về `/`.
8. Sau khi logout, tài khoản vừa tạo có thể dùng để đăng nhập tại `/login`.

## Responsive

- Desktop:
  - Layout hai cột 50/50.
  - Ảnh cộng đồng toàn chiều cao bên trái.
  - Form gọn ở cột phải.

- Tablet/mobile:
  - Ẩn ảnh desktop.
  - Hiển thị hero card riêng phía trên.
  - Form nằm trong card trắng bo góc.
  - Field họ và tên chuyển thành một cột trên điện thoại.
  - Có footer icon trang trí giống prototype responsive.

## Điểm Giải Thích Khi Báo Cáo

- Tài khoản mới được lưu trong localStorage để prototype có thể đăng ký rồi đăng nhập lại như ứng dụng thật.
- Service auth là lớp thay thế tạm cho `POST /api/auth/register`.
- UI không lưu trực tiếp dữ liệu mà gọi service, giúp dễ thay mock bằng backend.
- Password strength là phản hồi giao diện, còn validation tối thiểu vẫn yêu cầu 8 ký tự.

## Kiểm Tra

Đã chạy:

```bash
cd apps/web
npm run build
```

Kết quả:

```text
✓ built in 2.13s
```

