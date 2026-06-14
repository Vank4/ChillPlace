import { Compass, Plus } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Avatar } from "../common/Avatar.jsx";
import { Button } from "../common/Button.jsx";
import { headerActions, mobileNavItems, publicNavItems } from "../../constants/routes.js";
import { mockCurrentUser } from "../../data/mockFeed.js";
import { getUserProfile } from "../../services/profile.service.js";
import "./AppShell.css";

export function AppShell() {
  const location = useLocation();
  const [shellProfile, setShellProfile] = useState(() => getUserProfile());
  const isHomeRoute = location.pathname === "/";
  const isMapRoute = location.pathname === "/map";
  const isPostRoute = location.pathname.startsWith("/posts/");

  useLayoutEffect(() => {
    if (isHomeRoute) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [isHomeRoute]);

  useEffect(() => {
    function refreshProfile() {
      setShellProfile(getUserProfile());
    }

    window.addEventListener("chillplace:profile-updated", refreshProfile);
    return () => window.removeEventListener("chillplace:profile-updated", refreshProfile);
  }, []);

  return (
    <div
      className={[
        "app-shell",
        isHomeRoute ? "app-shell--home" : "",
        isMapRoute ? "app-shell--map" : "",
        isPostRoute ? "app-shell--post" : ""
      ].filter(Boolean).join(" ")}
    >
      <aside className="desktop-sidebar" aria-label="Điều hướng chính">
        <NavBrand />
        <nav className="desktop-sidebar__nav">
          {publicNavItems.map((item) => (
            <NavLink key={item.path} to={item.path} className="desktop-sidebar__link">
              <item.icon size={20} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="desktop-sidebar__footer">
          <Button className="desktop-sidebar__create">
            <Plus size={18} aria-hidden="true" />
            Đăng bài mới
          </Button>
          <NavLink className="desktop-sidebar__profile" to="/profile">
            <Avatar src={shellProfile.avatarUrl || mockCurrentUser.avatarUrl} alt={`Ảnh đại diện ${shellProfile.name}`} />
            <div>
              <strong>{shellProfile.name}</strong>
              <span>@{shellProfile.username}</span>
            </div>
          </NavLink>
        </div>
      </aside>

      <header className="mobile-header">
        <NavBrand compact />
        <div className="mobile-header__actions">
          {headerActions.map((action) => (
            <NavLink
              key={action.path}
              className="icon-button mobile-header__action-link"
              to={action.path}
              aria-label={action.label}
              title={action.label}
            >
              <action.icon size={20} aria-hidden="true" />
              <span className="icon-button__badge">3</span>
            </NavLink>
          ))}
        </div>
      </header>

      <main className="app-shell__content">
        <Outlet />
      </main>

      <nav className="bottom-nav" aria-label="Điều hướng di động">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={item.isCreate ? "bottom-nav__item bottom-nav__item--create" : "bottom-nav__item"}
          >
            <item.icon size={item.isCreate ? 22 : 20} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function NavBrand({ compact = false }) {
  return (
    <NavLink className={compact ? "nav-brand nav-brand--compact" : "nav-brand"} to="/">
      <span className="nav-brand__mark">
        <Compass size={compact ? 18 : 22} aria-hidden="true" />
      </span>
      <span>
        <strong>ChillPlace</strong>
        {!compact ? <small>Khám phá không gian</small> : null}
      </span>
    </NavLink>
  );
}
