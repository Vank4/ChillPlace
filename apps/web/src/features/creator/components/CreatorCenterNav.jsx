import { BarChart3, FileEdit, FileText, Plus, Send } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./CreatorCenterNav.css";

const creatorNavItems = [
  { label: "Tạo bài", path: "/creator/posts/new", icon: Plus },
  { label: "Bài viết", path: "/creator/posts", icon: Send },
  { label: "Bản nháp", path: "/creator/drafts", icon: FileEdit },
  { label: "Analytics", path: "/creator/analytics", icon: BarChart3 }
];

export function CreatorCenterHeader({ eyebrow, title, description, action }) {
  return (
    <header className="creator-center-header">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div className="creator-center-header__action">{action}</div> : null}
    </header>
  );
}

export function CreatorCenterNav() {
  return (
    <nav className="creator-center-nav" aria-label="Creator Center">
      {creatorNavItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink key={item.path} to={item.path}>
            <Icon size={16} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export function CreatorStatCard({ icon: Icon = FileText, label, value, tone = "warm", caption }) {
  return (
    <article className={`creator-stat-card creator-stat-card--${tone}`}>
      <span>
        <Icon size={17} />
      </span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
      {caption ? <em>{caption}</em> : null}
    </article>
  );
}

