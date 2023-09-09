import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  MD2Colors,
  FAB,
  useTheme,
  MD3Colors,
  Button
} from 'react-native-paper';
import ScreenWrapper from '../../ScreenWrapper';
import type { StackNavigationProp } from '@react-navigation/stack';
import * as DocumentPicker from 'expo-document-picker';
import {
  Alert,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
} from 'react-native';

type Props = {
  navigation: StackNavigationProp<{}>;
};

const AutoClaimUploadDocuments = ({ navigation }: Props) => {



  const [completed, setCompleted] = React.useState<boolean>(false);
  const [animating, setAnimating] = React.useState<boolean>(true);
  const [singleFile, setSingleFile] = React.useState(null);
  const { isV3 } = useTheme();

  const checkPermissions = async () => {
    try {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );

      if (!result) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title:
              'You need to give storage permission to download and save the file',
            message: 'App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
          return true;
        } else {
          Alert.alert('Error', I18n.t('PERMISSION_ACCESS_FILE'));

          console.log('Camera permission denied');
          return false;
        }
      } else {
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const uploadImage = async () => {
    const BASE_URL = 'xxxx';

    // Check if any file is selected or not
    if (singleFile != null) {
      // If file selected then create FormData
      const data = new FormData();

      console.log(singleFile.uri)
      data.append('upload', {
        uri: singleFile.uri,
        name: singleFile.name,
        type: singleFile.mimeType,
      });

      // return
      try {
        console.log(data)
        let res = await fetch('http://192.168.244.43:3001/upload', {
          method: 'post',
          body: data,
          headers: {
            Accept: 'application/json',
          },
        });

        console.log('result', res);
        navigation.navigate("insuranceClaimStatus")
        // let result = await res.json();
        //console.log('result', result);
        // if (result.status == 1) {
        //   Alert.alert('Info', result.msg);
        // }
      } catch (error) {
        // Error retrieving data
        // Alert.alert('Error', error.message);
        console.log('error upload', error);
      }
    } else {
      // If no file selected the show alert
      Alert.alert('Please Select File first');
    }
  };


  async function selectFile() {
    try {
      const result = await checkPermissions();

      if (result) {
        const result = await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: false,
          type: ["image/*", "application/pdf"]
        });

        if (result.type === 'success') {
          // Printing the log realted to the file
          console.log('res : ' + JSON.stringify(result));
          // Setting the state to show single file attributes
          setSingleFile(result);
        }
      }
    } catch (err) {
      setSingleFile(null);
      console.warn(err);
      return false;
    }
  }


  return (

    
    <ScreenWrapper style={styles.container}>

      {singleFile != null ? (
        <Text style={styles.textStyle}>
          The file has been selected successfully. You may proceed with the file upload process.

          {'\n'}
        </Text>
      ) : null}

      <View style={styles.divider}></View>
      <View style={styles.divider}></View>

      <Button mode="outlined" style={styles.button} onPress={selectFile}>
        Select File
      </Button>

      <Button mode="outlined" style={styles.button} onPress={uploadImage}>
        Upload File
      </Button>

    </ScreenWrapper>
  );
};

AutoClaimUploadDocuments.title = 'Upload Supporting  Documents';

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
  },
  button: {
    margin: 8,
    marginLeft: 35,
    marginRight: 35,
  },
  bottom: {
    // Add styles for the bottom-aligned view here
  },
  container2: {
    flex: 1, // Ensure the container takes up the entire screen
    flexDirection: 'column', // Arrange child views vertically
  },
  content: {
    flex: 1, // This view will take up the available space above the bottom view
    // Add styles for your content here
  },
  divider: {
    marginTop: 160
  }
});

export default AutoClaimUploadDocuments;
