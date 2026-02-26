import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "./NetIDLogin.css";
import loginPic from "/images/loginpage.png";

// NetID format: letters and digits only (as assigned by college)
const NETID_REGEX = /^[a-zA-Z0-9]+$/;

const NetIDLogin = () => {
  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [formData, setFormData] = useState({
    netId: "",
    password: "",
    otp: "",
  });
  const [pendingNetId, setPendingNetId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitCredentials = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { netId, password } = formData;
    const trimmedNetId = netId.trim();

    if (!trimmedNetId) {
      setError("Please enter your NetID.");
      return;
    }
    if (!NETID_REGEX.test(trimmedNetId)) {
      setError("NetID can only contain letters and numbers.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      const res = await api.post(
        "/authentication/netid-login",
        { netId: trimmedNetId, password },
        { withCredentials: true }
      );

      if (res.data.success && res.data.requireOtp) {
        setPendingNetId(trimmedNetId);
        setSuccess("Check your email for the verification code.");
        setStep("otp");
      } else if (res.data.success) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
        window.dispatchEvent(new Event("authChanged"));
      } else {
        setError(res.data.message || "Invalid NetID or password. Please try again.");
      }
    } catch (err) {
      console.error("NetID login error:", err);
      setError(
        err.response?.data?.message || "NetID login failed. Please try again."
      );
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const otp = formData.otp.trim();
    if (!otp) {
      setError("Please enter the code from your email.");
      return;
    }

    try {
      const res = await api.post(
        "/authentication/netid-verify-otp",
        { netId: pendingNetId, otp },
        { withCredentials: true }
      );

      if (res.data.success) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
        window.dispatchEvent(new Event("authChanged"));
      } else {
        setError(res.data.message || "Invalid or expired code. Try again.");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    }
  };

  return (
    <div className="netid-login-container">
      <div className="netid-login-form">
        <h1>{step === "otp" ? "Enter verification code" : "Login with NetID"}</h1>
        <p>
          {step === "otp"
            ? `We sent a 6-digit code to the email for ${pendingNetId}. Enter it below.`
            : "Use your university-assigned NetID and password to sign in."}
        </p>

        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">{success}</p>}

        {step === "credentials" ? (
          <form onSubmit={handleSubmitCredentials}>
            <input
              type="text"
              name="netId"
              placeholder="NetID"
              value={formData.netId}
              onChange={handleChange}
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button type="submit" className="netid-login-btn">
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitOtp}>
            <input
              type="text"
              name="otp"
              placeholder="6-digit code"
              value={formData.otp}
              onChange={handleChange}
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
            />
            <button type="submit" className="netid-login-btn">
              Verify and sign in
            </button>
            <button
              type="button"
              className="netid-back-btn"
              onClick={() => {
                setStep("credentials");
                setError("");
                setSuccess("");
                setFormData((prev) => ({ ...prev, otp: "" }));
              }}
            >
              Back to NetID login
            </button>
          </form>
        )}

        <p className="login-link">
          Back to <Link to="/login">Login</Link>
        </p>
      </div>

      <div className="netid-login-image">
        <img src={loginPic} alt="Login illustration" />
      </div>
    </div>
  );
};

export default NetIDLogin;
