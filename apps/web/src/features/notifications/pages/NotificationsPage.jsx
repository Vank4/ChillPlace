import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CheckCheck,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Tags,
  UserPlus,
  X
} from "lucide-react";
import { Avatar } from "../../../components/common/Avatar.jsx";
import { mockCurrentUser } from "../../../data/mockFeed.js";
import "./NotificationsPage.css";

const READ_STORAGE_KEY = "chillplace.readNotifications";
const HIDDEN_STORAGE_KEY = "chillplace.hiddenNotifications";
const SETTINGS_STORAGE_KEY = "chillplace.notificationSettings";

const defaultSettings = {
  comments: true,
  nearby: true,
  trends: false
};

const notificationFilters = [
  { id: "all", label: "Tất cả" },
  { id: "unread", label: "Chưa đọc" },
  { id: "social", label: "Tương tác" },
  { id: "places", label: "Địa điểm" },
  { id: "system", label: "Hệ thống" }
];

const notifications = [
  {
    id: "n1",
    type: "social",
    title: "Linh Chi đã bình luận bài review của anh",
    body: "Mình đã lưu lại, hôm nào ghé thử rồi review tiếp cho anh em.",
    time: "2 phút trước",
    icon: MessageCircle,
    tone: "orange",
    target: "/posts/post-1",
    actor: {
      name: "Linh Chi",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCX5hpYAe2q1eIr261Al5PegY4kgkoIFxIrCctmTzNF3gLkoxlHba0k4mKNKKRdA2BhluvB6hhnY6v32Etsst4JhBXGNIvGKVAJFCE3_K97igDhFZJe1LEmt4RKXDu2fwi-9m19uDevax3lW_WZjkhmKF3Ibv1TmlgbTxky0s_WaDZhOSQGAoYZTwZTM1LpkmmBO53MibepVulKcDfRXylLMoaVOULV1P9wF60BUiS9CEykDRH3arq-BOhNaB_TcULqHdRnvAqoMn8"
    }
  },
  {
    id: "n2",
    type: "places",
    title: "The Bloom Coffee đang được lưu nhiều gần anh",
    body: "Không gian yên tĩnh, ổ cắm đầy đủ và rating 4.6 sao.",
    time: "18 phút trước",
    icon: MapPin,
    tone: "teal",
    target: "/places/p2"
  },
  {
    id: "n3",
    type: "social",
    title: "Minh Nguyen thích bài viết của anh",
    body: "Bài review Tiệm Cà Phê Túi Mơ To vừa đạt 12.5k lượt thích.",
    time: "1 giờ trước",
    icon: Heart,
    tone: "pink",
    target: "/posts/post-1",
    actor: {
      name: "Minh Nguyen",
      avatarUrl: mockCurrentUser.avatarUrl
    }
  },
  {
    id: "n4",
    type: "places",
    title: "Có 3 địa điểm mới khớp gu study spot",
    body: "Lofi Study Lounge, Sách & Sip Study Cafe và Garden Chill Rooftop đang mở.",
    time: "Hôm nay",
    icon: Sparkles,
    tone: "blue",
    target: "/nearby"
  },
  {
    id: "n5",
    type: "system",
    title: "Hồ sơ khám phá đã sẵn sàng",
    body: "ChillPlace đã đồng bộ savedPlaces, recentSearches và filter gần nhất.",
    time: "Hôm qua",
    icon: ShieldCheck,
    tone: "green",
    target: "/profile"
  },
  {
    id: "n6",
    type: "social",
    title: "Saigon Bites bắt đầu theo dõi anh",
    body: "Tài khoản này thường đăng review rooftop và quán đêm ở Quận 1.",
    time: "2 ngày trước",
    icon: UserPlus,
    tone: "orange",
    target: "/posts/post-3",
    actor: {
      name: "Saigon Bites",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBPKJMZDmIIP1yRKv6GC307LV-8WxV92QEFm6bfmM20xhe25pfYiHAn0i9px4c-L7uvxAEZJlVFdiIveMKvW231FW4p-z2ramS3Vkyl3BF7ciovA4lFPLHpS6GUJgRHnBXIo4to4egHLNrVtWpUA5ABXbQnFbTrnwjcJyKPAOgvNss4uRsJ-aIMh6OE_DwZIgv4bv7T-F-HaiQSEJW4570fDj_OnKCo47e3wSgJErA6Widf6lAYpsIj645rcpgXlE0NX3LdKHwrCjc"
    }
  },
  {
    id: "n7",
    type: "places",
    title: "#cafe đang tăng nhanh trong khu vực",
    body: "12.8k lượt tương tác mới. Xem các địa điểm và bài viết liên quan.",
    time: "3 ngày trước",
    icon: Tags,
    tone: "amber",
    target: "/tags/cafe"
  }
];

function getStoredSet(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) ?? "[]"));
  } catch {
    return new Set();
  }
}

function saveStoredSet(key, value) {
  localStorage.setItem(key, JSON.stringify([...value]));
}

function getStoredSettings() {
  try {
    return {
      ...defaultSettings,
      ...JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) ?? "{}")
    };
  } catch {
    return defaultSettings;
  }
}

function saveStoredSettings(value) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(value));
}

function getTypeLabel(type) {
  if (type === "social") return "Tương tác";
  if (type === "places") return "Địa điểm";
  return "Hệ thống";
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [readIds, setReadIds] = useState(() => getStoredSet(READ_STORAGE_KEY));
  const [hiddenIds, setHiddenIds] = useState(() =>
    getStoredSet(HIDDEN_STORAGE_KEY)
  );
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [settings, setSettings] = useState(() => getStoredSettings());

  const visibleNotifications = useMemo(
    () => notifications.filter((item) => !hiddenIds.has(item.id)),
    [hiddenIds]
  );

  const unreadCount = visibleNotifications.filter(
    (item) => !readIds.has(item.id)
  ).length;

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredNotifications = visibleNotifications
    .filter((item) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "unread") return !readIds.has(item.id);
      return item.type === activeFilter;
    })
    .filter((item) => {
      if (!normalizedSearchTerm) return true;
      return `${item.title} ${item.body} ${getTypeLabel(item.type)} ${
        item.actor?.name ?? ""
      }`
        .toLowerCase()
        .includes(normalizedSearchTerm);
    });

  const typeCounts = notificationFilters.map((filter) => ({
    ...filter,
    count:
      filter.id === "all"
        ? visibleNotifications.length
        : filter.id === "unread"
          ? unreadCount
          : visibleNotifications.filter((item) => item.type === filter.id)
              .length
  }));

  function markAsRead(id) {
    const next = new Set(readIds);
    next.add(id);
    setReadIds(next);
    saveStoredSet(READ_STORAGE_KEY, next);
  }

  function markAllAsRead() {
    const next = new Set(visibleNotifications.map((item) => item.id));
    setReadIds(next);
    saveStoredSet(READ_STORAGE_KEY, next);
  }

  function markSelectedAsRead() {
    if (selectedIds.size === 0) return;
    const next = new Set(readIds);
    selectedIds.forEach((id) => next.add(id));
    setReadIds(next);
    saveStoredSet(READ_STORAGE_KEY, next);
    setSelectedIds(new Set());
  }

  function hideNotification(event, id) {
    event.stopPropagation();
    const next = new Set(hiddenIds);
    next.add(id);
    setHiddenIds(next);
    saveStoredSet(HIDDEN_STORAGE_KEY, next);
  }

  function hideSelectedNotifications() {
    if (selectedIds.size === 0) return;
    const next = new Set(hiddenIds);
    selectedIds.forEach((id) => next.add(id));
    setHiddenIds(next);
    saveStoredSet(HIDDEN_STORAGE_KEY, next);
    setSelectedIds(new Set());
  }

  function restoreHiddenNotifications() {
    const next = new Set();
    setHiddenIds(next);
    saveStoredSet(HIDDEN_STORAGE_KEY, next);
  }

  function toggleSelectedNotification(event, id) {
    event.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  }

  function toggleAllFiltered() {
    if (
      filteredNotifications.length > 0 &&
      selectedIds.size === filteredNotifications.length
    ) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(filteredNotifications.map((item) => item.id)));
  }

  function toggleSetting(key) {
    const next = {
      ...settings,
      [key]: !settings[key]
    };
    setSettings(next);
    saveStoredSettings(next);
  }

  function openNotification(item) {
    markAsRead(item.id);
    navigate(item.target);
  }

  return (
    <div className="notifications-page">
      <main className="notifications-page__main">
        <section
          className="notifications-hero"
          aria-labelledby="notifications-title"
        >
          <div>
            <p className="notifications-hero__eyebrow">Notification Center</p>
            <h1 id="notifications-title">Thông báo của anh</h1>
            <p>
              Theo dõi bình luận, lượt thích, địa điểm mới và các cập nhật hệ
              thống trong nhóm Public Discovery.
            </p>
          </div>
          <button
            className="notifications-page__mark-all"
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={18} />
            Đọc tất cả
          </button>
        </section>

        <div
          className="notifications-tabs"
          role="tablist"
          aria-label="Lọc thông báo"
        >
          {typeCounts.map((filter) => (
            <button
              key={filter.id}
              className={`notifications-tabs__item ${
                activeFilter === filter.id ? "is-active" : ""
              }`}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              role="tab"
              aria-selected={activeFilter === filter.id}
            >
              {filter.label}
              <span>{filter.count}</span>
            </button>
          ))}
        </div>

        <section className="notifications-tools" aria-label="Quản lý thông báo">
          <label className="notifications-tools__search">
            <Search size={16} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm trong thông báo..."
              aria-label="Tìm trong thông báo"
            />
          </label>
          <div className="notifications-tools__actions">
            <button
              type="button"
              onClick={toggleAllFiltered}
              disabled={filteredNotifications.length === 0}
            >
              {filteredNotifications.length > 0 &&
              selectedIds.size === filteredNotifications.length
                ? "Bỏ chọn"
                : "Chọn trang"}
            </button>
            <button
              type="button"
              onClick={markSelectedAsRead}
              disabled={selectedIds.size === 0}
            >
              Đọc mục chọn
            </button>
            <button
              type="button"
              onClick={hideSelectedNotifications}
              disabled={selectedIds.size === 0}
            >
              Ẩn mục chọn
            </button>
            <button
              type="button"
              onClick={restoreHiddenNotifications}
              disabled={hiddenIds.size === 0}
            >
              <RotateCcw size={15} />
              Khôi phục {hiddenIds.size > 0 ? hiddenIds.size : ""}
            </button>
          </div>
        </section>

        <section className="notifications-list" aria-label="Danh sách thông báo">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => {
              const Icon = item.icon;
              const isUnread = !readIds.has(item.id);

              return (
                <article
                  key={item.id}
                  className={`notification-card notification-card--${item.tone} ${
                    isUnread ? "is-unread" : ""
                  } ${selectedIds.has(item.id) ? "is-selected" : ""}`}
                  tabIndex={0}
                  role="button"
                  onClick={() => openNotification(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openNotification(item);
                    }
                  }}
                >
                  <span className="notification-card__status" aria-hidden="true" />
                  <button
                    className="notification-card__select"
                    type="button"
                    aria-label="Chọn thông báo"
                    aria-pressed={selectedIds.has(item.id)}
                    onClick={(event) =>
                      toggleSelectedNotification(event, item.id)
                    }
                  />
                  <div className="notification-card__media">
                    {item.actor ? (
                      <Avatar
                        src={item.actor.avatarUrl}
                        alt={item.actor.name}
                        size="lg"
                      />
                    ) : (
                      <span className="notification-card__icon">
                        <Icon size={22} />
                      </span>
                    )}
                  </div>
                  <div className="notification-card__body">
                    <div className="notification-card__title-row">
                      <h2>{item.title}</h2>
                      <span className="notification-card__time">
                        <Clock3 size={14} />
                        {item.time}
                      </span>
                    </div>
                    <p>{item.body}</p>
                    <div className="notification-card__meta">
                      <span>{getTypeLabel(item.type)}</span>
                      {isUnread && <strong>Chưa đọc</strong>}
                    </div>
                  </div>
                  <div className="notification-card__actions">
                    <button
                      type="button"
                      className="notification-card__dismiss"
                      aria-label="Ẩn thông báo"
                      onClick={(event) => hideNotification(event, item.id)}
                    >
                      <X size={17} />
                    </button>
                    <ArrowRight size={19} aria-hidden="true" />
                  </div>
                </article>
              );
            })
          ) : (
            <div className="notifications-empty">
              <Bell size={28} />
              <h2>Không có thông báo phù hợp</h2>
              <p>Thử đổi bộ lọc hoặc quay lại mục tất cả để xem thêm cập nhật.</p>
            </div>
          )}
        </section>
      </main>

      <aside className="notifications-page__side" aria-label="Tổng quan thông báo">
        <section className="notifications-summary">
          <Bell size={24} />
          <strong>{unreadCount}</strong>
          <span>thông báo chưa đọc</span>
        </section>

        <section className="notifications-side-card">
          <div className="notifications-side-card__heading">
            <h2>Nhịp hoạt động</h2>
            <Sparkles size={18} />
          </div>
          <ul>
            <li>
              <span>Tương tác</span>
              <strong>
                {typeCounts.find((item) => item.id === "social")?.count}
              </strong>
            </li>
            <li>
              <span>Địa điểm</span>
              <strong>
                {typeCounts.find((item) => item.id === "places")?.count}
              </strong>
            </li>
            <li>
              <span>Hệ thống</span>
              <strong>
                {typeCounts.find((item) => item.id === "system")?.count}
              </strong>
            </li>
          </ul>
        </section>

        <section className="notifications-side-card notifications-side-card--settings">
          <div className="notifications-side-card__heading">
            <h2>Cài đặt nhanh</h2>
            <Settings size={18} />
          </div>
          <button type="button" onClick={() => toggleSetting("comments")}>
            Bình luận và trả lời
            <span>{settings.comments ? "Bật" : "Tắt"}</span>
          </button>
          <button type="button" onClick={() => toggleSetting("nearby")}>
            Đề xuất gần anh
            <span>{settings.nearby ? "Bật" : "Tắt"}</span>
          </button>
          <button type="button" onClick={() => toggleSetting("trends")}>
            Hashtag đang hot
            <span>{settings.trends ? "Bật" : "Yên lặng"}</span>
          </button>
        </section>

        <section className="notifications-side-card notifications-side-card--tip">
          <Star size={19} />
          <p>
            Trang này đang dùng mock data, localStorage và routing thật. Sau này
            chỉ cần thay bằng API `/api/notifications`.
          </p>
        </section>
      </aside>
    </div>
  );
}
