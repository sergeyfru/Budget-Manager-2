import { useEffect, useState } from "react";
import { useCategoriesStore } from "../../store/categoriesStore";
import { CustomIcon } from "../../components/CustomIcons/CustomIcons";
import { useAuthStore } from "../../store/authStore";
import type { ReqCreateUserCategory } from "@shared/core";
import { CreateCategoryModal } from "../../components/CreateEditCategoryModal/CreateCategoryModal";
import { EditDelete } from "../../components/EditDelete/EditDelete";
import { Loader } from "../../components/Loading/Loader";
import { Plus } from "lucide-react";

export const CategoriesPage = () => {
  const authStore = useAuthStore();
  const categoriesStore = useCategoriesStore();
  const categories = categoriesStore.categories;

  useEffect(() => {
    // document.title = "Budget Manager - Categories";
    if (categoriesStore.categories.length === 0) {
      categoriesStore.getUserCategories();
    }
    if (categoriesStore.defaultCategories.length === 0) {
      categoriesStore.getDefaultCategories();
    }
  }, [categoriesStore.categories.length, categoriesStore.defaultCategories.length]);

  // const { categories, addCategory, updateCategory, deleteCategory } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ReqCreateUserCategory>({
    user_category_name: "",
    user_category_allowed_direction: "both",

    user_category_color: "",
    user_category_icon: "",
  });
  console.log("I don't use editingId or formData now, but here they are to prevent unused variable warnings:", { editingId, formData });

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.user_category_name.trim()) {
  //     toast.error('Please enter a category name');
  //     return;
  //   }

  //   if (editingId) {
  //     useCategoriesStore.getState().updateUserCategory(parseInt(editingId), formData);
  //   } else {
  //     useCategoriesStore.getState().createUserCategory(formData);
  //     toast.success('Category added!');
  //   }

  //   setShowAddModal(false);
  //   setEditingId(null);
  //   setFormData({ user_id: authStore.user?.user_id || 1, user_category_name: '', user_category_icon: 'ShoppingCart', user_category_color: '#10b981', user_category_allowed_direction: 'out' });
  // };

  const handleEdit = (user_category_id: number) => {
    const category = categoriesStore.categories.find((c) => c.user_category_id === user_category_id);
    if (category) {
      setFormData({
        user_id: authStore.user?.user_id || 1,
        user_category_name: category.user_category_name,
        user_category_icon: category.user_category_icon,
        user_category_color: category.user_category_color,
        user_category_allowed_direction: category.user_category_allowed_direction,
      });
      setEditingId(user_category_id.toString());
      setShowAddModal(true);
    }
  };

  const handleDelete = (user_category_id: number) => {
    useCategoriesStore.getState().deleteUserCategory(user_category_id);
    // toast.success('Category deleted!');
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2">Categories</h1>
              <p className="text-muted-foreground">Manage your transaction categories</p>
            </div>
            <button
              onClick={() => {
                setShowAddModal(true);
                setEditingId(null);
                setFormData({
                  user_id: authStore.user?.user_id || 1,
                  user_category_name: "",
                  user_category_icon: "ShoppingCart",
                  user_category_color: "#10b981",
                  user_category_allowed_direction: "out",
                });
              }}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8">
        {/* Categories Grid */}
        <h3 className="mb-4 text-muted-foreground">Categories</h3>
        {/* Expense Categories */}
        <div>
          <Loader loading={categoriesStore.categoriesStatus === "loading"} center size={48}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-4">
              {categoriesStore.categoriesStatus === "success" && categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories yet. Click "Add" to create one!</p>
              ) : null}
              {categories.map((category) => (
                <div
                  key={category.user_category_id}
                  className="flex items-center gap-4 p-4 md:p-5 bg-card rounded-xl border border-border shadow-sm group hover:shadow-md transition-all"
                >
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: category.user_category_color + "20" }}
                  >
                    <CustomIcon
                      name={category.user_category_icon || ""}
                      color={category.user_category_color}
                      size={24}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate">{category.user_category_name}</h4>
                  </div>
                  <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                    <EditDelete
                      onEdit={() => handleEdit(category.user_category_id)}
                      onDelete={() => handleDelete(category.user_category_id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Loader>
          {/* </div> */}

          {/* Income Categories */}
          {/* <div>
            <h3 className="mb-4 text-muted-foreground">Income</h3>
            <div className="space-y-3">
              {incomeCategories.map((category) => (
                <div
                  key={category.user_category_id}
                  className="flex items-center gap-4 p-4 md:p-5 bg-card rounded-xl border border-border shadow-sm group hover:shadow-md transition-all"
                >
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: category.user_category_color + '20' }}
                  >
                    <CustomIcon name={category.user_category_icon || ''} color={category.user_category_color} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate">{category.user_category_name}</h4>
                  </div>
                  <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(category.user_category_id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.user_category_id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && <CreateCategoryModal addModalOpen={showAddModal} setAddModalOpen={setShowAddModal} />}
    </div>
  );
};
