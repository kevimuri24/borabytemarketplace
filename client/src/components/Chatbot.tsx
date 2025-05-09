import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage, initialBotMessage, sendMessage, generateMessageId } from '@/lib/chatbot';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMessage.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);
    
    try {
      // Send message to the server
      const response = await sendMessage(currentMessage);
      
      // Add bot response after a small delay to simulate typing
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: generateMessageId(),
          content: response,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message if something goes wrong
      setTimeout(() => {
        const errorMessage: ChatMessage = {
          id: generateMessageId(),
          content: "I'm sorry, I'm having trouble connecting. Please try again later.",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div id="chatbot-container" className="chatbot-container fixed bottom-6 right-6 z-50 w-72 md:w-80">
      {/* Chat button */}
      <Button 
        id="chat-button" 
        onClick={toggleChat}
        className="bg-[#FF9900] hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center ml-auto"
      >
        <i className="fas fa-comment-dots text-xl"></i>
      </Button>
      
      {/* Chat window */}
      <div 
        id="chat-window" 
        className={`${isOpen ? 'block' : 'hidden'} bg-white rounded-lg shadow-xl overflow-hidden mt-4 transition-all transform origin-bottom-right`}
      >
        {/* Chat header */}
        <div className="bg-[#232F3E] text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-robot mr-2"></i>
            <h3 className="font-semibold">BoraByte Assistant</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleChat} 
            className="text-white hover:text-gray-300 h-auto p-1"
          >
            <i className="fas fa-times"></i>
          </Button>
        </div>
        
        {/* Chat messages */}
        <div id="chat-messages" className="p-4 h-80 overflow-y-auto bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex mb-4 ${msg.sender === 'bot' ? '' : 'justify-end'}`}>
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-[#232F3E] flex items-center justify-center text-white mr-2 flex-shrink-0">
                  <i className="fas fa-robot"></i>
                </div>
              )}
              
              <div className={`${
                msg.sender === 'bot' 
                  ? 'bg-gray-200 text-[#333333]' 
                  : 'bg-[#FF9900] text-white'
              } rounded-lg py-2 px-3 max-w-[80%]`}>
                <p>{msg.content}</p>
              </div>
              
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white ml-2 flex-shrink-0">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex mb-4">
              <div className="w-8 h-8 rounded-full bg-[#232F3E] flex items-center justify-center text-white mr-2 flex-shrink-0">
                <i className="fas fa-robot"></i>
              </div>
              <div className="bg-gray-200 rounded-lg py-2 px-3 max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat input */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex">
            <Input
              type="text"
              placeholder="Type your message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="flex-1 border rounded-l p-2 focus:ring-[#FF9900] focus:border-[#FF9900]"
            />
            <Button 
              type="submit"
              className="bg-[#FF9900] hover:bg-yellow-600 text-white px-4 rounded-r transition"
              disabled={isTyping}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <i className="fas fa-info-circle mr-1"></i>
            <span>Powered by AI - Responses may take a moment</span>
          </div>
        </form>
      </div>
    </div>
  );
}
