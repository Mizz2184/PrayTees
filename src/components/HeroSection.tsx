import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate('/shop');
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source 
          src="https://ik.imagekit.io/pg1g5ievp/Untitled%20design.mp4?updatedAt=1750967288666" 
          type="video/mp4" 
        />
        {/* Fallback for browsers that don't support video */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')`
          }}
        ></div>
      </video>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-tight mb-6 tracking-tight">
          Wear Your<br />
          <span className="text-yellow-400">Faith</span> Boldly
        </h1>
        
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
          Premium PRAY apparel for the modern believer. 
          Express your faith with style and inspire others through your testimony.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={handleShopClick}
            className="bg-white text-black px-8 py-4 font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors min-w-[200px]"
          >
            Shop Collection
          </button>
          
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-px h-12 bg-white/50 mx-auto mb-2"></div>
        <p className="text-white/70 text-xs uppercase tracking-widest">Scroll</p>
      </div>
    </section>
  );
};

export default HeroSection;
