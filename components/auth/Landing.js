import React from "react";
import {
  View,
  Button,
  StyleSheet,
  TouchableHighlight,
} from "react-native";

export default function Landing({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableHighlight style={{ width: "40%", borderRadius: 20 }}>
        <Button
          title="Register"
          onPress={() => {
            navigation.navigate("Register");
          }}
        />
      </TouchableHighlight>
      <TouchableHighlight
        style={{ width: "40%", marginTop: 20, borderRadius: 10 }}
      >
        <Button
          title="Login"
          onPress={() => {
            navigation.navigate("Login");
          }}
        />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});
