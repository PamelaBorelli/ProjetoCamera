import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from "react-native";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";

//Componente principal
const App = () => {
  const [filePath, setFilePath] = useState({});

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Permissão da Câmera",
            message: "O aplicativo precisa de permissão para acessar a câmera",
          }
        );
        //se a permissão da camera for concedida, retorna true
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        //senão retorna false
        alert("Erro de permissão a câmera", err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Permissão da Acesso em Armazenamento Externo",
            message:
              "O aplicativo precisa de permissão para acessar o armazenamento externo",
          }
        );
        //se a permissão do armazenamento for concedida, retorna true
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        //senão retorna false
        alert("Erro de permissão de armazenamento", err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: "low",
      durationLimit: 30,
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();

    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        console.log("Resposta = ", response);

        if (response.didCancel) {
          alert("O usuário cancelou a seleção da câmera.");
          return;
        } else if (response.errorCode == "camera_unavailable") {
          alert("Camera não disponível no dispositivo.");
          return;
        } else if (response.errorCode == "permission") {
          alert("Permissão não concedida.");
          return;
        } else if (response.errorCode == "others") {
          alert(response.errorMessage);
          return;
        }
        console.log("base64 -> ", response.base64);
        console.log("uri -> ", response.uri);
        console.log("largura -> ", response.maxWidth);
        console.log("altura -> ", response.maxHeight);
        console.log("tamanho do arquivo -> ", response.fileSize);
        console.log("tipo -> ", response.type);
        console.log("nome do arquivo -> ", response.fileName);
        setFilePath(response);
      });
    }
  };

  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      console.log("Resposta = ", response);

      if (response.didCancel) {
        alert("O usuário cancelou a seleção da câmera.");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera não disponível no dispositivo.");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permissão não concedida.");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }
      console.log("base64 -> ", response.base64);
      console.log("uri -> ", response.uri);
      console.log("largura -> ", response.maxWidth);
      console.log("altura -> ", response.maxHeight);
      console.log("tamanho do arquivo -> ", response.fileSize);
      console.log("tipo -> ", response.type);
      console.log("nome do arquivo -> ", response.fileName);
      setFilePath(response);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.titleText}>
        Exemplo React Native para acesso a Câmera
      </Text>
      <View style={styles.container}>
        <Image source={{ uri: filePath.uri }} style={styles.imageStyle} />
        <Text style={styles.textStyle}>{filePath.uri}</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage("photo")}>
          <Text style={styles.textStyle}>Abrir Câmera para Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage("video")}>
          <Text style={styles.textStyle}>Abrir Câmera para Vídeo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile("photo")}>
          <Text style={styles.textStyle}>Escolher Imagem</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile("video")}>
          <Text style={styles.textStyle}>Escolher Vídeo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 20,
  },
  textStyle: {
    fontSize: 17,
    padding: 10,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  buttonStyle: {
    alignItems: "center",
    backgroundColor: "#3b5998",
    padding: 5,
    marginVertical: 10,
    width: 250,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
});

export default App;