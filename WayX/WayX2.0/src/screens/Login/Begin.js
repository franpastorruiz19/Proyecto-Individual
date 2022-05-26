import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ImageBackground, TextInput } from "react-native";
import { Button, Dialog, HelperText, Portal, Provider } from "react-native-paper";
import * as React from "react";
import { Text } from "react-native-paper";
import "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { hex_md5 } from "react-native-md5";
import { context, IP, port } from "../../utils/Data/Server";
const image = require("../../assets/wallpaperInici3.png");

export default function Begin(props) {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [puls, setPuls] = React.useState({ user: false, pass: false });
  const [colorText, setColorText] = React.useState({
    user: "#56DACB",
    pass: "#56DACB",
  });
  const [error, setError] = React.useState(false);
  const [visibleDialogUser, setVisibleDialogUser] = React.useState(false);
  const showDialogUser = () => setVisibleDialogUser(true);
  const hideDialogUser = () => setVisibleDialogUser(false);
  const [visibleDialogClave, setVisibleDialogClave] = React.useState(false);
  const showDialogClave = () => setVisibleDialogClave(true);
  const hideDialogClave = () => setVisibleDialogClave(false);
  const [visibleDialogChange, setVisibleDialogChange] = React.useState(false);
  const showDialogChange = () => setVisibleDialogChange(true);
  const hideDialogChange = () => setVisibleDialogChange(false);
  const [userRecover, setUserRecover] = React.useState("");
  const [userNotExist, setUserNotExist] = React.useState(false)
  const [clave, setClave] = React.useState("");
  const [claveWrong, setClaveWrong] = React.useState(false)
  const [passwordChange, setPasswordChange] = React.useState("");
  const [changeOk, setChangeOk] = React.useState(false)


  const ValidateUser = async () => {
    var p = hex_md5(password);
    axios
      .post(
        "http://" + IP + ":" + port + "/" + context,
        '{"type":"login","userName":"' +
        username +
        '","password":"' +
        p +
        '"}'
      )
      .then((res) => {
        console.log(res.data);
        props.navigation.navigate("BottomTabs", { user: res.data });
      })
      .catch((res) => {
        setPuls({ user: false, pass: false });
        setColorText({ user: "red", pass: "red" });
        setError(true);
      });
  };
  const VerifyUserRecover = async () => {
    axios.post(
      "http://" + IP + ":" + port + "/" + context,
      '{"type":"VerifyUserEmail","userName":"' +
      userRecover + '"}'
    )
      .then((res) => {
        console.log(res.data);
        if (res.data === "Ok") {
          setUserNotExist(false);
          showDialogClave()
        } else {
          setUserNotExist(true);
          hideDialogClave()
        }
      }).catch((res) => {

      })
  }

  const VerifyClave = async () => {
    axios
      .post(
        "http://" + IP + ":" + port + "/" + context,
        '{"type":"confirmEmail","clave":"' +
        clave + '"}')
      .then((res) => {
        console.log(res.data);
        if (res.data === "Ok") {
          setClaveWrong(false)
          showDialogChange()
        } else {
          setClaveWrong(true)
        }
      })
      .catch((res) => {
        console.log(res.data);
        console.log("Error");
      });
  }
  const ChangePassword = async () => {
    var p = hex_md5(passwordChange);
    axios
      .post(
        "http://" + IP + ":" + port + "/" + context,
        '{"type":"changePassword","userName":"' +
        userRecover +
        '","password":"' +
        p +
        '"}'
      )
      .then((res) => {
        console.log(res.data);
        setChangeOk(true)
        setPasswordChange("");
        setClave("");
        setUserRecover("")
      })
      .catch((res) => {
        console.log(res.data);
      });
  };
  
  const resetTextInputValues = () => {
    setUsername("");
    setPassword("");
    setError(false);
  };

  return (
    <Provider style={styles.container}>
      <StatusBar
        animated={true}
        translucent={true}
        backgroundColor="transparent"
      ></StatusBar>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.empty1}></View>
        <View style={styles.components}>
          <HelperText type="error" visible={error} style={{ marginLeft: 15 }}>
            {t("wrongUserDataLbl")}
          </HelperText>
          <TextInput
            style={[styles.textInputUserValues, { borderColor: colorText.user }]}
            label={t("userNameTag")}
            value={username}
            placeholder={t("userNameTag")}
            underlineColor="transparent"
            onChangeText={(username) => setUsername(username)}
            onPressIn={() => setColorText({ user: "#56DACB", pass: "#56DACB" })}
          />
          <TextInput
            style={[styles.textInputUserValues, { borderColor: colorText.pass }]}
            label={t("passwordLbl")}
            value={password}
            placeholder={t("passwordLbl")}
            underlineColor="transparent"
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
            onPressIn={() => setColorText({ user: "#56DACB", pass: "#56DACB" })}
          />
        </View>
        <Portal>
          <Dialog visible={visibleDialogUser}>
            <Dialog.Content>
              <Text style={styles.textpicker}>{t("infoNameClave")}:</Text>
              <HelperText
                type="error"
                visible={userNotExist}
                style={{ marginTop: 15 }}
              >
                {t("infoNameWrong")}
              </HelperText>
              <TextInput
                style={styles.text_input}
                value={userRecover}
                onChangeText={(user) => setUserRecover(user)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialogUser} color={"#56DACB"}>
                {t("cancelLbl")}
              </Button>
              <Button
                onPress={() =>
                  VerifyUserRecover()
                } color={"#56DACB"}>
               {t("verify")}
              </Button>

            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={visibleDialogClave}>
            <Dialog.Content>
              <Text style={styles.textpicker}>{t("infoClave")}:</Text>
              <HelperText
                type="error"
                visible={claveWrong}
                style={{ marginTop: 5 }}
              >
                {t("clavError")}
              </HelperText>
              <TextInput
                style={styles.text_input}
                value={clave}
                onChangeText={(c) => setClave(c)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialogClave} color={"#56DACB"}>
                {t("cancelLbl")}
              </Button>
              <Button
                onPress={() =>
                  VerifyClave()
                } color={"#56DACB"}>
                 {t("verify")}
              </Button>

            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={visibleDialogChange}>
            <Dialog.Content> 
              <Text style={styles.textpicker}> {t("changePassword")}:</Text>
              <HelperText
                type="info"
                visible={changeOk}
                style={{ marginTop: 5 }}
              >
                 {t("infoChangePass")}
              </HelperText>
              <TextInput
                style={styles.text_input}
                value={passwordChange}
                onChangeText={(pass) => setPasswordChange(pass)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => hideDialogChange() & hideDialogClave() & hideDialogUser()& setChangeOk(false)} color={"#56DACB"}>
                {t("cancelLbl")}
              </Button>
              <Button
                onPress={() =>
                  ChangePassword()
                } color={"#56DACB"}>
                {t("verify")}
              </Button>

            </Dialog.Actions>
          </Dialog>
        </Portal>
        <View style={styles.regist}>
          <Button
            style={styles.botonInic}
            mode="text"
            color="#56DACB"
            onPress={() => {
              ValidateUser();
              resetTextInputValues();
            }}
          >
            {t("signInTag")}
          </Button>

          <Text style={styles.textSingIn}>{t("signInMessage")}</Text>
          <Button
            style={styles.botonRegis}
            mode="text"
            fontSize="20"
            color="white"
            onPress={() => {
              props.navigation.navigate("Register");
              resetTextInputValues();
            }}
          >
            {t("signUpTag")}
          </Button>
          <Text style={styles.textSingIn}> {t("forgetPass")}?</Text>
          <Button
            style={styles.botonForget}
            mode="text"
            fontSize="20"
            color="white"
            onPress={() => {
              showDialogUser()
            }}
          >
            {t("recoverPass")}
          </Button>
        </View>
        <View style={styles.empty2}></View>

      </ImageBackground>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 15,
    flexDirection: "column",
  },
  textInputUserValues: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderRadius: 12,
    elevation: 15,
    height: 60,
    paddingLeft: 20,
    fontSize: 20,
    color: "#484848",
  },
  empty1: {
    flex: 5,
  },
  empty2: {
    flex: 1,
  },
  components: {
    flex: 3,
  },
  regist: {
    flex: 3,
    padding: 10,
    alignItems: "center",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000a0",
  },
  textimput: {
    margin: 20,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 15,
    height: 60,
    paddingLeft: 20,
    fontSize: 20,
    color: "#484848",
  },
  botonInic: {
    width: 250,
    height: 60,
    borderRadius: 30,
    elevation: 12,
    paddingTop: 10,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
  },
  textSingIn: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 15
  },
  botonRegis: {
    margin: 5,
    width: 200,
    height: 45,
    borderRadius: 30,
    fontSize: 15,

    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    alignSelf: "center",
  },

  botonForget: {
    margin: 5,
    width: 300,
    height: 45,
    borderRadius: 30,
    fontSize: 15,

    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    alignSelf: "center",
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
});
