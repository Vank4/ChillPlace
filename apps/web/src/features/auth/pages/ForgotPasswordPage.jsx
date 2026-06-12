import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Compass,
  KeyRound,
  Mail,
  ShieldCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../../services/auth.service.js";
import "./ForgotPasswordPage.css";

const recoveryImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1dR-mfL_wBZClInudz1drnkFstUWEeSZfRyzzDjjxIH0QGsTBKdJEesejBzzk3eNK8uLJUrCGra8VNtOdg_wAZ8lEq8VQJkLqvSHNayZg6qfO5dcjYQuOeRJ6anfwECaATMGbh00Twg5kDMeJSufP7yxbviwcp3NbiPN2rGpNiGpThk3vOinNYrp-yPxTz2BEVx5RAYaM9VcnVsfACVpzxnxAE8YUSsymjUXKyw_UQ48J-V6rS2-rns1El8nrDpZY0Itn6IPMJjU";

const RESEND_SECONDS = 30;

function validateEmail(email) {
  if (!email.trim()) {
    return "Vui lòng nhập địa chỉ email.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Địa chỉ email chưa đúng định dạng.";
  }

  return "";
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    if (resendSeconds <= 0) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setResendSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [resendSeconds]);

  async function sendResetRequest(targetEmail) {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await requestPasswordReset(targetEmail);
      setSubmittedEmail(targetEmail.trim().toLowerCase());
      setIsSuccess(true);
      setResendSeconds(RESEND_SECONDS);
    } catch {
      setSubmitError("Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextError = validateEmail(email);
    setEmailError(nextError);
    setSubmitError("");

    if (nextError) {
      return;
    }

    await sendResetRequest(email);
  }

  async function handleResend() {
    if (resendSeconds > 0 || isSubmitting) {
      return;
    }

    await sendResetRequest(submittedEmail);
  }

  function handleChangeEmail() {
    setIsSuccess(false);
    setSubmitError("");
    setEmailError("");
  }

  return (
    <main className="forgot-page">
      <section className="forgot-visual" aria-label="Khôi phục tài khoản ChillPlace">
        <img src={recoveryImage} alt="" />
        <div className="forgot-visual__shade" />
        <div className="forgot-visual__content">
          <Link to="/">
            <Compass size={30} aria-hidden="true" />
            <strong>ChillPlace</strong>
          </Link>

          <div className="forgot-visual__copy">
            <span>
              <ShieldCheck size={22} />
              Khôi phục an toàn
            </span>
            <h1>Quay lại hành trình khám phá của anh.</h1>
            <p>
              Nhập email đã đăng ký. ChillPlace sẽ gửi hướng dẫn để anh tạo mật
              khẩu mới và tiếp tục sử dụng tài khoản.
            </p>
          </div>

          <small>Liên kết đặt lại mật khẩu có hiệu lực trong 15 phút.</small>
        </div>
      </section>

      <section className="forgot-panel">
        <div className="forgot-card">
          <Link className="forgot-mobile-brand" to="/">
            <span>
              <Compass size={34} />
            </span>
            <strong>ChillPlace</strong>
          </Link>

          {!isSuccess ? (
            <>
              <div className="forgot-icon">
                <KeyRound size={30} />
              </div>
              <header className="forgot-heading">
                <span>Khôi phục tài khoản</span>
                <h1>Quên mật khẩu?</h1>
                <p>
                  Đừng lo, hãy nhập email của anh để nhận liên kết đặt lại mật khẩu.
                </p>
              </header>

              <form className="forgot-form" noValidate onSubmit={handleSubmit}>
                <label>
                  <span>Địa chỉ Email</span>
                  <div className={emailError ? "forgot-input has-error" : "forgot-input"}>
                    <Mail size={20} />
                    <input
                      type="email"
                      value={email}
                      autoComplete="email"
                      placeholder="name@example.com"
                      aria-invalid={Boolean(emailError)}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setEmailError("");
                      }}
                    />
                  </div>
                  {emailError ? <small>{emailError}</small> : null}
                </label>

                {submitError ? (
                  <div className="forgot-error" role="alert">
                    {submitError}
                  </div>
                ) : null}

                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <span className="forgot-spinner" /> : null}
                  {isSubmitting ? "Đang gửi..." : "Gửi liên kết đặt lại"}
                </button>
              </form>

              <div className="forgot-security-note">
                <ShieldCheck size={18} />
                <p>
                  Vì lý do bảo mật, ChillPlace luôn hiển thị cùng một phản hồi dù
                  email có tồn tại hay không.
                </p>
              </div>
            </>
          ) : (
            <section className="forgot-success" aria-live="polite">
              <span className="forgot-success__icon">
                <CheckCircle2 size={40} />
              </span>
              <span className="forgot-success__eyebrow">Yêu cầu đã được ghi nhận</span>
              <h1>Kiểm tra hộp thư của anh</h1>
              <p>
                Nếu <strong>{submittedEmail}</strong> thuộc một tài khoản
                ChillPlace, hướng dẫn đặt lại mật khẩu sẽ được gửi trong vài phút.
              </p>

              <div className="forgot-success__tips">
                <strong>Chưa thấy email?</strong>
                <span>Kiểm tra thư rác hoặc chờ thêm một chút trước khi gửi lại.</span>
              </div>

              {submitError ? (
                <div className="forgot-error" role="alert">
                  {submitError}
                </div>
              ) : null}

              <button
                className="forgot-resend"
                type="button"
                disabled={resendSeconds > 0 || isSubmitting}
                onClick={handleResend}
              >
                {isSubmitting
                  ? "Đang gửi lại..."
                  : resendSeconds > 0
                    ? `Gửi lại sau ${resendSeconds}s`
                    : "Gửi lại email"}
              </button>

              <button
                className="forgot-change"
                type="button"
                onClick={handleChangeEmail}
              >
                Dùng email khác
              </button>
            </section>
          )}

          <Link className="forgot-back" to="/login">
            <ArrowLeft size={17} />
            Quay lại đăng nhập
          </Link>
        </div>
      </section>
    </main>
  );
}

