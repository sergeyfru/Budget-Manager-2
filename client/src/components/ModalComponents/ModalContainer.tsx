import type { ReactNode } from "react";
import { ModalTitle } from "./ModalTitle";
import { ModalBottom } from "./ModalBottom";

interface ModalFormContainerProps {
  children: ReactNode;
  title: string;
  closeModal: () => void;
  disabled: boolean;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  buttonTitle?: string;
}

export const ModalFormContainer = ({
  children,
  title,
  closeModal,
  disabled,
  onSubmit,
  buttonTitle,
}: ModalFormContainerProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-3 pb-20 sm:p-4 sm:pb-18 md:pb-20 lg:pb-4">
      <div className="w-full max-w-md max-h-[85vh] md:max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-lg">
        <ModalTitle title={title} closeModal={closeModal} />
        {onSubmit && (
          <form onSubmit={onSubmit} className="p-6 space-y-6">
            {children}

            <ModalBottom title={buttonTitle || title} closeModal={closeModal} disabled={disabled} />
          </form>
        )}
        
        {!onSubmit && (
          <div className="p-6 space-y-6">
            {children}

            <ModalBottom title={buttonTitle || title} closeModal={closeModal} disabled={disabled} />
          </div>
        )}
      </div>
    </div>
  );
};
