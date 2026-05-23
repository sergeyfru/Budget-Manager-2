import { X } from "lucide-react";

interface ModalTitleProps {
  title: string;
  closeModal: () => void;
}
export const ModalTitle = ({ title, closeModal }: ModalTitleProps) => {
  return (
    <div className="p-6 pb-4 border-b border-border">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button onClick={() => closeModal()} className="rounded-full p-2 hover:bg-muted transition-colors">
          <X />
        </button>
      </div>
    </div>
  );
};
