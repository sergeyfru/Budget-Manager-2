import { ModalFormContainer } from "../ModalComponents/ModalContainer";

interface ChangeDefaultCurrencyModalProps {
  setModalOpen: (showModal: boolean) => void;
}

export const ChangeDefaultCurrencyModal = ({ setModalOpen }: ChangeDefaultCurrencyModalProps) => {

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors, isSubmitting },
  //   setError,
  // } = useForm<ReqChangePassword>({
  //   resolver: zodResolver(reqChangePasswordSchema),
  // });


  const closeModal = () => {

    setModalOpen(false);
  };

  return (
    <ModalFormContainer
      title="Select default currency"
      closeModal={closeModal}
      disabled={true}
      buttonTitle="Save"
    >
      <div>We are working on this section.</div>
    </ModalFormContainer>
  );
};
