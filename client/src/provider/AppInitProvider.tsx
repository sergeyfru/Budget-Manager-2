import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { transactionsApi } from "../api/trasactionsApi";
import { categoriesApi } from "../api/categoriesApi";


export function AppInitProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  

  useEffect(() => {
    // preload everything needed for app startup
    queryClient.prefetchQuery({
      queryKey: ["transaction-types"],
      queryFn: transactionsApi.getTransactionTypes,
    });
    queryClient.prefetchQuery({
      queryKey: ["user-categories"],
      queryFn: categoriesApi.getUserCategories,
    });

  }, [queryClient]);

  return <>{children}</>;
}