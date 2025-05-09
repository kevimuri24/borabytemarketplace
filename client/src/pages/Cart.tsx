import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Loader2, ShoppingCart, Trash2 } from 'lucide-react';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  userId: number;
  addedAt: string;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    condition: string;
  };
}

export default function Cart() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const { data: cartItems, isLoading, error } = useQuery<CartItem[]>({
    queryKey: ['/api/cart'],
    queryFn: async () => {
      if (!user) return [];
      const res = await apiRequest('GET', '/api/cart');
      return res.json();
    },
    enabled: !!user,
  });
  
  const updateItemMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const res = await apiRequest('PATCH', `/api/cart/${productId}`, { quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Cart updated',
        description: 'Your cart has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update cart',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const removeItemMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest('DELETE', `/api/cart/${productId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to remove item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('DELETE', '/api/cart');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Cart cleared',
        description: 'Your cart has been emptied.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to clear cart',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItemMutation.mutate({ productId, quantity: newQuantity });
  };
  
  const handleRemoveItem = (productId: number) => {
    removeItemMutation.mutate(productId);
  };
  
  const handleClearCart = () => {
    clearCartMutation.mutate();
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  // Calculate totals
  const subtotal = cartItems?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      toast({
        title: 'Please sign in',
        description: 'You need to sign in to view your cart',
        variant: 'destructive',
      });
      navigate('/auth');
    }
  }, [user, isLoading, navigate, toast]);
  
  if (!user) return null;
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
          <h2 className="text-lg font-semibold">Error loading cart</h2>
          <p>{(error as Error).message}</p>
        </div>
      </div>
    );
  }
  
  if (!cartItems?.length) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-primary">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button onClick={() => navigate('/')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="page-title">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-accent/30">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-center">Quantity</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={item.product.image || 'https://via.placeholder.com/150'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <div className="text-sm text-gray-500 mt-1">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs capitalize condition-badge-${item.product.condition}`}>
                              {item.product.condition}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updateItemMutation.isPending}
                        >
                          -
                        </Button>
                        <span className="mx-3 w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={updateItemMutation.isPending}
                        >
                          +
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">${item.product.price.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right font-medium">${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td className="px-4 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={removeItemMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100 flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="text-primary"
              >
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                disabled={clearCartMutation.isPending}
              >
                {clearCartMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg text-secondary">${total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full"
              size="lg"
            >
              Proceed to Checkout
            </Button>
            <div className="mt-4 text-xs text-gray-500 text-center">
              Shipping tax & discounts calculated at checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}