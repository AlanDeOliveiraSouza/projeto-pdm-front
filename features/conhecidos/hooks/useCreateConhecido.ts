import api from "@/services/api";
import { Conhecido } from "@/types/conhecido";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

export function useCreateConhecido() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newConhecido: {nome: string; idade: number; dataConheceu: string; anosConhece: number; ocasiao: string; genero: string}) => {
            const { data }: { data: Conhecido } = await api.post("/conhecidos/cadastrar", newConhecido,);
            console.log("Criação:", data);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["conhecidos"]});

            Alert.alert("Cadastro concluído", "O conhececido foi cadastrado com sucesso!");
            router.push("/(tabs)");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Erro ao cadastrar conhecido";
            Alert.alert("Erro", message);
        }
    });
}