import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AddClassDialog } from '@/components/ClassManagement/AddClassDialog';
import { StudentList } from '@/components/ClassManagement/StudentList';
import { Search, Maximize2, Minimize2, Facebook } from 'lucide-react';

interface Class {
  name: string;
  students: string[];
}

const Content = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [displayedStudents, setDisplayedStudents] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[][]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const savedClasses = localStorage.getItem('classes');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error("გთხოვთ შეიყვანოთ საძიებო სიტყვა");
      return;
    }

    const foundClass = classes.find(c => c.name === searchTerm);
    if (foundClass) {
      setDisplayedStudents(prev => {
        const newStudents = [...new Set([...prev, ...foundClass.students])];
        toast.success("კლასი დაემატა");
        return newStudents;
      });
      return;
    }

    if (!displayedStudents.includes(searchTerm)) {
      setDisplayedStudents(prev => [...prev, searchTerm]);
      toast.success("მოსწავლე დაემატა", {
        className: "animate-fade-in"
      });
    } else {
      toast.error("მოსწავლე უკვე დამატებულია");
    }
  };

  const createGroups = (size: number) => {
    if (displayedStudents.length === 0) {
      toast.error("ჯერ აირჩიეთ მოსწავლეები");
      return;
    }

    const shuffled = [...displayedStudents].sort(() => Math.random() - 0.5);
    const numberOfGroups = Math.ceil(shuffled.length / size);
    const newGroups: string[][] = Array.from({ length: numberOfGroups }, () => []);
    
    let currentIndex = 0;
    shuffled.forEach((student) => {
      newGroups[currentIndex].push(student);
      currentIndex = (currentIndex + 1) % numberOfGroups;
    });

    setGroups(newGroups);
    toast.success(`${size} კაციანი ჯგუფები შეიქმნა`);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-green-200 p-4">
      <div className={`transition-all duration-500 ${isExpanded ? 'opacity-0 pointer-events-none' : ''}`}>
        <div className="relative h-screen">
          {/* Search Bar - Top Left */}
          <div className="absolute top-4 left-4 w-64">
            <div className="relative">
              <Input
                placeholder="მოძებნეთ კლასი ან მოსწავლე"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12"
              />
              <Button 
                onClick={handleSearch} 
                className="absolute right-0 top-0 h-full bg-green-500 hover:bg-green-600"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add Class Button - Top Right */}
          <div className="absolute top-4 right-4">
            <AddClassDialog onAddClass={(name, students) => {
              setClasses(prev => [...prev, { name, students }]);
            }} />
          </div>

          {/* Facebook Link - Bottom Left */}
          <div className="absolute bottom-4 left-4">
            <a
              href="https://www.facebook.com/profile.php?id=61567812722184"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span className="hidden md:inline">Facebook</span>
            </a>
          </div>

          {/* Main Content Area */}
          <div className="pt-20 pb-16">
            {displayedStudents.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-4">სულ მოსწავლეები: {displayedStudents.length}</h2>
                <StudentList
                  students={displayedStudents}
                  onRemoveStudent={(index) => {
                    setDisplayedStudents(prev => prev.filter((_, i) => i !== index));
                  }}
                  className="mb-4"
                />
              </div>
            )}

            {displayedStudents.length > 5 && (
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="flex gap-2 justify-center flex-wrap">
                  {[2, 3, 4, 5, 6, 7].map((size) => (
                    <Button
                      key={size}
                      onClick={() => createGroups(size)}
                      className={`w-12 h-12 rounded-full ${
                        size === 4 ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="relative">
          <Button
            onClick={toggleExpand}
            className="fixed top-4 right-4 z-50 bg-blue-500 hover:bg-blue-600"
          >
            {isExpanded ? <Minimize2 /> : <Maximize2 />}
          </Button>
          <div className={`
            transition-all duration-500 ease-in-out
            ${isExpanded ? 
              'fixed inset-0 z-40 bg-white overflow-auto p-8' : 
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            }
          `}>
            {groups.map((group, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 animate-fade-in">
                <h3 className="font-bold mb-2">ჯგუფი {index + 1}</h3>
                <StudentList students={group} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
