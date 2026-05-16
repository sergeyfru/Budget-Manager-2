import { useQuery } from "@tanstack/react-query"
import { transactionsApi } from "../api/trasactionsApi";

export const useTransactionTypes = () => {
    return useQuery({
        queryKey: ["transaction_types"],
        queryFn: transactionsApi.getTransactionTypes,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};