import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/'), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto mt-24 p-6 text-center border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Pembayaran Berhasil!</h1>
      <p>Terima kasih, pesanan Anda telah diterima.</p>
      <p className="mt-2 text-sm text-gray-500">Mengalihkan ke halaman utama...</p>
    </div>
  );
};

export default SuccessPage;
