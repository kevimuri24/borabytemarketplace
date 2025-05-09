import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, X, MessageSquare, Info, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "bot" | "user";
  content: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Hello! Welcome to Borabyte. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    
    // Call API
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/chatbot", { message: userMessage });
      const data = await response.json();
      
      setMessages((prev) => [...prev, { role: "bot", content: data.response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      // Add fallback bot message
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container fixed bottom-6 right-6 z-50 w-72 md:w-80">
      {/* Chat button */}
      <Button
        onClick={toggleChat}
        className="bg-primary hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center ml-auto w-12 h-12"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      {/* Chat window */}
      <div
        className={`bg-white rounded-lg shadow-xl overflow-hidden mt-4 transition-all transform origin-bottom-right ${
          isOpen ? "scale-100" : "scale-0 hidden"
        }`}
      >
        {/* Chat header */}
        <div className="bg-secondary text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            <h3 className="font-semibold">BoraByte Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleChat}
            className="text-white hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Chat messages */}
        <div className="p-4 h-80 overflow-y-auto bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "bot" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white mr-2 flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`rounded-lg py-2 px-3 max-w-[80%] ${
                  message.role === "bot"
                    ? "bg-gray-200"
                    : "bg-primary text-white"
                }`}
              >
                <p>{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white ml-2 flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Chat input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex">
            <Input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded-l p-2 focus:ring-primary focus:border-primary"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-yellow-600 text-white px-4 rounded-r transition"
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <Info className="mr-1 h-3 w-3" />
            <span>Powered by AI - Responses may take a moment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
