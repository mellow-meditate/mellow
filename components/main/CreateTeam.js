import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Image,
  Keyboard,
  Animated,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import uuid from 'uuid';
import imagePickSVG from '../../assets/pick_image.png';
import { defaultTeamImageURL } from './Teams';

const defaultState = {
  uploading: false,
  name: '',
  description: '',
  imageURL: '',
};

const uploadImageAsync = async (uri) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      blob.close();
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const fileRef = firebase.storage().ref('teams/').child(uuid.v4());
  const snapshot = await fileRef.put(blob);
  blob.close();
  return await snapshot.ref.getDownloadURL();
};

const CreateTeam = ({ navigation }) => {
  const popupAnim = useRef(new Animated.Value(0)).current;
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    setState(defaultState);
  }, []);

  const handlePickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need Photo gallery permissions to make this work!');
          return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        setState((curState) => ({ ...curState, uploading: true }));
        if (!pickerResult.cancelled) {
          const uploadUrl = await uploadImageAsync(pickerResult.uri);
          setState((curState) => ({ ...curState, imageURL: uploadUrl }));
        }
      }
    } catch (err) {
      console.log(err);
      alert('Image upload failed.');
    } finally {
      setState((curState) => ({ ...curState, uploading: false }));
    }
  };

  // Animate the input fields up so that keyboard doesn't cover them
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        Animated.timing(popupAnim, {
          toValue: -200,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Animated.timing(popupAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const maybeShowLoadingIndicator = () => {
    if (state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 24,
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  const handleCreatePress = () => {
    if (state.uploading) return alert('Please wait for the image to upload');
    if (state.name == '') return alert('Please enter a valid team name.');
    if (state.name.length > 30)
      return alert('Team name cannot be more than 30 characters.');
    if (state.description == '')
      return alert('Please enter a valid team description.');
    if (state.description.length > 200)
      return alert('Team description cannot be more than 200 characters.');

    // Make the firestore request
    firebase
      .firestore()
      .collection('teams')
      .add({
        name: state.name,
        description: state.description,
        imageURL: state.imageURL,
        members: [firebase.auth().currentUser.uid],
        createdBy: firebase.auth().currentUser.uid,
        created: firebase.firestore.Timestamp.now(),
      })
      .then(async (docRef) => {
        await firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .update({
            teams: firebase.firestore.FieldValue.arrayUnion(docRef.id),
          });
        alert('Team created successfully.');
        navigation.navigate('Teams');
        setState(defaultState);
      })
      .catch((error) => {
        console.log(error);
        alert('Error creating team.');
      });
  };
  return (
    <View style={styles.container}>
      <Image
        key={`${state.imageURL}${new Date()}`}
        style={styles.image}
        source={{
          uri: state.imageURL != '' ? state.imageURL : defaultTeamImageURL,
          cache: 'reload',
          headers: {
            Pragma: 'no-cache',
          },
        }}
        resizeMode="cover"
      />
      <TouchableHighlight
        style={styles.pickImageButton}
        onPress={handlePickImage}
        disabled={state.uploading}
      >
        <>
          <Image style={styles.pickImage} source={imagePickSVG} />
          {maybeShowLoadingIndicator()}
        </>
      </TouchableHighlight>
      <Animated.View
        style={[
          styles.inputContainer,
          {
            marginTop: popupAnim,
          },
        ]}
      >
        <View style={styles.inputGroup}>
          <View style={styles.row}>
            <Text style={styles.inputLabel}>Team Name</Text>
            <Text style={styles.inputLabel}>{state.name.length}/30</Text>
          </View>
          <TextInput
            style={styles.input}
            autoFocus={true}
            placeholder="Enter your team name"
            maxLength={30}
            onChangeText={(text) =>
              setState((curState) => ({ ...curState, name: text }))
            }
            value={state.name}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.row}>
            <Text style={styles.inputLabel}>Team Description</Text>
            <Text style={styles.inputLabel}>
              {state.description.length}/200
            </Text>
          </View>
          <TextInput
            style={[
              styles.input,
              {
                height: 138,
              },
            ]}
            multiline={true}
            placeholder="Enter your team description"
            maxLength={200}
            onChangeText={(text) =>
              setState((curState) => ({ ...curState, description: text }))
            }
            value={state.description}
          />
        </View>
        <TouchableHighlight
          style={styles.buttonContainer}
          onPress={handleCreatePress}
        >
          <Text style={styles.button}>Create Team</Text>
        </TouchableHighlight>
      </Animated.View>
    </View>
  );
};

export default CreateTeam;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pickImageButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  pickImage: {
    width: 16,
    height: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: 256,
  },
  inputContainer: {
    width: '100%',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    transform: [{ translateY: -24 }],
    backgroundColor: '#fff',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#767676',
    letterSpacing: 1.1,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#767676',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 40,
    borderRadius: 20,
  },
  button: {
    backgroundColor: '#074EE8',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
