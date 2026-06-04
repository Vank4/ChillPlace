# Kiểm kê và Phân tích các màn hình còn thiếu cho ChillPlace

Dựa trên tài liệu "Tài liệu thiết kế giao diện UI/UX - Responsive Design System" và so sánh với kho dữ liệu màn hình hiện có, dưới đây là bảng đối soát chi tiết.

## 1. Nhóm Giao diện Nền tảng Dùng chung
| Trang/Giao diện | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| App Layout tổng | 🟡 Tạm ổn | Đã có sidebar/nav nhưng cần chuẩn hóa thành Frame Layout Shell riêng. |
| Responsive Navigation | ✅ Đã có | SCREEN_2 (Mobile), SCREEN_18 (Desktop) có nav. |
| Modal, Drawer, Bottom Sheet | 🔴 Thiếu | Cần thiết kế các frame quy chuẩn riêng cho các loại overlay này. |
| Media Viewer, Carousel | 🔴 Thiếu | Cần trang viewer full-screen cho ảnh/video. |
| Loading, Empty, Error State | 🔴 Thiếu | Chưa có các màn hình minh họa hệ trạng thái này. |
| DataTable & Mobile Data Card | ✅ Đã có | SCREEN_11, SCREEN_39 (Desktop) và SCREEN_40 (Mobile). |

## 2. Nhóm Khám phá Công khai (Discovery)
| Trang/Giao diện | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| Home Feed | ✅ Đã có | SCREEN_43 (Polished). |
| Explore / Search | ✅ Đã có | SCREEN_10. |
| Search Result | 🔴 Thiếu | Cần tách biệt trang kết quả tìm kiếm với các tab Places/Posts/Tags. |
| Map | ✅ Đã có | SCREEN_48 (Polished). |
| Place Detail | ✅ Đã có | SCREEN_31, SCREEN_50. |
| Post Detail | 🔴 Thiếu | **CỰC KỲ QUAN TRỌNG.** Chưa có trang xem chi tiết một bài viết/reel. |
| Tag Detail / Hashtag Feed | 🔴 Thiếu | Chưa có trang đích cho các hashtag (#cafe, #chill...). |
| Nearby / For You | 🔴 Thiếu | Cần trang danh sách địa điểm gần đây với prompt yêu cầu vị trí. |
| Public Creator/Business Profile| ✅ Đã có | SCREEN_52 (User Profile - Desktop), SCREEN_19 (Mobile). |

## 3. Nhóm Tài khoản Người dùng
| Trang/Giao diện | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| Login / Register | ✅ Đã có | SCREEN_27, SCREEN_22. |
| User Profile | ✅ Đã có | SCREEN_19. |
| Favorites / Saved | 🔴 Thiếu | Chưa có trang danh sách các địa điểm/bài viết đã lưu. |
| Notifications | ✅ Đã có | SCREEN_16. |
| Upgrade Role Request | 🔴 Thiếu | Trang gửi yêu cầu lên Creator/Business (Wizard form). |

## 4. Nhóm Creator Center
| Trang/Giao diện | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| Creator Dashboard | ✅ Đã có | SCREEN_4 (Polished). |
| Create / Edit Review | ✅ Đã có | SCREEN_35. |
| Post Management | ✅ Đã có | SCREEN_47. |
| Creator Analytics | ✅ Đã có | SCREEN_28. |

## 5. Nhóm Business Center
| Trang/Giao diện | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| Business Dashboard | ✅ Đã có | SCREEN_46 (Polished). |
| Place Profile Editor | ✅ Đã có | SCREEN_44 (Desktop). Cần bổ sung bản Mobile. |
| Media / Menu Manager | 🔴 Thiếu | Trang quản lý riêng cho Menu và Media của quán. |
| Promotion / Event Form | ✅ Đã có | SCREEN_23 (Desktop). Cần bổ sung bản Mobile. |
| Review Reply Management | ✅ Đã có | SCREEN_32 (Desktop). Cần bổ sung bản Mobile. |

## 6. Nhóm Admin Dashboard
| Trang/Giao diện | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| Admin Overview | ✅ Đã có | SCREEN_37. |
| Role Requests | 🔴 Thiếu | Trang quản lý các yêu cầu nâng cấp quyền. |
| Place Moderation | ✅ Đã có | SCREEN_39. |
| Post / Report Moderation | ✅ Đã có | SCREEN_40 (Mobile). |
| Tags / Categories | ✅ Đã có | SCREEN_38. |

---
**KẾT LUẬN: Các trang ưu tiên cần bổ sung ngay:**
1. **Post Detail / Reel View** (Luồng trải nghiệm cốt lõi).
2. **Search Result** (Tách biệt với Explore).
3. **Favorites / Saved** (Tính năng giữ chân người dùng).
4. **Nearby / For You** (Tính năng Location-aware).
5. **Tag Detail / Hashtag Feed** (Tính năng Social-aware).
6. **Upgrade Role Request** (Luồng chuyển đổi user).
7. **Hệ màn hình trạng thái (Empty, Error, Loading, Media Viewer).**
