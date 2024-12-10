import { RequestList } from '@/components/RequestList';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">მოთხოვნების მართვა</h1>
        <RequestList />
      </div>
    </div>
  );
};

export default Admin;