import React, { useEffect, useState } from 'react';
import { View, Button, TouchableHighlight, Text } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import { GoogleOAuth } from '../../env';

const Landing = ({ navigation }) => {
  const [processingGoogleLogin, setProcessingGoogleLogin] = useState(false);
  const promptAsync = async () => {
    try {
      const { type, accessToken } = await Google.logInAsync({
        androidClientId: GoogleOAuth.expoProxyClientId,
        androidStandaloneAppClientId: GoogleOAuth.androidClientId,
        clientId: GoogleOAuth.androidClientId,
        scopes: ['profile', 'email'],
      });
      if (type === 'success') {
        setProcessingGoogleLogin(true);
        firebase
          .auth()
          .signInWithCredential(
            firebase.auth.GoogleAuthProvider.credential(null, accessToken)
          )
          .then((result) => {
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .firestore()
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .set({
                  name: result.additionalUserInfo.profile.name,
                  email: result.additionalUserInfo.profile.email,
                  imageURL: result.additionalUserInfo.profile.picture,
                  created: firebase.firestore.Timestamp.now(),
                  provider: 'GOOGLE',
                });
            }
          });
      }
    } catch (err) {
      alert('Google Signin Error');
      console.log(err);
    }
  };

  return processingGoogleLogin ? (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Logging in with Google...</Text>
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TouchableHighlight style={{ width: '40%', borderRadius: 20 }}>
        <Button
          title="Register"
          onPress={() => {
            navigation.navigate('Register');
          }}
        />
      </TouchableHighlight>
      <TouchableHighlight
        style={{ width: '40%', marginTop: 20, borderRadius: 10 }}
      >
        <Button
          title="Login"
          onPress={() => {
            navigation.navigate('Login');
          }}
        />
      </TouchableHighlight>
      <TouchableHighlight
        style={{ width: '40%', marginTop: 20, borderRadius: 10 }}
        onPress={() => {
          try {
            promptAsync();
          } catch (e) {
            console.log(e);
          }
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#2196f3',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
          }}
        >
          <FontAwesomeIcon name="google" size={24} color="white" />
          <Text style={{ marginLeft: 8, color: 'white' }}>
            LOGIN WITH GOOGLE
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};
export default Landing;
// const styles = StyleSheet.create({
//   button: {
//     marginTop: 20,
//     textAlign: 'center',
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
// });
