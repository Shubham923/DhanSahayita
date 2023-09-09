import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

const ChatBot = () => {
  const [messages, setMessages] = React.useState([]);

  const onSend = async (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    ask(newMessages[0].text)
  };

  const ask = async (userMessage: string) => {
    try {
      const response = await fetch(
        'http://192.168.244.43:3001/ask',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 'question': userMessage })
        }
      );
      const json = await response.json();
      console.log(json.answer)

      const responseMessage: IMessage = {
        _id: Math.random().toString(),
        text: json.answer,
        createdAt: new Date(),
        user: {
          _id: 2, // Use a different user ID for the chatbot
          name: 'DhanSahaytia',
        },
      };
      setMessages((prevMessages) => GiftedChat.append(prevMessages, [responseMessage]));
    } catch (error) {
      console.log(error)
      return error;
    }
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};

ChatBot.title = 'DhanSahaytia Assistant';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8
  },
});

export default ChatBot;
