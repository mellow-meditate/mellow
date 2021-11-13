
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Modal, ToastAndroid } from "react-native";
import { Searchbar } from 'react-native-paper';

import Icon from "react-native-vector-icons/FontAwesome5";
import mockTeamsData from '../../data/mockTeams';

const useMockFetch = () => {
    const [loading, setLoading] = useState(true);
    const error = null;

    setTimeout(() => {
        setLoading(false);
    }, 1000)

    const teams = mockTeamsData;
    return [teams, loading, error];
}

const TeamModal = ({ team, setModalVisible }) => {

    return (
        <TouchableWithoutFeedback onPress={() => {
            setModalVisible(false)
        }}>
            <View style={teamModalStyles.backgroundView}>
                <TouchableWithoutFeedback>
                    <View style={teamModalStyles.view}>
                        <TouchableOpacity style={teamModalStyles.close} onPress={() => setModalVisible((curVisible) => !curVisible)}>
                            <Icon style={teamModalStyles.close} name="times" size={20} color="#222" />
                        </TouchableOpacity>
                        <Image style={teamModalStyles.image} source={{ uri: team.image }} />
                        <Text style={teamModalStyles.name}>{team.name}</Text>

                        <View style={teamModalStyles.row}>
                            <View style={teamModalStyles.row}>
                                <Icon name="user-friends" size={16} color="#222" style={{ marginRight: 4 }} />
                                <Text style={teamStyles.memberCount}>{team.memberCount}</Text>
                            </View>

                            <View style={teamModalStyles.row}>
                                <Icon name="user" solid size={16} color="#222" style={{ marginRight: 4 }} />
                                <Text style={teamModalStyles.creator}>{team.creator.name}</Text>
                            </View>
                        </View>

                        <Text style={teamModalStyles.description}>{team.description}</Text>
                        <Text style={teamModalStyles.amount}>Rs.{team.amountRaised} raised</Text>
                        <TouchableOpacity onPress={() => {
                            ToastAndroid.show("You joined the team with id: " + team.id, ToastAndroid.SHORT);
                        }}>
                            <View style={teamModalStyles.join}>
                                <Text style={teamModalStyles.joinText}>Join Team</Text>
                            </View>
                        </TouchableOpacity>
                    </View >
                </TouchableWithoutFeedback>
            </View >
        </TouchableWithoutFeedback >
    );
}

export default function Teams() {
    const [teams, loading, error] = useMockFetch();//useFetch("TEAMS_API_URL");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const onChangeSearch = query => setSearchQuery(query);

    if (loading) {
        return (
            <View style={{ margin: 16 }}>
                <Text>Loading...</Text>
            </View >
        );
    }
    const filteredTeams = teams.filter(team => team.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <View>
            {/* Search Bar */}
            {/* <View style={teamStyles.searchBar}>
                <Icon name="search" size={16} color="#222" style={{ marginRight: 4 }} />
                <Text style={teamStyles.searchText}>Find a team</Text>
            </View> */}
            <Searchbar
                theme={{ colors: { primary: '#222' } }}
                placeholder="Find a Team"
                onChangeText={onChangeSearch}
                value={searchQuery}

            />
            {/* Teams list */}
            {filteredTeams.length == 0 && <View style={{ padding: 16 }}><Text>No teams found</Text></View>}
            {filteredTeams.length > 0 && <FlatList
                data={filteredTeams}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity onPress={() => {
                            setSelectedTeam(item);
                            setModalVisible(true);
                        }}>
                            <View style={teamStyles.team}>
                                <Image source={{ uri: item.image }} style={teamStyles.image} />
                                <Text style={teamStyles.name}>{item.name}</Text>
                                <Text style={teamStyles.memberCount}>{item.memberCount}</Text>
                                <Icon name="user-friends" size={16} color="#222" />
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />}

            {/* Teams Popup Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => { setModalVisible(false) }}
            >
                <TeamModal team={selectedTeam} setModalVisible={setModalVisible}></TeamModal>
            </Modal>
        </View >
    );
}

const teamStyles = StyleSheet.create({
    searchBar: {
        padding: 16,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderTopColor: "#bbb",
        borderBottomColor: "#bbb",
    },
    searchText: {
        marginLeft: 8,
    },
    team: {
        padding: 16,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#bbb",
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 8,
    },
    name: {
        display: "flex",
        flexDirection: "row",
        flexGrow: 1
    },
    memberCount: {
        marginRight: 8
    }
});

const teamModalStyles = StyleSheet.create({
    backgroundView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    view: {
        padding: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: 16,
        minWidth: "80%",
        maxWidth: "80%",
        minHeight: "50%",
    },
    close: {
        alignSelf: "flex-end"
    },
    row: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        fontSize: 24,
    },
    description: {
        alignSelf: "flex-start",
        marginBottom: 16,
        marginTop: 16
    },
    creator: {
        fontSize: 12,
    },
    amount: {
        fontSize: 24,
        marginBottom: 16,
    },
    join: {
        minWidth: "80%",
        backgroundColor: "rgb(50, 166, 191)",
        padding: 8,
        borderRadius: 4,
        alignItems: "center"
    },
    joinText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#fff"
    }
})