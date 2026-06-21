import { useMemo, useState } from "react";
import {
  ArrowRight,
  CircleHelp,
  Compass,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  UserRound
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginWithProvider,
  registerWithEmail
} from "../../../services/auth.service.js";
import "./RegisterPage.css";

const desktopImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB60vbpfU7hgxjRSJKArxSvBE10hKXXoCRAM9doBesIFU6hll-kZYOLbJJJYlhzRYobHb0NZMDM6I5Og1N5soY7nZNTYCu1jSCcQnOZFMOC1CiBV6FT-GUAphSSVZClWrGZThLDFhMCeDa5RKNbQz4lc9XVbyg1n1JVgeQljoYIkwWCyLU-a-y7HoPgcF-eA2Jxlrh0u-U4z38JTSCdGYk9lDNLFUdGmLU76B4CZG8I8xulcvx232WNhhd6fiJHzgh5FKo5pghKlw8";

const mobileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD8PKJ3n66goeyT5YB86R7vRHsjrUn4ls1B2wLGi8StKJ9NU1ZJMGTlvEs1MU2DhM4nUInGk64dDwnGRKDTC571Dg57YBAjuI3jIG7UDQmUpOOz8nVVGO-VQ4w28qfqYG21JgH9Swdi47hjRV7kRAXqTIg1b4wsTMuYB46pxzZvxuhW07FvNQ7vEspIxyzeGtd6dOFq04-ARyB8_rHXa5o14aj9guI-T1OYkAF6pmRkhpQkwB6oRuPVd3VfTVQUh2R_ZFVoB7cmfZs";

const communityAvatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCeI855Bip1gefUhbXkrC1WfCxZ_3rPxU8Y9ydyyNPyLiDlXhSqRwQF5qFJoOPNO3TjRlB06ixrhDobxKNxe-uz8fNvaMePS_6zR1ULOe5Iq7r5B-MVaHCsGYMV1jjakHZkoIHTdt847A_sxHDGWnI4pQPOox5WxfnyWFWW72y5-GSnzzBL-IwFGsdmFRlacbCdIvf3L9azP6ge41iVd0yDruaFXrr7lD4PqItqmdz9VDeUnbMQGh_va0Ff-v7KTOG7kjMt5Sj5IQM",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAmh8cw9szPhOEsl8zPA5WTMBmdxrdHC4r79lBbkeo4TEiA_XZhzG4ggqEuGiKF3GAC2CEYm8uZlLKsmgb5Oxt1CkMBjmPYh7RaBrOsZpW7byNygwPA_sQC6mnYLtp-V9q0ZucC2tFgKDLmiqVM_9eUmaEld3u3CE9ckefcYuxVZiLe3soU_avMhnMhYeLRgAn6HdX_D9auBrn9XwrfWFSbF_dnLwNbjunmySI0WLrHhcCkMtNEz_T434EbC5XvBGtu-Y1sNBsCOV8",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCp21F0gu8b0ta67qXQwLCdo_VVN9z7kQF7f8UA3sTTZVhHlev_0Uzeg-OOYs4pbWNgwRZk5bQk4DriDUiGYPrzDqm0NqImVgBVEzTNYUNYcn8gjAt4ECsn1qS0Rfe2tbCOEO0K19ncS_d6rD_s5u-LBfwNQ3Fu8e4hW61dTpeiv5pA0UhX4r5ecycxtR-iM_EI7Iw_QtS7SmFKDH6borO4PIn4h9hSWaQuEg5EZHm6O_2UIRCsx5d7Ubh6_I5FlXqQ3TCey8M7gQE"
];

function getPasswordStrength(password) {
  if (!password) {
    return { score: 0, label: "Sử dụng ít nhất 8 ký tự" };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = ["Quá yếu", "Yếu", "Trung bình", "Khá", "Mạnh"];
  return { score, label: labels[score] };
}

function validateForm(values) {
  const errors = {};

  if (!values.lastName.trim()) errors.lastName = "Vui lòng nhập họ.";
  if (!values.firstName.trim()) errors.firstName = "Vui lòng nhập tên.";

  if (!values.email.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Email chưa đúng định dạng.";
  }

  const cleanPhone = values.phone.replace(/\s/g, "");
  if (!cleanPhone) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  } else if (!/^(0|\+84)\d{9}$/.test(cleanPhone)) {
    errors.phone = "Số điện thoại Việt Nam chưa hợp lệ.";
  }

  if (!values.password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (values.password.length < 8) {
    errors.password = "Mật khẩu cần có ít nhất 8 ký tự.";
  }

  if (!values.acceptedTerms) {
    errors.acceptedTerms = "Anh cần đồng ý với điều khoản để tiếp tục.";
  }

  return errors;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    password: "",
    acceptedTerms: false
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProvider, setActiveProvider] = useState("");
  const passwordStrength = useMemo(
    () => getPasswordStrength(values.password),
    [values.password]
  );

  function updateValue(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateForm(values);
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await registerWithEmail(values);
      navigate("/", { replace: true });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleProviderRegister(provider) {
    setActiveProvider(provider);
    setSubmitError("");

    try {
      await loginWithProvider(provider);
      navigate("/", { replace: true });
    } catch {
      setSubmitError("Không thể đăng ký bằng nhà cung cấp này. Vui lòng thử lại.");
    } finally {
      setActiveProvider("");
    }
  }

  return (
    <main className="register-page">
      <section className="register-visual" aria-label="Cộng đồng ChillPlace">
        <img src={desktopImage} alt="" loading="eager" decoding="async" fetchPriority="high" />
        <div className="register-visual__shade" />
        <div className="register-visual__content">
          <Link to="/">ChillPlace</Link>
          <div>
            <h1>Ghi lại khoảnh khắc, kết nối cộng đồng.</h1>
            <p>
              Bắt đầu hành trình khám phá những địa điểm “chill” nhất cùng hàng
              triệu người dùng khác tại Việt Nam.
            </p>
          </div>
          <footer>
            <span className="register-community">
              {communityAvatars.map((avatar) => (
                <img key={avatar} src={avatar} alt="" loading="lazy" decoding="async" />
              ))}
            </span>
            <strong>+5k người đã tham gia hôm nay</strong>
          </footer>
        </div>
      </section>

      <section className="register-panel">
        <header className="register-mobile-head">
          <Link to="/">ChillPlace</Link>
          <button type="button" aria-label="Trợ giúp đăng ký">
            <CircleHelp size={23} />
          </button>
        </header>

        <div className="register-mobile-hero">
          <img src={mobileImage} alt="" decoding="async" />
          <div>
            <h1>Bắt đầu hành trình của bạn</h1>
            <p>Tham gia cộng đồng khám phá lớn nhất</p>
          </div>
        </div>

        <div className="register-card">
          <header className="register-heading">
            <h1>Tạo tài khoản mới</h1>
            <p>Chào mừng anh! Vui lòng nhập thông tin bên dưới.</p>
          </header>

          <form className="register-form" noValidate onSubmit={handleSubmit}>
            <div className="register-name-grid">
              <RegisterField
                label="Họ"
                field="lastName"
                value={values.lastName}
                placeholder="Vd: Nguyễn"
                error={errors.lastName}
                autoComplete="family-name"
                onChange={updateValue}
              />
              <RegisterField
                label="Tên"
                field="firstName"
                value={values.firstName}
                placeholder="Vd: An"
                error={errors.firstName}
                autoComplete="given-name"
                onChange={updateValue}
              />
            </div>

            <RegisterField
              label="Email"
              field="email"
              type="email"
              icon={Mail}
              value={values.email}
              placeholder="example@chillplace.vn"
              error={errors.email}
              autoComplete="email"
              onChange={updateValue}
            />

            <RegisterField
              label="Số điện thoại"
              field="phone"
              type="tel"
              icon={Phone}
              value={values.phone}
              placeholder="0901 234 567"
              error={errors.phone}
              autoComplete="tel"
              onChange={updateValue}
            />

            <label className="register-field">
              <span>Mật khẩu</span>
              <div className={errors.password ? "register-input has-error" : "register-input"}>
                <LockKeyhole size={20} aria-hidden="true" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  placeholder="Tối thiểu 8 ký tự"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
                  onChange={(event) => updateValue("password", event.target.value)}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <PasswordStrength strength={passwordStrength} />
              {errors.password ? <small>{errors.password}</small> : null}
            </label>

            <label className="register-terms">
              <input
                type="checkbox"
                checked={values.acceptedTerms}
                onChange={(event) => updateValue("acceptedTerms", event.target.checked)}
              />
              <span aria-hidden="true" />
              <span>
                Tôi đồng ý với <a href="#terms">Điều khoản dịch vụ</a> và{" "}
                <a href="#privacy">Chính sách bảo mật</a> của ChillPlace.
              </span>
            </label>
            {errors.acceptedTerms ? (
              <small className="register-terms-error">{errors.acceptedTerms}</small>
            ) : null}

            {submitError ? (
              <div className="register-submit-error" role="alert">
                {submitError}
              </div>
            ) : null}

            <button
              className="register-submit"
              type="submit"
              disabled={isSubmitting || Boolean(activeProvider)}
            >
              {isSubmitting ? <span className="register-spinner" /> : null}
              {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký ngay"}
              {!isSubmitting ? <ArrowRight size={20} /> : null}
            </button>
          </form>

          <div className="register-divider">
            <span>Hoặc đăng ký bằng</span>
          </div>

          <div className="register-socials">
            <ProviderButton
              provider="google"
              isLoading={activeProvider === "google"}
              disabled={isSubmitting || Boolean(activeProvider)}
              onClick={handleProviderRegister}
            />
            <ProviderButton
              provider="facebook"
              isLoading={activeProvider === "facebook"}
              disabled={isSubmitting || Boolean(activeProvider)}
              onClick={handleProviderRegister}
            />
          </div>

          <p className="register-login-link">
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>

        <footer className="register-mobile-footer" aria-hidden="true">
          <Compass size={20} />
          <Heart size={20} />
          <MapPin size={20} />
        </footer>
      </section>
    </main>
  );
}

function RegisterField({
  label,
  field,
  type = "text",
  icon: Icon = UserRound,
  value,
  placeholder,
  error,
  autoComplete,
  onChange
}) {
  return (
    <label className="register-field">
      <span>{label}</span>
      <div className={error ? "register-input has-error" : "register-input"}>
        <Icon size={20} aria-hidden="true" />
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(field, event.target.value)}
        />
      </div>
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function PasswordStrength({ strength }) {
  return (
    <div className="register-strength">
      <div aria-hidden="true">
        {[1, 2, 3, 4].map((step) => (
          <span
            className={step <= strength.score ? `is-active strength-${strength.score}` : ""}
            key={step}
          />
        ))}
      </div>
      <small>{strength.label}</small>
    </div>
  );
}

function ProviderButton({ provider, isLoading, disabled, onClick }) {
  const isGoogle = provider === "google";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick(provider)}
    >
      {isLoading ? (
        <span className="register-spinner register-spinner--dark" />
      ) : isGoogle ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z" />
          <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4L15.4 17c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.7A10 10 0 0 0 12 22Z" />
          <path fill="#FBBC05" d="M6.5 13.9a6 6 0 0 1 0-3.8V7.4H3.1a10 10 0 0 0 0 9.2l3.4-2.7Z" />
          <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.8 9.8 0 0 0 3.1 7.4l3.4 2.7A5.9 5.9 0 0 1 12 6Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#1877F2" d="M24 12.1A12 12 0 1 0 10.1 24v-8.4H7.1v-3.5h3V9.5c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.4l-.6 3.5h-2.8V24A12 12 0 0 0 24 12.1Z" />
        </svg>
      )}
      {isLoading ? "Đang xử lý..." : isGoogle ? "Google" : "Facebook"}
    </button>
  );
}

