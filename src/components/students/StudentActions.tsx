
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddStudentForm from './AddStudentForm';

interface StudentActionsProps {
  onStudentAdded: () => void;
}

const StudentActions = ({ onStudentAdded }: StudentActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <AddStudentForm onStudentAdded={onStudentAdded} />
    </div>
  );
};

export default StudentActions;
