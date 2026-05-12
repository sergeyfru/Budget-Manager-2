import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserPaymentMethodFormSchema,
  type CreateUserPaymentMethodForm,
  type UserPaymentMethodDB,
} from "@shared/core";
import { useForm } from "react-hook-form";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { CustomIcon } from "../CustomIcons/CustomIcons";
import { useEffect } from "react";
import { iconPaymentMethodsOptions, colorOptions } from "../../constants/constants";
import { TitleModal } from "../ModalComponents/TitleModale";
import { usePaymentMethodsStore } from "../../store/paymentMethodsStore";

interface CreateEditPaymentMethodModalProps {
  addModalOpen: boolean;
  setAddModalOpen: () => void;
  dataForUpdate: UserPaymentMethodDB | undefined;
}
export const CreateEditPaymentMethodModal = ({ setAddModalOpen, dataForUpdate }: CreateEditPaymentMethodModalProps) => {
  const paymentMethodsStore = usePaymentMethodsStore();

  const isEditMode = !!dataForUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    watch,
    reset,
  } = useForm<CreateUserPaymentMethodForm>({
    resolver: zodResolver(createUserPaymentMethodFormSchema),
  });
  useEffect(() => {
    if (dataForUpdate) {
      reset(dataForUpdate);
    }
  }, []);

  const onSubmit = async (data: CreateUserPaymentMethodForm) => {
    try {
      if (isEditMode && dataForUpdate) {
        const dataChanged = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => value !== dataForUpdate[key as keyof typeof dataForUpdate]),
        );
        await paymentMethodsStore.updateUserPaymentMethod(dataForUpdate.user_payment_method_id, dataChanged);
        setAddModalOpen();
      } else {
        await paymentMethodsStore.createUserPaymentMethod(data);
        setAddModalOpen();
      }
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

  const selectedIcon = watch("user_payment_method_icon");
  const selectedColor = watch("user_payment_method_color");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-3 pb-20 sm:p-4 sm:pb-18 md:pb-20 lg:pb-4">
      <div className="w-full max-w-md max-h-[85vh] md:max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-lg">
        <TitleModal
          title={isEditMode ? "Update payment method" : "Create payment method"}
          closeModal={setAddModalOpen}
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 md:space-y-8">
          {/* Type Toggle */}

          {/* Name Input */}
          <div>
            <label className="block mb-3">Payment Method Name</label>
            <input
              type="text"
              {...register("user_payment_method_name")}
              placeholder="e.g., Groceries"
              className={`w-full p-4 md:p-5 rounded-xl border border-border bg-background focus:border-primary transition-colors
                 ${
                   errors.user_payment_method_name
                     ? "border-destructive focus:border-destructive"
                     : "border-transparent focus:border-primary focus:bg-card"
                 }`}
            />
            {errors.user_payment_method_name && (
              <p className="mt-1 text-sm text-destructive-foreground">{errors.user_payment_method_name.message}</p>
            )}
          </div>

          <div>
            <label
              className={`block mb-4 ${errors.user_payment_method_icon ? "text-destructive-foreground" : "text-muted-foreground"}`}
            >
              Icon
            </label>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-2">
              {iconPaymentMethodsOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setValue("user_payment_method_icon", icon)}
                  className={`
                    flex items-center justify-center
                    size-18 rounded-xl border
                    bg-card text-foreground
                    transition-all duration-200
                    hover:bg-accent
                    hover:border-muted-foreground
                    ${
                      selectedIcon === icon
                        ? "border-primary bg-primary text-primary-foreground hover:text-primary shadow-sm scale-105"
                        : "border-border hover:border-muted-foreground"
                    }`}
                >
                  <CustomIcon name={icon} size={35} />
                </button>
              ))}
            </div>

            {errors.user_payment_method_icon && (
              <p className="mt-1 text-sm text-destructive-foreground">{errors.user_payment_method_icon.message}</p>
            )}
          </div>

          {/* Color Selection */}
          <div>
            <label
              className={`block mb-4 ${errors.user_payment_method_color ? "text-destructive-foreground" : "text-muted-foreground"}`}
            >
              Color *
            </label>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("user_payment_method_color", color)}
                  className={`w-full aspect-square rounded-xl border-2 transition-all hover:scale-110 ${
                    selectedColor === color ? "border-primary ring-4 ring-primary/20" : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {errors.user_payment_method_color && (
              <p className="mt-1 text-sm text-destructive-foreground">{errors.user_payment_method_color.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 md:gap-4 pt-4">
            <button
              type="button"
              onClick={() => setAddModalOpen()}
              className="flex-1 py-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>

            <button
              disabled={isSubmitting}
              type="submit"
              className="flex-1 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all"
            >
              {!dataForUpdate ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
