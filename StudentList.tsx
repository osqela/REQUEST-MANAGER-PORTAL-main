import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface StudentListProps {
  students: string[];
  onRemoveStudent?: (index: number) => void;
  className?: string;
}

export const StudentList = ({ students, onRemoveStudent, className = "" }: StudentListProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {students.map((student, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
          <span>{student}</span>
          {onRemoveStudent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveStudent(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};