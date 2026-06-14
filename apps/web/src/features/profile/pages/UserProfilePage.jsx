import { useMemo, useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  Edit3,
  Grid3X3,
  Heart,
  Map,
  MapPin,
  MessageCircle,
  Share2,
  Star,
  Tag,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../../../services/profile.service.js";
import { SavedPlacesPage } from "../../saved/pages/SavedPlacesPage.jsx";
import "./UserProfilePage.css";

const profilePosts = [
  {
    id: "profile-post-1",
    title: "Chuyến đi tuyệt vời nhất năm nay!",
    location: "Ninh Bình, Việt Nam",
    likes: "2.4k",
    comments: "128",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCg3_ClU9QiIPgplX9KNas5gH3a7emTDs_VTM9BxZL4EUsLF8dKgBTidKLwVmgX_G8wAj38EgiNxRYzgNOTaactp1aO4DsYn8Rd9sZl8UhnerMoMjMc9Mbm6UQAIiLb9uOQVwsvlXf0ID9rNfFYwdiReV17Embmbe4UYFy6BGEwQ1evhTBeWyGJkXi7UsTNakpN5qDz-8iKXMdASoJMq0uW7RHV6hHGgNzkfuey1UfezyZxtb9skrvEMk2h9XLpBGvMApOda3dNYQI"
  },
  {
    id: "profile-post-2",
    title: "Brunch cuối tuần",
    location: "Thảo Điền, TP.HCM",
    likes: "892",
    comments: "45",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiK-vspnk0dfPmJsKxCfTnmJPLDEZxiHqxXZuGkXjy_k3a6bH4NOgJR7aHv8ChmbH2kYvgcLV9bzxGb7g0mfGxJ7-IT9mk6CF0UFrIVaBhAkH3OuGyqYvnx3oOOZs0VITdG7CgtjJWQekfWRAh-fX4Tc8ateOLsuEkqwjViRJ2AkuAonslgpR4_VJzJqfcTSXUxmhvmBXrNvhku8qF2PlSvUrFj1UTwpnkJiuH08t2KzMtacgxudzMlomE73YWnRZ1m1TNdOVzwlE"
  },
  {
    id: "profile-post-3",
    title: "Một góc cafe ấm áp",
    location: "Quận 1, TP.HCM",
    likes: "1.1k",
    comments: "67",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAJo18VpPzMzIfPDosPJ11gmILPJ1py3ueuZxxyX38h9_KTDTw_CjiYKLXRsewSGbt6Mi1LmR7QPwmxEbh9BBVyZDp3cmnpe3wFI7EdgTgPnz7HSeQf1xARsCZDMy99c8MFXIrwu17cQkm7ONGGk2G1UMfErNP8wBM3uyvXbwhl0JUr95lbLNLaccUZAi0Z4OA5RhAq62fik0IkAeKbsyTDaKB1bTDW8iaKn4roL6JeueaJoz073YTQhxphiTcvP16FL4iPt_5qpKQ"
  },
  {
    id: "profile-post-4",
    title: "Sáng sớm trong rừng",
    location: "Đà Lạt, Lâm Đồng",
    likes: "764",
    comments: "31",
    isNew: true,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTm3Z1vzXTiITpGDPHoC09DGih0hNBwS5AGH64sp-dvOkrBoYM2877waVwlNeGufzkhtSvFGZhFia8p9cF9JinhYPnitVUc9gf89CRISu_2cbbSl6_B6Uevf9i87egcTITGn74L7PcbWS0qDtEjlO4g4yWnFEl4g5abJAVzgpOhdt975jEjBXNNG-xrNtKcjHaWt48VH21UqTDMhnf_WkBXMMs0BOEUXF5NOA24mMG1KFbQNcBAQp-D22I6zaBoQswOLf5b5FrGX0"
  },
  {
    id: "profile-post-5",
    title: "Kiến trúc thành phố",
    location: "Quận 7, TP.HCM",
    likes: "522",
    comments: "18",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDG90FVz9gqaTcA1SkW9yD-DxhbNC2Um56fud6h-UgcfhjW6fwLnQiYfNXe_cEHe_eDi_iBTAMMK_TYGCz0oc7ptst1Tcz9Tx5d5r57H37aVcarfdEwBmn0vzD0R3xSBFL3CncUaV9RQP2lKw_sXDV5dMqRU7JUqca57YFsHySXdkKgf-iyOwvb3l59oDF-ebeYIHs96Hnkma7m4iq_WMRi87939M06AXBZ5X32UsKNn9TwnPqPm2015wrO_Vc8V8hoDbnfkeAuTBE"
  },
  {
    id: "profile-post-6",
    title: "Một tối ở lounge",
    location: "Quận 1, TP.HCM",
    likes: "986",
    comments: "52",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA8xOHwbmNMEtDkB9uayXQUnS5mNVcxvKxVrXon5A8zbdXKUo7y7CUt53A1pungD_hysOxjLqk8ICrkaOGG6-_zbmoJRjxblrUtDI4T5dnbK0UxFhzDOSIfiEt4ECG9Z-arXpfXhXtjhoiCYhWvkh8711m7DwWiagwkQkz8TsTBJa70kI_q2jdbrfgWFzOFRQePexVqAsQWQ7HP3IiEDMG4oNsLDPQaozPA9JkLKt3cDcDZiiAQc6hNu1_ZnGKwrZ6_WO3Jfuo8gAk"
  }
];

const profileReviews = [
  { id: "r1", place: "The Bloom Coffee", rating: 5, text: "Không gian sáng, bàn rộng và nhân viên rất dễ thương." },
  { id: "r2", place: "Skyline Social Bar", rating: 4, text: "View hoàng hôn đẹp, nên đặt bàn trước vào cuối tuần." },
  { id: "r3", place: "Sách & Sip Study Cafe", rating: 5, text: "Yên tĩnh, nhiều ổ cắm và wifi ổn định." }
];

const tabs = [
  { id: "posts", label: "Bài viết", icon: Grid3X3 },
  { id: "saved", label: "Đã lưu", icon: Bookmark },
  { id: "reviews", label: "Đánh giá", icon: Star },
  { id: "tagged", label: "Được gắn thẻ", icon: Tag }
];

export function UserProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getUserProfile());
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [shareStatus, setShareStatus] = useState("");

  const visiblePosts = useMemo(
    () => activeTab === "tagged" ? profilePosts.slice(1, 5) : profilePosts,
    [activeTab]
  );

  async function handleShare() {
    const profileUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: `${profile.name} | ChillPlace`, url: profileUrl });
        setShareStatus("Đã mở chia sẻ");
      } else {
        await navigator.clipboard.writeText(profileUrl);
        setShareStatus("Đã sao chép liên kết");
      }
    } catch {
      setShareStatus("Chia sẻ đã được hủy");
    }

    window.setTimeout(() => setShareStatus(""), 2200);
  }

  async function handleSaveProfile(nextProfile) {
    const savedProfile = await updateUserProfile(nextProfile);
    setProfile(savedProfile);
    setIsEditing(false);
  }

  return (
    <main className="profile-page">
      <section className="profile-page__header">
        <div className="profile-cover">
          <img src={profile.coverUrl} alt="Ảnh bìa hồ sơ" />
          <div className="profile-cover__shade" />
        </div>

        <div className="profile-identity">
          <div className="profile-avatar">
            <img src={profile.avatarUrl} alt={`Ảnh đại diện ${profile.name}`} />
            <span title="Tài khoản đã xác minh">
              <CheckCircle2 size={18} />
            </span>
          </div>

          <div className="profile-copy">
            <div className="profile-copy__name">
              <h1>{profile.name}</h1>
              <span>{profile.membership}</span>
            </div>
            <p>@{profile.username}</p>
            <blockquote>“{profile.bio}”</blockquote>
            <small>
              <MapPin size={14} />
              {profile.location}
            </small>
          </div>

          <div className="profile-actions">
            <button type="button" onClick={() => setIsEditing(true)}>
              <Edit3 size={18} />
              Sửa hồ sơ
            </button>
            <button type="button" onClick={handleShare}>
              <Share2 size={18} />
              Chia sẻ
            </button>
          </div>
        </div>

        <div className="profile-stats" aria-label="Thống kê hồ sơ">
          <div>
            <strong>{profile.stats.posts}</strong>
            <span>Bài viết</span>
          </div>
          <div>
            <strong>{profile.stats.followers}</strong>
            <span>Người theo dõi</span>
          </div>
          <div>
            <strong>{profile.stats.following}</strong>
            <span>Đang theo dõi</span>
          </div>
        </div>
      </section>

      {shareStatus ? <div className="profile-toast" role="status">{shareStatus}</div> : null}

      <nav className="profile-tabs" aria-label="Nội dung hồ sơ">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? "is-active" : ""}
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <section className="profile-content">
        {activeTab === "saved" ? (
          <SavedPlacesPage embedded />
        ) : null}

        {activeTab === "reviews" ? (
          <div className="profile-reviews">
            {profileReviews.map((review) => (
              <article key={review.id}>
                <div>
                  <strong>{review.place}</strong>
                  <span>{Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={15}
                      fill={index < review.rating ? "currentColor" : "none"}
                    />
                  ))}</span>
                </div>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        ) : null}

        {activeTab === "posts" || activeTab === "tagged" ? (
          <div className="profile-grid">
            {visiblePosts.map((post, index) => (
              <article
                className={[
                  "profile-post",
                  index === 0 ? "profile-post--featured" : "",
                  index === 3 ? "profile-post--wide" : ""
                ].filter(Boolean).join(" ")}
                key={post.id}
              >
                <img src={post.imageUrl} alt={post.title} loading="lazy" decoding="async" />
                <div className="profile-post__overlay">
                  <span><MapPin size={14} />{post.location}</span>
                  <h2>{post.title}</h2>
                  <div>
                    <span><Heart size={15} />{post.likes}</span>
                    <span><MessageCircle size={15} />{post.comments}</span>
                  </div>
                </div>
                {post.isNew ? <strong className="profile-post__new">Mới</strong> : null}
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <button className="profile-map-action" type="button" aria-label="Mở bản đồ" onClick={() => navigate("/map")}>
        <Map size={25} />
      </button>

      {isEditing ? (
        <EditProfileDialog
          profile={profile}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveProfile}
        />
      ) : null}
    </main>
  );
}

function EditProfileDialog({ profile, onClose, onSave }) {
  const [draft, setDraft] = useState(profile);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!draft.name.trim() || !draft.username.trim()) {
      setError("Tên hiển thị và username không được để trống.");
      return;
    }

    setIsSaving(true);
    await onSave({
      name: draft.name.trim(),
      username: draft.username.trim().replace(/^@/, ""),
      bio: draft.bio.trim(),
      location: draft.location.trim()
    });
    setIsSaving(false);
  }

  return (
    <div className="profile-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
      <button className="profile-dialog__backdrop" type="button" aria-label="Đóng" onClick={onClose} />
      <form onSubmit={handleSubmit}>
        <header>
          <div>
            <span>Thông tin cá nhân</span>
            <h2 id="edit-profile-title">Chỉnh sửa hồ sơ</h2>
          </div>
          <button type="button" aria-label="Đóng" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="profile-dialog__preview">
          <img src={draft.avatarUrl || profile.avatarUrl} alt="" />
          <span><CheckCircle2 size={17} /></span>
        </div>

        <label>
          Tên hiển thị
          <input value={draft.name} maxLength={50} onChange={(event) => updateDraft("name", event.target.value)} />
        </label>
        <label>
          Username
          <input value={draft.username} maxLength={30} onChange={(event) => updateDraft("username", event.target.value)} />
        </label>
        <label>
          Giới thiệu
          <textarea value={draft.bio} maxLength={140} rows={3} onChange={(event) => updateDraft("bio", event.target.value)} />
        </label>
        <label>
          Khu vực
          <input value={draft.location} maxLength={60} onChange={(event) => updateDraft("location", event.target.value)} />
        </label>
        {error ? <div className="profile-dialog__error">{error}</div> : null}

        <footer>
          <button type="button" onClick={onClose}>Hủy</button>
          <button type="submit" disabled={isSaving}>{isSaving ? "Đang lưu..." : "Lưu thay đổi"}</button>
        </footer>
      </form>
    </div>
  );
}

