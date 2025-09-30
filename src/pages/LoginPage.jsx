import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useUserStore from "../components/store/useUserStore";
import { toast } from "sonner";
import { apiPost } from "../lib/api";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await apiPost("/login", { identifier, password });
      setUser({
        token: data.token,
        username: data.user?.username,
        userId: data.user?.id || data.user?._id,
        role: data.user?.role || "user",
        email: data.user?.email,
      });
      toast.success("Login berhasil");
      navigate("/");
    } catch (err) {
      toast.error(err?.payload?.error || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label
            htmlFor="identifier"
            className="block text-sm font-semibold mb-1"
          >
            Username atau Email
          </label>
          <input
            id="identifier"
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Masukkan username atau email"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="username"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              {showPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm text-gray-700">
          Belum punya akun?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Daftar sekarang
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
