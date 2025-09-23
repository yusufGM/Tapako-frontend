import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(api('/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Pendaftaran berhasil!');
        navigate('/login');
      } else {
        toast.error(data.error || 'Gagal daftar.');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mendaftar.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-semibold mb-1">Username</label>
          <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold mb-1">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold mb-1">Password</label>
          <div className="relative">
            <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border px-3 py-2 rounded" />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600">
              {showPassword ? 'Sembunyikan' : 'Lihat'}
            </button>
          </div>
        </div>
        <button type="submit" className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700">Daftar</button>
      </form>
    </div>
  );
};

export default SignUp;
