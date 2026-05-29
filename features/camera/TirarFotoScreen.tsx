import {
  CameraCapturedPicture,
  CameraPictureOptions,
  CameraView,
  useCameraPermissions
} from "expo-camera";
import * as Location from "expo-location";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text
} from "react-native";

// Importe o tipo correto para a referência do componente CameraView
type CameraViewRef = React.ComponentRef<typeof CameraView>;

interface ChildProps {
  setURI: (arquivo: string) => void;
  setBase64: (base64: string) => void;
  setLocation: (location: { latitude: number; longitude: number; altitude: number | null; precisao: number | null }) => void;
}

const TirarFoto: React.FC<ChildProps> = ({ setURI, setBase64, setLocation }) => {
  const [permission, requestPermission] = useCameraPermissions();

  // Referência para o componente CameraView
  const cameraRef = useRef<CameraViewRef>(null);

  async function tirarFoto() {
    if (cameraRef.current) {
      try {
        // 1. Verifica se o serviço de localização está ligado
        const hasServicesEnabled = await Location.hasServicesEnabledAsync();
        if (!hasServicesEnabled) {
          Alert.alert(
            "GPS Desativado",
            "Por favor, ative o GPS do seu aparelho para registrar a localização da foto."
          );
          return;
        }

        // 2. Solicita permissão de localização
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permissão negada", "Precisamos da sua localização para registrar onde a foto foi tirada");
          return;
        }

        const options: CameraPictureOptions = {
          quality: 0, // Qualidade da imagem - Compressão máxima
          base64: true, // Gerar foto convertida para string base64
        };

        // Chamada do método nativo de captura
        const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync(options);

        // 2. Obtém a localização no momento da foto
        const currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        // Armazena o URI da foto
        setURI(photo.uri);
        // Armazena base64 da foto
        if (photo.base64) {
          setBase64(photo.base64);
        } else {
          setBase64("Não gerado");
        }

        // Armazena a localização
        setLocation({
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
          altitude: currentPosition.coords.altitude,
          precisao: currentPosition.coords.accuracy,
        });

        // Mostra um alerta simples com o URI (para debug)
        Alert.alert("Foto Capturada!", "Sua foto e localização foram registradas com sucesso.");
      } catch (error){
        console.log("error", error);
        Alert.alert("Erro", "Não foi possível tirar a foto e registrar sua localização.");
      }
    } else {
      Alert.alert("Erro", "Câmera não está pronta.");
    }
  }

  if (!permission) {
    return (
      <ThemedView style={styles.containerCenter}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={styles.textLoading}>
          Sincronizando câmera...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.containerCenter}>

        <ThemedText style={styles.titlePermission}>
          Câmera Desabilitada
        </ThemedText>

        <ThemedText style={styles.descriptionPermission}>
          Para capturar fotos dos conhecidos e registrá-las, precisamos de
          acesso à sua câmera.
        </ThemedText>

        <ThemedView style={styles.buttonGroup}>
          <Pressable
            style={({ pressed }) => [
                styles.botao,
                { opacity: pressed ? 0.8 : 1 },
                !permission.canAskAgain && { backgroundColor: "#888" }
            ]}
            onPress={requestPermission}
            disabled={!permission.canAskAgain} // Bloqueia se o sistema não permitir mais o pop-up
          >
            <Text style={styles.textoBotao}>Tentar Novamente</Text>
          </Pressable>

          {!permission.canAskAgain && (
            <Pressable
              onPress={() => Linking.openSettings()}
              style={styles.linkButton}
            >
              <ThemedText style={styles.linkText}>
                Habilitar nas Configurações
              </ThemedText>
            </Pressable>
          )}
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.cameraContainerWrapper}>
      <ThemedView style={styles.cameraContainer}>
        <CameraView
          style={{ flex: 1 }}
          facing="back" // ou "front" para a câmera frontal
          ref={cameraRef}
        ></CameraView>
      </ThemedView>
      <Pressable 
        style={({ pressed }) => [
            styles.botao,
            { opacity: pressed ? 0.8 : 1 }
        ]}
        onPress={tirarFoto}
      >
          <Text style={styles.textoBotao}>Tirar Foto</Text>
      </Pressable>
    </ThemedView>
  );
};

export default TirarFoto;

const styles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titlePermission: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  descriptionPermission: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 30,
  },
  textLoading: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "500",
  },
  buttonGroup: {
    width: "100%",
    gap: 15,
  },
  cameraContainerWrapper: {
    width: "100%",
    marginBottom: 20,
  },
  cameraContainer: {
    height: 400,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.2)",
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
  textoBotao: {
    fontSize: 16,
    textAlign: "center",
    alignSelf: "center",
    color: "#fff",
    fontWeight: "600",
  },
  linkButton: {
    padding: 10,
    alignItems: "center",
  },
  linkText: {
    color: "#0a7ea4",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
