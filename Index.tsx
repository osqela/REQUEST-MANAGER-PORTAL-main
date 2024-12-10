import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestButton } from '@/components/RequestButton';
import { checkUserStatus } from '@/lib/firebase';

const Index = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const status = await checkUserStatus(userId);
        if (status === 'approved') {
          navigate('/content');
        }
      }
      setIsChecking(false);
    };
    checkAccess();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">მოწმდება წვდომა...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="text-center max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">
          მოგესალმებით
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          წვდომის მისაღებად გთხოვთ გააგზავნოთ მოთხოვნა
        </p>
        <RequestButton />
      </div>
    </div>
  );
};

export default Index;