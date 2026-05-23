import { useEffect, useState } from "react";
import { useCategoriesStore } from "../../store/categoriesStore";
import { CreateEditCategoryModal } from "../CreateEditCategoryModal/CreateEditCategoryModal";
import { CustomIcon } from "../CustomIcons/CustomIcons";
import { EditDelete } from "../EditDelete/EditDelete";
import { Loader } from "../Loading/Loader";
import type { UserCategoryDB } from "@shared/core";
import { CardsTitleInSettings } from "../CardsTitleInSettings/CardsTitleInSettings";

export const CategoriesCard = () => {
  const categoriesStore = useCategoriesStore();
  const categories = categoriesStore.categories;

  useEffect(() => {
    if (categoriesStore.categories.length === 0) {
      categoriesStore.getUserCategories();
    }
  }, [categoriesStore.categories.length]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<UserCategoryDB>();
  const [callapseCategoriesCard, setCallapseCategoriesCard] = useState(true);

  const openCard = () => {
    setCallapseCategoriesCard(!callapseCategoriesCard);
  };

  const handleEdit = (category: UserCategoryDB) => {
    setFormData(category);
    setShowAddModal(true);
  };

  const refreshCategories = () => {
    setCallapseCategoriesCard(false);
    categoriesStore.getUserCategories();
  };

  const closeModal = () => {
    setFormData(undefined);
    setShowAddModal(false);
  };

  const handleDelete = (user_category_id: number) => {
    useCategoriesStore.getState().deleteUserCategory(user_category_id);
  };

  return (
    <div className="bg-card flex flex-col gap-4 border border-border rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm">
      <CardsTitleInSettings
        title="Categories"
        cardIsClose={callapseCategoriesCard}
        setCardIsClose={openCard}
        refreshCard={refreshCategories}
        setShowAddModal={setShowAddModal}
      />

      {!callapseCategoriesCard && (
        <div>
          <Loader loading={categoriesStore.categoriesStatus === "loading"} center size={48}>
            {categoriesStore.categoriesStatus === "error" ? <p>Something went wrong.</p> : null}
            {categories.length === 0 ? (
              <div className="flex flex-col gap-2 items-center">
                <p className="text-sm text-muted-foreground">No categories yet. Click "Add" to create one!</p>
                <button
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0"
                  onClick={() => setShowAddModal(true)}
                >
                  <CustomIcon name={"Plus"} />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.user_category_id}
                    className="flex items-center gap-4 p-4 md:p-3 bg-card rounded-xl border border-border shadow-sm group hover:shadow-md transition-all"
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
                    <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                      <EditDelete
                        onEdit={() => handleEdit(category)}
                        onDelete={() => handleDelete(category.user_category_id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Loader>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <CreateEditCategoryModal 
          addModalOpen={showAddModal} 
          setAddModalOpen={closeModal} 
          dataForUpdate={formData} />
      )}
    </div>
  );
};
