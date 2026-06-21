import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell.jsx";

const lazyNamed = (loader, name) => lazy(() => loader().then((module) => ({ default: module[name] })));
const AdminLayout = lazyNamed(() => import("../features/admin/components/AdminLayout.jsx"), "AdminLayout");
const AdminDashboardPage = lazyNamed(() => import("../features/admin/pages/AdminPages.jsx"), "AdminDashboardPage");
const AdminUsersPage = lazyNamed(() => import("../features/admin/pages/AdminPages.jsx"), "AdminUsersPage");
const AdminPlacesPage = lazyNamed(() => import("../features/admin/pages/AdminPages.jsx"), "AdminPlacesPage");
const AdminPostsPage = lazyNamed(() => import("../features/admin/pages/AdminPages.jsx"), "AdminPostsPage");
const AdminReportsPage = lazyNamed(() => import("../features/admin/pages/AdminPages.jsx"), "AdminReportsPage");
const AdminRoleRequestsPage = lazyNamed(() => import("../features/admin/pages/AdminPages.jsx"), "AdminRoleRequestsPage");
const AdminTaxonomyPage = lazyNamed(() => import("../features/admin/pages/AdminPages.jsx"), "AdminTaxonomyPage");
const ForgotPasswordPage = lazyNamed(() => import("../features/auth/pages/ForgotPasswordPage.jsx"), "ForgotPasswordPage");
const LoginPage = lazyNamed(() => import("../features/auth/pages/LoginPage.jsx"), "LoginPage");
const RegisterPage = lazyNamed(() => import("../features/auth/pages/RegisterPage.jsx"), "RegisterPage");
const BusinessDashboardPage = lazyNamed(() => import("../features/business/pages/BusinessDashboardPage.jsx"), "BusinessDashboardPage");
const BusinessPlacesPage = lazyNamed(() => import("../features/business/pages/BusinessPlacesPage.jsx"), "BusinessPlacesPage");
const BusinessPromotionsPage = lazyNamed(() => import("../features/business/pages/BusinessPromotionsPage.jsx"), "BusinessPromotionsPage");
const BusinessReviewsPage = lazyNamed(() => import("../features/business/pages/BusinessReviewsPage.jsx"), "BusinessReviewsPage");
const CreatorAnalyticsPage = lazyNamed(() => import("../features/creator/pages/CreatorAnalyticsPage.jsx"), "CreatorAnalyticsPage");
const CreatorDraftsPage = lazyNamed(() => import("../features/creator/pages/CreatorDraftsPage.jsx"), "CreatorDraftsPage");
const CreatorPostsPage = lazyNamed(() => import("../features/creator/pages/CreatorPostsPage.jsx"), "CreatorPostsPage");
const CreatePostPage = lazyNamed(() => import("../features/creator/pages/CreatePostPage.jsx"), "CreatePostPage");
const ExplorePage = lazyNamed(() => import("../features/explore/pages/ExplorePage.jsx"), "ExplorePage");
const HomeFeedPage = lazyNamed(() => import("../features/feed/pages/HomeFeedPage.jsx"), "HomeFeedPage");
const MapPage = lazyNamed(() => import("../features/map/pages/MapPage.jsx"), "MapPage");
const NearbyDiscoveryPage = lazyNamed(() => import("../features/nearby/pages/NearbyDiscoveryPage.jsx"), "NearbyDiscoveryPage");
const NotificationsPage = lazyNamed(() => import("../features/notifications/pages/NotificationsPage.jsx"), "NotificationsPage");
const PlaceDetailPage = lazyNamed(() => import("../features/places/pages/PlaceDetailPage.jsx"), "PlaceDetailPage");
const PostDetailPage = lazyNamed(() => import("../features/posts/pages/PostDetailPage.jsx"), "PostDetailPage");
const UserProfilePage = lazyNamed(() => import("../features/profile/pages/UserProfilePage.jsx"), "UserProfilePage");
const SavedPlacesPage = lazyNamed(() => import("../features/saved/pages/SavedPlacesPage.jsx"), "SavedPlacesPage");
const SearchResultsPage = lazyNamed(() => import("../features/search/pages/SearchResultsPage.jsx"), "SearchResultsPage");
const SettingsPage = lazyNamed(() => import("../features/settings/pages/SettingsPage.jsx"), "SettingsPage");
const TagDetailPage = lazyNamed(() => import("../features/tags/pages/TagDetailPage.jsx"), "TagDetailPage");

export function App() {
  return (
    <Suspense fallback={<div className="route-loading" role="status" aria-live="polite"><span />Đang mở không gian...</div>}>
    <RouteMetadata />
    <Routes>
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="places" element={<AdminPlacesPage />} />
        <Route path="posts" element={<AdminPostsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="roles" element={<AdminRoleRequestsPage />} />
        <Route path="tags" element={<AdminTaxonomyPage />} />
      </Route>
      <Route element={<AppShell />}>
        <Route index element={<HomeFeedPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="tags/:tag" element={<TagDetailPage />} />
        <Route path="nearby" element={<NearbyDiscoveryPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="places/:placeId" element={<PlaceDetailPage />} />
        <Route path="posts/:postId" element={<PostDetailPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="favorites" element={<SavedPlacesPage />} />
        <Route path="saved" element={<SavedPlacesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="creator/posts" element={<CreatorPostsPage />} />
        <Route path="creator/posts/new" element={<CreatePostPage />} />
        <Route path="creator/drafts" element={<CreatorDraftsPage />} />
        <Route path="creator/analytics" element={<CreatorAnalyticsPage />} />
        <Route path="business" element={<BusinessDashboardPage />} />
        <Route path="business/places" element={<BusinessPlacesPage />} />
        <Route path="business/promotions" element={<BusinessPromotionsPage />} />
        <Route path="business/reviews" element={<BusinessReviewsPage />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    </Suspense>
  );
}

function RouteMetadata() {
  const location = useLocation();

  useEffect(() => {
    const routeName = getRouteName(location.pathname);
    document.title = `${routeName} | ChillPlace`;
  }, [location.pathname]);

  return null;
}

function getRouteName(pathname) {
  if (pathname.startsWith("/admin")) return "Quản trị hệ thống";
  if (pathname.startsWith("/business")) return "Business Center";
  if (pathname.startsWith("/creator")) return "Creator Center";
  if (pathname.startsWith("/places/")) return "Chi tiết địa điểm";
  if (pathname.startsWith("/posts/")) return "Chi tiết bài viết";
  if (pathname.startsWith("/tags/")) return "Khám phá hashtag";
  const labels = {
    "/": "Trang chủ",
    "/explore": "Khám phá",
    "/search": "Tìm kiếm",
    "/nearby": "Gần bạn",
    "/map": "Bản đồ",
    "/favorites": "Đã lưu",
    "/saved": "Đã lưu",
    "/notifications": "Thông báo",
    "/profile": "Hồ sơ",
    "/settings": "Cài đặt",
    "/login": "Đăng nhập",
    "/register": "Đăng ký",
    "/forgot-password": "Khôi phục mật khẩu"
  };
  return labels[pathname] || "Khám phá không gian";
}
