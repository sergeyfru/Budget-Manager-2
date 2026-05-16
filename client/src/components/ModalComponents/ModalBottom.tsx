
interface ModalBottomProps{
    closeModal:()=> void;
    title:string;
    disabled:boolean;
}
export const ModalBottom = ({closeModal,title,disabled} :ModalBottomProps)=>{
    return(
        <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 h-12 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={disabled}
              type="submit"
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground hover:opacity-70 transition-opacity"
            >
              {title}
            </button>
          </div>
    )
}