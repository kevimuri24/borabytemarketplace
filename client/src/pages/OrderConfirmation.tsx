import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  const [, navigate] = useLocation();
  
  // Generate a random order number
  const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2 text-primary">Thank You for Your Order!</h1>
        <p className="text-lg text-gray-600">Your order has been placed successfully.</p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Order #BOB-{orderNumber}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Order Date</h3>
              <p>{new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Payment Method</h3>
              <p>Credit Card</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Shipping Address</h3>
              <p className="text-gray-600">
                John Doe<br />
                123 Main St<br />
                Anytown, CA 12345<br />
                United States
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Delivery Method</h3>
              <p>Standard Delivery</p>
              <p className="text-sm text-gray-500 mt-1">Estimated delivery: {
                new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric'
                })
              }</p>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium text-gray-700 mb-3">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-medium">MacBook Pro 16-inch</div>
                  <div className="text-sm text-gray-500">Quantity: 1</div>
                </div>
                <div className="font-medium">$179.99</div>
              </div>
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-medium">AirPods Pro</div>
                  <div className="text-sm text-gray-500">Quantity: 2</div>
                </div>
                <div className="font-medium">$119.98</div>
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>$299.97</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>$24.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>$5.99</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span className="text-secondary">$329.96</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={() => navigate('/order-tracking')}>
            Track Order
          </Button>
          <Button onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-center space-y-4">
        <p className="text-gray-600">
          We've sent a confirmation email to <strong>john.doe@example.com</strong> with all the details of your order.
        </p>
        <p className="text-gray-600">
          If you have any questions about your order, please contact our customer support at 
          <a href="mailto:support@borabyte.com" className="text-primary font-medium mx-1">support@borabyte.com</a>
          or call us at <span className="font-medium">1-800-BORABYTE</span>.
        </p>
      </div>
    </div>
  );
}