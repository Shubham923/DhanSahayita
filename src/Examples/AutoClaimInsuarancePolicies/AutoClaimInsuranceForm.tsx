import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  MD2Colors,
  FAB,
  useTheme,
  MD3Colors,
  TextInput,
  List,
  HelperText,
  Button
} from 'react-native-paper';
import ScreenWrapper from '../../ScreenWrapper';
import type { StackNavigationProp } from '@react-navigation/stack';

type Props = {
    navigation: StackNavigationProp<{ [key: string]: undefined }>;
    route: Route
  };
  
  type Route = {
    route: { key: string };
    params: {
      quotes: string;
    };
  };

const AutoClaimInsuranceForm = ({ navigation, route }: Props) => {

  const { params } = route
  const {quotes} = params
  let insurancePollicy = JSON.parse(JSON.stringify(quotes[0]))

  console.log(insurancePollicy)

  const [completed, setCompleted] = React.useState<boolean>(false);
  const [animating, setAnimating] = React.useState<boolean>(true);
  const { isV3 } = useTheme();
   
  const inputActionHandler = (type: string, payload: string) => {
    console.log(payload)
  }

  return (
    <ScreenWrapper style={styles.container}>
    
    <List.Section title="Please Verify Your Policy Details">
                  <TextInput
                    mode="outlined"
                    style={styles.inputContainerStyle}
                    label="Full Name"
                    value={insurancePollicy.name}
                    onChangeText={(text) => inputActionHandler('amount', text)}
                    left={
                      <TextInput.Icon
                        icon="human"
                      />
                    }
                  />
                  <HelperText type="info" visible={true}>
                      Full Name
                  </HelperText>
                  <TextInput
                    mode="outlined"
                    style={styles.inputContainerStyle}
                    label="Policy Number"
                    value={insurancePollicy.policyNumber}
                    onChangeText={(text) => inputActionHandler('tenure', text)}
                    left={
                      <TextInput.Icon
                        icon="calendar"
                      />
                    }
                  />
                  <HelperText type="info" visible={true}>
                    Policy Number
                  </HelperText>
                  <TextInput
                    mode="outlined"
                    style={styles.inputContainerStyle}
                    label="PAN No."
                    value={insurancePollicy.PAN}
                    onChangeText={(text) => inputActionHandler('tenure', text)}
                    left={
                      <TextInput.Icon
                        icon="id-card"
                      />
                    }
                  />
                  <HelperText type="info" visible={true}>
                    Your PAN Card Number
                  </HelperText>
                  <TextInput
                    mode="outlined"
                    style={styles.inputContainerStyle}
                    label="Mobile Number"
                    value={insurancePollicy.mobile}
                    onChangeText={(text) => inputActionHandler('tenure', text)}
                    left={
                      <TextInput.Icon
                        icon="cellphone"
                      />
                    }
                  />
                  <HelperText type="info" visible={true}>
                  Mobile Number
                  </HelperText>

                  <TextInput
                    mode="outlined"
                    style={styles.inputContainerStyle}
                    label="Validity"
                    value={insurancePollicy.duration}
                    onChangeText={(text) => inputActionHandler('tenure', text)}
                    left={
                      <TextInput.Icon
                        icon="timer"
                      />
                    }
                  />
                  <HelperText type="info" visible={true}>
                  Policy Validity
                  </HelperText>

                  <TextInput
                    mode="outlined"
                    style={styles.inputContainerStyle}
                    label="Remaining Cover"
                    value={insurancePollicy.tenure}
                    onChangeText={(text) => inputActionHandler('tenure', text)}
                    left={
                      <TextInput.Icon
                        icon="timer"
                      />
                    }
                  />
                  <HelperText type="info" visible={true}>
                  Remaining Cover
                  </HelperText>

                </List.Section>

                <Button onPress={() => {navigation.navigate("autoClaimUploadDocuments")}} mode="outlined" style={styles.button}>
                  Continue
                </Button>

    </ScreenWrapper>
  );
};

AutoClaimInsuranceForm.title = 'Auto Claim Form';

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  inputContainerStyle: {
    margin: 8,
  },
  button: {
    margin: 4,
  },
});

export default AutoClaimInsuranceForm;
