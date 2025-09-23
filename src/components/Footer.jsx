
const Footer = () => {
    return (
    <footer className="bg-gray-100 border-t border-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700 text-sm">
        <div>
          <h4 className="uppercase font-bold mb-4">Bantuan</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-red-600 transition">Status Pesanan</a></li>
            <li><a href="#" className="hover:text-red-600 transition">Pengiriman</a></li>
            <li><a href="#" className="hover:text-red-600 transition">Pengembalian</a></li>
            <li><a href="#" className="hover:text-red-600 transition">Metode Pembayaran</a></li>
            <li><a href="#" className="hover:text-red-600 transition">Hubungi Kami</a></li>
          </ul>
        </div>
        <div>
          <h4 className="uppercase font-bold mb-4">Tentang TAPAK-O!</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-red-600 transition">Berita</a></li>
            <li><a href="#" className="hover:text-red-600 transition">Karir</a></li>
            <li><a href="#" className="hover:text-red-600 transition">Keberlanjutan</a></li>
            <li><a href="#" className="hover:text-red-600 transition">Investor</a></li>
          </ul>
        </div>
        <div>
          <h4 className="uppercase font-bold mb-4">Resmi</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-red-600 transition">Privasi</a></li>
            <li><a href="#" className="hover:text-red-600 transition">Persyaratan</a></li>
            <li><a href="#" className="hover:text-red-600 transition">Peminjaman</a></li>
          </ul>
        </div>
        <div>
          <h4 className="uppercase font-bold mb-4">Ikuti Kami</h4>
          <div className="flex space-x-6">
            <a href="#" aria-label="Facebook" className="text-gray-700 hover:text-red-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.593 0 0 .593 0 1.326v21.348C0 23.408.593 24 1.325 24h11.494v-9.294H9.692v-3.622h3.127V8.41c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.466.099 2.797.143v3.243l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.588l-.467 3.622h-3.121V24h6.116c.73 0 1.326-.593 1.326-1.326V1.326c0-.733-.596-1.326-1.326-1.326z"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-700 hover:text-red-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6" viewBox="0 0 24 24"><path d="M24 4.557a9.9 9.9 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.95.564-2.005.974-3.127 1.195a4.916 4.916 0 00-8.4 4.482A13.957 13.957 0 011.67 3.149a4.922 4.922 0 001.523 6.573 4.903 4.903 0 01-2.225-.616v.062a4.913 4.913 0 003.946 4.814 4.903 4.903 0 01-2.22.084 4.917 4.917 0 004.59 3.417 9.867 9.867 0 01-6.11 2.105c-.397 0-.79-.023-1.176-.067a13.949 13.949 0 007.557 2.212c9.054 0 14.002-7.496 14.002-14 0-.214-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-700 hover:text-red-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.206.056 2.004.244 2.474.415a4.996 4.996 0 011.743 1.01 4.996 4.996 0 011.01 1.743c.171.47.359 1.268.415 2.474.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.206-.244 2.004-.415 2.474a4.996 4.996 0 01-1.01 1.743 4.996 4.996 0 01-1.743 1.01c-.47.171-1.268.359-2.474.415-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.206-.056-2.004-.244-2.474-.415a4.996 4.996 0 01-1.743-1.01 4.996 4.996 0 01-1.01-1.743c-.171-.47-.359-1.268-.415-2.474C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.056-1.206.244-2.004.415-2.474a4.996 4.996 0 011.01-1.743 4.996 4.996 0 011.743-1.01c.47-.171 1.268-.359 2.474-.415C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.736 0 8.332.01 7.052.07 5.78.13 4.73.362 3.847.743 2.894 1.154 2.154 1.894 1.743 2.847c-.381.883-.613 1.933-.673 3.205C1.01 8.332 1 8.736 1 12s.01 3.668.07 4.948c.06 1.272.292 2.322.673 3.205.411.953 1.151 1.693 2.104 2.104.883.381 1.933.613 3.205.673C8.332 22.99 8.736 23 12 23s3.668-.01 4.948-.07c1.272-.06 2.322-.292 3.205-.673.953-.411 1.693-1.151 2.104-2.104.381-.883.613-1.933.673-3.205.06-1.28.07-1.684.07-4.948s-.01-3.668-.07-4.948c-.06-1.272-.292-2.322-.673-3.205-.411-.953-1.151-1.693-2.104-2.104-.883-.381-1.933-.613-3.205-.673C15.668.01 15.264 0 12 0z"/><path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998z"/><circle cx="18.406" cy="5.594" r="1.44"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;