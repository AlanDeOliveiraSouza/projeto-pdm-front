import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

export function useDeleteConhecido() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/conhecidos/${id}`);
            console.log("Exclusão:", response.data);
            return response.data;
        },
        onSuccess: (variables) => {
            queryClient.invalidateQueries({queryKey: ["conhecidos"]});
            queryClient.invalidateQueries({queryKey: ["conhecido", variables.id]});
        
            Alert.alert("Exclusão concluída", "O conhececido foi excluído com sucesso!");
            router.back();
        }, 
        onError: (error: any) => {
            const message = error.response?.data?.message || "Erro ao excluir conhecido";
            Alert.alert("Erro", message);
        }
    });
}