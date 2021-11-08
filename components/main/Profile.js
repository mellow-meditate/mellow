import React from "react";
import { View, Text, Button } from "react-native";

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
    <View>
      <Text>Name : {currentUser.name}</Text>
      <Text>Email : {currentUser.email}</Text>
      <Button title="Logout" onPress={() => onLogout()} />
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(Profile);
