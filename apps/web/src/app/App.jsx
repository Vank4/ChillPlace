import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell.jsx";
import { ForgotPasswordPage } from "../features/auth/pages/ForgotPasswordPage.jsx";
import { LoginPage } from "../features/auth/pages/LoginPage.jsx";
import { RegisterPage } from "../features/auth/pages/RegisterPage.jsx";
import { CreatorAnalyticsPage } from "../features/creator/pages/CreatorAnalyticsPage.jsx";
import { CreatorDraftsPage } from "../features/creator/pages/CreatorDraftsPage.jsx";
import { CreatorPostsPage } from "../features/creator/pages/CreatorPostsPage.jsx";
import { CreatePostPage } from "../features/creator/pages/CreatePostPage.jsx";
import { ExplorePage } from "../features/explore/pages/ExplorePage.jsx";
import { HomeFeedPage } from "../features/feed/pages/HomeFeedPage.jsx";
import { MapPage } from "../features/map/pages/MapPage.jsx";
import { NearbyDiscoveryPage } from "../features/nearby/pages/NearbyDiscoveryPage.jsx";
import { NotificationsPage } from "../features/notifications/pages/NotificationsPage.jsx";
import { PlaceDetailPage } from "../features/places/pages/PlaceDetailPage.jsx";
import { PostDetailPage } from "../features/posts/pages/PostDetailPage.jsx";
import { UserProfilePage } from "../features/profile/pages/UserProfilePage.jsx";
import { SavedPlacesPage } from "../features/saved/pages/SavedPlacesPage.jsx";
import { SearchResultsPage } from "../features/search/pages/SearchResultsPage.jsx";
import { SettingsPage } from "../features/settings/pages/SettingsPage.jsx";
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
        <Route path="settings" element={<SettingsPage />} />
        <Route path="creator/posts" element={<CreatorPostsPage />} />
        <Route path="creator/posts/new" element={<CreatePostPage />} />
        <Route path="creator/drafts" element={<CreatorDraftsPage />} />
        <Route path="creator/analytics" element={<CreatorAnalyticsPage />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
