import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";

import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";

const onLogout = () => {
  firebase.auth().signOut();
};

function Profile(props) {
  const [image, setImage] = useState();
  const [upload, setUpload] = useState();
  const { currentUser } = props;

  // _maybeRenderImage = () => {
  //   if (!image) {
  //     return;
  //   }
  // };
  // _maybeRenderUploadingOverlay = () => {
  //   if (upload) {
  //     return (
  //       <View
  //         style={[
  //           StyleSheet.absoluteFill,
  //           {
  //             backgroundColor: "rgba(0,0,0,0.4)",
  //             alignItems: "center",
  //             justifyContent: "center",
  //           },
  //         ]}
  //       >
  //         {/* <ActivityIndicator color="#fff" animating size="large" /> */}
  //       </View>
  //     );
  //   }
  // };

  // const _takePhoto = async () => {
  //   let pickerResult = await ImagePicker.launchCameraAsync({
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //   });

  //   this._handleImagePicked(pickerResult);
  // };

  // _pickImage = async () => {
  //   let pickerResult = await ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //   });

  //   console.log({ pickerResult });

  //   _handleImagePicked(pickerResult);
  // };

  // _handleImagePicked = async (pickerResult) => {
  //   try {
  //     setUpload(true);

  //     if (!pickerResult.cancelled) {
  //       const uploadUrl = await uploadImageAsync(pickerResult.uri);
  //       setImage(uploadUrl);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     alert("Upload failed, sorry :(");
  //   } finally {
  //     setUpload(false);
  //   }
  // };

  // async function uploadImageAsync(uri) {
  //   // Why are we using XMLHttpRequest? See:
  //   // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  //   const blob = await new Promise((resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.onload = function () {
  //       resolve(xhr.response);
  //     };
  //     xhr.onerror = function (e) {
  //       console.log(e);
  //       reject(new TypeError("Network request failed"));
  //     };
  //     xhr.responseType = "blob";
  //     xhr.open("GET", uri, true);
  //     xhr.send(null);
  //   });

  //   const fileRef = ref(getStorage(), uuid.v4());
  //   const result = await uploadBytes(fileRef, blob);

  //   // We're done with the blob, close and release it
  //   blob.close();

  //   return await getDownloadURL(fileRef);
  // }

  // console.log({ currentUser });

  // useEffect(() => {
  //   if (Platform.OS !== "web") {
  //     const { status } = ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== "granted") {
  //       alert("Sorry, we need camera roll permissions to make this work!");
  //     }
  //   }
  // }, []);

  return (
    <LinearGradient
      colors={["#000428", "#004e92"]}
      style={styles.background}
      start={[1, 1]}
    >
      <View>
        <Text style={styles.name}>Name : {currentUser.name}</Text>
        <Text style={styles.email}>Email : {currentUser.email}</Text>
        <Text style={styles.email}>Donations : {currentUser.donations}</Text>
        <Text style={styles.email}>
          Meditations : {currentUser.meditations}
        </Text>
        <Text style={styles.email}>
          Relief Bot Conversations : {currentUser.chatbotConvs}
        </Text>
        <Button
          style={styles.button}
          title="Logout"
          onPress={() => onLogout()}
        />
        {/* 
        {!!image && (
          <Text
            style={{
              fontSize: 20,
              marginBottom: 20,
              textAlign: "center",
              marginHorizontal: 15,
            }}
          >
            Example: Upload ImagePicker result
          </Text>
        )}

        <Button
          style={styles.button}
          onPress={_pickImage}
          title="Pick an image from camera roll"
        />

        <Button
          style={styles.button}
          onPress={_takePhoto}
          title="Take a photo"
        />

        {_maybeRenderImage()}
        {_maybeRenderUploadingOverlay()}

        <StatusBar barStyle="default" /> */}
      </View>
    </LinearGradient>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

const styles = StyleSheet.create({
  background: {
    height: "100%",
  },
  name: {
    color: "white",
    marginLeft: 20,
    fontSize: 20,
  },
  email: {
    color: "white",
    marginLeft: 20,
    fontSize: 20,
  },
  button: {
    marginTop: 50,
    width: 10,
  },
});

export default connect(mapStateToProps, null)(Profile);
