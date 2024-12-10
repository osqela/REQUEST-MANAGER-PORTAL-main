import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendRequest } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Facebook } from 'lucide-react';

export const RequestButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      const userId = crypto.randomUUID();
      const requestCode = generateCode();
      localStorage.setItem('userId', userId);
      await sendRequest(userId, requestCode);
      toast({
        title: "მოთხოვნა გაგზავნილია",
        description: `თქვენი კოდია: ${requestCode}`,
      });
    } catch (error) {
      toast({
        title: "შეცდომა",
        description: "მოთხოვნის გაგზავნა ვერ მოხერხდა",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleRequest} 
        disabled={isLoading}
        className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105 animate-fade-in"
      >
        {isLoading ? "იგზავნება..." : "მოთხოვნის გაგზავნა"}
      </Button>
      <div className="flex justify-center">
        <a
          href="https://www.facebook.com/profile.php?id=61567812722184"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Facebook className="h-5 w-5" />
          <span>Facebook</span>
        </a>
      </div>
    </div>
  );
};