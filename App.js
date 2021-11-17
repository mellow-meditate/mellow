import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { View, Text, LogBox, TouchableHighlight } from 'react-native';

import firebase from 'firebase/app';
import 'firebase/auth';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/Main';
import ChatScreen from './components/main/Chat';
import PlayScreen from './components/main/Play';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
const store = createStore(rootReducer, applyMiddleware(thunk));

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import JoinTeam from './components/main/JoinTeam';
import CreateTeam from './components/main/CreateTeam';
import ViewTeam from './components/main/ViewTeam';

LogBox.ignoreLogs(['Setting a timer for a long period of time']);

const firebaseConfig = {
  apiKey: 'AIzaSyAZouq-DJIPWhZdZyLeOM5caDCVfLLKyrQ',
  authDomain: 'mellow-meditate.firebaseapp.com',
  projectId: 'mellow-meditate',
  storageBucket: 'mellow-meditate.appspot.com',
  messagingSenderId: '294713002680',
  appId: '1:294713002680:web:a07a73a72df722cc61024d',
  measurementId: 'G-NCF660YNLZ',
};

// Fixed: Firebase app duplication
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
else firebase.app();

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="JoinTeam"
              component={JoinTeam}
              options={{ title: 'Join Team' }}
            />
            <Stack.Screen
              name="CreateTeam"
              component={CreateTeam}
              options={{ title: 'Create Team' }}
            />
            <Stack.Screen
              name="ViewTeam"
              component={ViewTeam}
              options={{
                title: 'Team',
                headerTitleContainerStyle: {
                  width: '75%',
                  paddingLeft: 8,
                },
              }}
            />
            <Stack.Screen name="Chat" component={ChatScreen} />

            <Stack.Screen name="Play" component={PlayScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
