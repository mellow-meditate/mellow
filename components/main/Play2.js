import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { popular } from "../../data/meditations";
const audio = {
  id: "ff171f80-5960-41e7-965c-1f9bcf31e02c",
  order: 1,
  title: "Power of Love",
  track: 0,
  subtitle: "Love and Peace",
  time: 2,
  uri: "https://goofy-ritchie-dd0c3d.netlify.app/meditations/17.mp3",
  image: require("../../assets/meditate.jpg"),
};

export default function Play2({ route, navigation }) {
  const { id } = route.params;
  // console.log("recieved id : " + id);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackObject, setPlaybackObject] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState(null);

  function useMeditate(id) {
    popular.forEach((item) => {
      if (item.id == id) {
        // console.log("item.id " + item.id);
        // console.log("id " + id);
        // console.log("item " + item);
        let arr = [item.uri, item.image, item.title, item.subtitle];
        return arr;
      }
    });
  }

  let arr = useMeditate(id);
  // console.log(arr);
  //   const title = arr[2];
  //   const image = arr[1];
  //   const subtitle = arr[3];
  //   const uri = arr[0];

  // const title = "tit";
  // const image = "../../assets/meditate.jpg";
  // const subtitle = "sub";
  // const uri = "https://goofy-ritchie-dd0c3d.netlify.app/meditations/17.mp3";

  useEffect(() => {
    if (playbackObject === null) {
      setPlaybackObject(new Audio.Sound());
    }
  }, []);

  const handleAudioPlayPause = async () => {
    if (playbackObject !== null && playbackStatus === null) {
      const status = await playbackObject.loadAsync(
        { uri: uri },
        { shouldPlay: true }
      );
      setIsPlaying(true);
      return setPlaybackStatus(status);
    }

    // It will pause our audio
    if (playbackStatus.isPlaying) {
      const status = await playbackObject.pauseAsync();
      setIsPlaying(false);
      return setPlaybackStatus(status);
    }

    // It will resume our audio
    if (!playbackStatus.isPlaying) {
      const status = await playbackObject.playAsync();
      setIsPlaying(true);
      return setPlaybackStatus(status);
    }
  };

  const { title, image, subtitle, uri } = audio;

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Ionicons
        style={{
          alignSelf: "center",
          backgroundColor: "gray",
          padding: 10,
          borderRadius: 50,
        }}
        name={isPlaying ? "pause" : "play"}
        size={24}
        color="white"
        onPress={handleAudioPlayPause}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 31,
    paddingRight: 31,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 30,
  },
  image: {
    width: "100%",
    height: "100%",
    maxWidth: 300,
    maxHeight: 300,
    marginBottom: 30,
    borderRadius: 10,
    alignSelf: "center",
  },
  favourite: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
