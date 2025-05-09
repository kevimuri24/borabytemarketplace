import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { ProtectedRoute } from '@/lib/protected-route';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: 'Order placed!',
        description: 'Your order has been successfully placed.',
      });
      setIsProcessing(false);
      navigate('/order-confirmation');
    }, 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="page-title">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                  <CardDescription>Enter your shipping address details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip/Postal Code</Label>
                      <Input id="zipCode" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" defaultValue="United States" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" required />
                  </div>
                </CardContent>
              </Card>
              
              {/* Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Method</CardTitle>
                  <CardDescription>Choose your preferred delivery option</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    defaultValue="standard" 
                    value={deliveryMethod}
                    onValueChange={setDeliveryMethod}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-accent/20" onClick={() => setDeliveryMethod('standard')}>
                      <RadioGroupItem value="standard" id="standard" />
                      <div className="flex-1">
                        <Label htmlFor="standard" className="font-medium cursor-pointer">Standard Delivery</Label>
                        <p className="text-sm text-gray-500">Delivery in 3-5 business days</p>
                      </div>
                      <div className="font-medium">$5.99</div>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-accent/20" onClick={() => setDeliveryMethod('express')}>
                      <RadioGroupItem value="express" id="express" />
                      <div className="flex-1">
                        <Label htmlFor="express" className="font-medium cursor-pointer">Express Delivery</Label>
                        <p className="text-sm text-gray-500">Delivery in 2-3 business days</p>
                      </div>
                      <div className="font-medium">$12.99</div>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-accent/20" onClick={() => setDeliveryMethod('next_day')}>
                      <RadioGroupItem value="next_day" id="next_day" />
                      <div className="flex-1">
                        <Label htmlFor="next_day" className="font-medium cursor-pointer">Next Day Delivery</Label>
                        <p className="text-sm text-gray-500">Delivery the next business day</p>
                      </div>
                      <div className="font-medium">$19.99</div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Choose how you'd like to pay</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="credit_card" value={paymentMethod} onValueChange={setPaymentMethod}>
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="credit_card">Credit Card</TabsTrigger>
                      <TabsTrigger value="paypal">PayPal</TabsTrigger>
                      <TabsTrigger value="stripe">Stripe</TabsTrigger>
                    </TabsList>
                    <TabsContent value="credit_card" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input id="nameOnCard" required />
                      </div>
                    </TabsContent>
                    <TabsContent value="paypal">
                      <div className="text-center p-8 space-y-4 border rounded-md">
                        <div className="text-2xl font-bold text-blue-600">PayPal</div>
                        <p>Click 'Place Order' below to be redirected to PayPal to complete your purchase securely.</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="stripe">
                      <div className="text-center p-8 space-y-4 border rounded-md">
                        <div className="text-2xl font-bold text-purple-600">Stripe</div>
                        <p>Click 'Place Order' below to be redirected to Stripe to complete your purchase securely.</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t pt-6">
                  <Button type="button" variant="outline" onClick={() => navigate('/cart')}>
                    Back to Cart
                  </Button>
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">$299.97</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">$24.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {deliveryMethod === 'standard' && '$5.99'}
                    {deliveryMethod === 'express' && '$12.99'}
                    {deliveryMethod === 'next_day' && '$19.99'}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-lg text-secondary">
                  {deliveryMethod === 'standard' && '$329.96'}
                  {deliveryMethod === 'express' && '$336.96'}
                  {deliveryMethod === 'next_day' && '$343.96'}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Items in Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm">MacBook Pro 16-inch</div>
                  <div className="text-sm text-gray-500">Quantity: 1</div>
                </div>
                <div className="text-sm font-medium">$179.99</div>
              </div>
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm">AirPods Pro</div>
                  <div className="text-sm text-gray-500">Quantity: 2</div>
                </div>
                <div className="text-sm font-medium">$119.98</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}