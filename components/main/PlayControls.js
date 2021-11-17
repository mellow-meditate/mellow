import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';

export default function PlayerControls({
  positionTime,
  durationTime,
  isPlaying,
  pause,
  play,
  replay,
  forward,
}) {
  return (
    <View style={styles.controls}>
      <Text>{positionTime}</Text>
      <Icon name="replay-10" onPress={replay} size={30} />
      {isPlaying ? (
        <Icon name="pause-circle-filled" onPress={pause} />
      ) : (
        <Icon name="play-circle-filled" onPress={play} />
      )}
      <Icon name="forward-10" onPress={forward} size={30} />
      <Text>{durationTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
