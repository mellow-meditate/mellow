import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import firebase from 'firebase';
import { Audio } from 'expo-av';
import { meditations } from '../../data/meditations';
import { LinearGradient } from 'expo-linear-gradient';
import PlayerControls from './PlayControls';
import { minutesToPoints } from '../../misc/Points';

export default function Play({ route, navigation }) {
  const { id } = route.params;
  const mountedRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [positionTime, setPositionTime] = useState(0);
  const [durationTime, setDurationTime] = useState(0);
  const [playbackObject, setPlaybackObject] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      (async () => {
        if (playbackObject) {
          await playbackObject.stopAsync();
        }
      })();
      mountedRef.current = false;
    };
  }, [playbackObject]);

  // Meditation complete modal
  const [modalVisible, setModalVisible] = useState(false);
  const [updatingPoints, setUpdatingPoints] = useState(false);

  let { title, image, subtitle, uri, time } = [...Object.values(meditations)]
    .flat()
    .find((meditation) => meditation.id === id);
  const handlePlay = async () => {
    // First time we play, we need to load the audio file
    if (playbackObject == null) {
      let soundObject = new Audio.Sound();
      const status = await soundObject.loadAsync(
        { uri: uri },
        { shouldPlay: true }
      );
      soundObject.setOnPlaybackStatusUpdate((currentStatus) => {
        if (!mountedRef.current) return;
        setPositionTime(currentStatus.positionMillis);
        setDurationTime(currentStatus.durationMillis);
        if (currentStatus.didJustFinish) {
          setModalVisible(true);
          setIsPlaying(false);
          setPlaybackStatus(null);
          setPlaybackObject(null);
        }
      });
      setPlaybackObject(soundObject);
      setIsPlaying(true);
      setPlaybackStatus(status);
      return;
    }
    // If already paused once, we don't need to load the audio file again
    if (playbackObject) {
      const status = await playbackObject.playAsync();
      setPlaybackStatus(status);
      setIsPlaying(true);
      return;
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
        <PlayerControls
          isPlaying={isPlaying}
          positionTime={positionTime}
          durationTime={durationTime}
          playbackStatus={playbackStatus}
          pause={async () => {
            const status = await playbackObject.pauseAsync();
            setIsPlaying(false);
            setPlaybackStatus(status);
          }}
          play={handlePlay}
          seekForward={async () => {
            const status = await playbackObject.setPositionAsync(
              positionTime + 10000
            );
            setIsPlaying(true);
            setPlaybackStatus(status);
          }}
        />
        {modalVisible && (
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'absolute',
              flex: 1,
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onShow={async () => {
            // Add the points to the firebase of user
            setUpdatingPoints(true);
            let pointsToAdd = minutesToPoints(time);

            firebase
              .firestore()
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              .update({
                points: firebase.firestore.FieldValue.increment(pointsToAdd),
                meditations: firebase.firestore.FieldValue.increment(1),
              })
              .then(() => {
                setUpdatingPoints(false);
              });
          }}
          onRequestClose={() => {
            setModalVisible(false);
            navigation.navigate('Home');
          }}
        >
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <View style={{ alignItems: 'center' }}>
                <Text style={modalStyles.title}>Meditation Completed</Text>
                <Text style={modalStyles.subtitle}>
                  Yay! You got {minutesToPoints(time)} points
                </Text>

                <TouchableOpacity
                  style={modalStyles.collectBtn}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('Home');
                  }}
                  disabled={updatingPoints}
                >
                  <Text style={modalStyles.buttonText}>
                    {updatingPoints ? 'Loading...' : 'Continue'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  },
  title: {
    fontSize: 24,
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

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  collectBtn: {
    backgroundColor: 'rgba(110,255,110,1)',
    borderRadius: 16,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
