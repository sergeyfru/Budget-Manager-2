

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransactionModal({ open, onOpenChange }: AddTransactionModalProps) {

  // const {register, handleSubmit, setValue} = useForm<CreateUserCategoryForm>({

  // })
    
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form clicked as submitted with data: ",{

    });
    // Handle form submission logic here (e.g., send data to the server)
    onOpenChange(false); // Close the modal after submission
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  };

if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-lg">

    {/* Header */}
    <div className="p-6 pb-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Add Transaction</h2>
        <button onClick={handleCancel} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
          ✕
        </button>
      </div>
    </div>

    {/* Form */}
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-6">

      {/* Type Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 py-3 rounded-xl font-medium bg-red-500 text-white shadow-md"
        >
          Expense
        </button>
        <button
          type="button"
          className="flex-1 py-3 rounded-xl font-medium bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          Income
        </button>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Amount *</label>

        <div className="relative">
          {/* Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            $
          </div>

          {/* Input */}
          <input
            type="number"
            placeholder="0.00"
            className="w-full text-3xl h-16 pl-12 pr-24 font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Currency */}
          <select className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-2 rounded-md bg-gray-100 text-sm">
            <option>USD</option>
            <option>EUR</option>
            <option>ILS</option>
          </select>
        </div>

        {/* Error */}
        <p className="text-sm text-red-500">Error message</p>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category *</label>
        <select className="w-full h-12 px-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Select a category</option>
          <option>Food</option>
          <option>Transport</option>
        </select>
        <p className="text-sm text-red-500">Error message</p>
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Payment Method</label>
        <select className="w-full h-12 px-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>Cash</option>
          <option>Bank Transfer</option>
          <option>PayPal</option>
        </select>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <input
          type="date"
          className="w-full h-12 px-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes (optional)</label>
        <textarea
          className="w-full h-20 px-3 py-2 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add any additional notes..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          className="flex-1 h-12 border rounded-xl hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"

          className="flex-1 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </div>
    </form>
  </div>
</div>
  );
}
