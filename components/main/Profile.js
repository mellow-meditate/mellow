import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";

const onLogout = () => {
  firebase.auth().signOut();
};

function Profile(props) {
  const { currentUser } = props;
  console.log({ currentUser });
  return (
    <LinearGradient
      colors={["#000428", "#004e92"]}
      style={styles.background}
      start={[1, 1]}
    >
      <View>
        <Text style={styles.name}>Name : {currentUser.name}</Text>
        <Text style={styles.email}>Email : {currentUser.email}</Text>
        <Button
          style={styles.button}
          title="Logout"
          onPress={() => onLogout()}
        />
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
