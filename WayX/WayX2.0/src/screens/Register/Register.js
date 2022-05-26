import React, { useState } from "react";
import {
  Image,
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  IconButton,
  Colors,
  Button,
  FAB,
  HelperText,
  Portal,
  Modal,
  Provider,
  Dialog,
} from "react-native-paper";
import { locations, routeTypes } from "../../utils/Data/Data";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { hex_md5 } from "react-native-md5";
import { context, IP, port } from "../../utils/Data/Server";
export default function ImagePickerExample(props) {
  const { t, i18n } = useTranslation();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [image, setImage] = useState();
  const [touchImage, setTouchImage] = useState(false);
  const [province, setProvince] = useState(t("Valencia"));
  const [routeType, setRouteType] = useState(t("City"));
  const [imageUser, SetImageUser] = useState("");
  const [samePass, setSamePass] = useState(false);
  const [sameUser, setsameUser] = useState(false);
  const [valEmailWrite, setValEmailWrite] = useState(false);
  const [visibleDialogEmail, setVisibleDialogEmail] = useState(false);
  const showDialogEmail = () => setVisibleDialogEmail(true);
  const hideDialogEmail = () => setVisibleDialogEmail(false);
  const [valEmail, setValEmail] = useState(false);
  const [clave, setClave]=useState("");

  const returnImage = () => {
    if (!touchImage) {
      return (
        <View style={styles.icnCam}>
          <IconButton
            icon="camera"
            color={Colors.black500}
            size={100}
            onPress={() => pickImage()}
            style={styles.imagepicker}
          />
        </View>
      );
    } else {
      return (
        <TouchableOpacity style={styles.icnCam} onPress={() => pickImage()}>
          <Image
            source={{ uri: image }}
            style={{ width: 190, height: 190, borderRadius: 10 }}
          />
        </TouchableOpacity>
      );
    }
  };
  const register = () => {
    axios
    .post(
      "http://" + IP + ":" + port + "/" + context,
      '{"type":"confirmEmail","clave":"' +
        clave+'"}')
        .then((res) => {
          console.log(res.data);
          if (res.data === "Ok") {
        setValEmail(false)
        var p=hex_md5(password);
        axios
          .post(
            "http://" + IP + ":" + port + "/" + context,
            '{"type":"register","userName":"' +
              name +
              '","password":"' +
              p +
              '","email":"' +
              email +
              '","image":"data:image/png;base64,' +
              imageUser +
              '","location":"' +
              province +
              '","typeRoute":"' +
              routeType +
              '"}'
          )
          .then((res) => {
            console.log(res.data);
            if (res.data === "Ok") {
              props.navigation.navigate("Begin");
              setsameUser(false);
            } else {
              setsameUser(true);
            }
          })
          .catch((res) => {
            console.log(res.data);
            console.log("Error");
          });}
          else{
            setValEmail(true)
          }})
          .catch((res) => {
            console.log(res.data);
            console.log("Error");
          });
  
  };

  const Verify = () => {
    if (password === confirmPassword) {
      setSamePass(false);
      if (
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
          email
        )
      ) {
        setValEmailWrite(false);
        axios.post(
          "http://" + IP + ":" + port + "/" + context,
          '{"type":"checkUser","userName":"' +
          name + '"}'
        )
          .then((res) => {
            console.log(res.data);
            if (res.data === "Ok") {
              setsameUser(false);
              axios.post(
                "http://" + IP + ":" + port + "/" + context,
                '{"type":"sendEmail","emailUser":"' +
                email + '"}'
              )
              showDialogEmail()
            } else {
              setsameUser(true);
              hideDialogEmail()
            }
          })
          .catch((res) => {
            console.log(res.data);
            console.log("Error");
          });
      } else {
        setValEmailWrite(true);
      }
    } else {
      setSamePass(true);
    }

    //
  };
  const pickImage = async () => {
    //Modificar aspect si dependiendo del tamaño que cojamos para las fotos
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 0.35,
    });
    SetImageUser(result.base64);
    setTouchImage(true);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <Provider style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/wallpaperCreateMap3.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.fabBackContainer}>
          <FAB
            style={styles.fab}
            color={"#93cab3"}
            small
            icon="arrow-left"
            onPress={() => props.navigation.goBack()}
          />
        </View>
        <View style={styles.ViewContent}>
          {returnImage()}

<Portal>
          <Dialog visible={visibleDialogEmail} onDismiss={hideDialogEmail}>
            <Dialog.Content>
                <Text style={styles.textpicker}>{t("infoClave")}:</Text>
                <HelperText
                type="error"
                visible={valEmail}
                style={{ marginTop: 15 }}
              >
                {t("clavError")}
              </HelperText>
                <TextInput
                style={styles.text_input}
                value={clave}
                onChangeText={(clave) => setClave(clave)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialogEmail} color={"#56DACB"}>
                {t("cancelLbl")}
              </Button>
              <Button
                onPress={() =>
                  register()
                } color={"#56DACB"}>
                 {t("verify")}
                </Button>
              
            </Dialog.Actions>
          </Dialog>
        </Portal>
          <ScrollView style={{ width: "95%" }}>
            <View style={{ marginTop: 25 }}>
                
                
              <HelperText
                type="error"
                visible={sameUser}
                style={{ marginLeft: 15 }}
              >
                {t("userNameExistsLbl")}
              </HelperText>
              <TextInput
                style={styles.text_input}
                placeholder={t("nameLbl")}
                value={name}
                onChangeText={(name) => setName(name)}
              />
              <HelperText
                type="error"
                visible={valEmailWrite}
                style={{ marginLeft: 15 }}
              >
                {t("validEmailLbl")}
              </HelperText>
              <TextInput
                style={styles.text_input}
                placeholder={t("emailLbl")}
                value={email}
                onChangeText={(email) => setEmail(email)}
              />
              <HelperText
                type="error"
                visible={samePass}
                style={{ marginLeft: 15 }}
              >
                {t("validPasswordLbl")}
              </HelperText>
              <TextInput
                secureTextEntry={true}
                style={styles.text_input}
                placeholder={t("passwordLbl")}
                value={password}
                onChangeText={(password) => setPassword(password)}
              />
              <HelperText
                type="error"
                visible={samePass}
                style={{ marginLeft: 15 }}
              >
                {t("validPasswordLbl")}
              </HelperText>
              <TextInput
                secureTextEntry={true}
                style={styles.text_input}
                placeholder={t("confirmPassLbl")}
                value={confirmPassword}
                onChangeText={(confirmPassword) =>
                  setConfirmPassword(confirmPassword)
                }
              />
              <View style={styles.picker}>
                <Text style={styles.textpicker}>{t("locationLbl")}:</Text>
                <Picker
                  selectedValue={province}
                  style={styles.textinpicker}
                  prompt={t("selectProvince")}
                  onValueChange={(itemValue) => setProvince(itemValue)}
                  itemStyle={styles.textinpicker}
                >
                  {locations.map((data, pos) => {
                    return (
                      <Picker.Item
                        key={pos}
                        label={t(data.province)}
                        value={data.province}
                      />
                    );
                  })}
                </Picker>
              </View>
              <View style={styles.picker}>
                <Text style={styles.textpicker}>{t("routeTypeLbl")}:</Text>
                <Picker
                  selectedValue={routeType}
                  style={styles.pickerElement}
                  prompt={t("selectRouteType")}
                  onValueChange={(itemValue) => setRouteType(itemValue)}
                >
                  {routeTypes.map((data, pos) => {
                    return (
                      <Picker.Item
                        key={pos}
                        label={t(data.type)}
                        value={data.type}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
            <Button
              style={styles.botonInic}
              mode="text"
              color="#56DACB"
              onPress={() => Verify()}
            >
              {t("signUpTag")}
            </Button>
          </ScrollView>
        </View>
      </ImageBackground>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  fabBackContainer: {
    position: "absolute",
    zIndex: 100,
    top: "6%",
    left: "5%",
  },
  fab: {
    backgroundColor: "white",
    elevation: 10,
    height: "100%",
    width: "100%",
  },
  text_input: {
    width: "90%",
    margin: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#56DACB",
    borderRadius: 12,
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 20,
    color: "#484848",
  },
  textpicker: {
    marginTop: 10,
    color: "#A1A1A1",
    fontSize: 20,
  },
  textinpicker: {
    fontSize: 30,
  },
  button: {
    marginTop: 70,
    borderRadius: 200,
    backgroundColor: "green",
  },
  modal: {
    alignSelf: "center",
    width: "50%",
    height: "50%",
    marginLeft: 20,
    
  },
  icnbtn: {
    backgroundColor: "white",
    marginTop: 30,
  },
  icnCam: {
    borderColor: "#D1D1D1",
    alignItems: "center",
    width: 230,
    height: 230,
    borderRadius: 12,
    justifyContent: "center",
    padding: 5,
    backgroundColor: "white",
    elevation: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#56DACB",
    width: "90%",
    paddingLeft: 20,
    margin: 10,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    marginTop: 35,
  },
  ViewContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20%",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  botonInic: {
    margin: 20,
    marginTop: 20,
    width: 250,
    height: 60,
    borderRadius: 30,
    paddingTop: 10,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
    elevation: 7.5,
  },
});
