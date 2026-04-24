import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { api } from "@/services/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import * as yup from "yup";

const schema = yup.object({
    nome: yup
        .string()
        .required("O nome é obrigatório")
        .matches(
            /^[A-Za-zÀ-ÿ\s]+$/,
            "O nome deve conter apenas letras e espaços",
        ),
    idade: yup
        .string()
        .test(
            "is-number", 
            "Idade inválida",
            (value) => !isNaN(parseInt(value as string)),
        )
        .required("A idade é obrigatória"),
    dataConheceu: yup
        .string()
        .typeError("Insira uma data válida")
        .required("A data que conheceu é obrigatória"),
    ocasiao: yup
        .string()
        .required("A ocasiao é obrigatória"),
    genero: yup
        .string()
        .required("O gênero é obrigatório")
        .matches(
            /^[A-Za-zÀ-ÿ\s]+$/,
            "O gênero deve conter apenas letras ('Masculino', 'Feminino', 'Indefinido')",
        ),
}).required();

const calcularAnosConhece = (data: string): number => {
    const [dia, mes, ano] = data.split('/').map(Number);
    if (!dia || !mes || !ano) return 0;

    const dataInicio = new Date(ano, mes - 1, dia);
    const hoje = new Date();
 
    let anos = hoje.getFullYear() - dataInicio.getFullYear();
    const m = hoje.getMonth() - dataInicio.getMonth();
 
    // Ajuste se o aniversário do conhecimento ainda não chegou no ano atual
    if (m < 0 || (m === 0 && hoje.getDate() < dataInicio.getDate())) {
        anos--;
    }

    return anos >= 0 ? anos : 0;
};

const formatarDataParaISO = (data: string): string => {
    const [dia, mes, ano] = data.split('/').map(Number);

    const dataFormatada = `${ano}-${mes}-${dia}`;
    return dataFormatada;
}

export default function ConhecidoCreateScreen() {

    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            nome: "",
            dataConheceu: "",
            ocasiao: "",
            genero: "",
        }
    });

    const onSubmit = async (data: any) => {
        try {
            const dados = {
                nome: data.nome,
                idade: parseInt(data.idade),
                dataConheceu: formatarDataParaISO(data.dataConheceu),
                anosConhece: calcularAnosConhece(data.dataConheceu),
                ocasiao: data.ocasiao,
                genero: data.genero,
            }
            await api.cadastrar(dados);
            Alert.alert("Sucesso", "Conhecido cadastrado!");
            reset();
            router.push("/(tabs)");
        } catch(error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível salvar.");
        }
    };

    return (
        <ThemedView style={estilo.pagina}>

            <ScrollView showsVerticalScrollIndicator={false}>

                <ThemedText type="title" style={estilo.titulo}>Cadastrar conhecido</ThemedText>
                <ThemedText type="subtitle"style={estilo.subtitulo}>Insira os dados necessários:</ThemedText>

                <ThemedView>

                    <ThemedView style={estilo.caixaInput}>
                        <Text style={estilo.textoInput}>Nome</Text>
                        <Controller
                            control={control}
                            name="nome"
                            render={({ field: { onChange, value } }) => (
                                <TextInput 
                                    style={[estilo.input, errors.nome && estilo.inputErro]} 
                                    onChangeText={onChange} 
                                    value={value} 
                                    placeholder="Nome completo"
                                    placeholderTextColor="#888"
                                />
                            )}
                        />
                        {errors.nome && <Text style={estilo.erro}>{errors.nome.message}</Text>}
                    </ThemedView>

                    <ThemedView style={estilo.caixaInput}>
                        <Text style={estilo.textoInput}>Idade</Text>
                        <Controller
                            control={control}
                            name="idade"
                            render={({ field: { onChange, value } }) => (
                                <TextInput 
                                    style={[estilo.input, errors.idade && estilo.inputErro]} 
                                    onChangeText={onChange} 
                                    value={value?.toString()}
                                    keyboardType="numeric"
                                    placeholder="Ex: 25"
                                    placeholderTextColor="#888" 
                                />
                            )}
                        />
                        {errors.idade && <Text style={estilo.erro}>{errors.idade.message}</Text>}
                    </ThemedView>

                    <ThemedView style={estilo.caixaInput}>
                        <Text style={estilo.textoInput}>Data que conheceu</Text>
                        <Controller
                            control={control}
                            name="dataConheceu"
                            render={({ field: { onChange, value } }) => (
                                <TextInput 
                                    style={[estilo.input, errors.dataConheceu && estilo.inputErro]} 
                                    onChangeText={onChange} 
                                    value={value}
                                    placeholder="DD/MM/AAAA"
                                    placeholderTextColor="#888"
                                />
                            )}
                        />
                        {errors.dataConheceu && <Text style={estilo.erro}>{errors.dataConheceu.message}</Text>}
                    </ThemedView>

                    <ThemedView style={estilo.caixaInput}>
                        <Text style={estilo.textoInput}>Como conheceu</Text>
                        <Controller
                            control={control}
                            name="ocasiao"
                            render={({ field: { onChange, value } }) => (
                                <TextInput 
                                    style={[estilo.input, errors.ocasiao && estilo.inputErro]} 
                                    onChangeText={onChange} 
                                    value={value}
                                    placeholder="Ex: Na faculdade, No trabalho..."
                                    placeholderTextColor="#888"
                                />
                            )}
                        />
                        {errors.ocasiao && <Text style={estilo.erro}>{errors.ocasiao.message}</Text>}
                    </ThemedView>

                    <ThemedView style={estilo.caixaInput}>
                        <Text style={estilo.textoInput}>Gênero</Text>
                        <Controller
                            control={control}
                            name="genero"
                            render={({ field: { onChange, value } }) => (
                                <TextInput 
                                    style={[estilo.input, errors.genero && estilo.inputErro]} 
                                    onChangeText={onChange} 
                                    value={value} 
                                    placeholder="Masculino / Feminino / Outro"
                                    placeholderTextColor="#888"
                                />
                            )}
                        />
                        {errors.genero && <Text style={estilo.erro}>{errors.genero.message}</Text>}
                    </ThemedView>
                    
                    <Pressable style={estilo.botao} onPress={handleSubmit(onSubmit)}><Text style={estilo.textoInput}>Salvar</Text></Pressable>

                </ThemedView>

            </ScrollView>

        </ThemedView>
    )
}

const estilo = StyleSheet.create({
    pagina: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20
    },
    titulo: {
        marginBottom: 20,
        textAlign: "center",
    },
    subtitulo: {
        marginBottom: 15,
    },
    caixaInput: {
        paddingBottom: 20,
    },
    input: {
        height: 60,
        width: "100%",
        elevation: 2,
        borderRadius: 5,
        borderWidth: 1,
        color: "#fff",
        borderColor: "rgba(150, 150, 150, 0.1)",
    },
    textoInput: {
        color: "#fff",
        paddingBottom: 10,
        fontSize: 14,
        opacity: 0.8,
        marginTop: 4,
    },
    botao: {
        display: "flex",
        height: 60,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#0a7ea4",
        elevation: 2,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "rgba(150, 150, 150, 0.1)",
    },
    inputErro: {
        borderColor: "#ff4444",
    },
    erro: {
        color: "#ff4444",
        fontSize: 12,
        marginTop: 4,
    },
});