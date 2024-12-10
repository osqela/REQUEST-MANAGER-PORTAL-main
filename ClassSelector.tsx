interface ClassSelectorProps {
  selectedClass: string;
  classes: Array<{ name: string; students: string[] }>;
  onClassSelect: (className: string) => void;
}

export const ClassSelector = ({ selectedClass, classes, onClassSelect }: ClassSelectorProps) => {
  return (
    <div className="flex gap-4 justify-center my-4">
      {classes.map((classItem) => (
        <button
          key={classItem.name}
          onClick={() => onClassSelect(classItem.name)}
          className={`px-4 py-2 rounded-md ${
            selectedClass === classItem.name
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {classItem.name}
        </button>
      ))}
    </div>
  );
};