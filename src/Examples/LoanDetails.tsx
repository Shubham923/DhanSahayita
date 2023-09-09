import * as React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { List, Divider, Card, Avatar, Text, Chip, Button } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';
import type { StackNavigationProp } from '@react-navigation/stack';
import { WebView } from 'react-native-webview';

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

const LoanDetails = ({ navigation, route }: Props) => {
  const [expanded, setExpanded] = React.useState<boolean>(true);
  const [showWebView, setShowWebView] = React.useState(false);
  const [webviewUrl, setWebviewUrl] = React.useState('https://example.com');
  const [isLoading, setLoading] = React.useState(false);
  const [isKYCComplete, setKYCComplete] = React.useState(false);

  const _handlePress = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <ScreenWrapper>
        {showWebView ? (
          <WebView
            startInLoadingState={true}
            scalesPageToFit
            style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
            source={{ uri: webviewUrl }}
          />
        ) : (
          <>
            <Card style={styles.card} mode="contained">
              <Card.Title
                left={(props) => <Avatar.Icon {...props} icon="bank" />}
                title="ICICI Bank"
                titleVariant="bodyLarge"
              />
              <Card.Content>
                <Text variant="bodyMedium">
                  Approved Loan Amount
                </Text>
                <Text variant="titleMedium">
                  ₹ 80,000
                </Text>
                <Divider style={{ marginVertical: 8 }}></Divider>
                <Text variant="bodyMedium">
                  Interest
                </Text>
                <Text variant="titleMedium">
                  ₹ 8,000 @ 10%
                </Text>
                <Divider style={{ marginVertical: 8 }}></Divider>
                <Text variant="bodyMedium">
                  Duration
                </Text>
                <Text variant="titleMedium">
                  3 months
                </Text>
                <Chip onPress={navigation.navigate('ConfirmationScreen')} compact textStyle={{ color: 'mediumslateblue' }} style={{ marginTop: 8 }} mode='flat'>
                  LOWEST INTEREST
                </Chip>
              </Card.Content>
            </Card>

            <List.Accordion
              style={{ marginHorizontal: 8 }}
              left={(props) => <List.Icon {...props} icon="cash" />}
              expanded={expanded}
              title="Loan Details"
              onPress={_handlePress}
            >
              {data.map((data, index) => {
                return (
                  <>
                    <View style={styles.container} key={index}>
                      <Text variant="titleSmall" style={styles.leftText}>{data.key}</Text>
                      <Text variant="titleSmall" style={styles.rightText}>{data.value}</Text>
                    </View>
                    <Divider style={{ marginTop: 8 }} />
                  </>
                );
              })}
            </List.Accordion>

            <Button onPress={navigation.navigate("KYC")} mode="contained" style={styles.button}>
              Select Offer & Proceed to KYC
            </Button>
          </>
        )}
      </ScreenWrapper>
    </>
  );
};

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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexDirection: 'row', // Arrange children in a row
    justifyContent: 'space-between', // Space the children evenly
    alignItems: 'center', // Center vertically within the container
    padding: 16,
  },
  leftText: {
    marginLeft: 8,
    color: 'gray',
  },
  rightText: {
    marginRight: 8
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
    margin: 4,
  },
  inputContainerStyle: {
    margin: 8,
  },

});

LoanDetails.title = 'Loan Details';

export default LoanDetails;
