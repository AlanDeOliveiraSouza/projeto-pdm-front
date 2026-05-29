import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { calcularAnosConhece, formatarDataParaBR } from "./hooks/useConhecidoCalculos";
import { useConhecidos } from "./hooks/useConhecidos";

export default function ConhecidoListScreen() {
    
    const router = useRouter();

    const {
        data: listaConhecidos,
        isLoading,
        error,
        refetch,
    } = useConhecidos();

    if(isLoading) {
        return (
        <ThemedView style={estilo.pagina}>
            <ThemedText type="title" style={estilo.titulo}>Conhecidos</ThemedText>
            <ThemedText type="subtitle"style={estilo.subtitulo}>Carregando conhecidos...</ThemedText>
        </ThemedView>
        )
    }

    if(error) {
        return (
        <ThemedView style={estilo.pagina}>
            <ThemedText type="title" style={estilo.titulo}>Conhecidos</ThemedText>
            <ThemedText type="subtitle"style={estilo.subtitulo}>Não foi possível carregar os conhecidos: </ThemedText>
            <Pressable
                style={estilo.botaoRecarregar}
                onPress={() => refetch()}
            >
                <Text style={estilo.textoBotao}>Recarregar</Text>
            </Pressable>
        </ThemedView>
        )
    }
    
    return (
        <ThemedView style={estilo.pagina}>
                <ThemedText type="title" style={estilo.titulo}>Conhecidos</ThemedText>
                <ThemedText type="subtitle"style={estilo.subtitulo}>Meus conhecidos:</ThemedText>
                <FlatList
                    style={estilo.lista}
                    data={listaConhecidos}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({item}) => (
                        <ThemedView style={estilo.card}>
                            {item.imagem ? (
                                <Image 
                                    source={{ uri: `data:image/jpeg;base64,${item.imagem}` }} 
                                    style={estilo.fotoMiniatura}
                                />
                            ) : (
                                <View style={[estilo.fotoMiniatura, { justifyContent: 'center', alignItems: 'center' }]}>
                                    <IconSymbol size={32} name="person.fill" color={'#ccc'} />
                                </View>
                            )}
                            <View style={estilo.informacoes}>
                                <ThemedText type="defaultSemiBold" style={estilo.nome}>{item.nome}</ThemedText>
                                <ThemedText style={estilo.dado}>Id: {item.id}</ThemedText>
                                <ThemedText style={estilo.dado}>{item.idade} anos • Conhece há: {calcularAnosConhece(formatarDataParaBR(item.dataConheceu))} ano(s)</ThemedText>
                                <ThemedText style={estilo.dado}>Data conheceu: {formatarDataParaBR(item.dataConheceu)}</ThemedText>
                                <ThemedText style={estilo.dado}>Gênero: {item.genero}</ThemedText>
                                <ThemedText style={estilo.dado}>Como conheceu: {item.ocasiao}</ThemedText>
                            </View>
                            <View style={estilo.botoes}>
                                <Pressable
                                    style={estilo.botaoAcao}
                                    onPress={() => router.push(`/conhecido/edit/${item.id}`)}
                                >
                                    <IconSymbol size={28} name="pencil" color={'#ffffff'} />
                                </Pressable>
                                <Pressable
                                    style={estilo.botaoAcao}
                                    onPress={() => router.push(`/conhecido/delete/${item.id}`)}
                                >
                                    <IconSymbol size={28} name="trash" color={'#ffffff'} />
                                </Pressable>
                            </View>
                        </ThemedView>
                    )}
                />
        </ThemedView>
    );
}

const estilo = StyleSheet.create({
    pagina: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    titulo: {
        marginBottom: 20,
        textAlign: "center",
    },
    subtitulo: {
        marginBottom: 15,
    },
    lista: {
        width: "100%",
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        gap: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: "rgba(150, 150, 150, 0.1)",
    },
    fotoMiniatura: {
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: "rgba(150, 150, 150, 0.1)",
    },
    informacoes: {
        flex: 1,
    },
    dado: {
        fontSize: 13,
        opacity: 0.7,
        marginTop: 2,
    },
    botoes: {
        flexDirection: "column",
        gap: 15,
    },
    botaoAcao: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: "#0a7ea4",
        justifyContent: "center",
        alignItems: "center",
    },
    botaoRecarregar: {
        backgroundColor: "#0a7ea4",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        paddingHorizontal: 30,
        height: 50,
        marginTop: 20,
    },
    textoBotao: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "600",
    },
    nome: {
        fontSize: 17,
        fontWeight: "bold",
    }
});
