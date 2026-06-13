import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTransactionFormSchema,
  type ReqCreateTransaction,
  type TransactionDB,
  type UserCategoryDB,
  type UserPaymentMethodDB,
} from "@shared/core";
import { useForm } from "react-hook-form";
import { useTransactionStore } from "../../store/transactionsStore";
import { useEffect } from "react";
import { usePaymentMethodsStore } from "../../store/paymentMethodsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useCategoriesStore } from "../../store/categoriesStore";
import { useModalsStore } from "../../store/modalsStore";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { ModalFormContainer } from "../ModalComponents/ModalContainer";
import { TypeComponent } from "../AddEdditTransactionComponents/TypeComponent";
import { AmountComponent } from "../AddEdditTransactionComponents/AmountComponent";
import { SelectComponent } from "../AddEdditTransactionComponents/SelectComponent";
import { DateComponent } from "../AddEdditTransactionComponents/DateComponent";
import { NotesComponent } from "../AddEdditTransactionComponents/NotesComponent";
import { AdvancedSettingsComponent } from "../AddEdditTransactionComponents/AdvancedSettingsComponent.tsx";

interface AddTransactionModalProps {
  dataForUpdate: TransactionDB | null;
}

const AddTransactionModal = ({ dataForUpdate }: AddTransactionModalProps) => {
  const isEditing = !!dataForUpdate;
  console.log("RENDERING");

  const { addTransaction, updateTransaction } = useTransactionStore();
  const { paymentMethodsStatus, paymentMethods } = usePaymentMethodsStore();
  const { categories, categoriesStatus } = useCategoriesStore();
  const { defaultCurrency } = useSettingsStore();
  const { resetTransactionModalStore } = useModalsStore();

  useEffect(() => {
    if (dataForUpdate) {
      reset({
        ...dataForUpdate,
        date_of_transaction: dataForUpdate.date_of_transaction,
      });
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(createTransactionFormSchema),
    defaultValues: {
      transaction_currency_id: defaultCurrency.currency_id,
      date_of_transaction: new Date().toISOString().split("T")[0],
      fx_rate_to_base: 1,
      base_currency_id: defaultCurrency.currency_id,
    },
  });


  const onFormSubmit = async (data: ReqCreateTransaction) => {
    try {
      if (isEditing && dataForUpdate) {
        const dataChanged = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => value !== dataForUpdate[key as keyof typeof dataForUpdate]),
        );
        updateTransaction(dataForUpdate.transaction_id, dataChanged);
      } else {
        addTransaction(data);
      }
      closeModal();
    } catch (err: any) {
      const data = (err as AxiosError)?.response?.data || err;
      if (data?.errors) {
        data.errors.forEach((e: any) => {
          console.log(e.field, { message: e.message });
          setError(e.field, { message: `${e.message}` });
        });
        return;
      }
      if (data?.message) {
        toast.error(data.message);
        return;
      }
      toast.error("An unexpected error occurred");
      console.error("Login error:", data);
    }
  };

  const closeModal = () => {
    resetTransactionModalStore();
  };

  return (
    <ModalFormContainer
      title={isEditing ? "Update Transaction" : "Add Transaction"}
      closeModal={closeModal}
      disabled={isSubmitting}
      onSubmit={handleSubmit(onFormSubmit)}
      fullScreen
    >
      <TypeComponent control={control} errors={errors} />

      <AmountComponent
        watch={watch}
        errors={errors}
        register={register}
        defaultCurrency={defaultCurrency}
        setValue={setValue}
        dataForUpdate={dataForUpdate}
      />

      <SelectComponent<UserCategoryDB>
        title="Category *"
        error={errors.user_category_id}
        selectorStatus={categoriesStatus}
        labelKey="user_category_name"
        valueKey="user_category_id"
        selectOptions={categories}
        registration={register("user_category_id", { valueAsNumber: true })}
      />

      <SelectComponent<UserPaymentMethodDB>
        title="Payment Method *"
        error={errors.user_payment_method_id}
        selectorStatus={paymentMethodsStatus}
        labelKey="user_payment_method_name"
        valueKey="user_payment_method_id"
        selectOptions={paymentMethods}
        registration={register("user_payment_method_id", { valueAsNumber: true })}
      />

      <DateComponent errors={errors} register={register} />

      <NotesComponent errors={errors} register={register} />

      <AdvancedSettingsComponent />
    </ModalFormContainer>
  );
};

export default AddTransactionModal;
