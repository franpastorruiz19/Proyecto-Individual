import * as React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import { FAB, Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Linking from "expo-linking";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { context, IP, port } from "../../utils/Data/Server";

export default function RouteInfo(props) {
  const { t, i18n } = useTranslation();
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState(false);
  useEffect(() => {
    const [lat, lng] = props.route.params.rut.map.split(",");
    setLatitude(parseFloat(lat));
    setLongitude(parseFloat(lng));
    IsCompleted();
    IsVoted()
      ;
  }, []);
  console.log(props.route.params.rut.map);

  // this function is used to open the google maps app with the route
  function openGps(lat, lng) {
    var scheme = Platform.OS === "ios" ? "maps:" : "google.navigation:q=";
    var url = scheme + `${lat},${lng}`;
    Linking.openURL(url);
  }

  const [txtCompl, setTxtCompl] = useState(t("markCompletedBtn"));
  const [completed, setCompleted] = useState(false);
  const [visibleVotes, setVisibleVotes] = useState(false);

  const IsCompleted = () => {
    axios
      .post(
        "http://" + IP + ":" + port + "/" + context,
        '{"type":"isCompleted_route","user_id":' +
        props.route.params.user.id +
        ',"route_id":' +
        props.route.params.rut.id +
        "}"
      )
      .then((res) => {
        console.log(res.data);
        if (res.data === "Ok") {
          console.log("Lacasitos");
          setCompleted(true);
          setTxtCompl(t("markCompleted"));
          if (!voted) {
            setVisibleVotes(true)
          }

        } else {
          console.log("pomodoro");
          setCompleted(false);
          setVisibleVotes(false)
          setTxtCompl(t("markCompletedBtn"));
        }
      })
      .catch((res) => {
        console.log(res.data);
        console.log("Error");
      });
  };

  const IsVoted = () => {
    axios
      .post(
        "http://" + IP + ":" + port + "/" + context,
        '{"type":"isVoted_route","user_id":' +
        props.route.params.user.id +
        ',"route_id":' +
        props.route.params.rut.id +
        "}"
      )
      .then((res) => {
        console.log(res.data);
        if (res.data === "Ok") {
          setVisibleVotes(false)
          setVoted(true)
        } else {
          setVoted(false)
          setVisibleVotes(true);
        }
      })
      .catch((res) => {
        console.log(res.data);
        console.log("Error");
      });
  };

  const VisitSite = () => {
    console.log(
      "http://" + IP + ":" + port + "/" + context,
      '{"type":"visited_site_add","user_id":' +
      props.route.params.user.id +
      ',"route_id":' +
      props.route.params.rut.id +
      "}"
    );

    axios
      .post(
        "http://" + IP + ":" + port + "/" + context,
        '{"type":"visited_site_add","user_id":' +
        props.route.params.user.id +
        ',"route_id":' +
        props.route.params.rut.id +
        "}"
      )
      .then((res) => {
        console.log(res.data);
        setTxtCompl(t("markCompleted"));
        setCompleted(true);
        setVisibleVotes(true)
      })
      .catch((res) => {
        console.log(res.data);
        console.log("Error");
      });
  };
  let [pulsat, setPulsat] = useState({ e1: false, e2: false, e3: false, e4: false, e5: false })
  let [colorEstrela, setEstrela] = useState({ e1: "black", e2: "black", e3: "black", e4: "black", e5: "black" })
  let [Icona, setIcona] = useState({ e1: "star-outline", e2: "star-outline", e3: "star-outline", e4: "star-outline", e5: "star-outline" })

  const pulsar1 = () => {
    if (!pulsat.e1) {
      setPulsat({ e1: true, e2: false, e3: false, e4: false, e5: false })
      setEstrela({ e1: "#F6C602", e2: "black", e3: "black", e4: "black", e5: "black" })
      setIcona({ e1: "star", e2: "star-outline", e3: "star-outline", e4: "star-outline", e5: "star-outline" })
      setVotes(1)
    } else {
      setPulsat({ e1: false, e2: false, e3: false, e4: false, e5: false })
      setEstrela({ e1: "black", e2: "black", e3: "black", e4: "black", e5: "black" })
      setIcona({ e1: "star-outline", e2: "star-outline", e3: "star-outline", e4: "star-outline", e5: "star-outline" })
      setVotes(0)
    }
  }
  const pulsar2 = () => {
    if (!pulsat.e2) {
      setPulsat({ e1: false, e2: true, e3: false, e4: false, e5: false })
      setEstrela({ e1: "#F6C602", e2: "#F6C602", e3: "black", e4: "black", e5: "black" })
      setIcona({ e1: "star", e2: "star", e3: "star-outline", e4: "star-outline", e5: "star-outline" })
      setVotes(2)
    } else {
      setPulsat({ e1: false, e2: false, e3: false, e4: false, e5: false })
      setEstrela({ e1: "black", e2: "black", e3: "black", e4: "black", e5: "black" })
      setIcona({ e1: "star-outline", e2: "star-outline", e3: "star-outline", e4: "star-outline", e5: "star-outline" })
      setVotes(0)
    }
  }
  const pulsar3 = () => {
    if (!pulsat.e3) {
      setPulsat({ e1: false, e2: false, e3: true, e4: false, e5: false })
      setEstrela({ e1: "#F6C602", e2: "#F6C602", e3: "#F6C602", e4: "black", e5: "black" })
      setIcona({ e1: "star", e2: "star", e3: "star", e4: "star-outline", e5: "star-outline" })
      setVotes(3)
    } else {
      setPulsat({ e1: false, e2: false, e3: false, e4: false, e5: false })
      setEstrela({ e1: "black", e2: "black", e3: "black", e4: "black", e5: "black" })
      setIcona({ e1: "star-outline", e2: "star-outline", e3: "star-outline", e4: "star-outline", e5: "star-outline" })
      setVotes(0)
    }
  }
  const pulsar4 = () => {
    if (!pulsat.e4) {
      setPulsat({ e1: false, e2: false, e3: true, e4: true, e5: false })
      setEstrela({ e1: "#F6C602", e2: "#F6C602", e3: "#F6C602", e4: "#F6C602", e5: "black" })
      setIcona({ e1: "star", e2: "star", e3: "star", e4: "star", e5: "star-outline" })
      setVotes(4)
    } else {
      setPulsat({ e1: false, e2: false, e3: false, e4: false, e5: false })
      setEstrela({ e1: "black", e2: "black", e3: "black", e4: "black", e5: "black" })
      setIcona({ e1: "star-outline", e2: "star-outline", e3: "star-outline", e4: "star-outline", e5: "star-outline" })
      setVotes(0)
    }
  }
  const pulsar5 = () => {
    if (!pulsat.e5) {
      setPulsat({ e1: false, e2: false, e3: false, e4: false, e5: true })
      setEstrela({ e1: "#F6C602", e2: "#F6C602", e3: "#F6C602", e4: "#F6C602", e5: "#F6C602" })
      setIcona({ e1: "star", e2: "star", e3: "star", e4: "star", e5: "star" })
      setVotes(5)
    } else {
      setPulsat({ e1: false, e2: false, e3: false, e4: false, e5: false })
      setEstrela({ e1: "black", e2: "black", e3: "black", e4: "black", e5: "black" })
      setIcona({ e1: "star-outline", e2: "star-outline", e3: "star-outline", e4: "star-outline", e5: "star-outline" })
      setVotes(0)
    }
  }
  const VoteIfCompleted = () => {
    if (completed) {
      if (!voted) {
        return (
          <View>
            <Text style={[styles.tagTitle, { marginTop: 55, marginLeft: 25 }]}> Rate the route: </Text>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>

              <IconButton icon={Icona.e1} size={45} color={colorEstrela.e1} style={{ justifyContent: 'center' }} onPress={() => pulsar1()} />
              <IconButton icon={Icona.e2} size={45} color={colorEstrela.e2} style={{ justifyContent: 'center' }} onPress={() => pulsar2()} />
              <IconButton icon={Icona.e3} size={45} color={colorEstrela.e3} style={{ justifyContent: 'center' }} onPress={() => pulsar3()} />
              <IconButton icon={Icona.e4} size={45} color={colorEstrela.e4} style={{ justifyContent: 'center' }} onPress={() => pulsar4()} />
              <IconButton icon={Icona.e5} size={45} color={colorEstrela.e5} style={{ justifyContent: 'center' }} onPress={() => pulsar5()} />

            </View>
            <FAB
              style={[styles.fab2, { marginBottom: -30 }]}
              color={"#93cab3"}
              small
              icon="vote"
              label={t("saveChangesBtn")}
              onPress={() => SaveVote()}
            />
          </View>
        );
      }
    }
  }
  const SaveVote = () => {
    axios
      .post(
        "http://" + IP + ":" + port + "/" + context,
        '{"type":"Vote","user_id":' +
        props.route.params.user.id +
        ',"route_id":' +
        props.route.params.rut.id +
        ',"vote":' +
        votes +
        "}"
      ).then((res) => {
        setVisibleVotes(false);
      }).catch(
        setVisibleVotes(true)
      )
  }
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/wallpaperGrandW2.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.fabBackContainer}>
          <FAB
            style={styles.fab}
            color={"#93cab3"}
            icon="arrow-left"
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.flexImage}>
          <Image
            source={{ uri: props.route.params.rut.images }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <ScrollView style={styles.scroll}>
          <View style={styles.flexTitleConfirm}>
            <View style={styles.flexTitle}>
              <Text style={styles.tagTitle}>{t("pointNameLbl")}:</Text>
              <Text style={styles.info}>{props.route.params.rut.name}</Text>
            </View>
            <View style={styles.flexConfirm}>
              <Button
                icon="play"
                color={"#93cab3"}
                mode="text"
                onPress={() => openGps(latitude, longitude)}
              >
                {t("startBtn")}
              </Button>
            </View>
          </View>
          <View style={styles.flexDescrip}>
            <View style={styles.boxContent}>
              <View style={styles.boxInfo}>
                <Text style={styles.tagTitle}>{t("locationNameLbl")}:</Text>
                <Text style={styles.info}>
                  {t(props.route.params.rut.location)}
                </Text>
              </View>
              <View style={styles.boxInfo}>
                <Text style={styles.tagTitle}>{t("coordsLbl")}:</Text>
                <Text style={styles.info}>
                  {latitude.toFixed(4) + ", " + longitude.toFixed(4)}
                </Text>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.boxInfo}>
                <Text style={styles.tagTitle}>{t("routeTypeLbl")}:</Text>
                <Text style={styles.info}>
                  {t(props.route.params.rut.type)}
                </Text>
              </View>
              <View style={styles.boxInfo}>
                <Text style={styles.tagTitle}>{t("perfectForLbl")}:</Text>
                <Text style={styles.info}>
                  {t(props.route.params.rut.perfectoTo)}
                </Text>
              </View>
            </View>
            <View style={styles.boxContent}>
              <View style={styles.boxInfo}>
                <Text style={styles.tagTitle}>{t("isforchildren")}:</Text>
                <Text style={styles.info}>
                  {t(props.route.params.rut.forChildren)}
                </Text>
              </View>
              <View style={styles.boxInfo}>
                <Text style={styles.tagTitle}>{t("rate")}</Text>
                <Text style={styles.info}>
                  {t(props.route.params.rut.votes)}
                </Text>
              </View>
              
            </View>
            <View style={styles.boxContent}>
            <View style={styles.boxInfo}>
                <Text style={styles.tagTitle}>{t("hasRestaurant")}:</Text>
                <Text style={styles.info}>
                  {t(props.route.params.rut.hasServices)}
                </Text>
              </View>
            </View>
            <View style={styles.boxContent2}>
              <View style={styles.boxInfo2}>
                <Text style={styles.tagTitle}>{t("descriptionLbl")}:</Text>
              </View>
              <View style={styles.boxInfo2}>
                <Text style={styles.info}>
                  {props.route.params.rut.description}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.flexMap}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              pitchEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}
              region={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.09122,
                longitudeDelta: 0.00121,
              }}
            >
              <Marker
                title={t("yourPointLbl")}
                pinColor="#93cab3"
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
              ></Marker>
            </MapView>
          </View>
          {visibleVotes ? VoteIfCompleted() : null}
          <View style={styles.fabConfirmRoute}>
            <FAB
              style={styles.fab2}
              color={"#93cab3"}
              small
              icon="check-all"
              label={txtCompl}
              onPress={() => VisitSite()}
              disabled={completed}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fefefe",
  },
  scroll: {
    height: 300,
    padding: 10,
  },

  info: {
    fontSize: 20,
    color: "black",
  },
  tagTitle: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    marginBottom: 10,
  },
  tagTitle2: {
    fontSize: 16,
    color: "black",
    marginBottom: 10,
    textAlign: "center",
    alignSelf: "center",
  },
  map: {
    width: "80%",
    height: 300,
  },
  fabBackContainer: {
    position: "absolute",
    zIndex: 100,
    top: "6%",
    left: "5%",
  },
  fabConfirmRoute: {
    height: 200,
    justifyContent: "center",
  },
  fab: {
    backgroundColor: "white",
    elevation: 10,
    height: "90%",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  fab2: {
    backgroundColor: "white",
    elevation: 10,
    height: 60,
    width: "80%",
    alignSelf: "center",
    justifyContent: "center",
  },
  fab3: {
    backgroundColor: "grey",
    elevation: 10,
    height: 60,
    width: "80%",
    alignSelf: "center",
    justifyContent: "center",
  },
  flexImage: {
    flex: 1.5,
    width: "100%",
  },
  flexTitleConfirm: {
    flex: 0.5,
    flexDirection: "row",
  },
  flexTitle: {
    flex: 2,
    width: "100%",
    padding: 10,
  },
  flexConfirm: {
    flex: 1,
    justifyContent: "center",
  },
  flexDescrip: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
  boxContent: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
  boxContent2: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
  boxInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  boxInfo2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  flexMap: {
    flex: 2,
    alignItems: "center",
    width: "100%",
    marginTop: "5%",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
