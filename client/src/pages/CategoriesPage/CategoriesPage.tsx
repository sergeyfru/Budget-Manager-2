import {  useEffect, useState } from "react";
import { useCategoriesStore } from "../../store/categoriesStore";
import { CustomIcon } from "../../components/CustomIcons/CustomIcons";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../../store/authStore";
import type { ReqCreateUserCategory } from "@shared/core";

const iconOptions = [
  'ShoppingCart', 'Car', 'Tv', 'FileText', 'Coffee', 'ShoppingBag',
  'Heart', 'Briefcase', 'Code', 'TrendingUp', 'Home', 'Plane',
  'Book', 'Music', 'Dumbbell', 'Gift', 'Phone', 'Laptop'
];
const colorOptions = [
  '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];
export const CategoriesPage = () => {
  const authStore = useAuthStore();
  const categoriesStore = useCategoriesStore();
  const expenseCategories = categoriesStore.getCategoriesByDirection("out");
  const incomeCategories = categoriesStore.getCategoriesByDirection("in");
  
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
    user_id: authStore.user?.user_id || 1,
    user_category_name: '',
    user_category_icon: 'ShoppingCart',
    user_category_color: '#10b981',
    user_category_direction: 'out',
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_category_name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    if (editingId) {
      useCategoriesStore.getState().updateUserCategory({ ...formData, user_category_id: parseInt(editingId) });
    } else {
      useCategoriesStore.getState().createUserCategory(formData);
      toast.success('Category added!');
    }

    setShowAddModal(false);
    setEditingId(null);
    setFormData({ user_id: authStore.user?.user_id || 1, user_category_name: '', user_category_icon: 'ShoppingCart', user_category_color: '#10b981', user_category_direction: 'out' });
  };

  const handleEdit = (user_category_id: number) => {
    const category = categoriesStore.categories.find(c => c.user_category_id === user_category_id);
    if (category) {
      setFormData({
        user_id: authStore.user?.user_id || 1,
        user_category_name: category.user_category_name,
        user_category_icon: category.user_category_icon,
        user_category_color: category.user_category_color,
        user_category_direction: category.user_category_direction,
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
                setFormData({ user_id: authStore.user?.user_id || 1, user_category_name: '', user_category_icon: 'ShoppingCart', user_category_color: '#10b981', user_category_direction: 'out' });
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Expense Categories */}
          <div>
            <h3 className="mb-4 text-muted-foreground">Expenses</h3>
            <div className="space-y-3">
              {expenseCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No expense categories yet. Click "Add" to create one!</p>
              ) : null}
              {expenseCategories.map((category) => (
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
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
          </div>

          {/* Income Categories */}
          <div>
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
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-card rounded-t-3xl sm:rounded-3xl p-6 md:p-8 w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="mb-6 md:mb-8">{editingId ? 'Edit Category' : 'Add Category'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              {/* Type Toggle */}
              <div className="flex gap-2 p-1 bg-muted rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, user_category_direction: 'out' })}
                  className={`flex-1 py-3 md:py-4 rounded-lg transition-all ${
                    formData.user_category_direction === 'out'
                      ? 'bg-card shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, user_category_direction: 'in' })}
                  className={`flex-1 py-3 md:py-4 rounded-lg transition-all ${
                    formData.user_category_direction === 'in'
                      ? 'bg-card shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  Income
                </button>
              </div>

              {/* Name Input */}
              <div>
                <label className="block mb-3">Category Name</label>
                <input
                  type="text"
                  value={formData.user_category_name}
                  onChange={(e) => setFormData({ ...formData, user_category_name: e.target.value })}
                  placeholder="e.g., Groceries"
                  className="w-full p-4 md:p-5 rounded-xl border border-border bg-background focus:border-primary transition-colors"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block mb-4">Icon</label>
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 md:gap-3">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, user_category_icon: icon })}
                      className={`p-3 md:p-4 rounded-xl border-2 transition-all hover:scale-110 ${
                        formData.user_category_icon === icon
                          ? 'border-primary bg-primary/5 scale-110'
                          : 'border-border hover:border-muted-foreground'
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
                      onClick={() => setFormData({ ...formData, user_category_color: color })}
                      className={`w-full aspect-square rounded-xl border-2 transition-all hover:scale-110 ${
                        formData.user_category_color === color
                          ? 'border-primary ring-4 ring-primary/20'
                          : 'border-border'
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
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingId(null);
                  }}
                  className="flex-1 py-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}