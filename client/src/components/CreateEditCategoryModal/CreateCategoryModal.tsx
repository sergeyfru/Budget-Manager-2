import { zodResolver } from "@hookform/resolvers/zod";
import { createUserCategoryFormSchema, type CreateUserCategoryForm } from "@shared/core";
import { useForm } from "react-hook-form";
import { useCategoriesStore } from "../../store/categoriesStore";
import { set } from "zod";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { CustomIcon } from "../CustomIcons/CustomIcons";

const iconOptions = [
  "ShoppingCart",
  "Car",
  "Tv",
  "FileText",
  "Coffee",
  "ShoppingBag",
  "Heart",
  "Briefcase",
  "Code",
  "TrendingUp",
  "Home",
  "Plane",
  "Book",
  "Music",
  "Dumbbell",
  "Gift",
  "Phone",
  "Laptop",
];

const colorOptions = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
];

interface CreateCategoryModalProps {
  addModalOpen: boolean;
  setAddModalOpen: (addModalOpen: boolean) => void;
}
export const CreateCategoryModal = (props: CreateCategoryModalProps) => {
  const { addModalOpen, setAddModalOpen } = props;
  const categoryStore = useCategoriesStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    watch,
  } = useForm<CreateUserCategoryForm>({
    resolver: zodResolver(createUserCategoryFormSchema),
    defaultValues:{
      user_category_allowed_direction: "both",
    }
  });
  const onSubmit = async (data: CreateUserCategoryForm) => {
    console.log("Submitting create category form with data:", data);

    try {
      await categoryStore.createUserCategory(data);
      setAddModalOpen(!addModalOpen);
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

  const selectedIcon = watch("user_category_icon")
  const selectedColor = watch("user_category_color")

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-card rounded-t-3xl sm:rounded-3xl p-6 md:p-8 w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center gap-3 mb-6">

        <h1 className="">
          {/* <CustomIcon name="Plus" size={24} /> */}
          Add Category
        </h1>
        <button onClick={() => setAddModalOpen(!addModalOpen)} className="ml-auto p-2 rounded-md hover:bg-muted transition-colors">
          <CustomIcon name="X" size={20}/>
        </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
          {/* Type Toggle */}

          {/* <div className="flex gap-2 p-1 bg-muted rounded-xl"></div> // This is where the toggle buttons for "Expense" and "Income" would go. */}

          {/* Name Input */}
          <div>
            <label className="block mb-3">Category Name</label>
            <input
              type="text"
              {...register("user_category_name")}
              placeholder="e.g., Groceries"
              className={`w-full p-4 md:p-5 rounded-xl border border-border bg-background focus:border-primary transition-colors
                 ${errors.user_category_name 
              ? 'border-destructive focus:border-destructive' 
              : 'border-transparent focus:border-primary focus:bg-card'
            }`}
            />
            {errors.user_category_name && (
              <p className="mt-1 text-sm text-red-500">{errors.user_category_name.message}</p>
            )}
          </div>

          {/* Icon Selection */}
          <div>
            <label className={`block mb-4 ${errors.user_category_icon ? 'text-red-500' : 'text-muted-foreground'}`}>Icon</label>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 md:gap-6">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={()=> setValue("user_category_icon", icon)}
                  className={`p-3 md:p-4 rounded-xl border-2 transition-all hover:scale-110 ${
                  selectedIcon === icon
                      ? "border-primary bg-primary/5 scale-110"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <CustomIcon name={icon} size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block mb-4">Color</label>
            <div className="grid grid-cols-5 gap-3 md:gap-4">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={()=> setValue("user_category_color", color)}
                  className={`w-full aspect-square rounded-xl border-2 transition-all hover:scale-110 ${
                   selectedColor === color ? "border-primary ring-4 ring-primary/20" : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 md:gap-4 pt-4">
            <button
              type="button"
              onClick={() => setAddModalOpen(!addModalOpen)}
              className="flex-1 py-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
