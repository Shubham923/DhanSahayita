import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  MD2Colors,
  FAB,
  useTheme,
  MD3Colors,
} from 'react-native-paper';
import ScreenWrapper from '../../ScreenWrapper';
import type { StackNavigationProp } from '@react-navigation/stack';

type Props = {
    navigation: StackNavigationProp<{}>;
  };

const AutoClaimInsuranceLoader = ({ navigation }: Props) => {



  const [completed, setCompleted] = React.useState<boolean>(false);
  const [animating, setAnimating] = React.useState<boolean>(true);
  const { isV3 } = useTheme();


  React.useEffect(() => {
    const restoreState = async () => {
        try {
            const response = await fetch(
              'http://192.168.244.43:3001/fetchSimplifiedInsurancePolicies',
              {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ a: 1, b: 'Textual content' })
              }
            );
            const json = await response.json();
            let quotesIns = JSON.parse(json)
            setCompleted(true)
            navigation.replace('autoClaimInsuranceForm', {quotes: quotesIns})
            //return json;
          } catch (error) {
            console.log(error)
            setCompleted(true)
          }
    };

    restoreState()

  });

  return (
    <ScreenWrapper style={styles.container}>
    
      <View style={styles.row}>
        <ActivityIndicator animating={animating} />
      </View>

    </ScreenWrapper>
  );
};

AutoClaimInsuranceLoader.title = 'Auto Claim Insurance';

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});

export default AutoClaimInsuranceLoader;
