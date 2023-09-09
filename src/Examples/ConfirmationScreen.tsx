import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Avatar,
  Divider,
  Text,
  Button,
  List,
  TextInput,
  HelperText
} from 'react-native-paper';
import type { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<{}>;
  route: Route;
};

type Route = {
  route: { key: string };
  params: {
    sourceColor: string;
    headerTitle: string;
    darkMode: boolean;
  };
};

const ConfirmationScreen = ({ navigation, route }: Props) => {
  return (
    <View style={styles.container}>
      <Avatar.Icon style={styles.avatar} icon="check" />
      <Text variant="titleLarge">
        Loan Disbursed Successfully
      </Text>
      <Text variant="titleMedium" style={{ color: 'gray', textAlign: "center"}}>
        Would take a day or two to reach your bank account
      </Text>
      <Divider/>
      <List.Accordion
          style={{ marginLeft: 8 }}
          left={(props) => <List.Icon {...props} icon="refresh-auto" />}
          title="Setup Loan Repayment"
        >
          <View style={{ marginRight: 52 }}>
            <TextInput
              mode="outlined"
              style={styles.inputContainerStyle}
              label="Mobile Number or VPA"
              left={
                <TextInput.Icon
                  icon="refresh-auto"
                />
              }
            />
            <HelperText type="info" visible={true}>
              They will receive a notifcation to approve 
            </HelperText>
            <Button mode="contained-tonal" style={{ marginHorizontal: 8 }}>
              Setup AutoPay
            </Button>
          </View>
        </List.Accordion>

      <Button onPress={() => navigation.navigate('chatbot')} icon="face-agent" mode="contained-tonal" style={styles.button}>
        I need help
      </Button>
    </View>
  );
};

ConfirmationScreen.title = 'Loan Confirmation';

const styles = StyleSheet.create({
  avatar: {
    margin: 8,
  },
  container: {
    flex: 1, // This allows the container to take up the entire screen space
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center",
    marginBottom: 32
  },
  button: {
    marginTop: 16
  },
  inputContainerStyle: {
    margin: 8,
  },
});

export default ConfirmationScreen;
