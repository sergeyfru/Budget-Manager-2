
import type { TransactionDetailed } from '@shared/core';
import { useTransactionStore } from '../../store/transactionsStore';
import { CustomIcon } from '../CustomIcons/CustomIcons';
import { EditDelete } from '../EditDelete/EditDelete';

interface TransactionItemProps {
  transaction: TransactionDetailed;
  showDate?: boolean;
}

export function TransactionItem({ transaction, showDate = false }: TransactionItemProps) {
  const {  deleteTransaction } = useTransactionStore();
  const category = transaction.user_category; // Assuming category is a property of TransactionDetailed

  const symbol = transaction.currency.currency_symbol || '₪'; // Default to ₪ if symbol is not available

  return (
    <div className="flex items-center gap-3 md:gap-4 py-3 md:py-4 group hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
      <div 
        className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0" 
        style={{ backgroundColor: category?.color + '20' }}
      >
        <CustomIcon name={category?.icon || 'DollarSign'} color={category?.color || '#666'} size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-3">
          <h4 className="truncate">{transaction.user_category.name}</h4>
          <p className={`flex-shrink-0 font-medium ${
            transaction.transaction_type.direction === 'in' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-foreground'
          }`}>
            {transaction.transaction_type.direction === 'in' ? '+' : ''}{transaction.transaction_amount.toFixed(2)}{" "}{symbol}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground truncate">
            {transaction.transaction_note || transaction.user_payment_method.name}
          </p>
          {showDate && (
            <p className="text-xs text-muted-foreground flex-shrink-0">
              {(new Date(transaction.date_of_transaction)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      <div className='flex flex-col justify-center items-center'>
        <EditDelete onEdit={() => {}} onDelete={() => deleteTransaction(transaction.transaction_id)} />
      </div>
    </div>
  );
}