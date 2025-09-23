import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiPost } from "../lib/api";

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await apiPost('/signup', { username, email, password });
      toast.success('Pendaftaran berhasil!');
      navigate('/login');
    } catch (err) {
      toast.error(err?.payload?.error || 'Gagal daftar.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSignup} className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold">Daftar</h1>
        <input className="input input-bordered w-full" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <input className="input input-bordered w-full" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <div className="relative">
          <input className="input input-bordered w-full" placeholder="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" onClick={()=>setShowPassword((s)=>!s)}>
            {showPassword ? "Sembunyikan" : "Lihat"}
          </button>
        </div>
        <button className="btn w-full bg-black text-white">Daftar</button>
      </form>
    </div>
  );
};

export default SignUp;
