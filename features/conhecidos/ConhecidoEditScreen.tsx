import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { api } from "@/services/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, StyleSheet, Text, TextInput } from "react-native";
import * as yup from "yup";

const schema = yup.object({
    nome: yup
        .string()
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
        ),
    dataConheceu: yup
        .string()
        .typeError("Insira uma data válida"),
    ocasiao: yup
        .string(),
    genero: yup
        .string()
        .matches(
            /^[A-Za-zÀ-ÿ\s]+$/,
            "O gênero deve conter apenas letras ('Masculino', 'Feminino', 'Outro')",
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

const formatarDataParaBR = (data: string): string => {
    const [ano, mes, dia] = data.split('-').map(Number);
    let dataFormatada;

    if(dia < 10 && mes < 10) {
        dataFormatada = `0${dia}/0${mes}/${ano}`;
    } else if(dia < 10 ) {
        dataFormatada = `0${dia}/${mes}/${ano}`;
    } else if(mes < 10 ) {
        dataFormatada = `${dia}/0${mes}/${ano}`;
    } else {
        dataFormatada = `${dia}/${mes}/${ano}`;
    }

    return dataFormatada;
}

export default function ConhecidoEditScreen() {

    const { id } = useLocalSearchParams();
    const router = useRouter();
    
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const response = await api.buscar(id as string);
                const conhecido = response.data;

                setValue("nome", conhecido.nome);
                setValue("idade", conhecido.idade.toString());
                setValue("dataConheceu", formatarDataParaBR(conhecido.dataConheceu));
                setValue("ocasiao", conhecido.ocasiao);
                setValue("genero", conhecido.genero);
            } catch(error) {
                Alert.alert("Erro", "Não foi possível carregar os dados.");
                router.push("/(tabs)");
            }
        };
        carregarDados()
    }, [id]);

    const onSubmit = async (data: any) => {
            try {
                const dados = {
                    id: data.id,
                    nome: data.nome,
                    idade: parseInt(data.idade),
                    dataConheceu: formatarDataParaISO(data.dataConheceu),
                    anosConhece: calcularAnosConhece(data.dataConheceu),
                    ocasiao: data.ocasiao,
                    genero: data.genero,
                }
                await api.editar(dados);
                Alert.alert("Sucesso", "Conhecido atualizado!");
                reset();
                router.push("/(tabs)");
            } catch(error) {
                console.error(error);
                Alert.alert("Erro", "Não foi possível atualizar.");
            }
        };

    return (
        <ThemedView style={estilo.pagina}>

            <ThemedText type="subtitle" style={estilo.subtitulo}>Editar conhecido n° {id}</ThemedText>

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