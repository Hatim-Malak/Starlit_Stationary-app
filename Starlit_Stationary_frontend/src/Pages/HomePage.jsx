import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../Components/Navbar.jsx";
import PageTransition from "../Components/PageTransition.jsx";
import { useProduct } from "../store/useProductStore.js";
import { useCart } from "../store/useCartStore.js";
import { Loader2, Sparkles, ShoppingBag, Star, TrendingUp, Package } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Helper component for the dot navigation
const DotButton = ({ selected, onClick }) => (
  <button
    className={`h-2 rounded-full transition-all duration-300 ${
      selected ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
    }`}
    type="button"
    onClick={onClick}
  />
);

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};

// Enhanced Carousel component with professional design
const FeaturedProductCarousel = ({ featureProduct, quantities, handleQuantityChange, handleCartSubmit }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [openDescriptions, setOpenDescriptions] = useState({});

  const handleToggleDescription = (productId) => {
    setOpenDescriptions(prevStates => ({
      ...prevStates,
      [productId]: !prevStates[productId]
    }));
  };

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
  }, [emblaApi]);

  const chunkSize = isDesktop ? 6 : 2;

  const productChunks = React.useMemo(() => {
    if (!featureProduct) return [];
    return featureProduct.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / chunkSize);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
    }, []);
  }, [featureProduct, chunkSize]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [productChunks, emblaApi]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center pb-6">
      <div className="embla h-full w-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {productChunks.map((chunk, index) => (
            <div className="embla__slide flex items-center justify-center" key={index}>
              <div className='grid lg:px-16 px-4 items-start justify-center gap-4 lg:gap-6 lg:grid-cols-6 grid-cols-2'>
                {chunk.map((pro) => (
                  <div 
                    key={pro._id} 
                    className='group relative flex flex-col h-[280px] w-[160px] lg:h-[320px] lg:w-[180px] justify-between rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1'
                  >
                    {openDescriptions[pro._id] ? (
                      <div className='relative w-full h-full flex flex-col p-4 bg-gradient-to-br from-blue-50 to-white'>
                        <button 
                          onClick={() => handleToggleDescription(pro._id)} 
                          className='absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                          </svg>
                        </button>
                        <div className='flex items-center gap-2 mb-3 pb-2 border-b-2 border-blue-200'>
                          <Package className='text-blue-600' size={20} />
                          <h3 className='font-bold text-lg text-gray-800'>Description</h3>
                        </div>
                        <p className='text-sm text-gray-700 flex-grow overflow-y-auto leading-relaxed'>
                          {pro.description || "No description available."}
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Product Image with Badge */}
                        <div className='relative w-full p-3'>
                          <div className='w-full h-[110px] lg:h-[130px] rounded-xl overflow-hidden bg-gray-50'>
                            <img 
                              className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110' 
                              src={pro.image || '/defaultProduct.png'} 
                              alt={pro.name} 
                            />
                          </div>
                          <div className='absolute top-5 right-5 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1'>
                            <Star size={12} fill="white" />
                            <span>Featured</span>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className='w-full flex flex-col justify-end px-3 pb-3 gap-2'>
                          <div className='min-h-[60px] lg:min-h-[70px] flex flex-col gap-1'>
                            <h1 className='font-semibold text-sm lg:text-base text-gray-800 line-clamp-2 leading-tight'>
                              {pro.name}
                            </h1>
                            <div className='flex items-center gap-2'>
                              <span className='font-bold text-blue-600 text-lg'>Rs {pro.price}</span>
                            </div>
                            <button 
                              onClick={() => handleToggleDescription(pro._id)} 
                              className="text-xs text-blue-500 hover:text-blue-700 hover:underline text-left font-medium transition-colors"
                            >
                              View Details →
                            </button>
                          </div>

                          {/* Add to Cart Button */}
                          <div className='flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800'>
                            {(!quantities[pro._id] || quantities[pro._id] === 0) ? (
                              <ShoppingBag className='text-white' size={18} />
                            ) : (
                              <button 
                                onClick={() => handleQuantityChange(pro._id, -1)}
                                className='hover:bg-white/20 rounded-md p-0.5 transition-colors'
                              >
                                <img src="/minus.svg" className='size-[18px]' alt="minus" />
                              </button>
                            )}
                            <button
                              onClick={(!quantities[pro._id] || quantities[pro._id] === 0) ? () => handleQuantityChange(pro._id, 1) : () => handleCartSubmit(pro)}
                              className='flex-1 text-white text-sm font-semibold'
                            >
                              {quantities[pro._id] > 0 ? `Add ${quantities[pro._id]}` : `Add to Cart`}
                            </button>
                            {quantities[pro._id] > 0 && (
                              <button 
                                onClick={() => handleQuantityChange(pro._id, 1)}
                                className='hover:bg-white/20 rounded-md p-0.5 transition-colors'
                              >
                                <img src="/plus.svg" className='size-[18px]' alt="plus" />
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex gap-2 mt-6">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const { addToCart } = useCart();
  const { gettingFeatureProduct, getFeatureProduct, featureProduct } = useProduct();
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    getFeatureProduct();
  }, [getFeatureProduct]);

  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) + delta, 0)
    }));
  };

  const handleCartSubmit = async (product) => {
    const qty = quantities[product._id] || 1;
    await addToCart({ productId: product._id, quantity: qty });
    setQuantities(prev => ({ ...prev, [product._id]: 0 }));
  };

  if (gettingFeatureProduct || !featureProduct) {
    return (
      <div className='w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-white'>
        <Loader2 className='w-[60px] h-[60px] animate-spin text-blue-600 mb-4' />
        <p className='text-gray-600 font-medium'>Loading amazing products...</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className='min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500'>
        <Navbar />
        
        {/* Main Content Container */}
        <div className='flex-1 flex flex-col'>
          {/* Hero Section with Enhanced Design */}
          <div className='relative w-full py-12 lg:py-16'>
            {/* Decorative Elements */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
              <div className='absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl'></div>
              <div className='absolute bottom-10 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl'></div>
            </div>

            <div className='relative container mx-auto px-4 flex flex-col items-center gap-6 lg:gap-8 text-center z-10'>
              {/* Badge */}
              <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30'>
                <TrendingUp className='text-white' size={18} />
                <span className='text-white text-sm font-semibold'>Premium Quality Stationery</span>
              </div>

              {/* Main Heading */}
              <div className='space-y-3'>
                <h1 className='text-4xl lg:text-6xl xl:text-7xl text-white font-bold leading-tight'>
                  Shop the Latest
                  <span className='block bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent'>
                    Stationery Collection
                  </span>
                </h1>
                <p className='text-white/90 text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed'>
                  Discover premium quality stationery products at unbeatable prices. Everything you need for work, study, and creativity.
                </p>
              </div>

              {/* CTA Button */}
              <Link 
                to='/product' 
                className='group relative inline-flex items-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 overflow-hidden'
              >
                <span className='absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                <ShoppingBag className='relative z-10' size={24} />
                <span className='relative z-10'>Shop Now</span>
                <svg className='relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* Trust Indicators */}
              <div className='flex flex-wrap items-center justify-center gap-6 lg:gap-12 mt-4 text-white/80 text-sm'>
                <div className='flex items-center gap-2'>
                  <div className='w-5 h-5 rounded-full bg-green-400 flex items-center justify-center'>
                    <svg className='w-3 h-3 text-white' fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className='font-medium'>Free Delivery</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-5 h-5 rounded-full bg-green-400 flex items-center justify-center'>
                    <svg className='w-3 h-3 text-white' fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className='font-medium'>Best Prices</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-5 h-5 rounded-full bg-green-400 flex items-center justify-center'>
                    <svg className='w-3 h-3 text-white' fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className='font-medium'>Quality Guaranteed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Products Section */}
          <div className='flex-1 flex items-center justify-center px-4 pb-8'>
            <div className='w-full max-w-[1400px] bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden'>
              {/* Section Header */}
              <div className='bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 lg:py-8'>
                <div className='flex items-center justify-center gap-3'>
                  <div className='p-2 bg-white/20 rounded-lg backdrop-blur-sm'>
                    <Sparkles className='text-yellow-300' size={28} />
                  </div>
                  <div className='text-center'>
                    <h2 className='font-bold text-3xl lg:text-4xl text-white'>
                      Featured Products
                    </h2>
                    <p className='text-blue-100 text-sm mt-1'>
                      Handpicked bestsellers just for you
                    </p>
                  </div>
                </div>
              </div>

              {/* Carousel */}
              <div className='py-8 bg-gradient-to-b from-gray-50 to-white'>
                <FeaturedProductCarousel
                  featureProduct={featureProduct}
                  quantities={quantities}
                  handleQuantityChange={handleQuantityChange}
                  handleCartSubmit={handleCartSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HomePage;
