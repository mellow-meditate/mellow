import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { popular, anxiety, sleep } from '../../data/meditations';
import { LinearGradient } from 'expo-linear-gradient';

export default function Play({ route, navigation }) {
  const { id } = route.params;

  const dispatch = useDispatch();

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackObject, setPlaybackObject] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState(null);

  function useMeditate(id) {
    var flag = 0;
    var arr = new Array();
    popular.forEach((item) => {
      if (item.id == id) {
        console.log('item.id ' + item.id);
        console.log('id ' + id);

        arr.push(item.uri);
        arr.push(item.title);
        arr.push(item.subtitle);
        arr.push(item.image);
        flag = 1;
      }
    });

    if (flag == 0) {
      anxiety.forEach((item) => {
        if (item.id == id) {
          console.log('item.id ' + item.id);
          console.log('id ' + id);

          arr.push(item.uri);
          arr.push(item.title);
          arr.push(item.subtitle);
          arr.push(item.image);
          flag = 1;
        }
      });
    }

    if (flag == 0) {
      sleep.forEach((item) => {
        if (item.id == id) {
          console.log('item.id ' + item.id);
          console.log('id ' + id);

          arr.push(item.uri);
          arr.push(item.title);
          arr.push(item.subtitle);
          arr.push(item.image);
          flag = 1;
        }
      });
    }

    return arr;
  }

  var arr2 = useMeditate(id);

  var title = arr2[1];
  var image = arr2[3];
  var subtitle = arr2[2];
  var uri = arr2[0];

  useEffect(() => {
    if (playbackObject === null) {
      setPlaybackObject(new Audio.Sound());
    } else {
      playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
  }, [onPlaybackStatusUpdate]);

  const onPlaybackStatusUpdate = useCallback(
    (playbackStatus) => {
      if (!playbackStatus.isLoaded) {
        // Update your UI for the unloaded state
      } else {
        // Update your UI for the loaded state

        if (playbackStatus.didJustFinish) {
          setIsPlaying(false);
          console.log('meditation finished!!!!!!!');
        }
      }
    },
    [dispatch, navigation]
  );

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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000428', '#004e92']}
        style={styles.background}
        start={[1, 1]}
      >
        <Image source={{ uri: image }} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Ionicons
          style={{
            alignSelf: 'center',
            backgroundColor: 'gray',
            padding: 10,
            borderRadius: 50,
          }}
          name={isPlaying ? 'pause' : 'play'}
          size={24}
          color="white"
          onPress={handleAudioPlayPause}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    // paddingLeft: 31,
    // paddingRight: 31,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 30,
    color: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    marginTop: 100,
    maxWidth: 300,
    maxHeight: 300,
    marginBottom: 30,
    borderRadius: 10,
    alignSelf: 'center',
  },
  favourite: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
