
import { Greeting } from "../../components/Greeting/Greeting";

export const CategoriesPage = () => {

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <Greeting
        title="Categories"
        subtitle="Manage your transaction categories"
        
      />

      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 justify-center">
            <h2 className="">The functionality has been moved to the settings page.</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
