import React from 'react';
import Navbar from "../Components/Navbar.jsx";
import { useEffect, useState, useMemo } from 'react';
import { useCart, useTotalPriceStore } from '../store/useCartStore.js';
import { Link } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, Package, ArrowRight, ShoppingBag, Info } from 'lucide-react';

const CartPage = () => {
  const { Cart, getCart, gettingCart, updateCart, removeCart } = useCart();
  const { setTotalPrice } = useTotalPriceStore()
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
      <div className='flex flex-col min-h-screen bg-gradient-to-br from-primary to-secondary'>
        <Navbar />
        <div className='flex-1 py-8 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            {/* Page Header */}
            <div className='mb-8'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center'>
                  <ShoppingCart className='w-6 h-6 text-primary' />
                </div>
                <h1 className='text-3xl font-bold text-white'>Shopping Cart</h1>
              </div>
              <p className='text-accent'>Review and manage your cart items</p>
            </div>

            {/* Cart Container */}
            <div className='bg-white rounded-xl shadow-xl border-2 border-accent/30 overflow-hidden'>
              {/* Cart Items Section */}
              <div className='p-6'>
                {/* Desktop Table Header */}
                <div className='hidden md:grid md:grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-600 pb-4 border-b-2 border-accent'>
                  <div className='col-span-5'>Product Details</div>
                  <div className='col-span-2 text-center'>Price</div>
                  <div className='col-span-2 text-center'>Quantity</div>
                  <div className='col-span-2 text-center'>Total</div>
                  <div className='col-span-1 text-center'>Actions</div>
                </div>

                {/* Cart Items */}
                <div className='divide-y divide-gray-200'>
                  {Cart?.items?.length === 0 || !Cart?.items ? (
                    <div className='flex flex-col items-center justify-center py-16'>
                      <div className='w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mb-4'>
                        <ShoppingBag className='w-10 h-10 text-primary' />
                      </div>
                      <h3 className='text-xl font-bold text-gray-900 mb-2'>Your cart is empty</h3>
                      <p className='text-gray-600 mb-6'>Add some items to get started!</p>
                      <Link to='/'>
                        <button className='bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2'>
                          Continue Shopping
                          <ArrowRight className='w-5 h-5' />
                        </button>
                      </Link>
                    </div>
                  ) : (
                    Cart.items.map((item) => {
                      const product = item.product;
                      if (!product) return null;
                      const total = product.price * (quantities[item._id] || 0);

                      return (
                        <div key={product._id} className='py-6'>
                          {/* Desktop Layout */}
                          <div className='hidden md:grid md:grid-cols-12 gap-4 items-center'>
                            {/* Product Details */}
                            <div className='col-span-5 flex items-center gap-4'>
                              <div className='w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200'>
                                <img
                                  className='w-full h-full object-cover'
                                  src={product.image || "/defaultProduct.png"}
                                  alt={product.name}
                                />
                              </div>
                              <div className='flex-1 min-w-0'>
                                <h3 className='font-semibold text-gray-900 mb-1 truncate'>{product.name}</h3>
                                <div className="relative group">
                                  <button className="text-xs text-primary hover:text-primary flex items-center gap-1">
                                    <Info className='w-3 h-3' />
                                    View Description
                                  </button>
                                  <div className="absolute left-0 top-full mt-2 w-72 rounded-lg bg-white shadow-xl border-2 border-accent p-3 text-sm text-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <p className='font-medium text-gray-900 mb-1'>Description:</p>
                                    {product.description?.slice(0, 150) || "No description available"}...
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Price */}
                            <div className='col-span-2 text-center'>
                              <p className='font-semibold text-gray-900'>₹{product.price}</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className='col-span-2 flex justify-center'>
                              <div className='flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2'>
                                <button
                                  onClick={() => handleQuantityChange(item._id, -1)}
                                  className='w-7 h-7 bg-white hover:bg-warm rounded-md flex items-center justify-center transition-colors border border-gray-300'
                                >
                                  <Minus className='w-4 h-4 text-gray-600' />
                                </button>
                                <span className='font-semibold text-gray-900 w-8 text-center'>{quantities[item._id] || 0}</span>
                                <button
                                  onClick={() => handleQuantityChange(item._id, 1)}
                                  className='w-7 h-7 bg-white hover:bg-warm rounded-md flex items-center justify-center transition-colors border border-gray-300'
                                >
                                  <Plus className='w-4 h-4 text-gray-600' />
                                </button>
                              </div>
                            </div>

                            {/* Total */}
                            <div className='col-span-2 text-center'>
                              <p className='font-bold text-primary'>₹{total}</p>
                            </div>

                            {/* Actions */}
                            <div className='col-span-1 flex justify-center gap-2'>
                              {quantities[item._id] !== item.quantity && (
                                <button
                                  className='bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200'
                                  onClick={async () => {
                                    await updateCart(item._id, { quantity: quantities[item._id] });
                                    getCart();
                                  }}
                                >
                                  Update
                                </button>
                              )}
                              <button
                                className='bg-red-500 hover:bg-red-600 p-2 rounded-md transition-colors'
                                onClick={async () => {
                                  await removeCart(item._id);
                                  await getCart();
                                }}
                              >
                                <Trash2 className='w-4 h-4 text-white' />
                              </button>
                            </div>
                          </div>

                          {/* Mobile Layout */}
                          <div className='md:hidden'>
                            <div className='flex gap-4 mb-4'>
                              <div className='w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200'>
                                <img
                                  className='w-full h-full object-cover'
                                  src={product.image || "/defaultProduct.png"}
                                  alt={product.name}
                                />
                              </div>
                              <div className='flex-1 min-w-0'>
                                <div className='flex justify-between items-start mb-2'>
                                  <h3 className='font-semibold text-gray-900 text-sm'>{product.name}</h3>
                                  <button
                                    className='bg-red-500 hover:bg-red-600 p-2 rounded-md transition-colors ml-2'
                                    onClick={async () => {
                                      await removeCart(item._id);
                                      await getCart();
                                    }}
                                  >
                                    <Trash2 className='w-4 h-4 text-white' />
                                  </button>
                                </div>
                                <div className="relative group mb-2">
                                  <button className="text-xs text-primary hover:text-primary flex items-center gap-1">
                                    <Info className='w-3 h-3' />
                                    View Description
                                  </button>
                                  <div className="absolute left-0 top-full mt-2 w-64 rounded-lg bg-white shadow-xl border-2 border-accent p-3 text-sm text-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <p className='font-medium text-gray-900 mb-1'>Description:</p>
                                    {product.description?.slice(0, 150) || "No description available"}...
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className='space-y-3'>
                              <div className='flex justify-between items-center text-sm'>
                                <span className='text-gray-600'>Price:</span>
                                <span className='font-semibold text-gray-900'>₹{product.price}</span>
                              </div>

                              <div className='flex justify-between items-center'>
                                <span className='text-sm text-gray-600'>Quantity:</span>
                                <div className='flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2'>
                                  <button
                                    onClick={() => handleQuantityChange(item._id, -1)}
                                    className='w-7 h-7 bg-white hover:bg-warm rounded-md flex items-center justify-center transition-colors border border-gray-300'
                                  >
                                    <Minus className='w-4 h-4 text-gray-600' />
                                  </button>
                                  <span className='font-semibold text-gray-900 w-8 text-center'>{quantities[item._id] || 0}</span>
                                  <button
                                    onClick={() => handleQuantityChange(item._id, 1)}
                                    className='w-7 h-7 bg-white hover:bg-warm rounded-md flex items-center justify-center transition-colors border border-gray-300'
                                  >
                                    <Plus className='w-4 h-4 text-gray-600' />
                                  </button>
                                </div>
                              </div>

                              <div className='flex justify-between items-center text-sm'>
                                <span className='text-gray-600'>Total:</span>
                                <span className='font-bold text-primary'>₹{total}</span>
                              </div>

                              {quantities[item._id] !== item.quantity && (
                                <button
                                  className='w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white py-2 rounded-lg font-semibold transition-all duration-200'
                                  onClick={async () => {
                                    await updateCart(item._id, { quantity: quantities[item._id] });
                                    getCart();
                                  }}
                                >
                                  Update Cart
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Cart Summary Footer */}
              {Cart?.items?.length > 0 && (
                <div className='bg-gradient-to-r from-warm to-warm-100 border-t-2 border-accent p-6'>
                  <div className='max-w-md ml-auto space-y-4'>
                    {/* Subtotal */}
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-700 font-medium'>Subtotal:</span>
                      <span className='font-semibold text-gray-900'>₹{grandTotal}</span>
                    </div>

                    {/* Shipping */}
                    <div className='flex justify-between items-center pb-4 border-b border-accent/50'>
                      <span className='text-gray-700 font-medium'>Shipping:</span>
                      <span className='font-semibold text-green-600'>Free</span>
                    </div>

                    {/* Grand Total */}
                    <div className='flex justify-between items-center py-2'>
                      <span className='text-xl font-bold text-gray-900'>Grand Total:</span>
                      <span className='text-2xl font-bold text-primary'>₹{grandTotal}</span>
                    </div>

                    {/* Checkout Button */}
                    <Link to='/order' className='block'>
                      <button className='w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl'>
                        <span>Proceed to Checkout</span>
                        <ArrowRight className='w-5 h-5' />
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
