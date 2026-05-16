import { zodResolver } from "@hookform/resolvers/zod";
import { createUserCategoryFormSchema, type CreateUserCategoryForm, type UserCategoryDB } from "@shared/core";
import { useForm } from "react-hook-form";
import { useCategoriesStore } from "../../store/categoriesStore";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { CustomIcon } from "../CustomIcons/CustomIcons";
import { useEffect } from "react";
import { iconCategoriesOptions, colorOptions } from "../../constants/constants";
import { ModalTitle } from "../ModalComponents/ModalTitle";
import { ModalBottom } from "../ModalComponents/ModalBottom";

interface CreateEditCategoryModalProps {
  addModalOpen: boolean;
  setAddModalOpen: () => void;
  dataForUpdate: UserCategoryDB | undefined;
}
export const CreateEditCategoryModal = ({ setAddModalOpen, dataForUpdate }: CreateEditCategoryModalProps) => {
  const categoryStore = useCategoriesStore();

  const isEditMode = !!dataForUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    watch,
    reset,
  } = useForm<CreateUserCategoryForm>({
    resolver: zodResolver(createUserCategoryFormSchema),
    defaultValues: {
      user_category_allowed_direction: "both",
    },
  });
  
  useEffect(() => {
    if (dataForUpdate) {
      reset(dataForUpdate);
    }
  }, []);

  const onSubmit = async (data: CreateUserCategoryForm) => {
    try {
      if (isEditMode && dataForUpdate) {
        const dataChanged = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => value !== dataForUpdate[key as keyof typeof dataForUpdate]),
        );
        await categoryStore.updateUserCategory(dataForUpdate.user_category_id, dataChanged);
        setAddModalOpen();
      } else {
        await categoryStore.createUserCategory(data);
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

  const selectedIcon = watch("user_category_icon");
  const selectedColor = watch("user_category_color");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-3 pb-20 sm:p-4 sm:pb-18 md:pb-20 lg:pb-4">
      <div className="w-full max-w-md max-h-[85vh] md:max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-lg">
        <ModalTitle title={isEditMode ? "Update category" : "Create category"} closeModal={setAddModalOpen} />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 md:space-y-8">
          {/* Type Toggle */}

          {/* Name Input */}
          <div>
            <label className="block mb-3">Category Name</label>
            <input
              type="text"
              {...register("user_category_name")}
              placeholder="e.g., Groceries"
              className={`w-full p-4 md:p-5 rounded-xl border border-border bg-background focus:border-primary transition-colors
                 ${
                   errors.user_category_name
                     ? "border-destructive focus:border-destructive"
                     : "border-transparent focus:border-primary focus:bg-card"
                 }`}
            />
            {errors.user_category_name && (
              <p className="mt-1 text-sm text-destructive-foreground">{errors.user_category_name.message}</p>
            )}
          </div>

          <div>
            <label
              className={`block mb-4 ${errors.user_category_icon ? "text-destructive-foreground" : "text-muted-foreground"}`}
            >
              Icon
            </label>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-2">
              {iconCategoriesOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setValue("user_category_icon", icon)}
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

            {errors.user_category_icon && (
              <p className="mt-1 text-sm text-destructive-foreground">{errors.user_category_icon.message}</p>
            )}
          </div>

          {/* Color Selection */}
          <div>
            <label
              className={`block mb-4 ${errors.user_category_color ? "text-destructive-foreground" : "text-muted-foreground"}`}
            >
              Color *
            </label>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("user_category_color", color)}
                  className={`w-full aspect-square rounded-xl border-2 transition-all hover:scale-110 ${
                    selectedColor === color ? "border-primary ring-4 ring-primary/20" : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {errors.user_category_color && (
              <p className="mt-1 text-sm text-destructive-foreground">{errors.user_category_color.message}</p>
            )}
          </div>

          <ModalBottom closeModal={setAddModalOpen} title={isEditMode? "Update category" : "Create category"} disabled={isSubmitting} />
        </form>
      </div>
    </div>
  );
};
