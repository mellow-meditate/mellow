import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { defaultTeamImageURL } from './Teams';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Searchbar } from 'react-native-paper';
import firebase from 'firebase';

const useTeams = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection('teams')
      .get()
      .then((querySnapshot) => {
        let allTeams = [];
        querySnapshot.docs.forEach((doc) => {
          allTeams = [...allTeams, { ...doc.data(), id: doc.id }];
        });
        setTeams(allTeams);
        setLoading(false);
      })
      .catch((err) => {
        console.log(error);
        setLoading(false);
        setError(err);
      });
  }, []);

  return [teams, loading, error];
};

const JoinTeam = ({ navigation }) => {
  const [teams, loading, error] = useTeams();
  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = (query) => setSearchQuery(query);
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const circleAnimatedValue = useRef(new Animated.Value(0)).current;

  const skeletonAnimate = () => {
    circleAnimatedValue.setValue(0);
    Animated.timing(circleAnimatedValue, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        skeletonAnimate();
      }, 100);
    });
  };
  useEffect(() => {
    skeletonAnimate();
  }, []);

  const windowWidth = useWindowDimensions().width;
  const translateX = circleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 50],
  });

  const translateX2 = circleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, windowWidth],
  });

  const translateX3 = circleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 32],
  });

  return (
    <View>
      {/* Search Bar */}
      <Searchbar
        theme={{ colors: { primary: '#222' } }}
        placeholder="Find a Team"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />

      {loading && (
        <FlatList
          data={[{ key: 1 }, { key: 2 }, { key: 3 }]}
          renderItem={() => {
            return (
              <View style={[teamStyles.team, { backgroundColor: '#fff' }]}>
                <View
                  style={[
                    teamStyles.image,
                    {
                      backgroundColor: '#ECEFF1',
                    },
                  ]}
                >
                  <Animated.View
                    style={{
                      width: '30%',
                      opacity: 0.5,
                      height: '100%',
                      backgroundColor: 'white',
                      transform: [{ translateX: translateX }],
                    }}
                  ></Animated.View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 1,
                  }}
                >
                  <Animated.View
                    style={{
                      backgroundColor: '#ECEFF1',
                      flex: 1,
                      marginRight: 32,
                      height: 32,
                    }}
                  >
                    <Animated.View
                      style={{
                        width: '20%',
                        height: '100%',
                        backgroundColor: 'white',
                        opacity: 0.5,
                        transform: [{ translateX: translateX2 }],
                      }}
                    ></Animated.View>
                  </Animated.View>
                  <Animated.View
                    style={{
                      backgroundColor: '#ECEFF1',
                      width: 32,
                      height: 32,
                    }}
                  >
                    <Animated.View
                      style={{
                        width: '20%',
                        height: '100%',
                        backgroundColor: 'white',
                        opacity: 0.5,
                        transform: [{ translateX: translateX3 }],
                      }}
                    ></Animated.View>
                  </Animated.View>
                </View>
              </View>
            );
          }}
        />
      )}
      {/* All Teams list */}
      {!loading && filteredTeams.length == 0 && (
        <View style={{ padding: 16 }}>
          <Text>No teams found</Text>
        </View>
      )}
      {filteredTeams.length > 0 && (
        <FlatList
          data={filteredTeams}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                delayPressIn={50}
                onPress={() => {
                  navigation.navigate('ViewTeam', {
                    team: item,
                    showJoinButton: !item.members.includes(
                      firebase.auth().currentUser.uid
                    ),
                  });
                }}
              >
                <View style={teamStyles.team}>
                  <Image
                    source={{ uri: item.imageURL || defaultTeamImageURL }}
                    style={teamStyles.image}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={teamStyles.name}>{item.name}</Text>
                    <View
                      style={{
                        width: '20%',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={teamStyles.memberCount}>
                        {item.members.length}
                      </Text>
                      <Icon name="user-friends" size={16} color="#222" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};
export default JoinTeam;

const teamStyles = StyleSheet.create({
  searchBar: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderTopColor: '#bbb',
    borderBottomColor: '#bbb',
  },
  searchText: {
    marginLeft: 8,
  },
  team: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
  },
  name: {
    flexDirection: 'column',
    // width: '90%',
    flex: 1,
  },
  memberCount: {
    marginRight: 4,
    fontSize: 16,
  },
});
