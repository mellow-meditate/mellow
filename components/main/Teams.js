/*
interface Team {
    id: String,
    name: String
    imageURL: String
    description: String
    members: []
    amountRaised: Number
    created: Timestamp,
    createdBy: String (User.id)
}
*/

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  Animated,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient';

const defaultTeamImageURL =
  'https://firebasestorage.googleapis.com/v0/b/mellow-meditate.appspot.com/o/teams%2Fflower.jpeg?alt=media&token=fa163ded-9833-4ec4-ad07-bbc7f62231c5';

const useMyTeams = (navigation) => {
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      setMyTeams([]);
      setError(null);
      firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then(async (querySnapshot) => {
          const teamIds = querySnapshot.data().teams || [];

          const batches = [];
          // convert the teamIds to a new list each having 10 elements
          // to bypass the limit of 10 items in where() of firestore
          while (teamIds.length) {
            const batch = teamIds.splice(
              0,
              teamIds.length > 10 ? 10 : teamIds.length
            );
            batches.push(
              new Promise((response) => {
                firebase
                  .firestore()
                  .collection('teams')
                  .where(firebase.firestore.FieldPath.documentId(), 'in', batch)
                  .get()
                  .then((results) =>
                    response(
                      results.docs.map((result) => ({
                        id: result.id,
                        ...result.data(),
                      }))
                    )
                  );
              })
            );
          }

          Promise.all(batches).then((teamBatches) => {
            const sortedTeams = teamBatches
              .flat()
              .sort((a, b) => a.name.localeCompare(b.name));
            setMyTeams(sortedTeams);
            setLoading(false);
          });
        })
        .catch((error) => {
          console.log('error', error);
          setError(error);
          setLoading(false);
        });
    });
    return unsubscribe;
  }, [navigation]);
  return [myTeams, loading, error];
};
const Teams = ({ navigation }) => {
  const [myTeams, loading, error] = useMyTeams(navigation);
  const circleAnimatedValue = useRef(new Animated.Value(0)).current;

  const skeletonAnimate = () => {
    circleAnimatedValue.setValue(0);
    Animated.timing(circleAnimatedValue, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        skeletonAnimate();
      }, 1000);
    });
  };
  useEffect(() => {
    skeletonAnimate();
  }, []);

  const windowWidth = useWindowDimensions().width;
  const translateX = circleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, windowWidth],
  });

  const translateX2 = circleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, windowWidth],
  });
  return (
    <LinearGradient
      colors={['#000428', '#004e92']}
      style={styles.background}
      start={[1, 1]}
    >
      <View
        style={[
          styles.row,
          {
            justifyContent: 'center',
          },
        ]}
      >
        <View style={styles.createButton}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CreateTeam');
            }}
          >
            <Text style={styles.buttonText}>Create Team</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.joinButton}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('JoinTeam');
            }}
          >
            <Text style={styles.buttonText}>Join Team</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.heading}>My Teams</Text>
      {/* {loading && <Text style={{ color: '#fff' }}>Loading...</Text>} */}
      {loading && (
        <FlatList
          data={[{ key: 1 }, { key: 2 }, { key: 3 }]}
          renderItem={() => {
            return (
              <View style={teamStyles.team}>
                <View
                  style={[
                    teamStyles.image,
                    {
                      height: 75,
                      backgroundColor: '#eceff1',
                      overflow: 'hidden',
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
                {/* <View
                  style={[
                    teamStyles.bottomView,
                    {
                      flex: 1,
                      backgroundColor: 'red',
                      justifyContent: 'space-evenly',
                      overflow: 'hidden',
                    },
                  ]}
                >
                  <View>
                    <Text style={teamStyles.name}></Text>
                    <Text style={teamStyles.description}></Text>
                  </View>

                  <View style={teamStyles.memberCountView}>
                    <Text style={teamStyles.memberCount}></Text>
                    <Icon name="user-friends" size={16} color="#fff" />
                  </View>
                </View> */}
                <View
                  style={{
                    height: 75,
                    padding: 16,
                    backgroundColor: 'white',
                    justifyContent: 'space-evenly',
                    overflow: 'hidden',
                  }}
                >
                  <Animated.View
                    style={{ backgroundColor: '#ECEFF1', height: 18 }}
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
                  <View style={{ backgroundColor: '#ECEFF1', height: 18 }}>
                    <Animated.View
                      style={{
                        width: '20%',
                        height: '100%',
                        backgroundColor: 'white',
                        opacity: 0.5,
                        transform: [{ translateX: translateX2 }],
                      }}
                    ></Animated.View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
      {!loading && myTeams.length === 0 && (
        <Text style={{ color: '#fff' }}>
          You are not in any teams. Join a team now to see it here.
        </Text>
      )}
      {!loading && (
        <FlatList
          contentContainerStyle={{ paddingBottom: 80 }}
          data={myTeams}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate('ViewTeam', { team: item });
                }}
              >
                <View style={teamStyles.team}>
                  <ImageBackground
                    source={{ uri: item.imageURL || defaultTeamImageURL }}
                    resizeMode="cover"
                    style={teamStyles.image}
                  ></ImageBackground>
                  <View style={teamStyles.bottomView}>
                    <View>
                      <Text style={teamStyles.name}>{item.name}</Text>
                      <Text style={teamStyles.description}>
                        {item.description.substring(0, 16)}
                      </Text>
                    </View>

                    <View style={teamStyles.memberCountView}>
                      <Text style={teamStyles.memberCount}>
                        {item.members.length}
                      </Text>
                      <Icon name="user-friends" size={16} color="#fff" />
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            );
          }}
        />
      )}
    </LinearGradient>
  );
};
export { Teams as default, defaultTeamImageURL };

const styles = StyleSheet.create({
  background: {
    height: '100%',
    paddingLeft: 17,
  },
  mainView: {
    // padding: 16,
  },
  row: {
    flexDirection: 'row',
  },
  heading: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,

    fontWeight: 'bold',
  },
  createButton: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: 'rgb(7, 77, 233)',
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 16,
    width: 120,
    height: 40,
    justifyContent: 'center',
  },
  joinButton: {
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    marginTop: 30,
    backgroundColor: 'rgb(7, 77, 233)',
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 16,
  },
  buttonText: {
    color: 'white',
  },
  h1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

const teamStyles = StyleSheet.create({
  team: {
    marginLeft: 10,
    borderRadius: 16,
    minHeight: 220,
    width: 300,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomView: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'black',
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
  },
  description: {
    color: 'white',
  },
  memberCount: {
    color: 'white',
    marginRight: 8,
  },
  memberCountView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});
