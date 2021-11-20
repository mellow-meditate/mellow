import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const millisToHumanMinSec = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

export default function PlayerControls({
  positionTime,
  durationTime,
  isPlaying,
  pause,
  play,
  seekBack,
  seekForward,
}) {
  return (
    <View style={styles.controls}>
      <View style={styles.timeView}>
        <Text style={styles.timeText}>{millisToHumanMinSec(positionTime)}</Text>
        <Text style={styles.timeText}>{millisToHumanMinSec(durationTime)}</Text>
      </View>
      <Slider
        minimumValue={0}
        maximumValue={durationTime}
        minimumTrackTintColor="white"
        maximumTrackTintColor="white"
        thumbTintColor="white"
        value={positionTime}
        disabled={true}
        style={styles.slider}
      />
      <View style={styles.buttonView}>
        {/* <TouchableOpacity onPress={seekBack} disabled={!isPlaying}>
          <Icon
            name="replay-10"
            size={48}
            color={isPlaying ? 'white' : 'rgba(200,200,200,1)'}
          />
        </TouchableOpacity> */}
        {isPlaying ? (
          <TouchableOpacity onPress={pause}>
            <Icon name="pause-circle-filled" size={48} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={play}>
            <Icon name="play-circle-filled" size={48} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={seekForward} disabled={!isPlaying}>
          <Icon
            name="forward-10"
            size={48}
            color={isPlaying ? 'white' : 'rgba(200,200,200,1)'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    alignSelf: 'center',
    width: '80%',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  timeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
  },
  slider: {
    width: '100%',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
    width: '60%',
  },
});
