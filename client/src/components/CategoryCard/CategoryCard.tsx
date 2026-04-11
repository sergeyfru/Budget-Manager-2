import type { UserCategoryDB } from "@shared/core";
import { CustomIcon } from "../CustomIcons/CustomIcons";

export const CategoryCard = ({
  category,
}: {
  category: UserCategoryDB;
}) => {
  return (
    <div
      key={category.user_category_id}
      className="
        aspect-square
        rounded-lg
        border
        flex flex-col items-center justify-center
        gap-1
        p-2
        text-xs
        hover:shadow-md
        transition
      "
    >
      <div
        className="w-15 h-15  flex items-center justify-center"
        style={{ backgroundColor: category.user_category_color }} 
      >
        <CustomIcon name={category.user_category_icon || ''} color="" size={10} />
      </div>

      <div className="text-center truncate w-full">
        {category.user_category_name}
      </div>
    </div>
  );
};
