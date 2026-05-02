import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { formatarDataParaBR } from "./hooks/useConhecidoCalculos";
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
                style={estilo.botao}
                onPress={() => refetch()}
            >
                <Text style={estilo.textoBotao}>Recarregar</Text>
            </Pressable>
        </ThemedView>
        )
    }
    
    /*
    const listaConhecidos = [
        { id: 2, nome: "Yasmin", idade: 12, dataConheceu: "2013-12-01", ocasiao: "No dia em que nasceu conheci minha irmã.", anosConhece: 12, genero: 'Feminino'},
        { id: 22, nome: "Alessandra", idade: 50, dataConheceu: "2006-04-24", ocasiao: "No dia em que eu nasci conheci a minha mãe.", anosConhece: 20, genero: 'Feminino'},
        { id: 23, nome: "Jose", idade: 52, dataConheceu: "2006-04-24", ocasiao: "No dia em que eu nasci conheci o meu pai.", anosConhece: 20, genero: 'Masculino'},
    ];*/
    
    return (
        <ThemedView style={estilo.pagina}>
                <ThemedText type="title" style={estilo.titulo}>Conhecidos</ThemedText>
                <ThemedText type="subtitle"style={estilo.subtitulo}>Meus conhecidos:</ThemedText>
                <FlatList
                    style={estilo.lista}
                    data={listaConhecidos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => (
                        <ThemedView style={estilo.card}>
                            <View style={estilo.informacoes}>
                                <ThemedText type="defaultSemiBold" style={estilo.nome}>{item.nome}</ThemedText>
                                <ThemedText style={estilo.dado}>ID: {item.id}</ThemedText>
                                <ThemedText style={estilo.dado}>{item.idade} anos • Conhece há {item.anosConhece} anos</ThemedText>
                                <ThemedText style={estilo.dado}>Data que conheceu: {formatarDataParaBR(item.dataConheceu)}</ThemedText>
                                <ThemedText style={estilo.dado}>Como conheceu: {item.ocasiao}</ThemedText>
                                <ThemedText style={estilo.dado}>Gênero: {item.genero}</ThemedText>
                            </View>
                            <View style={estilo.botoes}>
                                <Pressable
                                    style={estilo.botao}
                                    onPress={() => router.push(`/conhecido/edit/${item.id}`)}
                                    
                                >
                                    <IconSymbol size={28} name="pencil" color={'#fff'} />
                                </Pressable>
                                <Pressable
                                    style={estilo.botao}
                                    onPress={() => router.push(`/conhecido/delete/${item.id}`)}
                                >
                                    <IconSymbol size={28} name="trash" color={'#fff'} />
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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 5,
        marginBottom: 12,
        marginLeft: 10,
        marginRight: 10,
        gap: 10,

        elevation: 4,
        borderWidth: 1,
        borderColor: "rgba(150, 150, 150, 0.1)",
    },
    informacoes: {
        flex: 2,
    },
    dado: {
        fontSize: 14,
        opacity: 0.8,
        marginTop: 4,
    },
    botoes: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end"
        },
    botao: {
        flex: 1,
        display: "flex",
        width: 60,
        height: 60,
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
    nome: {
        fontSize: 20,
    }
});

{/* 
Para deixar sua lista de conhecidos com um visual mais moderno e profissional, a melhor estratégia é transformar cada
  item em um "Card".

  Principais Sugestões:

   1. Estrutura de Card: Use bordas arredondadas, sombras (no iOS) ou elevação (no Android) para dar profundidade.
   2. Hierarquia de Texto: O nome do conhecido deve ter mais destaque (negrito/maior), enquanto a idade e o tempo de
      amizade podem ser menores e mais sutis.
   3. Botões com Ícones: Em vez de um botão de texto padrão, use ícones (como um lápis para editar) dentro de um círculo
      com fundo suave. Isso limpa a interface.
   4. Espaçamento (Padding/Margin): Dê "ar" aos elementos para que a leitura seja agradável.

  ---

  Exemplo de código para aplicar:

  Você pode substituir o conteúdo do seu arquivo ConhecidoListScreen.tsx ou se basear nesta estrutura:
    18     return (
    19         <ThemedView style={estilo.pagina}>
    20             <ThemedText type="title" style={estilo.titulo}>Meus Conhecidos</ThemedText>
    21
    22             <FlatList
    23                 style={estilo.lista}
    24                 data={listaConhecidos}
    25                 keyExtractor={(item) => item.id.toString()}
    26                 contentContainerStyle={estilo.listaContent}
    27                 renderItem={({item}) => (
    28                     <ThemedView style={estilo.card}>
    29                         <View style={estilo.infoContainer}>
    30                             <ThemedText type="defaultSemiBold" style={estilo.nome}>
    31                                 {item.nome}
    32                             </ThemedText>
    33                             <ThemedText style={estilo.detalhes}>
    34                                 {item.idade} anos • Conhece há {item.anosConhece} anos
    35                             </ThemedText>
    36                         </View>
    37
    38                         <TouchableOpacity
    39                             style={estilo.botaoEditar}
    40                             onPress={() => router.push(`/conhecido/edit/${item.id}`)}
    41                         >
    42                             <IconSymbol name="pencil" size={20} color="#0a7ea4" />
    43                         </TouchableOpacity>
    44                     </ThemedView>
    45                 )}
    46             />
    47         </ThemedView>
    48     );
    49 }
    50
    51 const estilo = StyleSheet.create({
    52     pagina: {
    53         flex: 1,
    54         paddingTop: 60,
    55         paddingHorizontal: 20,
    56     },
    57     titulo: {
    58         marginBottom: 20,
    59     },
    60     lista: {
    61         width: "100%",
    62     },
    63     listaContent: {
    64         paddingBottom: 30,
    65     },
    66     card: {
    67         flexDirection: "row",
    68         alignItems: "center",
    69         padding: 16,
    70         borderRadius: 16,
    71         marginBottom: 12,
    72         // Sombra para iOS
    73         shadowColor: "#000",
    74         shadowOffset: { width: 0, height: 2 },
    75         shadowOpacity: 0.1,
    76         shadowRadius: 8,
    77         // Elevação para Android
    78         elevation: 4,
    79         borderWidth: 1,
    80         borderColor: "rgba(150, 150, 150, 0.1)",
    81     },
    82     infoContainer: {
    83         flex: 1,
    84     },
    85     nome: {
    86         fontSize: 18,
    87     },
    88     detalhes: {
    89         fontSize: 14,
    90         opacity: 0.6,
    91         marginTop: 4,
    92     },
    93     botaoEditar: {
    94         width: 40,
    95         height: 40,
    96         borderRadius: 20,
    97         backgroundColor: "rgba(10, 126, 164, 0.1)",
    98         justifyContent: "center",
    99         alignItems: "center",
   100     }
   101 });

  O que melhoramos aqui:
   * Margens e Preenchimento: O paddingHorizontal na página evita que o texto "cole" nas bordas do celular.
   * Feedback de Clique: Usar TouchableOpacity faz com que o botão mude de opacidade ao ser tocado, o que é melhor para
     a experiência do usuário.
   * Visual de Card: O uso de borderRadius e elevation faz com que cada pessoa na lista pareça um objeto físico
     separado, o que organiza visualmente a tela.
*/}
