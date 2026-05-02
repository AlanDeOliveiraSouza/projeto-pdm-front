import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

export function useEditConhecido() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (conhecido: {id: number; nome: string; idade: number; dataConheceu: string; anosConhece: number; ocasiao: string; genero: string}) => {
            const response = await api.put(`/conhecidos`, conhecido);
            console.log("Edição:", response.data);
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({queryKey: ["conhecidos"]});
            queryClient.invalidateQueries({queryKey: ["conhecido", variables.id.toString()]});
        
            Alert.alert("Edição concluída", "O conhececido foi editado com sucesso!");
            router.back();
        }, 
        onError: (error: any) => {
            const message = error.response?.data?.message || "Erro ao editar conhecido";
            Alert.alert("Erro", message);
        }
    });
}