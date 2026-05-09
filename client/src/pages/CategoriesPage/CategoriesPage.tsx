import { useEffect, useState } from "react";
import { useCategoriesStore } from "../../store/categoriesStore";
import { CustomIcon } from "../../components/CustomIcons/CustomIcons";
import type {  UserCategoryDB } from "@shared/core";
import { CreateEditCategoryModal } from "../../components/CreateEditCategoryModal/CreateEditCategoryModal";
import { EditDelete } from "../../components/EditDelete/EditDelete";
import { Loader } from "../../components/Loading/Loader";
import { Plus } from "lucide-react";

export const CategoriesPage = () => {
  const categoriesStore = useCategoriesStore();
  const categories = categoriesStore.categories;

  useEffect(() => {
    // document.title = "Budget Manager - Categories";
    if (categoriesStore.categories.length === 0) {
      categoriesStore.getUserCategories();
    }

    // if (categoriesStore.defaultCategories.length === 0) {
    //   categoriesStore.getDefaultCategories();
    // }
  }, [categoriesStore.categories.length]);

  // const { categories, addCategory, updateCategory, deleteCategory } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<UserCategoryDB>();


  const handleEdit = (category:UserCategoryDB) => {

      setFormData(category)
      setShowAddModal(true);
    
  };

  const closeModal = ()=>{
    setFormData(undefined)
    setShowAddModal(false)
  }

  const handleDelete = (user_category_id: number) => {
    useCategoriesStore.getState().deleteUserCategory(user_category_id);
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
                      onEdit={() => handleEdit(category)}
                      onDelete={() => handleDelete(category.user_category_id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Loader>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && 
      <CreateEditCategoryModal 
          addModalOpen={showAddModal} 
          setAddModalOpen={closeModal} 
          dataForUpdate={formData}
          />}
    </div>
  );
};
