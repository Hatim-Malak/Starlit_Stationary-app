import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../Components/Navbar.jsx";
import PageTransition from "../Components/PageTransition.jsx";
import { useProduct } from "../store/useProductStore.js";
import { useCart } from "../store/useCartStore.js";
import { Loader2, Sparkles } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Helper component for the dot navigation
const DotButton = ({ selected, onClick }) => (
  <button
    className={`embla__dot ${selected ? 'embla__dot--selected' : ''}`}
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

// Carousel component - Now designed to fit within a flex container
const FeaturedProductCarousel = ({ featureProduct, quantities, handleQuantityChange, handleCartSubmit }) => {
  // --- Step 1: Use the hook to detect screen size ---
  // It will be `true` if screen width is 1024px or more.
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [openDescriptions, setOpenDescriptions] = useState({});

  // ... (scrollTo and other handlers remain the same) ...
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
    emblaApi.on('reInit', onSelect); // Important for responsiveness
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
  }, [emblaApi]);

  // --- Step 2: Set chunk size based on screen size ---
  const chunkSize = isDesktop ? 6 : 2;

  // --- Step 3: Use the dynamic chunk size to create slides ---
  const productChunks = React.useMemo(() => {
    // Re-calculate chunks only when featureProduct or chunkSize changes
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

  // When the chunks change, we need to tell Embla to re-initialise
  useEffect(() => {
    if (emblaApi) {
        emblaApi.reInit();
    }
  }, [productChunks, emblaApi]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center pb-4">
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {productChunks.map((chunk, index) => (
            <div className="embla__slide flex items-center justify-center" key={index}>
              {/* This grid layout is now perfect. It will automatically match the number of items in the chunk. */}
              <div className='grid lg:px-16 px-4 items-start justify-center gap-4 lg:gap-6 lg:grid-cols-6 grid-cols-2'>
                {chunk.map((pro) => (
                  <div key={pro._id} className='flex flex-col h-[230px] w-[150px] justify-center items-center pt-1 rounded-xl bg-white shadow-md border'>
                    {/* Your product card JSX remains exactly the same */}
                    {openDescriptions[pro._id] ? (
                      <div className='relative w-full h-full flex flex-col p-2'>
                        <button onClick={() => handleToggleDescription(pro._id)} className='absolute top-1 right-1 p-1 text-gray-500 hover:text-black'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                        <h3 className='font-bold text-md mb-2 border-b pb-1'>Description</h3>
                        <p className='text-sm text-gray-700 flex-grow overflow-y-auto'>
                          {pro.description || "No description available."}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className='w-[130px] h-[90px]'>
                          <img className='w-full h-full object-cover rounded-xl' src={pro.image || '/defaultProduct.png'} alt={pro.name} />
                        </div>
                        <div className='w-full h-1/2 flex flex-col justify-center items-center gap-1'>
                          <h1 className='font-medium text-md text-center'>{pro.name}</h1>
                          <h1 className='font-medium text-xs'>Rs {pro.price}</h1>
                          <button onClick={() => handleToggleDescription(pro._id)} className="text-xs text-blue-600 hover:underline">
                            Description
                          </button>
                          <div className='flex items-center gap-2 p-2 rounded-md bg-blue-900'>
                            {(!quantities[pro._id] || quantities[pro._id] === 0) ? (
                              <img src="/shop.svg" className='size-[20px]' alt="shop" />
                            ) : (
                              <button onClick={() => handleQuantityChange(pro._id, -1)}>
                                <img src="/minus.svg" className='size-[20px]' alt="minus" />
                              </button>
                            )}
                            <button
                              onClick={(!quantities[pro._id] || quantities[pro._id] === 0) ? () => handleQuantityChange(pro._id, 1) : () => handleCartSubmit(pro)}
                              className='text-white text-md font-medium'
                            >
                              {quantities[pro._id] > 0 ? `Add ${quantities[pro._id] || 0}` : `Add Cart`}
                            </button>
                            {quantities[pro._id] > 0 && (
                              <button onClick={() => handleQuantityChange(pro._id, 1)}>
                                <img src="/plus.svg" className='size-[20px]' alt="plus" />
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
      <div className="embla__dots">
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
      <div className='w-screen h-screen flex justify-center items-center'>
        <Loader2 className='w-[50px] h-[50px] animate-spin text-blue-500' />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className='h-screen flex flex-col'>
      <Navbar />
      {/* Main container with fixed height and overflow hidden */}
      <div className='w-full flex-1 flex flex-col fint bg-gradient-to-br from-blue-800 to-blue-400 overflow-hidden justify-center items-center'>
        {/* Hero Section takes its fixed space */}
        <div className='h-[250px] lg:mb-10 lg:mt-5 flex-1  flex flex-col gap-4 justify-center items-center pt-8'>
          <h1 className='text-5xl text-white font-bold text-center '>Shop the latest Stationary</h1>
          <p className='text-white lg:text-[20px]  font-medium'>Find all your stationary needs at best price</p>
          <Link to='/product' className='bg-blue-900 p-3 text-white text-xl font-medium rounded-md'>Shop now</Link>
        </div>

        {/* White container now correctly fills the remaining space */}
        <div className='w-4/5 bg-white flex-1 flex flex-col rounded-t-xl  pb-6 '>
          {/* Title section */}
          <div className='flex-shrink-0 flex items-center justify-center gap-3 py-4'>
            <Sparkles className='text-blue-600' size={32} />
            <h1 className='font-bold text-3xl text-slate-800 text-center'>
              Featured Products
            </h1>
          </div>
          {/* Carousel wrapper fills the rest of the space in the white card */}
          <div className=' w-full  '>
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
    </PageTransition>
  );
};

export default HomePage;