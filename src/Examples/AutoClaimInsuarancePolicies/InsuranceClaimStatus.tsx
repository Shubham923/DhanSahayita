import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import StepIndicator from 'react-native-step-indicator';

import {
  ActivityIndicator,
  MD2Colors,
  FAB,
  useTheme,
  MD3Colors,
  Text,
  Banner,
  Surface,
  Chip,
  Button,
  List,
  Card,
  Divider,
  Avatar
} from 'react-native-paper';
import ScreenWrapper from '../../ScreenWrapper';
import type { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<{}>;
};

const InsuranceClaimStatus = ({ navigation }: Props) => {

  const defaultTheme = useTheme();


  const [completed, setCompleted] = React.useState<boolean>(false);
  const [animating, setAnimating] = React.useState<boolean>(true);
  const [response, setReponse] = React.useState({ insuranceDetails: null, auditorApproval: null });

  const { isV3 } = useTheme();
  const v2Elevation = [1, 2, 4, 8, 12];
  React.useEffect(() => {
    const restoreState = async () => {
      try {
        if (completed == false) {
          const response = await fetch(
            'http://192.168.244.43:3001/evaluateInsuranceValidity',
            {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ type: 'a' })
            }
          );

          const auditorResponse = await fetch(
            'http://192.168.244.43:3001/getAuditorApproval',
            {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ type: 'a' })
            }
          );
          const json = await response.json();
          const json1 = await auditorResponse.json();
          let quotesIns = JSON.parse(json)
          console.log({ insuranceDetails: quotesIns, auditorApproval: json1 })
          setReponse({ insuranceDetails: quotesIns, auditorApproval: json1 })
          setCompleted(true)
          //navigation.navigate('autoClaimInsurance', {quotes: quotesIns})
          //return json;
        }
      } catch (error) {
        setCompleted(true)
        console.log(error)
      }
    };

    restoreState()

  });

  const refreshFlow = async () => {
    console.log("Shubham")
    setCompleted(false)
    React.useEffect(() => {
      const restoreState = async () => {
        try {
          if (completed == false) {
            const response = await fetch(
              'http://192.168.244.43:3001/evaluateInsuranceValidity',
              {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type: 'a' })
              }
            );

            const auditorResponse = await fetch(
              'http://192.168.244.43:3001/getAuditorApproval',
              {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type: 'a' })
              }
            );
            const json = await response.json();
            const json1 = await auditorResponse.json();
            let quotesIns = JSON.parse(json)
            console.log({ insuranceDetails: quotesIns, auditorApproval: json1 })
            setReponse({ insuranceDetails: quotesIns, auditorApproval: json1 })
            setCompleted(true)
            //navigation.navigate('autoClaimInsurance', {quotes: quotesIns})
            //return json;
          }
        } catch (error) {
          setCompleted(true)
          console.log(error)
        }
      };

      restoreState()

    });
  }

  const labels = ["Details \n Verification", "Policy Validation", "Document \n Verification", "Auditor \n Approval"];
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#00cc66',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#00cc66',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#00cc66',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#00cc66',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#00cc66',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#00cc66'
  }

  const labels1 = ["Details \n Verification", "Policy Validation", "Document \n Verification", "Auditor \n Approved Claim"];
  const customStyles1 = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#00cc66',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#00cc66',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#00cc66',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#00cc66',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ff0000',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#00cc66',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#00cc66'
  }



  return (
    <ScreenWrapper style={styles.container}>
      <Banner

        icon={require('../../../assets/images/waiting.png')}
        visible={true}
        theme={defaultTheme}
      >
        Your insurance claim is presently under review, and we will promptly notify you once the processing procedure has been finalized.
      </Banner>

      <View style={styles.inputContainerStyle}>

      </View>

      {!response.auditorApproval ?
        <StepIndicator
          customStyles={customStyles}
          currentPosition={3}
          labels={labels}
          stepCount={4}
          direction='horizontal'
        />
        : <StepIndicator
          customStyles={customStyles1}
          currentPosition={4}
          labels={labels1}
          stepCount={4}
          direction='horizontal'
        />}

      <View style={styles.inputContainerStyle}>

      </View>

      {!response.auditorApproval ?
        <Banner visible>
          <Text variant="bodyMedium" style={styles.justpay}>
            Note: Approval from the auditor is currently pending. We kindly request your patience as we await this authorization. Rest assured, we will promptly notify you of any updates. Should you have any inquiries, please do not hesitate to reach out to our customer care service.
          </Text>

        </Banner>
        :
        <View>
          <Card style={styles.card} mode="contained">
            <Card.Title
              left={(props) => <Avatar.Icon {...props} icon="hospital" />}
              title="Niva Bupa SuperTopUp"
              titleVariant="bodyLarge"
              right={(props) => <Avatar.Icon {...props} style={{ marginRight: 8 }} icon="arrow-right" />}
            />

            <Card.Content>
              <Text variant="bodyMedium">
                Top Up Amount
              </Text>
              <Text variant="titleMedium">
                20,000
              </Text>
              <Chip compact textStyle={{ color: 'palevioletred' }} style={{ marginTop: 8 }} mode='flat'>
                You are left with INR 5000, please topup now
              </Chip>
            </Card.Content>
          </Card>
        </View>

      }

      <View style={styles.inputContainerStyle8}>

      </View>


      <Banner visible icon={require('../../../assets/images/custcare.png')}>

        <Text variant="bodyMedium" style={styles.justpay}>
          Should you still have any inquiries, please feel free to contact our customer care team at your convenience.
        </Text>

      </Banner>


      <View style={styles.inputContainerStyle8}></View>
      <View style={styles.inputContainerStyle8}></View>
      <View style={styles.inputContainerStyle8}></View>
      <View style={styles.inputContainerStyle8}></View>
      <View style={styles.inputContainerStyle8}></View>
      <View style={styles.inputContainerStyle8}></View>

      <Button mode="outlined" style={styles.button} onPress={refreshFlow}>
        Refresh
      </Button>

      <Button mode="outlined" style={styles.button}>
        View All Claims
      </Button>

    </ScreenWrapper>
  );
};

InsuranceClaimStatus.title = 'Insrance Claim Status';

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
  }, screen: {
    flex: 1,
  },
  winner: {
    fontWeight: '700',
  },
  listRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  teamResultRow: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  score: {
    marginRight: 16,
  },
  surface: {
    margin: 24,
    height: 80,
    width: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  card: {
    marginHorizontal: 8,
    marginTop: 8
  },
  cardContainer: {
    marginBottom: 80,
  },
  chipsContainer: {
    flexDirection: 'row',
  },
  chipsContent: {
    paddingLeft: 8,
    paddingVertical: 8,
  },
  chip: {
    marginRight: 8,
  },
  button: {
    margin: 8,
  },
  inputContainerStyle: {
    margin: 16,
  },
  inputContainerStyle8: {
    margin: 8,
  }, v3Surface: {
    borderRadius: 16,
    height: 160,
    width: 335,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preference: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    margin: 16
  },
  justpay: {
    textAlign: 'justify'
  },
  text: {
    marginVertical: 4,
  },
});



export default InsuranceClaimStatus;
