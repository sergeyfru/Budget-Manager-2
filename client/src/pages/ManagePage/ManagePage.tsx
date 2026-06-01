
import { CategoriesCard } from "../../components/CategoriesCard/CategoriesCard";
import { Greeting } from "../../components/Greeting/Greeting";
import { PaymentMethodsCard } from "../../components/PaymentMethodsCard/PaymentMethodsCard";

export const ManagePage = () => {

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <Greeting
        title="Manage"
        subtitle="Manage your categories and payment methods"
      />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8 flex flex-col gap-3">
        <CategoriesCard />
        <PaymentMethodsCard />
      </div>
    </div>
  );
};
