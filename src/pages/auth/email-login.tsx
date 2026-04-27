import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AuthService } from "../../services/auth";
import { setAuth } from "../../store/states/authSlice";

const FEATURES = [
  "Track streams across all platforms",
  "Split royalties with collaborators",
  "Manage payment wallets & withdrawals",
];

export default function EmailLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      if (response && response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isAuth", "true");
        dispatch(setAuth({ isAuth: "true", user: response.data.user }));
        if (response.data.user.onboardingCompleted) {
          navigate("/panel/home");
        } else {
          navigate("/onboarding");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    height: 46,
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingLeft: 40,
    paddingRight: 14,
    fontSize: 14,
    color: "#111827",
    outline: "none",
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div
        className="hidden lg:flex flex-col justify-center gap-9 flex-shrink-0"
        style={{
          width: 500,
          backgroundColor: "#0F172A",
          padding: "60px 50px",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
            style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#F97316" }}
          >
            S
          </div>
          <span className="text-white font-bold text-xl">SplitMe</span>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-4">
          <h1
            className="text-white font-bold"
            style={{ fontSize: 42, lineHeight: 1.2 }}
          >
            Manage your
            <br />
            music royalties.
          </h1>
          <p
            className="text-[#94A3B8] text-sm"
            style={{ lineHeight: 1.6 }}
          >
            Track streams, split payments, and manage collaborators all in one
            place.
          </p>
        </div>

        {/* Orange accent */}
        <div
          style={{
            width: 48,
            height: 3,
            borderRadius: 2,
            backgroundColor: "#F97316",
          }}
        />

        {/* Features */}
        <div className="flex flex-col gap-3.5">
          {FEATURES.map((feat) => (
            <div key={feat} className="flex items-center gap-2.5">
              <div
                className="flex-shrink-0 rounded-full"
                style={{ width: 8, height: 8, backgroundColor: "#F97316" }}
              />
              <span className="text-[#CBD5E1] text-sm">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div
        className="flex-1 flex items-center justify-center p-6"
        style={{ backgroundColor: "#F7F8FA" }}
      >
        {/* Form Card */}
        <div
          className="w-full flex flex-col gap-5"
          style={{
            maxWidth: 420,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            padding: 40,
          }}
        >
          {/* Card logo */}
          <div
            className="flex items-center justify-center text-white font-bold text-[22px] self-start"
            style={{ width: 44, height: 44, borderRadius: 11, backgroundColor: "#F97316" }}
          >
            S
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <h2 className="text-[26px] font-bold text-[#111827]">Welcome back</h2>
            <p className="text-sm text-[#6B7280]">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#374151]">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  color="#9CA3AF"
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={inputBase}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#374151]">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  color="#9CA3AF"
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{ ...inputBase, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Options row */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  className="flex-shrink-0"
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: "1.5px solid #D1D5DB",
                    backgroundColor: "#FFFFFF",
                  }}
                />
                <span className="text-sm text-[#6B7280]">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/auth/password-recovery")}
                className="text-sm font-medium text-[#F97316] hover:opacity-80 transition-opacity"
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Sign In button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold text-[15px] transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ height: 46, borderRadius: 10, backgroundColor: "#F97316" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-xs text-[#9CA3AF]">or</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          {/* Sign up */}
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm text-[#6B7280]">Don't have an account?</span>
            <Link
              to="/auth/register"
              className="text-sm font-semibold text-[#F97316] hover:opacity-80 transition-opacity"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
