import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { api } from "@/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

export default function ConhecidoDeleteScreen() {

    const router = useRouter();

    const { id }= useLocalSearchParams();

    const onSubmit = async (id : string) => {
        try {
            await api.excluir(id);
            Alert.alert("Sucesso", "Conhecido excluído!");
            router.push("/(tabs)");
        } catch(error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível excluir o conhecido.");
        }
    };

    return (
        <ThemedView style={estilo.pagina}>
            <ThemedText type="subtitle" style={estilo.subtitulo}>Excluir conhecido n° {id}</ThemedText>
            <ThemedText>Tem certeza que deseja apagar{/*{conhecido.nome}*/}</ThemedText>
            <ThemedView style={estilo.botoes}>
                <Pressable
                    style={estilo.botao}
                    onPress={() => router.back()}
                >
                    <Text style={estilo.textoBotao}>Cancelar</Text>
                </Pressable>
                <Pressable
                    style={estilo.botao}
                    onPress={() => onSubmit(id as string)}
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