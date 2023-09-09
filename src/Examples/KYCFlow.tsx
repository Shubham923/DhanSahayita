import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { BackHandler } from "react-native";
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

const KYCFlow = ({ navigation, route }: Props) => {
  const [webviewUrl, setWebviewUrl] = React.useState('');

  React.useEffect(() => {
    startKYCFlow()
  }, [])

  function handleBackButtonClick() {
    console.log("back called")
    navigation.navigate('ConfirmationScreen')
    return true;
  }
  
  React.useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, []);

  const startKYCFlow = async () => {
    try {
      const response = await fetch(
        'http://192.168.244.43:3001/startKYCFlow',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ vua: '9405485377@onemoney' })
        }
      );
      if (response.ok) {
        const json = await response.json();
        console.log(json)
        setWebviewUrl(json.url)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      {(webviewUrl == '') ? <ActivityIndicator style={{justifyContent: 'center', alignSelf: 'center' }} animating={webviewUrl == ''} size={"large"} />
        : <WebView
          startInLoadingState={true}
          scalesPageToFit
          style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
          source={{ uri: webviewUrl }}
        />}
    </View>
  );
};

KYCFlow.title = 'Grant KYC';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8
  },
});

export default KYCFlow;
