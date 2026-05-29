import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { yupResolver } from "@hookform/resolvers/yup";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as yup from "yup";
import TirarFoto from "../camera/TirarFotoScreen";
import { formatarDataParaISO } from "./hooks/useConhecidoCalculos";
import { useCreateConhecido } from "./hooks/useCreateConhecido";

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

export default function ConhecidoCreateScreen() {

    const router = useRouter();
    const [urifoto, setUrifoto] = useState("");
    const [base64, setBase64] = useState("");
    const [location, setLocation] = useState<{ latitude: number; longitude: number; altitude: number | null; precisao: number | null } | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            nome: "",
            idade: "",
            dataConheceu: "",
            ocasiao: "",
            genero: "",
        }
    });

    const { mutate } = useCreateConhecido();

    useFocusEffect(
        useCallback(()=> {
            reset(); // Limpa os dados quando o usuário voltar ao formulário
            setUrifoto("");
            setBase64("");
            setLocation(null);
        }, [reset])
    );

    const onSubmit = (data: any) => {
        if (!base64 || base64 === "Não gerado" || base64 === "") {
            Alert.alert("Foto obrigatória", "Por favor, tire uma foto para realizar o cadastro.");
            return;
        }

        mutate({
            nome: data.nome,
            idade: parseInt(data.idade),
            dataConheceu: formatarDataParaISO(data.dataConheceu),
            ocasiao: data.ocasiao,
            genero: data.genero,
            imagem: base64,
            coordenada: location ? {
                latitude: location.latitude,
                longitude: location.longitude,
                altitude: location.altitude,
                precisao: location.precisao
            } : undefined
        })
    
    };

    return (
        <ThemedView style={estilo.pagina}>

            <ScrollView showsVerticalScrollIndicator={false}>

                <ThemedText type="title" style={estilo.titulo}>Cadastrar conhecido</ThemedText>
                
                <ThemedView style={estilo.secaoCamera}>
                    <ThemedText type="subtitle" style={estilo.subtitulo}>Foto do conhecido:</ThemedText>
                    {urifoto ? (
                        <View style={estilo.contanerPrevisu}>
                            <Image source={{ uri: urifoto }} style={estilo.previsuImagem} />
                            <Pressable style={estilo.botaoTrocarFoto} onPress={() => {setUrifoto(""); setBase64(""); setLocation(null);}}>
                                <Text style={estilo.textoBotaoTrocar}>Trocar Foto</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <TirarFoto setURI={setUrifoto} setBase64={setBase64} setLocation={setLocation} />
                    )}
                </ThemedView>

                <ThemedText type="subtitle" style={estilo.subtitulo}>Dados pessoais:</ThemedText>

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
                    
                    <Pressable style={estilo.botao} onPress={handleSubmit(onSubmit)}><Text style={estilo.textoBotao}>Salvar</Text></Pressable>

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
    secaoCamera: {
        marginBottom: 25,
    },
    contanerPrevisu: {
        width: "100%",
        alignItems: "center",
        gap: 10,
    },
    previsuImagem: {
        width: "100%",
        height: 250,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(150, 150, 150, 0.2)",
    },
    botaoTrocarFoto: {
        padding: 10,
    },
    textoBotaoTrocar: {
        color: "#0a7ea4",
        fontWeight: "bold",
        textDecorationLine: "underline",
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
        marginBottom: 30,
    },
    textoBotao: {
        fontSize: 16,
        textAlign: "center",
        alignSelf: "center",
        color: "#fff",
        fontWeight: "600",
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