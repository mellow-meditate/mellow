import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import firebase from 'firebase';

const defaultTeamImageURL =
  'https://firebasestorage.googleapis.com/v0/b/mellow-meditate.appspot.com/o/teams%2Fflower.jpeg?alt=media&token=fa163ded-9833-4ec4-ad07-bbc7f62231c5';

const handleJoinTeam = async ({ team, navigation }) => {
  let updateUser = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .update({
      teams: firebase.firestore.FieldValue.arrayUnion(team.id),
    });

  let updateTeam = firebase
    .firestore()
    .collection('teams')
    .doc(team.id)
    .update({
      members: firebase.firestore.FieldValue.arrayUnion(
        firebase.auth().currentUser.uid
      ),
    });

  Promise.all([updateUser, updateTeam])
    .then(() => {
      alert('You have joined the team');
      navigation.navigate('Teams');
    })
    .catch((err) => {
      console.log(err);
      alert('Error joining team');
      navigation.navigate('Teams');
    });
};

const handleLeaveTeam = async ({ team, navigation }) => {
  let updateUser = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .update({
      teams: firebase.firestore.FieldValue.arrayRemove(team.id),
    });

  let updateTeam = firebase
    .firestore()
    .collection('teams')
    .doc(team.id)
    .update({
      members: firebase.firestore.FieldValue.arrayRemove(
        firebase.auth().currentUser.uid
      ),
    });

  Promise.all([updateUser, updateTeam])
    .then(() => {
      alert('You have left the team');
      navigation.navigate('Teams');
    })
    .catch((err) => {
      console.log(err);
      alert('Error leaving team');
      navigation.navigate('Teams');
    });
};

const ViewTeam = ({ navigation, route }) => {
  const { team, showJoinButton, showLeaveButton } = route.params;
  const [createdBy, setCreatedBy] = useState('');
  useEffect(() => {
    navigation.setOptions({
      title: team.name,
    });
    let createdById = team.createdBy;
    firebase
      .firestore()
      .collection('users')
      .doc(createdById)
      .get()
      .then((doc) => {
        setCreatedBy(doc.data().name);
      });
  }, []);

  return (
    <View style={styles.view}>
      <ScrollView onScroll={(e) => {}} scrollEventThrottle={16}>
        <Image
          style={styles.image}
          source={{ uri: team.imageURL || defaultTeamImageURL }}
          resizeMode="cover"
        />
        <View style={styles.card}>
          <View style={styles.nameView}>
            <Text style={styles.name}>{team.name}</Text>
          </View>
          {createdBy.length > 0 && (
            <Text style={styles.createdBy}>Leader: {createdBy}</Text>
          )}
          <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
            <Text style={{ fontSize: 16, color: '#333', marginVertical: 8 }}>
              {team.description}
            </Text>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <Text style={styles.amount}>Rs. {team.amountRaised || '0'}</Text>
              <Text style={styles.raised}>contribution so far</Text>

              <View style={styles.row}>
                <View style={styles.line}>
                  <Text style={styles.cardText}>{team.members.length}</Text>
                  <Text style={styles.cardTitle}>Meditators</Text>
                </View>
                <View
                  style={[
                    styles.line,
                    {
                      borderLeftWidth: 1,
                      borderRightWidth: 0,
                      paddingLeft: 12,
                      paddingRight: 0,
                      alignItems: 'flex-start',
                    },
                  ]}
                >
                  <Text style={styles.cardText}>{team.hours || 0}</Text>
                  <Text style={styles.cardTitle}>Hours of Meditation</Text>
                </View>
              </View>
            </View>
            {/* // TODO: implement invite to my team */}
            {/* <TouchableOpacity
                style={styles.inviteView}
                onPress={() => {
                  alert('To implement team id: ' + team.id);
                }}
              >
                <Text style={styles.inviteText}>Invite Teammates</Text>
              </TouchableOpacity> */}
            {showJoinButton && (
              <TouchableOpacity
                onPress={() => handleJoinTeam({ team, navigation })}
              >
                <View style={styles.primaryButton}>
                  <Text style={styles.whiteText}>Join Team</Text>
                </View>
              </TouchableOpacity>
            )}
            {(showLeaveButton ||
              team.members.includes(firebase.auth().currentUser.uid)) && (
              <TouchableOpacity
                onPress={() => handleLeaveTeam({ team, navigation })}
              >
                <View
                  style={[
                    styles.primaryButton,
                    {
                      borderWidth: 1,
                      borderColor: 'rgb(120, 120, 120)',
                      backgroundColor: '#fff',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.whiteText,
                      {
                        color: '#555',
                      },
                    ]}
                  >
                    Leave Team
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default ViewTeam;

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#fff',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  image: {
    width: '100%',
    height: 224,
  },
  createdBy: {
    textAlign: 'center',
    fontSize: 16,
  },
  nameView: {
    alignItems: 'center',
    transform: [{ translateY: -16 }],
  },
  name: {
    padding: 8,
    paddingHorizontal: 16,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    minWidth: '75%',
    textAlign: 'center',
    fontSize: 18,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 32,
    color: '#555',
  },
  raised: {
    color: '#777',
    marginBottom: 24,
  },
  inviteView: {
    backgroundColor: 'rgb(1, 193, 242)',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    padding: 8,
  },
  inviteText: {
    color: 'white',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  line: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    borderRightWidth: 2,
    borderColor: '#555',
    paddingRight: 12,
    width: '50%',
  },
  cardText: {
    fontSize: 19,
    color: '#555',
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
  },
  memberCount: {
    marginRight: 8,
  },
  creator: {
    fontSize: 12,
  },
  primaryButton: {
    minWidth: '80%',
    backgroundColor: 'rgb(7, 77, 233)',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  whiteText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
});
