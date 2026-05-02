import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { useConhecido } from "./hooks/useConhecido";
import { useDeleteConhecido } from "./hooks/useDeleteConhecido";

export default function ConhecidoDeleteScreen() {

    const router = useRouter();

    const { id } = useLocalSearchParams();
    
    const { mutate } = useDeleteConhecido();

    const {
        data: conhecido,
        isLoading,
        error,
        refetch,
    } = useConhecido(id as string);

    if(isLoading) {
        return (
        <ThemedView style={estilo.pagina}>
            <ThemedText type="subtitle"style={estilo.subtitulo}>Carregando dados...</ThemedText>
        </ThemedView>
        )
    }

    if(error || !conhecido) {
        return (
        <ThemedView style={estilo.pagina}>
            <ThemedText type="subtitle"style={estilo.subtitulo}>Não foi possível carregar os dados: </ThemedText>
            <Pressable
                style={estilo.botao}
                onPress={() => refetch()}
            >
                <Text style={estilo.textoBotao}>Recarregar</Text>
            </Pressable>
        </ThemedView>
        )
    }

    return (
        <ThemedView style={estilo.pagina}>
            <ThemedText type="subtitle" style={estilo.subtitulo}>Excluir conhecido n° {id}</ThemedText>
            <ThemedText>Tem certeza que deseja apagar {conhecido.nome}?</ThemedText>
            <ThemedText style={estilo.dado}>{conhecido.idade} anos</ThemedText>
            <ThemedText style={estilo.dado}>Conhece há {conhecido.anosConhece} anos</ThemedText>
            {/*<ThemedText style={estilo.dado}>Data que conheceu: {formatarDataParaBR(conhecido.dataConheceu)}</ThemedText>*/}
            <ThemedText style={estilo.dado}>Como conheceu: {conhecido.ocasiao}</ThemedText>
            <ThemedText style={estilo.dado}>Gênero: {conhecido.genero}</ThemedText>
            <ThemedView style={estilo.botoes}>
                <Pressable
                    style={estilo.botao}
                    onPress={() => router.back()}
                >
                    <Text style={estilo.textoBotao}>Cancelar</Text>
                </Pressable>
                <Pressable
                    style={estilo.botao}
                    onPress={() => mutate(id as string)}
                >
                    <Text style={estilo.textoBotao}>Excluir</Text>
                </Pressable>
            </ThemedView>
        </ThemedView>
    )
}

const estilo = StyleSheet.create({
    pagina: {
        flex: 1,
        paddingHorizontal: 20,
    },
    subtitulo: {
        alignSelf: "center",
        marginBottom: 15,
    },
    dado: {
        fontSize: 14,
        opacity: 0.8,
        marginTop: 4,
    },
    botoes: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    botao: {
        flex: 1,
        display: "flex",
        width: 60,
        height: 40,
        backgroundColor:"#0a7ea4",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
    },
    textoBotao: {
        fontSize: 16,
        textAlign: "center",
        alignSelf: "center",
        color: "#fff",
    },
});