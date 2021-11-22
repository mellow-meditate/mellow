import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as ImagePicker from 'expo-image-picker';
import donationIcon from '../../assets/donation.png';
import meditationIcon from '../../assets/meditation.png';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

import firebase from 'firebase';
import { connect } from 'react-redux';

const defaultUserImageURL =
  'https://firebasestorage.googleapis.com/v0/b/mellow-meditate.appspot.com/o/users%2Fdefault%20user%20imageurl.jpg?alt=media&token=daf8d45c-58cb-4402-88e7-cd5e9fda590e';

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

  const fileRef = firebase
    .storage()
    .ref('users/')
    .child(firebase.auth().currentUser.uid);
  const snapshot = await fileRef.put(blob);
  blob.close();
  return await snapshot.ref.getDownloadURL();
};

function Profile(props) {
  const [imageURL, setImageURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const [didUpload, setDidUpload] = useState(false);

  // const { currentUser } = props;
  const [currentUser, setCurrentUser] = useState(props.currentUser);
  useEffect(() => {
    console.log('got from firebase');
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((doc) => {
        setCurrentUser(doc.data());
      });
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
          aspect: [1, 1],
          quality: 0.5,
        });
        setUploading(true);
        if (!pickerResult.cancelled) {
          const uploadUrl = await uploadImageAsync(pickerResult.uri);
          setDidUpload(true);
          firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
              imageURL: uploadUrl,
            })
            .then(() => {
              alert('Profile picture updated successfully.');
            })
            .catch((err) => {
              console.log(err);
              alert('Error updating profile picture.');
            });
          setImageURL(uploadUrl);
        }
      }
    } catch (err) {
      setUploading(false);
      alert('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const maybeShowLoadingIndicator = () => {
    if (uploading) {
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

  return (
    <LinearGradient
      colors={['#000428', '#004e92']}
      style={styles.background}
      start={[1, 1]}
    >
      {currentUser ? (
        <>
          <View style={{ alignItems: 'center', paddingVertical: 24 }}>
            <View>
              <Image
                style={styles.profileImage}
                resizeMode="cover"
                key={`${currentUser.imageURL}${imageURL}${new Date()}`}
                source={{
                  uri: didUpload
                    ? imageURL
                    : currentUser.imageURL || defaultUserImageURL,
                  cache: 'reload',
                  headers: {
                    Pragma: 'no-cache',
                  },
                }}
              />
              <TouchableHighlight
                style={styles.editProfileImage}
                onPress={handlePickImage}
                disabled={uploading}
              >
                <>
                  <FontAwesomeIcon name="pen" size={16} color="white" />
                  {maybeShowLoadingIndicator()}
                </>
              </TouchableHighlight>
            </View>
            <Text style={styles.name}>{currentUser.name}</Text>
            <Text style={styles.email}>{currentUser.email}</Text>
          </View>
          <View style={styles.whiteContainer}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
              Statistics
            </Text>
            <View style={styles.row}>
              <View style={styles.card}>
                <Image
                  style={styles.cardImage}
                  resizeMode="contain"
                  source={meditationIcon}
                />
                <Text style={styles.cardTitle}>Meditation Sessions</Text>
                <Text style={styles.cardValue}>
                  {currentUser.meditations || 0}
                </Text>
              </View>
              <View style={styles.card}>
                <Image
                  style={styles.cardImage}
                  resizeMode="contain"
                  source={donationIcon}
                />
                <Text style={styles.cardTitle}>Donations</Text>
                <Text style={styles.cardValue}>
                  {currentUser.donations || 0}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.card}>
                <SimpleLineIcons name="clock" size={32} color="#999" />
                <Text style={styles.cardTitle}>Reliefbot Conversations</Text>
                <Text style={styles.cardValue}>
                  {currentUser.chatbotConvs || 0}
                </Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </LinearGradient>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editProfileImage: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 16,
    position: 'absolute',
    top: 12,
    left: 0,
  },
  name: {
    marginTop: 16,
    fontSize: 24,
    color: '#fff',
  },
  email: {
    marginTop: 8,
    fontSize: 14,
    color: '#fff',
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 8,
  },
  card: {
    width: '45%',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  cardImage: {
    width: 48,
    height: 32,
  },
  cardTitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  cardValue: {
    color: '#074EE8',
    fontSize: 24,
  },
});

export default connect(mapStateToProps, null)(Profile);
