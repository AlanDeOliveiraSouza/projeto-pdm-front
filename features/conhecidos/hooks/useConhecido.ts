import api from "@/services/api";
import { Conhecido } from "@/types/conhecido";
import { useQuery } from "@tanstack/react-query";

export function useConhecido(id: string) {
    return useQuery<Conhecido>({
        queryKey: ["conhecido", id],
        queryFn: async () => {
            const { data } = await api.get<Conhecido>(`/conhecidos/${id}`);
            return data;
        },
        staleTime: 1000 * 60 * 5, 
    });
}