import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AddClassDialogProps {
  onAddClass: (className: string, students: string[]) => void;
}

export const AddClassDialog = ({ onAddClass }: AddClassDialogProps) => {
  const [className, setClassName] = useState("");
  const [studentsText, setStudentsText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddClass = () => {
    if (!className.trim()) {
      toast.error("გთხოვთ შეიყვანოთ კლასის ნომერი");
      return;
    }
    
    const studentsList = studentsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    if (studentsList.length < 2) {
      toast.error("გთხოვთ დაამატოთ მინიმუმ 2 მოსწავლე");
      return;
    }

    onAddClass(className, studentsList);
    setClassName("");
    setStudentsText("");
    setIsOpen(false);
    toast.success("კლასი წარმატებით დაემატა");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600">კლასის დამატება</Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>ახალი კლასის დამატება</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium mb-1">კლასის ნომერი</label>
            <Input
              placeholder="შეიყვანეთ კლასის ნომერი"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">მოსწავლეები</label>
            <Textarea
              placeholder="ჩაწერეთ მოსწავლეების სახელები (თითო ხაზზე თითო მოსწავლე)"
              value={studentsText}
              onChange={(e) => setStudentsText(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          <Button onClick={handleAddClass} className="w-full">დამატება</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};