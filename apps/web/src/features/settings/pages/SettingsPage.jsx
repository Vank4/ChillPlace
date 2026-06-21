import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Ban,
  ChevronRight,
  CircleHelp,
  FileText,
  Globe2,
  Languages,
  Link2,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Text,
  UserRound,
  UsersRound,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  changePassword,
  getAuthSession,
  logout
} from "../../../services/auth.service.js";
import {
  applyThemePreference,
  getUserSettings,
  updateUserSettings
} from "../../../services/settings.service.js";
import {
  getUserProfile,
  updateUserProfile
} from "../../../services/profile.service.js";
import "./SettingsPage.css";

const sections = [
  { id: "account", label: "Tài khoản", description: "Hồ sơ và bảo mật", icon: UserRound },
  { id: "notifications", label: "Thông báo", description: "Kênh nhận thông tin", icon: Bell },
  { id: "privacy", label: "Quyền riêng tư", description: "Hiển thị và vị trí", icon: ShieldCheck },
  { id: "appearance", label: "Giao diện", description: "Chế độ và ngôn ngữ", icon: Palette },
  { id: "support", label: "Hỗ trợ", description: "Trợ giúp và chính sách", icon: CircleHelp }
];

const languageLabels = {
  vi: "Tiếng Việt",
  en: "English"
};

const visibilityLabels = {
  everyone: "Mọi người",
  friends: "Bạn bè",
  private: "Chỉ mình tôi"
};

const fontSizeLabels = {
  small: "Nhỏ",
  medium: "Trung bình",
  large: "Lớn"
};

export function SettingsPage() {
  const navigate = useNavigate();
  const session = getAuthSession();
  const [activeSection, setActiveSection] = useState("account");
  const [profile, setProfile] = useState(() => getUserProfile());
  const [profileDraft, setProfileDraft] = useState(() => getUserProfile());
  const [settings, setSettings] = useState(() => getUserSettings());
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState("");

  const accountEmail =
    session?.user?.email ?? "minh@chillplace.vn";

  const currentSection = useMemo(
    () => sections.find((section) => section.id === activeSection),
    [activeSection]
  );
  const CurrentSectionIcon = currentSection.icon;

  useEffect(() => {
    applyThemePreference(settings.darkMode);
  }, [settings.darkMode]);

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function setPreference(key, value) {
    const nextSettings = await updateUserSettings({ [key]: value });
    setSettings(nextSettings);

    showToast("Đã lưu cài đặt");
  }

  async function handleSaveProfile(event) {
    event.preventDefault();

    if (!profileDraft.name.trim()) {
      showToast("Tên hiển thị không được để trống");
      return;
    }

    setIsSavingProfile(true);
    const nextProfile = await updateUserProfile({
      name: profileDraft.name.trim(),
      bio: profileDraft.bio.trim(),
      location: profileDraft.location.trim()
    });
    setProfile(nextProfile);
    setProfileDraft(nextProfile);
    setIsSavingProfile(false);
    showToast("Đã cập nhật hồ sơ");
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="settings-page">
      <header className="settings-hero">
        <div>
          <span>Personal space</span>
          <h1>Cài đặt hệ thống</h1>
          <p>Quản lý tài khoản và trải nghiệm cá nhân của anh tại ChillPlace.</p>
        </div>
        <div className="settings-hero__actions">
          <button className="settings-hero__profile" type="button" onClick={() => navigate("/profile")}>
            <UserRound size={16} />
            Xem hồ sơ
          </button>
          <button className="settings-hero__logout" type="button" onClick={handleLogout}>
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Danh mục cài đặt">
          {sections.map((section) => (
            <button
              className={activeSection === section.id ? "is-active" : ""}
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
            >
              <span><section.icon size={18} /></span>
              <strong>{section.label}</strong>
              <ChevronRight size={17} />
            </button>
          ))}

          <div className="settings-nav__account">
            <img src={profile.avatarUrl} alt="" loading="lazy" decoding="async" />
            <div>
              <strong>{profile.name}</strong>
              <span>@{profile.username}</span>
            </div>
          </div>
        </nav>

        <section className="settings-panel" aria-labelledby="settings-section-title">
          <div className="settings-panel__title">
            <span><CurrentSectionIcon size={19} /></span>
            <div>
              <small>Cài đặt</small>
              <h2 id="settings-section-title">{currentSection.label}</h2>
              <p>{currentSection.description}</p>
            </div>
          </div>

          {activeSection === "account" ? (
            <AccountSection
              draft={profileDraft}
              accountEmail={accountEmail}
              isSaving={isSavingProfile}
              onChange={setProfileDraft}
              onSave={handleSaveProfile}
              onPassword={() => setDialog("password")}
              onSocial={() => setDialog("social")}
              twoFactorEnabled={settings.twoFactorEnabled}
              onTwoFactor={(value) => setPreference("twoFactorEnabled", value)}
            />
          ) : null}

          {activeSection === "notifications" ? (
            <SettingsGroup title="Tùy chọn thông báo">
              <ToggleRow icon={Bell} title="Đẩy tin nhắn" description="Thông báo tức thời trên thiết bị" checked={settings.pushNotifications} onChange={(value) => setPreference("pushNotifications", value)} />
              <ToggleRow icon={Mail} title="Email" description="Bản tin và hoạt động tài khoản" checked={settings.emailNotifications} onChange={(value) => setPreference("emailNotifications", value)} />
              <ToggleRow icon={Smartphone} title="Cập nhật hệ thống" description="Tính năng mới và thông báo bảo trì" checked={settings.systemUpdates} onChange={(value) => setPreference("systemUpdates", value)} />
            </SettingsGroup>
          ) : null}

          {activeSection === "privacy" ? (
            <>
              <SettingsGroup title="Quyền xem và hoạt động">
                <ActionRow icon={UsersRound} title="Ai có thể xem bài viết" description={visibilityLabels[settings.postVisibility]} onClick={() => setDialog("visibility")} />
                <ToggleRow icon={MapPin} title="Chia sẻ vị trí" description="Dùng vị trí để gợi ý địa điểm gần anh" checked={settings.locationSharing} onChange={(value) => setPreference("locationSharing", value)} />
                <ToggleRow icon={Sparkles} title="Trạng thái hoạt động" description="Hiển thị khi anh đang trực tuyến" checked={settings.activityStatus} onChange={(value) => setPreference("activityStatus", value)} />
              </SettingsGroup>
              <SettingsGroup title="An toàn">
                <ActionRow icon={Ban} title="Danh sách chặn" description="Chưa có người dùng bị chặn" onClick={() => showToast("Danh sách chặn đang trống")} />
              </SettingsGroup>
            </>
          ) : null}

          {activeSection === "appearance" ? (
            <SettingsGroup title="Giao diện và ngôn ngữ">
              <ToggleRow icon={Moon} title="Chế độ tối" description="Giảm độ sáng giao diện khi dùng ban đêm" checked={settings.darkMode} onChange={(value) => setPreference("darkMode", value)} />
              <ActionRow icon={Languages} title="Ngôn ngữ" description={languageLabels[settings.language]} onClick={() => setDialog("language")} />
              <ActionRow icon={Text} title="Cỡ chữ" description={fontSizeLabels[settings.fontSize]} onClick={() => setDialog("fontSize")} />
            </SettingsGroup>
          ) : null}

          {activeSection === "support" ? (
            <SettingsGroup title="Thông tin và hỗ trợ">
              <ActionRow icon={CircleHelp} title="Trung tâm trợ giúp" description="Câu hỏi thường gặp và hướng dẫn sử dụng" onClick={() => showToast("Trung tâm trợ giúp sẽ sớm ra mắt")} />
              <ActionRow icon={FileText} title="Điều khoản dịch vụ" description="Cập nhật lần cuối tháng 06/2026" onClick={() => setDialog("terms")} />
              <ActionRow icon={ShieldCheck} title="Chính sách bảo mật" description="Cách ChillPlace bảo vệ dữ liệu của anh" onClick={() => setDialog("privacyPolicy")} />
            </SettingsGroup>
          ) : null}
        </section>
      </div>

      {toast ? <div className="settings-toast" role="status">{toast}</div> : null}

      {dialog ? (
        <SettingsDialog title={getDialogTitle(dialog)} onClose={() => setDialog(null)}>
          {dialog === "password" ? (
            <PasswordForm
              onSuccess={() => {
                setDialog(null);
                showToast("Đã đổi mật khẩu");
              }}
            />
          ) : null}
          {dialog === "social" ? <SocialConnections /> : null}
          {dialog === "visibility" ? (
            <OptionList
              value={settings.postVisibility}
              options={visibilityLabels}
              onSelect={(value) => {
                setPreference("postVisibility", value);
                setDialog(null);
              }}
            />
          ) : null}
          {dialog === "language" ? (
            <OptionList
              value={settings.language}
              options={languageLabels}
              onSelect={(value) => {
                setPreference("language", value);
                setDialog(null);
              }}
            />
          ) : null}
          {dialog === "fontSize" ? (
            <OptionList
              value={settings.fontSize}
              options={fontSizeLabels}
              onSelect={(value) => {
                setPreference("fontSize", value);
                setDialog(null);
              }}
            />
          ) : null}
          {dialog === "terms" || dialog === "privacyPolicy" ? (
            <PolicyCopy type={dialog} />
          ) : null}
        </SettingsDialog>
      ) : null}
    </main>
  );
}

function AccountSection({
  draft,
  accountEmail,
  isSaving,
  onChange,
  onSave,
  onPassword,
  onSocial,
  twoFactorEnabled,
  onTwoFactor
}) {
  return (
    <>
      <form className="settings-profile-form" onSubmit={onSave}>
        <div className="settings-profile-form__heading">
          <div>
            <small>Thông tin công khai</small>
            <h3>Hồ sơ cá nhân</h3>
            <p>Cập nhật cách mọi người nhìn thấy anh trên ChillPlace.</p>
          </div>
          <button type="submit" disabled={isSaving}>
            <Save size={16} />
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>

        <div className="settings-profile-form__body">
          <aside className="settings-profile-card">
            <img src={draft.avatarUrl} alt={`Ảnh đại diện ${draft.name}`} loading="lazy" decoding="async" />
            <strong>{draft.name}</strong>
            <span>@{draft.username}</span>
            <small>{accountEmail}</small>
          </aside>
          <div className="settings-profile-fields">
            <div className="settings-profile-fields__grid">
              <label>
                Tên hiển thị
                <input
                  maxLength={50}
                  value={draft.name}
                  onChange={(event) => onChange({ ...draft, name: event.target.value })}
                />
              </label>
              <label>
                Khu vực
                <input
                  maxLength={60}
                  value={draft.location}
                  onChange={(event) => onChange({ ...draft, location: event.target.value })}
                />
              </label>
            </div>
            <label>
              Tiểu sử
              <textarea
                rows={2}
                maxLength={140}
                value={draft.bio}
                onChange={(event) => onChange({ ...draft, bio: event.target.value })}
              />
            </label>
            <div className="settings-profile-fields__meta">
              <span>Username <strong>@{draft.username}</strong></span>
              <span>Email <strong>{accountEmail}</strong></span>
            </div>
          </div>
        </div>
      </form>

      <SettingsGroup title="Bảo mật">
        <ActionRow icon={LockKeyhole} title="Đổi mật khẩu" description="Nên cập nhật mật khẩu định kỳ" onClick={onPassword} />
        <ToggleRow icon={Smartphone} title="Xác thực 2 yếu tố (2FA)" description={twoFactorEnabled ? "Đang bật" : "Chưa bật"} checked={twoFactorEnabled} onChange={onTwoFactor} />
        <ActionRow icon={Link2} title="Liên kết mạng xã hội" description="Quản lý Google và Facebook" onClick={onSocial} />
      </SettingsGroup>
    </>
  );
}

function SettingsGroup({ title, children }) {
  return (
    <section className="settings-group">
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  );
}

function ActionRow({ icon: Icon, title, description, onClick }) {
  return (
    <button className="settings-row" type="button" onClick={onClick}>
      <span className="settings-row__icon"><Icon size={18} /></span>
      <span className="settings-row__copy">
        <strong>{title}</strong>
        {description ? <small>{description}</small> : null}
      </span>
      <ChevronRight className="settings-row__chevron" size={18} />
    </button>
  );
}

function ToggleRow({ icon: Icon, title, description, checked, onChange }) {
  return (
    <div className="settings-row">
      <span className="settings-row__icon"><Icon size={18} /></span>
      <span className="settings-row__copy">
        <strong>{title}</strong>
        {description ? <small>{description}</small> : null}
      </span>
      <button
        className={checked ? "settings-toggle is-on" : "settings-toggle"}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${checked ? "Tắt" : "Bật"} ${title}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}

function SettingsDialog({ title, children, onClose }) {
  return (
    <div className="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-dialog-title">
      <button className="settings-dialog__backdrop" type="button" aria-label="Đóng" onClick={onClose} />
      <section>
        <header>
          <h2 id="settings-dialog-title">{title}</h2>
          <button type="button" aria-label="Đóng" onClick={onClose}><X size={19} /></button>
        </header>
        {children}
      </section>
    </div>
  );
}

function PasswordForm({ onSuccess }) {
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (values.newPassword.length < 8) {
      setError("Mật khẩu mới cần ít nhất 8 ký tự.");
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      setError("Mật khẩu xác nhận chưa khớp.");
      return;
    }

    setIsSaving(true);
    try {
      await changePassword(values);
      onSuccess();
    } catch (requestError) {
      setError(requestError.message);
      setIsSaving(false);
    }
  }

  return (
    <form className="settings-password-form" onSubmit={handleSubmit}>
      <label>Mật khẩu hiện tại<input type="password" value={values.currentPassword} onChange={(event) => setValues({ ...values, currentPassword: event.target.value })} /></label>
      <label>Mật khẩu mới<input type="password" value={values.newPassword} onChange={(event) => setValues({ ...values, newPassword: event.target.value })} /></label>
      <label>Xác nhận mật khẩu<input type="password" value={values.confirmPassword} onChange={(event) => setValues({ ...values, confirmPassword: event.target.value })} /></label>
      {error ? <p role="alert">{error}</p> : null}
      <button type="submit" disabled={isSaving}>{isSaving ? "Đang cập nhật..." : "Đổi mật khẩu"}</button>
    </form>
  );
}

function OptionList({ value, options, onSelect }) {
  return (
    <div className="settings-options">
      {Object.entries(options).map(([optionValue, label]) => (
        <button className={value === optionValue ? "is-selected" : ""} key={optionValue} type="button" onClick={() => onSelect(optionValue)}>
          <span>{label}</span>
          <span>{value === optionValue ? "Đang dùng" : ""}</span>
        </button>
      ))}
    </div>
  );
}

function SocialConnections() {
  return (
    <div className="settings-socials">
      <div><Globe2 size={20} /><span><strong>Google</strong><small>Chưa liên kết</small></span><button type="button">Liên kết</button></div>
      <div><Link2 size={20} /><span><strong>Facebook</strong><small>Chưa liên kết</small></span><button type="button">Liên kết</button></div>
    </div>
  );
}

function PolicyCopy({ type }) {
  return (
    <div className="settings-policy">
      <p>
        {type === "terms"
          ? "Khi sử dụng ChillPlace, người dùng đồng ý tôn trọng cộng đồng, không đăng nội dung vi phạm pháp luật và chịu trách nhiệm với nội dung mình chia sẻ."
          : "ChillPlace chỉ lưu dữ liệu cần thiết cho trải nghiệm khám phá, hồ sơ và tùy chọn cá nhân. Dữ liệu mock hiện được lưu trong trình duyệt của anh."}
      </p>
      <small>Bản nội dung dùng cho prototype frontend, cập nhật tháng 06/2026.</small>
    </div>
  );
}

function getDialogTitle(dialog) {
  return {
    password: "Đổi mật khẩu",
    social: "Liên kết mạng xã hội",
    visibility: "Ai có thể xem bài viết",
    language: "Ngôn ngữ",
    fontSize: "Cỡ chữ",
    terms: "Điều khoản dịch vụ",
    privacyPolicy: "Chính sách bảo mật"
  }[dialog];
}
