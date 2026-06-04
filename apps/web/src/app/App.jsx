import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell.jsx";
import { ExplorePage } from "../features/explore/pages/ExplorePage.jsx";
import { HomeFeedPage } from "../features/feed/pages/HomeFeedPage.jsx";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomeFeedPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="search" element={<ExplorePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
