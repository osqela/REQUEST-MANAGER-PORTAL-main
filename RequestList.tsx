import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRequests, approveRequest, denyRequest } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

export const RequestList = () => {
  const [requests, setRequests] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadRequests = async () => {
    const data = await getAllRequests();
    setRequests(data);
    setIsLoading(false);
  };

  const handleApprove = async (userId: string) => {
    try {
      await approveRequest(userId);
      toast({ title: "მოთხოვნა დადასტურებულია" });
      await loadRequests();
    } catch (error) {
      toast({ 
        title: "შეცდომა", 
        description: "დადასტურება ვერ მოხერხდა",
        variant: "destructive"
      });
    }
  };

  const handleDeny = async (userId: string) => {
    try {
      await denyRequest(userId);
      toast({ title: "მოთხოვნა უარყოფილია" });
      await loadRequests();
    } catch (error) {
      toast({ 
        title: "შეცდომა", 
        description: "უარყოფა ვერ მოხერხდა",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="text-center">იტვირთება...</div>;
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={() => navigate('/')}
        variant="outline"
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        უკან დაბრუნება
      </Button>
      
      {Object.entries(requests).map(([userId, data]: [string, any]) => (
        <div 
          key={userId} 
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-between animate-fade-in"
        >
          <div>
            <p className="text-sm font-medium mb-1">
              კოდი: {data.requestCode}
            </p>
            <p className="text-sm text-gray-500">
              მომხმარებელი: {userId.slice(0, 8)}...
            </p>
            <p className="text-sm text-gray-500">
              დრო: {new Date(data.timestamp).toLocaleString('ka-GE')}
            </p>
            <p className="text-sm font-medium">
              სტატუსი: {data.status === 'pending' ? 'მოლოდინში' : 'დადასტურებული'}
            </p>
          </div>
          <div className="space-x-2">
            {data.status === 'pending' && (
              <>
                <Button
                  onClick={() => handleApprove(userId)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  დადასტურება
                </Button>
                <Button
                  onClick={() => handleDeny(userId)}
                  variant="destructive"
                >
                  უარყოფა
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
      {Object.keys(requests).length === 0 && (
        <div className="text-center text-gray-500">
          მოთხოვნები არ არის
        </div>
      )}
    </div>
  );
};