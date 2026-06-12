import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Compass,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Mountain
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithProvider } from "../../../services/auth.service.js";
import "./LoginPage.css";

const lifestyleImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1dR-mfL_wBZClInudz1drnkFstUWEeSZfRyzzDjjxIH0QGsTBKdJEesejBzzk3eNK8uLJUrCGra8VNtOdg_wAZ8lEq8VQJkLqvSHNayZg6qfO5dcjYQuOeRJ6anfwECaATMGbh00Twg5kDMeJSufP7yxbviwcp3NbiPN2rGpNiGpThk3vOinNYrp-yPxTz2BEVx5RAYaM9VcnVsfACVpzxnxAE8YUSsymjUXKyw_UQ48J-V6rS2-rns1El8nrDpZY0Itn6IPMJjU";

const checkInAvatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsKlP3tnd8fEl7fkd_639bwBPNl7bYru79H1wZpreqAyPCoCwE6juLo1-33AIxiA6G6Q4XgxOT6_pAGmNE9F3irKOaEbkedCDq5Yv6Gir57tduPK8B1t-QQACboGgPfx7CGuGylZ2fTTPqKqzrCVbN0KPFdJ0LTUsaqrNIdhviT2BRPiqtXv-4_ah_p2GfFy81LQ2cZBheUFcjuBBO2GhxtaBgrR_KqGTntwvuu4_n7arUbrebtpyKB_f5wQQXq9KYHdac7L372eA";

function validateForm(email, password) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Vui lòng nhập địa chỉ email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Địa chỉ email chưa đúng định dạng.";
  }

  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (password.length < 8) {
    errors.password = "Mật khẩu cần có ít nhất 8 ký tự.";
  }

  return errors;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProvider, setActiveProvider] = useState("");

  const redirectPath = useMemo(() => {
    const requestedPath = location.state?.from?.pathname;
    return requestedPath && requestedPath !== "/login" ? requestedPath : "/";
  }, [location.state]);

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm(email, password);
    setFieldErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await loginWithEmail({ email, password, remember });
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleProviderLogin(provider) {
    setActiveProvider(provider);
    setSubmitError("");

    try {
      await loginWithProvider(provider);
      navigate(redirectPath, { replace: true });
    } catch {
      setSubmitError("Không thể đăng nhập bằng nhà cung cấp này. Vui lòng thử lại.");
    } finally {
      setActiveProvider("");
    }
  }

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="Giới thiệu ChillPlace">
        <img className="login-visual__image" src={lifestyleImage} alt="" />
        <div className="login-visual__shade" />

        <div className="login-visual__content">
          <Link className="login-brand login-brand--light" to="/">
            <Mountain size={32} strokeWidth={2.5} aria-hidden="true" />
            <strong>ChillPlace</strong>
          </Link>

          <div className="login-visual__story">
            <h1>Khám phá không gian thuộc về chính bạn.</h1>
            <p>
              Tham gia cộng đồng ChillPlace để tìm kiếm, chia sẻ và trải nghiệm
              những địa điểm tuyệt vời nhất xung quanh bạn.
            </p>

            <div className="login-checkin">
              <img src={checkInAvatar} alt="" />
              <div>
                <strong>Minh Anh vừa check-in</strong>
                <span>Cà phê Workshop, Quận 1</span>
              </div>
            </div>
          </div>

          <footer className="login-visual__footer">
            <span>© 2026 ChillPlace Inc.</span>
            <a href="#terms">Điều khoản</a>
            <a href="#privacy">Bảo mật</a>
          </footer>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-panel__inner">
          <Link className="login-mobile-brand" to="/">
            <span>
              <Compass size={43} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <strong>ChillPlace</strong>
          </Link>

          <header className="login-heading">
            <h1>Chào mừng trở lại!</h1>
            <p>Hãy đăng nhập để tiếp tục hành trình khám phá.</p>
          </header>

          <div className="login-socials">
            <SocialButton
              provider="google"
              isLoading={activeProvider === "google"}
              disabled={Boolean(activeProvider) || isSubmitting}
              onClick={handleProviderLogin}
            />
            <SocialButton
              provider="apple"
              isLoading={activeProvider === "apple"}
              disabled={Boolean(activeProvider) || isSubmitting}
              onClick={handleProviderLogin}
            />
          </div>

          <div className="login-divider">
            <span>Hoặc sử dụng email</span>
          </div>

          <form className="login-form" noValidate onSubmit={handleSubmit}>
            <label className="login-field">
              <span>Địa chỉ Email</span>
              <div className={fieldErrors.email ? "login-input has-error" : "login-input"}>
                <Mail size={20} aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  autoComplete="email"
                  placeholder="name@example.com"
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFieldErrors((current) => ({ ...current, email: "" }));
                  }}
                />
              </div>
              {fieldErrors.email ? (
                <small id="login-email-error">{fieldErrors.email}</small>
              ) : null}
            </label>

            <label className="login-field">
              <span className="login-field__head">
                <span>Mật khẩu</span>
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </span>
              <div className={fieldErrors.password ? "login-input has-error" : "login-input"}>
                <LockKeyhole size={20} aria-hidden="true" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFieldErrors((current) => ({ ...current, password: "" }));
                  }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {fieldErrors.password ? (
                <small id="login-password-error">{fieldErrors.password}</small>
              ) : null}
            </label>

            <label className="login-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              <span>
                <CheckCircle2 size={15} aria-hidden="true" />
              </span>
              Ghi nhớ đăng nhập
            </label>

            {submitError ? (
              <div className="login-form__error" role="alert">
                {submitError}
              </div>
            ) : null}

            <button className="login-submit" type="submit" disabled={isSubmitting || Boolean(activeProvider)}>
              {isSubmitting ? <span className="login-spinner" aria-hidden="true" /> : null}
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="login-demo">
            <strong>Tài khoản demo</strong>
            <span>minh@chillplace.vn</span>
            <span>ChillPlace123</span>
          </div>

          <p className="login-register">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function SocialButton({ provider, isLoading, disabled, onClick }) {
  const isGoogle = provider === "google";
  const label = isGoogle ? "Google" : "Apple";

  return (
    <button
      className="login-social"
      type="button"
      disabled={disabled}
      onClick={() => onClick(provider)}
    >
      {isLoading ? (
        <span className="login-spinner login-spinner--dark" aria-hidden="true" />
      ) : isGoogle ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z" />
          <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4L15.4 17c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.7A10 10 0 0 0 12 22Z" />
          <path fill="#FBBC05" d="M6.5 13.9a6 6 0 0 1 0-3.8V7.4H3.1a10 10 0 0 0 0 9.2l3.4-2.7Z" />
          <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.8 9.8 0 0 0 3.1 7.4l3.4 2.7A5.9 5.9 0 0 1 12 6Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M17.1 12.6c0-2.7 2.2-4 2.3-4.1a5 5 0 0 0-3.9-2.1c-1.7-.2-3.2 1-4 1s-2.1-1-3.5-1a5.3 5.3 0 0 0-4.5 2.7c-1.9 3.3-.5 8.2 1.4 10.9.9 1.3 2 2.8 3.5 2.7 1.4 0 1.9-.9 3.6-.9s2.2.9 3.7.9 2.5-1.3 3.4-2.6a12 12 0 0 0 1.6-3.3 4.7 4.7 0 0 1-3.6-4.2ZM14.4 4.7A4.8 4.8 0 0 0 15.5 1 4.9 4.9 0 0 0 12.2 2a4.5 4.5 0 0 0-1.1 3.5 4 4 0 0 0 3.3-.8Z" />
        </svg>
      )}
      {isLoading ? "Đang xử lý..." : label}
    </button>
  );
}

