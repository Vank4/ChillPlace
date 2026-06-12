import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell.jsx";
import { ForgotPasswordPage } from "../features/auth/pages/ForgotPasswordPage.jsx";
import { LoginPage } from "../features/auth/pages/LoginPage.jsx";
import { RegisterPage } from "../features/auth/pages/RegisterPage.jsx";
import { ExplorePage } from "../features/explore/pages/ExplorePage.jsx";
import { HomeFeedPage } from "../features/feed/pages/HomeFeedPage.jsx";
import { MapPage } from "../features/map/pages/MapPage.jsx";
import { NearbyDiscoveryPage } from "../features/nearby/pages/NearbyDiscoveryPage.jsx";
import { NotificationsPage } from "../features/notifications/pages/NotificationsPage.jsx";
import { PlaceDetailPage } from "../features/places/pages/PlaceDetailPage.jsx";
import { PostDetailPage } from "../features/posts/pages/PostDetailPage.jsx";
import { UserProfilePage } from "../features/profile/pages/UserProfilePage.jsx";
import { PrototypePage } from "../features/prototype/pages/PrototypePage.jsx";
import { SavedPlacesPage } from "../features/saved/pages/SavedPlacesPage.jsx";
import { SearchResultsPage } from "../features/search/pages/SearchResultsPage.jsx";
import { TagDetailPage } from "../features/tags/pages/TagDetailPage.jsx";

export function App() {
  return (
    <Routes>
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
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
        <Route
          path="settings"
          element={
            <PrototypePage
              eyebrow="Settings"
              title="Cài đặt tài khoản"
              description="Trang cài đặt đang ở mức prototype để giữ routing đầy đủ trong giai đoạn chưa nối backend."
            />
          }
        />
        <Route
          path="creator/posts/new"
          element={
            <PrototypePage
              eyebrow="Create Post"
              title="Tạo bài viết mới"
              description="Flow tạo bài viết sẽ được nối với media upload và API sau, hiện đang là placeholder functional route."
            />
          }
        />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
