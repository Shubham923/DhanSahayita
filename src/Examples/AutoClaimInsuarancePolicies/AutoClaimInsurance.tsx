import * as React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Paragraph,
  Card,
  Button,
  IconButton,
  useTheme,
  Chip,
  Text,
  List,
  Divider
} from 'react-native-paper';
import { PreferencesContext } from '../../index';
import ScreenWrapper from '../../ScreenWrapper';
import { isWeb } from '../../../utils';
import type { StackNavigationProp } from '@react-navigation/stack';



type Mode = 'Car' | 'Health' | 'contained';
type Props = {
  navigation: StackNavigationProp<{}>;
  route: Route
};

type Route = {
  route: { key: string };
  params: {
    quotes: string;
  };
};

const AutoClaimInsurance = ({ navigation, route }: Props) => {
  const { colors, isV3 } = useTheme();
  const [selectedMode, setSelectedMode] = React.useState('elevated' as Mode);
  const [isSelected, setIsSelected] = React.useState(false);
  const [outputJson, setOutputJson] = React.useState("");
  const [expanded, setExpanded] = React.useState<boolean>(true);


  const _handlePress = () => {
    setExpanded(!expanded);
  };

  const { params } = route
  const {quotes} = params
  let insurancePollicy1 = quotes[0]
  let insurancePollicy2 = quotes[1]

  const preferences = React.useContext(PreferencesContext);

  const modes = isV3
    ? ['elevated', 'outlined', 'contained']
    : ['elevated', 'outlined'];

  const TextComponent = isV3 ? Text : Paragraph;

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>

      <Card style={styles.card} mode="contained"
      onPress={() => {
        navigation.navigate("autoClaimInsuranceForm")
      }
    }
      >
        <Card.Title
          left={(props) => <Avatar.Icon {...props} icon="bank" />}
          title="Apna Car Insurance"
          titleVariant="bodyLarge"
        />
        <Card.Content>
          <Text variant="bodyMedium">
            Policy Number
          </Text>
          <Text variant="titleMedium">
            {insurancePollicy1["policyNumber"]}
          </Text>
          <Divider style={{ marginVertical: 8 }}></Divider>
          <Text variant="bodyMedium">
            Assured Sum
          </Text>
          <Text variant="titleMedium">
          {insurancePollicy1["sumAssured"]}
          </Text>
          <Divider style={{ marginVertical: 8 }}></Divider>
          <Text variant="bodyMedium">
            Duration
          </Text>
          <Text variant="titleMedium">
          {insurancePollicy1["duration"]}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Title
          left={(props) => <Avatar.Icon {...props} icon="bank" />}
          title="Apna Health Insurance"
          titleVariant="bodyLarge"
        />
        <Card.Content>
          <Text variant="bodyMedium">
            Policy Number
          </Text>
          <Text variant="titleMedium">
            {insurancePollicy2["policyNumber"]}
          </Text>
          <Divider style={{ marginVertical: 8 }}></Divider>
          <Text variant="bodyMedium">
            Assured Sum
          </Text>
          <Text variant="titleMedium">
          {insurancePollicy2["sumAssured"]}
          </Text>
          <Divider style={{ marginVertical: 8 }}></Divider>
          <Text variant="bodyMedium">
            Duration
          </Text>
          <Text variant="titleMedium">
          {insurancePollicy2["duration"]}
          </Text>
        </Card.Content>
      </Card>


    </ScreenWrapper>
  );
};

AutoClaimInsurance.title = 'Your Policies';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 4,
  },
  card: {
    margin: 4,
  },
  chip: {
    margin: 4,
  },
  preference: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  button: {
    borderRadius: 12,
  },
  leftText: {
    marginLeft: 8,
    color: 'gray',
  },
  rightText: {
    marginRight: 8
  },
});

const data = [
  {
    key: "Interest",
    value: "₹ 8,000 @ 10%"
  },
  {
    key: "Processing Charge",
    value: "₹ 1600"
  },
  {
    key: "Repay Before",
    value: "31st May, 2025"
  },
  {
    key: "Late Charge",
    value: "8% per month"
  },
  {
    key: "Prepayment Penalty",
    value: "1% per month"
  },

]

export default AutoClaimInsurance;
