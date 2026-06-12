import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../Components/Navbar.jsx";
import PageTransition from "../Components/PageTransition.jsx";
import { useProduct } from "../store/useProductStore.js";
import { useCart } from "../store/useCartStore.js";
import { Loader2, Sparkles, ShoppingBag, Star, TrendingUp, Package } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';



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
const FeaturedProductCarousel = ({ featureProduct, quantities, handleQuantityChange, handleCartSubmit, addingProductId }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    skipSnaps: false,
    dragFree: true
  }, [
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
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

  if (!featureProduct) return null;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center pb-8 px-4 lg:px-12">
      <div className="embla w-full overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex gap-6 lg:gap-8 py-8">
          {featureProduct.map((pro) => (
            <div 
              key={pro._id} 
              className="embla__slide flex-[0_0_80%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%] xl:flex-[0_0_18%]"
            >
              <div 
                className='group relative flex flex-col h-[380px] w-full justify-between rounded-3xl bg-white shadow-xl border border-warm/40 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2'
              >
                {openDescriptions[pro._id] ? (
                  <div className='relative w-full h-full flex flex-col p-5 bg-gradient-to-br from-warm-50 to-warm'>
                    <button 
                      onClick={() => handleToggleDescription(pro._id)} 
                      className='absolute top-3 right-3 p-2 rounded-full bg-white shadow-md text-secondary hover:text-primary hover:bg-warm-100 transition-all duration-200 z-10'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                      </svg>
                    </button>
                    <div className='flex items-center gap-3 mb-4 pb-3 border-b-2 border-accent'>
                      <Package className='text-primary' size={24} />
                      <h3 className='font-bold text-xl text-primary'>Description</h3>
                    </div>
                    <p className='text-sm text-secondary flex-grow overflow-y-auto leading-relaxed pr-2'>
                      {pro.description || "No description available."}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Product Image with Premium Badge */}
                    <div className='relative w-full p-4 h-[200px]'>
                      <div className='w-full h-full rounded-2xl overflow-hidden bg-warm-50 relative group-hover:shadow-inner transition-all duration-500'>
                        <img 
                          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
                          src={pro.image || '/defaultProduct.png'} 
                          alt={pro.name} 
                        />
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
                      </div>
                      <div className='absolute top-6 right-6 bg-gradient-to-r from-primary to-secondary text-warm px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 transform group-hover:scale-105 transition-transform'>
                        <Star size={12} fill="currentColor" />
                        <span>Featured</span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className='w-full flex flex-col justify-end px-5 pb-5 gap-3'>
                      <div className='flex flex-col gap-1.5'>
                        <h1 className='font-bold text-lg text-primary line-clamp-1 group-hover:text-secondary transition-colors'>
                          {pro.name}
                        </h1>
                        <div className='flex items-center justify-between'>
                          <span className='font-extrabold text-primary text-xl'>Rs {pro.price}</span>
                          <button 
                            onClick={() => handleToggleDescription(pro._id)} 
                            className="text-xs text-secondary hover:text-primary hover:underline font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <div className={`flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary shadow-md transition-all duration-300 mt-2 ${addingProductId === pro._id ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:from-secondary hover:to-primary'}`}>
                        {addingProductId === pro._id ? (
                          <div className='p-1 bg-white/20 rounded-lg'>
                            <Loader2 className='text-warm animate-spin' size={18} />
                          </div>
                        ) : (!quantities[pro._id] || quantities[pro._id] === 0) ? (
                          <div className='p-1 bg-white/20 rounded-lg'>
                            <ShoppingBag className='text-warm' size={18} />
                          </div>
                        ) : (
                          <button 
                            disabled={addingProductId === pro._id}
                            onClick={() => handleQuantityChange(pro._id, -1)}
                            className='hover:bg-white/20 rounded-lg p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            <img src="/minus.svg" className='size-[18px] filter invert brightness-0' alt="minus" />
                          </button>
                        )}
                        <button
                          disabled={addingProductId === pro._id}
                          onClick={(!quantities[pro._id] || quantities[pro._id] === 0) ? () => handleQuantityChange(pro._id, 1) : () => handleCartSubmit(pro)}
                          className='flex-1 text-warm text-sm font-bold tracking-wide disabled:cursor-not-allowed'
                        >
                          {addingProductId === pro._id ? 'Adding...' : quantities[pro._id] > 0 ? `Add ${quantities[pro._id]}` : `Add to Cart`}
                        </button>
                        {quantities[pro._id] > 0 && addingProductId !== pro._id && (
                          <button 
                            disabled={addingProductId === pro._id}
                            onClick={() => handleQuantityChange(pro._id, 1)}
                            className='hover:bg-white/20 rounded-lg p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            <img src="/plus.svg" className='size-[18px] filter invert brightness-0' alt="plus" />
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex gap-2.5 mt-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            className={`transition-all duration-500 rounded-full ${
              index === selectedIndex 
                ? 'w-10 h-2.5 bg-primary shadow-md' 
                : 'w-2.5 h-2.5 bg-primary/30 hover:bg-primary/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const { addToCart, addingProductId } = useCart();
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

  return (
    <PageTransition>
      <div className='min-h-screen flex flex-col bg-gradient-to-br from-primary via-secondary to-primary'>
        <Navbar />
        
        {/* Main Content Container */}
        <div className='flex-1 flex flex-col'>
          {/* Hero Section with Enhanced Design */}
          <div className='relative w-full py-12 lg:py-16'>
            {/* Decorative Elements */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
              <div className='absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl'></div>
              <div className='absolute bottom-10 right-10 w-96 h-96 bg-warm/10 rounded-full blur-3xl'></div>
            </div>

            <div className='relative container mx-auto px-4 flex flex-col items-center gap-6 lg:gap-8 text-center z-10'>
              {/* Badge */}
              <div className='inline-flex items-center gap-2 bg-warm/15 backdrop-blur-sm px-4 py-2 rounded-full border border-accent/30'>
                <Sparkles className='text-warm' size={18} />
                <span className='text-warm text-sm font-semibold'>Premium Quality Stationery</span>
              </div>

              {/* Main Heading */}
              <div className='space-y-3'>
                <h1 className='text-4xl lg:text-6xl xl:text-7xl text-white font-bold leading-tight'>
                  Shop the Latest
                  <span className='block bg-gradient-to-r from-warm to-warm-100 bg-clip-text text-transparent'>
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
                className='group relative inline-flex items-center gap-3 bg-warm text-primary px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-warm/20 transition-all duration-300 hover:scale-105 overflow-hidden'
              >
                <span className='absolute inset-0 bg-gradient-to-r from-accent to-warm opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                <ShoppingBag className='relative z-10' size={24} />
                <span className='relative z-10'>Shop Now</span>
                <svg className='relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* Trust Indicators */}
              <div className='flex flex-wrap items-center justify-center gap-6 lg:gap-12 mt-4 text-warm/80 text-sm'>
                <div className='flex items-center gap-2'>
                  <div className='w-5 h-5 rounded-full bg-accent flex items-center justify-center'>
                    <svg className='w-3 h-3 text-warm' fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className='font-medium'>Free Delivery</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-5 h-5 rounded-full bg-accent flex items-center justify-center'>
                    <svg className='w-3 h-3 text-warm' fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className='font-medium'>Best Prices</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-5 h-5 rounded-full bg-accent flex items-center justify-center'>
                    <svg className='w-3 h-3 text-warm' fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className='font-medium'>Quality Guaranteed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Products Section or Fallback */}
          {gettingFeatureProduct ? (
            <div className='flex-1 flex items-center justify-center px-4 pb-8'>
              <div className='w-full max-w-[1400px] bg-warm/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-warm/20 overflow-hidden'>
                {/* Section Header */}
                <div className='bg-gradient-to-r from-secondary to-primary px-6 py-6 lg:py-8'>
                  <div className='flex items-center justify-center gap-3'>
                    <div className='p-2 bg-white/20 rounded-lg backdrop-blur-sm'>
                      <Sparkles className='text-warm' size={28} />
                    </div>
                    <div className='text-center'>
                      <h2 className='font-bold text-3xl lg:text-4xl text-white'>
                        Featured Products
                      </h2>
                      <p className='text-accent-100 text-sm mt-1'>
                        Handpicked bestsellers just for you
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Cards Skeleton */}
                <div className='bg-gradient-to-b from-warm-50 to-warm w-full flex flex-col justify-center items-center pb-8 px-4 lg:px-12'>
                  <div className='w-full overflow-hidden'>
                    <div className='flex gap-6 lg:gap-8 py-8'>
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className="flex-[0_0_80%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%] xl:flex-[0_0_18%]"
                        >
                          <div className='flex flex-col h-[380px] w-full justify-between rounded-3xl bg-white shadow-xl border border-warm/40 overflow-hidden'>
                            {/* Image Skeleton */}
                            <div className='relative w-full p-4 h-[200px]'>
                              <div className='w-full h-full rounded-2xl bg-gray-200 animate-pulse'></div>
                            </div>

                            {/* Info Skeleton */}
                            <div className='w-full flex flex-col justify-end px-5 pb-5 gap-3'>
                              <div className='flex flex-col gap-3'>
                                <div className='w-3/4 h-5 bg-gray-200 rounded-full animate-pulse'></div>
                                <div className='flex items-center justify-between mt-1'>
                                  <div className='w-1/3 h-6 bg-gray-200 rounded-full animate-pulse'></div>
                                  <div className='w-1/4 h-4 bg-gray-200 rounded-full animate-pulse'></div>
                                </div>
                              </div>
                              <div className='w-full h-11 mt-2 bg-gray-200 rounded-xl animate-pulse'></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Dots Skeleton */}
                  <div className='flex gap-2.5 mt-2'>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className='w-2.5 h-2.5 bg-primary/20 rounded-full animate-pulse'></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : featureProduct && featureProduct.length > 0 ? (
            <div className='flex-1 flex items-center justify-center px-4 pb-8'>
              <div className='w-full max-w-[1400px] bg-warm/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-warm/20 overflow-hidden'>
                {/* Section Header */}
                <div className='bg-gradient-to-r from-secondary to-primary px-6 py-6 lg:py-8'>
                  <div className='flex items-center justify-center gap-3'>
                    <div className='p-2 bg-white/20 rounded-lg backdrop-blur-sm'>
                      <Sparkles className='text-warm' size={28} />
                    </div>
                    <div className='text-center'>
                      <h2 className='font-bold text-3xl lg:text-4xl text-white'>
                        Featured Products
                      </h2>
                      <p className='text-accent-100 text-sm mt-1'>
                        Handpicked bestsellers just for you
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carousel */}
                <div className='py-8 bg-gradient-to-b from-warm-50 to-warm'>
                  <FeaturedProductCarousel
                    featureProduct={featureProduct}
                    quantities={quantities}
                    handleQuantityChange={handleQuantityChange}
                    handleCartSubmit={handleCartSubmit}
                    addingProductId={addingProductId}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className='flex-1 flex items-center justify-center px-4 pb-12 mt-8 lg:mt-16'>
              <div className='w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-16 text-center border border-white/20 shadow-2xl relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-tr from-secondary/40 to-primary/40 opacity-30 pointer-events-none'></div>
                <div className='absolute -top-24 -right-24 w-64 h-64 bg-warm/20 rounded-full blur-3xl pointer-events-none'></div>
                <div className='relative z-10 flex flex-col items-center gap-6'>
                  <div className='p-5 bg-warm/20 rounded-full'>
                    <TrendingUp className='text-warm w-10 h-10 lg:w-12 lg:h-12' />
                  </div>
                  <h2 className='text-2xl lg:text-4xl font-bold text-white'>More Exciting Products Coming Soon!</h2>
                  <p className='text-accent-100 text-base lg:text-lg max-w-xl mx-auto'>
                    We are constantly updating our catalog with fresh, premium stationery. Explore our main store to see all currently available items.
                  </p>
                  <Link 
                    to='/product' 
                    className='mt-4 px-8 py-4 bg-warm text-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300'
                  >
                    Explore All Products
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default HomePage;
