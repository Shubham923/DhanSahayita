import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { WebView } from 'react-native-webview';

const UserConsent = () => {
  const [webviewUrl, setWebviewUrl] = React.useState('');

  React.useEffect(() => {
    startConsentFlow()
  }, [])

  const startConsentFlow = async () => {
    console.log("starting consent flow")
    try {
      const response = await fetch(
        'http://192.168.244.43:3001/startConsentFlow',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ vua: '8308171711@onemoney' })
        }
      );
      if (response.ok) {
        const json = await response.json();
        console.log(json)
        setWebviewUrl(json)
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

UserConsent.title = 'Grant Consent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8
  },
});

export default UserConsent;
