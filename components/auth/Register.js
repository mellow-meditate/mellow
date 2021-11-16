import React, { Component } from "react";
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import firebase from "firebase";

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
      donations: 0,
      meditations: 0,
      chatbotConvs: 0,
      image: "",
    };
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const {
      email,
      password,
      name,
      donations,
      meditations,
      chatbotConvs,
      image,
    } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            email,
            donations,
            meditations,
            chatbotConvs,
            image,
          });
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="name"
          onChangeText={(name) => this.setState({ name })}
        />
        <TextInput
          style={styles.input}
          placeholder="email"
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          style={styles.input}
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />
        <TouchableHighlight style={styles.buttonContainer}>
          <Button onPress={() => this.onSignUp()} title="Sign Up" />
        </TouchableHighlight>
      </View>
    );
  }
}

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "90%",
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginTop: 30,
    marginLeft: 35,
  },
  buttonContainer: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginLeft: 100,
    borderRadius: 20,
  },
});
