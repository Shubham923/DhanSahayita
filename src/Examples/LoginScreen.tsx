import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Text,
  Button,
  TextInput,
  IconButton
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


const inputActionHandler = (type: string, payload: string) => {
  console.log(payload)
}

const LoginScreen = ({ navigation, route }: Props) => {
  const [flatTextSecureEntry, setFlatTextSecureEntry] = React.useState(true);
  return (
    <View style={styles.container}>
      <IconButton
        icon="currency-inr"
        selected
        style={styles.avatar}
        mode="contained-tonal"
        size={60}
        onPress={() => { }}
      />
      <Text variant="titleLarge" style={{ alignSelf: 'center' }}>
        Welcome to DhanSahayita
      </Text>
      <Text variant="titleMedium" style={{ color: 'gray', textAlign: "center", marginBottom: 16 }}>
        Login to super charge your financial journey
      </Text>
      <TextInput
        mode="outlined"
        style={styles.inputContainerStyle}
        label="Mobile Number"
        onChangeText={(text) => inputActionHandler('amount', text)}
        left={
          <TextInput.Icon
            icon="phone"
          />
        }
      />
      <TextInput
        mode="outlined"
        style={styles.inputContainerStyle}
        label="Password"
        onChangeText={(text) => inputActionHandler('amount', text)}
        left={
          <TextInput.Icon
            icon="lock"
          />
        }
        secureTextEntry={flatTextSecureEntry}
        right={
          <TextInput.Icon
            icon={true ? 'eye' : 'eye-off'}
            onPress={() =>
              setFlatTextSecureEntry(!flatTextSecureEntry)
            }
            forceTextInputFocus={false}
          />
        }
      />

      <Button onPress={() => navigation.navigate('Product Selection')} icon="login" mode="contained-tonal" style={styles.button}>
        Login Securely
      </Button>
    </View>
  );
};

LoginScreen.title = 'Login';

const styles = StyleSheet.create({
  avatar: {
    margin: 8,
    padding: 1,
    alignSelf: 'center',
  },
  container: {
    flex: 1, // This allows the container to take up the entire screen space
    flexDirection: 'column',
    justifyContent: "center",
    marginBottom: 32
  },
  button: {
    marginTop: 16,
    marginHorizontal: 8
  },
  inputContainerStyle: {
    margin: 8,
  },
});

export default LoginScreen;
