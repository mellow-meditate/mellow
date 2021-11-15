import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ToastAndroid } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function ({ route }) {
  const { team } = route.params;
  return (
    <View style={styles.view}>
      <Image style={styles.image} source={{ uri: team.imageURL }} resizeMode="cover" />
      <View style={styles.nameView}>
        <Text style={styles.name}>{team.name}</Text>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Text>{team.description}</Text>
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Text style={styles.amount}>Rs. {team.amountRaised || 'Nil'}</Text>
          <Text style={styles.raised}>raised so far</Text>

          <View style={styles.row}>
            <View style={styles.card}>
              <View style={styles.line}>
                <Icon name="user-friends" size={16} color="#222" style={{ marginRight: 4 }} />
                <Text style={styles.cardTitle}>Members</Text>
              </View>
              <Text>{team.members.length}</Text>
            </View>

            {/* <View style={styles.card}>
              <View style={styles.line}>
                <Icon name="user" solid size={16} color="#222" style={{ marginRight: 4 }} />
                <Text style={styles.cardTitle}>Creator</Text>
              </View>
              <Text>{team.creator.name}</Text>
            </View> */}
          </View>

          <TouchableOpacity style={styles.inviteView} onPress={() => {
            // TODO: implement invite to my team
            ToastAndroid.show("To implement team id: " + team.id, ToastAndroid.SHORT);
          }}>
            <Text style={styles.inviteText}>Invite Teammates</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200
  },
  nameView: {
    alignItems: "center",
    transform: [{ translateY: -16 }]
  },
  name: {
    padding: 8,
    paddingHorizontal: 16,
    fontWeight: "bold",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    minWidth: "75%",
    textAlign: "center",
  },
  amount: {
    fontWeight: "bold",
    fontSize: 32
  },
  raised: {
    color: "#777",
    marginBottom: 24
  },
  inviteView: {
    backgroundColor: "rgb(1, 193, 242)",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    padding: 8.

  },
  inviteText: {
    color: "white",
    fontSize: 16,
    textTransform: "uppercase",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  cardTitle: {
    fontWeight: "bold"
  },
  memberCount: {
    marginRight: 8
  },
  creator: {
    fontSize: 12,
  },
});