import { Edit2, Trash2 } from "lucide-react";

interface EditDeleteProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const EditDelete = ({ onEdit, onDelete }: EditDeleteProps) => {

  return (
    <>
      <button 
        className="p-2 hover:bg-muted rounded-lg transition-colors"
        onClick={onEdit}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        className="p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4 text-destructive" />
      </button>
    </>
  );
};
