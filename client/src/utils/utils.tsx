import { Suspense } from "react";
import { Spinner } from "../components/Loading/Spiner";

export const withSuspense = (component: React.ReactNode) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center w-full h-full min-h-[90vh]">
        <Spinner size={64} />
      </div>
    }
  >
    {component}
  </Suspense>
);

