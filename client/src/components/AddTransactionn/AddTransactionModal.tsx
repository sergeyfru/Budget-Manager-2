
import { X, Calendar as CalendarIcon, DollarSign } from 'lucide-react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransactionModal({ open, onOpenChange }: AddTransactionModalProps) {
    
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to the server)
    onOpenChange(false); // Close the modal after submission
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  };
if (!open) return null;
  return (
  <div className="max-w-[calc(100%-2rem)] sm:max-w-md rounded-2xl p-0 gap-0 max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border shadow-lg z-50">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">Add Transaction</h2>
            <button
              onClick={handleCancel}
              className="rounded-full p-2 hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Amount & Currency */}
        </form>
      </div>
  );
}
