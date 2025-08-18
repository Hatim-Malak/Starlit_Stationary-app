import React from 'react';
import Navbar from "../Components/Navbar.jsx";
import { useEffect, useState,useMemo } from 'react';
import { useCart,useTotalPriceStore } from '../store/useCartStore.js';
import { Link } from 'react-router-dom'

const CartPage = () => {
  const { Cart, getCart, gettingCart, updateCart, removeCart } = useCart();
  const {setTotalPrice} = useTotalPriceStore()
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    getCart();
  }, [getCart]);

  useEffect(() => {
    if (Cart?.items) {
      const initialQuantities = {};
      Cart.items.forEach(item => {
        initialQuantities[item._id] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [Cart]);

  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) + delta, 0)
    }));
  };

  const grandTotal = useMemo(() => {
    return Cart?.items?.reduce((acc, item) => {
      const q = quantities[item._id] || 0;
      const p = item.product?.price || 0;
      return acc + q * p;
    }, 0) || 0;
  }, [Cart, quantities]);
  
  // Store grand total in persistent store
  useEffect(() => {
    setTotalPrice(grandTotal);
  }, [grandTotal, setTotalPrice]);
  return (
    <>
      <div className='flex flex-col h-screen'>
        <Navbar />
        <div className='bg-gradient-to-br from-blue-800 to-blue-400 w-full flex-1 fint justify-center items-center gap-2 flex p-2 md:p-0'>
          <div className='lg:w-3/5 w-full h-auto max-h-[90vh] bg-white rounded-lg sh p-4 flex flex-col'>
            <h1 className='text-2xl font-bold'>Shopping Cart:-</h1>
            <div className='w-full flex-grow p-0 md:p-2 overflow-auto '>
              <div className='hidden md:flex items-center justify-between text-gray-600 font-medium px-2 pt-2 pb-1 '>
                <h1>Items Detail</h1>
                <div className='flex justify-center items-center gap-12 pr-16'>
                  <h1 className='w-[50px]'>Price</h1>
                  <h1 className='w-[70px]'>Quantity</h1>
                  <h1 className='w-[70px]'>Total</h1>
                </div>
              </div>
              <div className='hidden md:block border border-gray-400'></div>
              {Cart?.items?.map((item) => {
                const product = item.product;
                if (!product) return null;
                const total = product.price * (quantities[item._id] || 0);

                return (
                  <div key={product._id} className='flex flex-col w-full p-2 justify-center border-b'>
                    <div className="flex items-center justify-between w-full">
                      <div className='flex justify-center items-center gap-4'>
                        <div className='size-[40px] flex-shrink-0'>
                          <img
                            className='w-full h-full object-cover rounded-md'
                            src={product.image || "/defaultProduct.png"}
                            alt="product"
                          />
                        </div>
                        <div className='flex flex-col justify-center items-start'>
                          <h2 className='font-medium text-sm'>{product.name}</h2>
                          <div className="relative group">
                            <button className="text-xs text-gray-800 relative z-10">
                              Description...
                              <div className="absolute left-0 top-full mt-1 w-[220px] rounded-md bg-white shadow-xl border border-gray-200 p-2 text-[12px] text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                                {product.description?.slice(0, 100) || "No description"}...
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="md:hidden">
                        <button className='bg-red-600 p-2 rounded-md' onClick={async () => {
                          await removeCart(item._id);
                          await getCart();
                        }}>
                          <img className='size-[12px]' src="/cross.svg" alt="cross" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end md:gap-12 w-full mt-3 md:mt-0">
                      <h1 className='text-sm font-medium w-auto md:w-[50px]'><span className="text-gray-500 md:hidden">Price: </span>Rs {product.price}</h1>
                      <div className='flex gap-3 justify-center items-center w-auto md:w-[70px]'>
                        <button onClick={() => handleQuantityChange(item._id, -1)}>
                          <img className='size-[22px]' src="/minusBlack.svg" alt="minus" />
                        </button>
                        <h1 className='text-md font-medium'>{quantities[item._id] || 0}</h1>
                        <button onClick={() => handleQuantityChange(item._id, 1)}>
                          <img className='size-[22px]' src="/plusBlack.svg" alt="plus" />
                        </button>
                      </div>
                      <h1 className='text-sm font-medium w-auto md:w-[70px]'><span className="text-gray-500 md:hidden">Total: </span>Rs {total}</h1>
                      <div className='hidden md:flex items-center gap-4'>
                        {(quantities[item._id] > item.quantity) && (
                          <button className='w-[60px] rounded-lg p-1 text-sm bg-blue-900 text-white' onClick={async () => {
                            await updateCart(item._id, { quantity: quantities[item._id] });
                            getCart();
                          }}>
                            Update
                          </button>
                        )}
                        {(quantities[item._id] < item.quantity) && (
                          <button className='w-[60px] rounded-lg p-1 text-sm bg-blue-900 text-white' onClick={async () => {
                            await updateCart(item._id, { quantity: quantities[item._id] });
                            getCart();
                          }}>
                            remove
                          </button>
                        )}
                        <button className='bg-red-600 p-2 rounded-md' onClick={async () => {
                          await removeCart(item._id);
                          await getCart();
                        }}>
                          <img className='size-[12px]' src="/cross.svg" alt="cross" />
                        </button>
                      </div>
                    </div>
                     {(quantities[item._id] > item.quantity) && (
                        <button className='w-full mt-2 rounded-lg p-1 text-sm bg-blue-900 text-white md:hidden' onClick={async () => {
                        await updateCart(item._id, { quantity: quantities[item._id] });
                        getCart();
                        }}>
                        Update Cart
                        </button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-auto w-full pt-4">
              <div className="flex w-full justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Grand Total:</h2>
                <h1 className="text-xl font-bold text-black">
                  Rs {grandTotal}
                </h1>
              </div>
              <div>
              <Link to='/order'>
                <button className='w-full p-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-md transition-colors'>
                  Procced to Order
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;