import api from "@/services/api";
import { Conhecido } from "@/types/conhecido";
import { useQuery } from "@tanstack/react-query";

export function useConhecidos() {
    return useQuery<Conhecido[]>({
        queryKey: ["conhecidos"],
        queryFn: async () => {
            const { data }: { data: Conhecido[] } = await api.get("/conhecidos");
            return data;
        },
        staleTime: 1000 * 60 * 5, 
    });
}