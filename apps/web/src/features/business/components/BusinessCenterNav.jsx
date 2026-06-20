import { BarChart3, Gift, MapPinned, MessageSquareText, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./BusinessCenterNav.css";

const businessNavItems = [
  { label: "Dashboard", path: "/business", icon: BarChart3, end: true },
  { label: "Địa điểm", path: "/business/places", icon: MapPinned },
  { label: "Khuyến mãi", path: "/business/promotions", icon: Gift },
  { label: "Đánh giá", path: "/business/reviews", icon: MessageSquareText }
];

export function BusinessHeader({ eyebrow, title, description, action }) {
  return (
    <header className="business-header">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div className="business-header__action">{action}</div> : null}
    </header>
  );
}

export function BusinessNav() {
  return (
    <nav className="business-nav" aria-label="Business Center">
      {businessNavItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink end={item.end} key={item.path} to={item.path}>
            <Icon size={16} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export function BusinessActionLink({ to = "/business/promotions", children }) {
  return (
    <NavLink className="business-action-link" to={to}>
      <Plus size={16} />
      {children}
    </NavLink>
  );
}

export function BusinessMetric({ icon: Icon, label, value, detail, tone = "orange" }) {
  return (
    <article className={`business-metric business-metric--${tone}`}>
      <span>
        <Icon size={17} />
      </span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
      {detail ? <em>{detail}</em> : null}
    </article>
  );
}

