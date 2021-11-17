import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import firebase from 'firebase';
require('firebase/firestore');
import { connect } from 'react-redux';

const onLogout = () => {
  firebase.auth().signOut();
};

function Profile(props) {
  const [image, setImage] = useState();
  const [upload, setUpload] = useState();
  const { currentUser } = props;

  return (
    <LinearGradient
      colors={['#000428', '#004e92']}
      style={styles.background}
      start={[1, 1]}
    >
      <View>
        <View style={styles.textbackground}>
          <Text style={styles.name}>Name : {currentUser.name}</Text>
        </View>
        <View style={styles.textbackground}>
          <Text style={styles.email}>Email : {currentUser.email}</Text>
        </View>
        <View style={styles.textbackground}>
          <Text style={styles.email}>Donations : {currentUser.donations}</Text>
        </View>
        <View style={styles.textbackground}>
          <Text style={styles.email}>
            Meditations : {currentUser.meditations}
          </Text>
        </View>
        <View style={styles.textbackground}>
          <Text style={styles.email}>
            Relief Bot Conversations : {currentUser.chatbotConvs}
          </Text>
        </View>
        <View style={styles.logoutButton}>
          <TouchableOpacity
            onPress={() => {
              onLogout();
            }}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const styles = StyleSheet.create({
  background: {
    height: '100%',
  },
  textbackground: {
    marginLeft: 40,
    marginTop: 30,
    backgroundColor: 'black',
    height: 50,
    width: 300,
    justifyContent: 'center',
    borderRadius: 16,
  },
  name: {
    color: 'white',
    marginLeft: 20,
    fontSize: 18,
  },
  email: {
    color: 'white',
    marginLeft: 20,
    fontSize: 18,
  },
  logout: {
    backgroundColor: 'rgb(7, 77, 233)',
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 70,
    width: 170,
    marginLeft: 105,
  },
  logoutButton: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 40,
    backgroundColor: 'rgb(7, 77, 233)',
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 130,
    width: 120,
    height: 40,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
  },
});

export default connect(mapStateToProps, null)(Profile);
