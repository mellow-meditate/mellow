import * as React from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";

import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import PlayerControls from "./PlayControls";

import { Meditation, meditations } from "../../data/meditations";

// import { useAppSelector, useMeditation } from "../../hooks";
// import NotFoundScreen from '../NotFoundScreen'
// import { HomeParamList, MainStackParamList } from '../../types'
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
// import { useMsToTime, useAppDispatch } from "../../hooks";
// import { completed, updateFavourite } from '../../redux/meditationSlice'
// import { LoadingScreen } from "../../components";
import { useCallback } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
// import { selectFavourites, selectFilePaths } from '../../redux/selectors'
// import FavouriteButton from '../../components/FavouriteButton'

export default function Play({ id, navigation }) {
  // function useMeditation(id) {
  //   console.log(id);
  //   const arr = Object.values(meditations).flat();
  //   const meditation = arr.find((m) => m.id === id);

  //   return meditation;
  // }

  // const { id } = route.params;
  //const meditation = useMeditation(id);
  // const meditation = "ff171f80-5960-41e7-965c-1f9bcf31e02c";
  const uri = "https://goofy-ritchie-dd0c3d.netlify.app/meditations/17.mp3";

  const meditation = {
    id: "ff171f80-5960-41e7-965c-1f9bcf31e02c",
    order: 1,
    title: "Power of Love",
    track: 0,
    subtitle: "Love and Peace",
    time: 2,
    uri: "https://goofy-ritchie-dd0c3d.netlify.app/meditations/17.mp3",
    image: require("../../assets/meditate.jpg"),
  };

  //   const favourites = useAppSelector(selectFavourites);
  const [isLoadingAudio, setIsLoadingAudio] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [sound, setSound] = React.useState();
  const [positionMillis, setPositionMillis] = React.useState(0);
  const [durationMills, setDurationMills] = React.useState(0);
  const durationTime = useMsToTime(durationMills);
  const positionTime = useMsToTime(positionMillis);
  const dispatch = useDispatch();
  //const uri = meditation?.uri || "";
  // const filepaths = useSelector(selectFilePaths);

  // const isFavourited = favourites.some((item) => item.id === meditation?.id);

  // const onFavourite = () => {
  //   dispatch(updateFavourite(meditation));
  // };

  function formatToString(n) {
    return n < 10 ? `0${n}` : n;
  }

  function useMsToTime(s) {
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const minsString = formatToString(mins);
    const secsString = formatToString(secs);

    return minsString + ":" + secsString;
  }

  function useMsToMinutes(ms) {
    const minutes = Math.floor(ms / 60000);

    return minutes;
  }
  function useMinutesToStatsTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    if (h && m) {
      return `${h}h ${m}m`;
    } else if (h) {
      return `${h} hour${h === 1 ? "" : "s"}`;
    } else {
      return `${m} minute${m === 1 ? "" : "s"}`;
    }
  }

  const onPlaybackStatusUpdate = useCallback(
    (playbackStatus) => {
      if (!playbackStatus.isLoaded) {
        // Update your UI for the unloaded state
      } else {
        // Update your UI for the loaded state
        if (playbackStatus.positionMillis) {
          setPositionMillis(playbackStatus.positionMillis);
        }
        if (playbackStatus.durationMillis) {
          setDurationMills(playbackStatus.durationMillis);
        }
        if (playbackStatus.didJustFinish) {
          dispatch(completed(playbackStatus.durationMillis || 0));
          setIsPlaying(false);
          navigation.replace("CompletedScreen");
        }
      }
    },
    [dispatch, navigation]
  );

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  React.useEffect(() => {
    const loadAudio = async () => {
      let filename = uri.split("/").pop() ?? "";
      let filepath = filepaths.find((file) => {
        if (file.split("/").pop() === filename) {
          return file;
        }
      });

      setIsLoadingAudio(true);

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      if (filepath) {
        // Load from downloaded audio file
        const _sound = new Audio.Sound();
        _sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        await _sound.loadAsync({ uri: filepath });
        setSound(_sound);
      } else {
        // Load from remote URI
        const { sound: _sound } = await Audio.Sound.createAsync(
          { uri },
          {},
          onPlaybackStatusUpdate
        );
        setSound(_sound);
      }

      setIsLoadingAudio(false);
    };

    loadAudio();
  }, [onPlaybackStatusUpdate, uri]);

  const replay = async () => {
    await sound?.setPositionAsync(positionMillis - 10 * 1000);
  };

  const forward = async () => {
    await sound?.setPositionAsync(positionMillis + 10 * 1000);
  };

  const play = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  if (!meditation) {
    return (
      <View>
        <Text>Not Found Screen</Text>
      </View>
    );
  }

  const { title, subtitle, image } = meditation;

  if (isLoadingAudio) {
    // return <LoadingScreen loading={isLoadingAudio} />;
    <Text>Loading</Text>;
  }

  return (
    <View style={styles.container}>
      {/* <FavouriteButton isFavourited={isFavourited} style={styles.favourite} onPress={onFavourite} /> */}
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <PlayerControls
        isPlaying={isPlaying}
        play={play}
        pause={pause}
        replay={replay}
        forward={forward}
        positionTime={positionTime}
        durationTime={durationTime}
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
