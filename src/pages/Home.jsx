import ProductCart from '../components/ProductCart';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <section className="relative border-b border-gray-200">
        <div className="w-full h-96 md:h-screen relative overflow-hidden">
          <img src="https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_1268,c_limit/f5654862-ef4d-4f10-85f7-7c11f1fe1f8f/nike-just-do-it.png" alt="TAPAK-O! – Menapak Bersama" className="w-full h-full object-cover object-center transform transition-transform duration-1000 hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
              <div className="max-w-xl text-white space-y-6">
                <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-xl">TAPAK-O!</h1>
                <p className="text-lg md:text-2xl font-light drop-shadow-lg">Menapak Bersama. Gaya untuk setiap langkah, dari kasual hingga olahraga.</p>
                <Link to="/store" className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full px-8 py-3 uppercase font-semibold tracking-widest shadow-2xl hover:scale-105 transition-transform">Mulai Menapak</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <ProductCart category="Casual Shoes" limit={6} />
        <ProductCart category="Boots" limit={6} />
        <ProductCart category="Minimalist Shoes" limit={6} />
        <ProductCart category="High Heels" limit={6} />
      </div>
    </>
  );
};

export default Home;