import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ToastAndroid,
} from "react-native";
import firebase from "firebase";
import { LinearGradient } from "expo-linear-gradient";

export default function () {
  const [state, setState] = useState({
    name: "",
    description: "",
    imageURL: "",
  });
  const handlePress = () => {
    if (state.name == "")
      return ToastAndroid.show("Please enter a team name.", ToastAndroid.SHORT);
    if (state.description == "")
      return ToastAndroid.show(
        "Please enter a team description.",
        ToastAndroid.SHORT
      );
    if (state.description.length > 200)
      return ToastAndroid.show(
        "Team description cannot be more than 200 characters.",
        ToastAndroid.SHORT
      );
    if (state.imageURL == "")
      return ToastAndroid.show(
        "Please enter a team image URL.",
        ToastAndroid.SHORT
      );

    // Make the firestore request
    firebase
      .firestore()
      .collection("teams")
      .add({
        name: state.name,
        description: state.description,
        imageURL: state.imageURL,
        members: [firebase.auth().currentUser.uid],
        createdBy: firebase.auth().currentUser.uid,
      })
      .then(() => {
        ToastAndroid.show("Team created successfully.", ToastAndroid.SHORT);
        setState({
          name: "",
          description: "",
          imageURL: "",
        });
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show("Error creating team.", ToastAndroid.SHORT);
      });
  };
  return (
    <LinearGradient
      colors={["#000428", "#004e92"]}
      style={styles.background}
      start={[1, 1]}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Team Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Team Name"
              onChangeText={(text) => setState({ ...state, name: text })}
              value={state.name}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Team Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Team Description"
              onChangeText={(text) => setState({ ...state, description: text })}
              value={state.description}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Team Image URL</Text>
            <TextInput
              style={styles.input}
              placeholder="Team Image URL"
              onChangeText={(text) => setState({ ...state, imageURL: text })}
              value={state.imageURL}
            />
          </View>
          <TouchableHighlight style={styles.buttonContainer}>
            <Button onPress={handlePress} title="Create Team" />
          </TouchableHighlight>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    height: "100%",
    paddingLeft: 17,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "white",
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 40,
    borderRadius: 20,
  },
});
