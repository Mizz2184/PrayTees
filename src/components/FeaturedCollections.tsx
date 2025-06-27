import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturedCollections = () => {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    navigate('/shop');
  };

  const collections = [
    {
      id: 1,
      name: "Men",
      description: "Faith-based apparel for men",
      image: "https://ik.imagekit.io/pg1g5ievp/6.png?updatedAt=1751005573962",
      
    },
    {
      id: 2,
      name: "Women",
      description: "Stylish faith wear for women",
      image: "https://ik.imagekit.io/pg1g5ievp/3.png?updatedAt=1751005573701",
      
    },
    {
      id: 3,
      name: "Kids",
      description: "Faith apparel for little believers",
      image: "https://ik.imagekit.io/pg1g5ievp/Untitled%20design%20(12).png?updatedAt=1751005573646",
      
    }
  ];

  return (
    <section id="collections" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tight">
            Featured Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular faith-based apparel collections, 
            designed to inspire and encourage believers everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <div key={collection.id} className="group cursor-pointer">
              <div className="relative overflow-hidden bg-black aspect-[4/5] mb-4">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <h3 className="text-2xl font-black uppercase mb-2 tracking-tight">
                    {collection.name}
                  </h3>
                  <p className="text-sm mb-2 opacity-90">
                    {collection.description}
                  </p>
                </div>

                {/* Shop Now Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={handleShopNowClick}
                    className="bg-white text-black px-6 py-3 font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
