
import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

import { myTeams } from '../../data/mockTeams';

export default function Teams({ navigation }) {
  return (
    <View style={styles.mainView}>
      <View style={[styles.row, {
        justifyContent: 'center'
      }]}>
        <View style={styles.createButton}>
          <TouchableOpacity onPress={() => {
            navigation.navigate('CreateTeam');
          }}>
            <Text style={styles.buttonText}>Create Team</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.joinButton}>
          <TouchableOpacity onPress={() => {
            navigation.navigate('JoinTeam');
          }}>
            <Text>Join Team</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.h1, { marginVertical: 16 }]}>My Teams</Text>
      <FlatList contentContainerStyle={{ paddingBottom: 80 }}
        data={myTeams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <TouchableWithoutFeedback onPress={() => {
              navigation.navigate("ViewTeam", { team: item });
            }}>
              <View style={teamStyles.team}>
                <ImageBackground source={{ uri: item.image }} resizeMode="cover" style={teamStyles.image}>
                  <View style={teamStyles.bottomView}>

                    <View>
                      <Text style={teamStyles.name}>{item.name}</Text>
                      <Text style={teamStyles.description}>{item.description.substring(0, 16)}</Text>
                    </View>

                    <View style={teamStyles.memberCountView}>
                      <Text style={teamStyles.memberCount}>{item.memberCount}</Text>
                      <Icon name="user-friends" size={16} color="#fff" />
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </TouchableWithoutFeedback>
          );
        }} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    padding: 16
  },
  row: {
    flexDirection: 'row',
  },
  createButton: {
    backgroundColor: 'rgb(7, 77, 233)',
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 16
  },
  joinButton: {
    borderColor: 'rgb(7, 77, 233)',
    borderWidth: 1,
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 16
  },
  buttonText: {
    color: 'white',
  },
  h1: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

const teamStyles = StyleSheet.create({
  team: {
    borderRadius: 16,
    minHeight: 150,
    overflow: "hidden",
    marginBottom: 24
  },
  image: {
    flex: 1,
    justifyContent: "flex-end"
  },
  bottomView: {
    padding: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    color: "white",
    fontWeight: "bold",
  },
  description: {
    color: "white",
  },
  memberCount: {
    color: "white",
    marginRight: 8
  },
  memberCountView: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  }
});