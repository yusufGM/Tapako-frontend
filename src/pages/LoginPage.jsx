import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiPost } from "../lib/api";
import useUserStore from "../components/store/useUserStore";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await apiPost("/login", { identifier, password });
      setUser({
        token: data.token,
        username: data.user?.username,
        userId: data.user?.id,
        role: data.user?.role,
        email: data.user?.email
      });
      toast.success("Login berhasil");
      navigate("/");
    } catch (err) {
      toast.error(err?.payload?.error || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold">Masuk</h1>
        <input className="input input-bordered w-full" placeholder="Username atau Email" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} />
        <input className="input input-bordered w-full" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn w-full bg-black text-white">Masuk</button>
      </form>
    </div>
  );
};

export default LoginPage;
