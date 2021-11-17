import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

import { Dialogflow_V2 } from 'react-native-dialogflow';
import { dialogflowConfig } from '../../env';
import { LinearGradient } from 'expo-linear-gradient';

const BOT = {
  _id: 2,
  name: 'Mr.Bot',
  avatar:
    'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg',
};

class Chat extends Component {
  state = {
    messages: [
      { _id: 2, text: 'My name is Mellow', createdAt: new Date(), user: BOT },
      { _id: 1, text: 'Hi', createdAt: new Date(), user: BOT },
    ],
    id: 1,
    name: '',
  };

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  }

  sendBotResponse(text) {
    let msg;
    if (text == 'meditate') {
      msg = {
        _id: this.state.messages.length + 1,
        text: 'maybe you should meditate',
        image:
          'https://pcdn.columbian.com/wp-content/uploads/2021/06/0615_fea_meditation-1226x0-c-default.jpg',
        createdAt: new Date(),
        user: BOT,
      };
    } else if (text == 'show options') {
      msg = {
        _id: this.state.messages.length + 1,
        text: 'Please choose type of meditation',
        createdAt: new Date(),
        user: BOT,
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values: [
            {
              title: 'Mindful',
              value: 'Mindful',
              bColor: '#A0522D',
              bgColor: '#A0522D',
            },
            {
              title: 'Walking',
              value: 'Walking',
              bColor: '#7B68EE',
              bgColor: '#7B68EE',
            },
            {
              title: 'Transcendental',
              value: 'Transcendental',
              bColor: '#008B8B',
              bgColor: '#008B8B',
            },
          ],
        },
      };
    } else {
      msg = {
        _id: this.state.messages.length + 1,
        text,
        createdAt: new Date(),
        user: BOT,
      };
    }

    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let message = messages[0].text;

    Dialogflow_V2.requestQuery(
      message,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log(error)
    );
  }

  onQuickReply(quickReply) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, quickReply),
    }));

    let message = quickReply[0].value;

    Dialogflow_V2.requestQuery(
      message,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log(error)
    );
  }

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{ right: { color: 'black' } }}
        wrapperStyle={{
          left: { backgroundColor: 'lavender' },
          right: { backgroundColor: 'pink' },
        }}
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(message) => this.onSend(message)}
          onQuickReply={(quickReply) => this.onQuickReply(quickReply)}
          renderBubble={this.renderBubble}
          user={{ _id: 1 }}
        />
      </View>
    );
  }
}

export default Chat;
