import {
  Bell,
  Compass,
  FileWarning,
  Flag,
  Gauge,
  Hash,
  MapPinned,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  UserCog,
  Users
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getUserSettings, updateUserSettings } from "../../../services/settings.service.js";
import "./AdminLayout.css";

const adminNav = [
  { to: "/admin", label: "Tổng quan", icon: Gauge, end: true },
  { to: "/admin/users", label: "Người dùng", icon: Users },
  { to: "/admin/places", label: "Địa điểm", icon: MapPinned },
  { to: "/admin/posts", label: "Nội dung", icon: ShieldCheck },
  { to: "/admin/reports", label: "Báo cáo", icon: FileWarning },
  { to: "/admin/roles", label: "Phân quyền", icon: UserCog },
  { to: "/admin/tags", label: "Thẻ & danh mục", icon: Hash }
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => getUserSettings().darkMode);
  const [query, setQuery] = useState("");

  async function toggleTheme() {
    const next = !darkMode;
    setDarkMode(next);
    await updateUserSettings({ darkMode: next });
  }

  function submitSearch(event) {
    event.preventDefault();
    if (query.trim()) navigate(`/admin/users?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-main-content">Bỏ qua điều hướng quản trị</a>
      <aside className="admin-sidebar">
        <NavLink className="admin-brand" to="/admin">
          <span><Compass size={20} /></span>
          <div><strong>ChillPlace Admin</strong><small>System Control</small></div>
        </NavLink>
        <nav className="admin-sidebar__nav" aria-label="Điều hướng quản trị">
          {adminNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              <item.icon size={18} /><span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <NavLink className="admin-report-link" to="/admin/reports"><Flag size={17} />Tạo báo cáo</NavLink>
          <NavLink className="admin-back-link" to="/">Trở về ChillPlace</NavLink>
        </div>
      </aside>

      <div className="admin-shell__body">
        <header className="admin-topbar">
          <form className="admin-global-search" onSubmit={submitSearch}>
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm người dùng, nội dung..." />
          </form>
          <div className="admin-topbar__actions">
            <NavLink to="/admin/reports" aria-label="Báo cáo mới"><Bell size={19} /><span>5</span></NavLink>
            <button type="button" onClick={toggleTheme} aria-label={darkMode ? "Bật chế độ sáng" : "Bật chế độ tối"}>
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <div className="admin-account"><span>AC</span><div><strong>Admin Chill</strong><small>SUPER ADMIN</small></div></div>
          </div>
        </header>

        <nav className="admin-mobile-nav" aria-label="Điều hướng quản trị mobile">
          {adminNav.map((item) => <NavLink key={item.to} to={item.to} end={item.end}><item.icon size={16} />{item.label}</NavLink>)}
        </nav>

        <main className="admin-content" id="admin-main-content" tabIndex={-1}><Outlet /></main>
      </div>
    </div>
  );
}
