import * as React from 'react';
import {
  Easing,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
  Dimensions,
  Image
} from 'react-native';
import { WebView } from 'react-native-webview';

import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Appbar,
  BottomNavigation,
  Card,
  Text,
  Chip,
  Divider,
  Provider,
  Avatar,
  ActivityIndicator,
  Button,
  TextInput,
  HelperText,
  List,
  SegmentedButtons,
  Snackbar,
  MD3LightTheme,
  Checkbox,
  MD2Colors,
  Badge,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { colorThemes } from '../../utils';
import ScreenWrapper from '../ScreenWrapper';
import ChatBot from './ChatBot';
import DropDown from "react-native-paper-dropdown";
import AppLink from 'react-native-app-link';
import { PieChart } from "react-native-gifted-charts";
const actions = require('./actions.json');

type RoutesState = Array<{
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon?: string;
  color?: string;
  badge?: boolean;
  getAccessibilityLabel?: string;
  getTestID?: string;
}>;

type Route = {
  route: { key: string };
  params: {
    sourceColor: string;
    headerTitle: string;
    darkMode: boolean;
  };
};

type Props = {
  navigation: StackNavigationProp<{}>;
  route: Route;
};

const inputActionHandler = (type: string, payload: string) => {
  console.log(payload)
}

const Portfolio = () => {
  const [value, setValue] = React.useState('portfolio');
  const [actionss, setActionss] = React.useState([]);
  const [pieData1, setPieData1] = React.useState([]);
  const [pieData2, setPieData2] = React.useState([]);
  const [recos, setRecos] = React.useState({});

  const pieData = [
    { value: 54, text: 'MF' },
    { value: 30, text: '30%' },
    { value: 26, text: '26%' },
  ];

  React.useEffect(() => {
    if (value == "recommendations") {
      getRebalancedData()
    } else {
      getOverallDistru()
      getMFDistru()
      fetchDhanSahayitaRecos()
    }
  }, [value]);

  const getRebalancedData = async () => {
    try {
      const response = await fetch(
        'http://192.168.244.43:3001/rebalance',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ vua: '8308171711@onemoney' })
        }
      );
      const json = await response.json();
      console.log(json)
      console.log(actions[json[0]])
      if (json.length == 1) {
        setActionss([actions[json[0]]])
      } else {
        setActionss([actions[json[0]], actions[json[1]]])
      }

      console.log(actionss)
    } catch (error) {
      console.log(error)
    }
  }

  const getOverallDistru = async () => {
    try {
      const response = await fetch(
        'http://192.168.244.43:3001/getOverallDistru',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ vua: '8308171711@onemoney' })
        }
      );
      const json = await response.json();
      console.log(json)
      setPieData1(json)
    } catch (error) {
      console.log(error)
    }
  }

  const getMFDistru = async () => {
    try {
      const response = await fetch(
        'http://192.168.244.43:3001/getMFDistru',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ vua: '8308171711@onemoney' })
        }
      );
      const json = await response.json();
      console.log(json)
      setPieData2(json)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchDhanSahayitaRecos = async () => {
    try {
      const response = await fetch(
        'http://192.168.244.43:3001/fetchDhanSahayitaRecos',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ vua: '8308171711@onemoney' })
        }
      );
      const json = await response.json();
      console.log(json)
      setRecos(json)
    } catch (error) {
      console.log(error)
    }
  }

  return <ScreenWrapper style={styles.container}>
    <SegmentedButtons
      value={value}
      onValueChange={setValue}
      buttons={[
        {
          value: 'portfolio',
          label: 'My Portfolio',
          style: styles.button2,
          showSelectedCheck: true,
        },
        {
          value: 'recommendations',
          label: 'Recommendations',
          style: styles.button2,
          showSelectedCheck: true,
        },
      ]}
      style={styles.group}
    />

    {value != "recommendations" ?
      <View style={styles.cardContainer}>
        <View style={styles.cardContainer2} >
          <PieChart
            donut
            showText
            textColor="white"
            textSize={10}
            radius={80}
            innerRadius={35}
            showTextBackground
            textBackgroundRadius={-1}
            labelsPosition={"outward"}
            data={pieData1} />

          <PieChart
            donut
            showText
            textColor="white"
            textSize={12}
            radius={80}
            innerRadius={35}
            showTextBackground
            textBackgroundRadius={-1}
            data={pieData2} />
        </View>
        <View style={styles.cardContainer2} >
          <Text variant='titleMedium' style={{marginLeft:24}}> Overall Portfolio</Text>
          <Text variant='titleMedium' style={{marginLeft:24}}>Mutual Fund Portfolio</Text>
        </View>

        {Object.keys(recos).length != 0 ?
          <Card style={styles.card} mode="contained">
            <Card.Title
              left={(props) => <Avatar.Icon {...props} icon="basket" />}
              title={recos['suggestionName']}
              titleVariant="bodyLarge"
            />
            <Card.Content>
              <Divider style={{ marginVertical: 8 }}></Divider>
              <Text variant="bodyMedium">
                Expected Rate of Returns
              </Text>
              <Text variant="titleMedium">
                {recos['returns']}
              </Text>
              <Divider style={{ marginVertical: 8 }}></Divider>
              <Text variant="bodyMedium">
                Benefits
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Checkbox
                  color={MD2Colors.green300}
                  status={'checked'}
                />
                <Text style={{ marginTop: 8 }} variant="bodyMedium">
                  {recos['benefits'][0]}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Checkbox
                  color={MD2Colors.green300}
                  status={'checked'}
                />
                <Text style={{ marginTop: 8 }} variant="bodyMedium">
                  {recos['benefits'][1]}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Checkbox
                  color={MD2Colors.green300}
                  status={'checked'}
                />
                <Text style={{ marginTop: 8 }} variant="bodyMedium">
                  {recos['benefits'][2]}
                </Text>
              </View>
              <Divider style={{ marginVertical: 8 }}></Divider>
              <Text variant="bodyMedium">
                Suggested Products
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Checkbox
                  color={MD2Colors.green300}
                  status={'checked'}
                />
                <Text style={{ marginTop: 8 }} variant="bodyMedium">
                  {recos['suggestedQuotes']['mf']}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Checkbox
                  color={MD2Colors.green300}
                  status={'checked'}
                />
                <Text style={{ marginTop: 8 }} variant="bodyMedium">
                  {recos['suggestedQuotes']['ef']}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Checkbox
                  color={MD2Colors.green300}
                  status={'checked'}
                />
                <Text style={{ marginTop: 8 }} variant="bodyMedium">
                  {recos['suggestedQuotes']['fds']}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Checkbox
                  color={MD2Colors.green300}
                  status={'checked'}
                />
                <Text style={{ marginTop: 8 }} variant="bodyMedium">
                  {recos['suggestedQuotes']['stocks']}
                </Text>
              </View>
            </Card.Content>
          </Card> : null}
      </View> :
      <View style={styles.cardContainer}>
        {actionss[0] != null ?
          <View>
            <List.Accordion title={actionss[0]['message']} left={(props) => <List.Icon {...props} icon="cog" />}>
              <List.Item
                title={actionss[0]['action'][0].actionName}
                description={actionss[0]['action'][0].description}
                right={(props) => <Button style={{ padding: 8 }} mode='contained-tonal' {...props}>Act</Button>}
              />
              <List.Item
                right={(props) => <Button style={{ padding: 8 }} mode='contained-tonal' {...props}>Act</Button>}
                title={actionss[0]['action'][1].actionName}
                description={actionss[0]['action'][1].description}
              />
            </List.Accordion>
          </View>
          : <View style={styles.cardContainer} />}
        {actionss[1] != null ?
          <View>
            <List.Accordion title={actionss[1]['message']} left={(props) => <List.Icon {...props} icon="cog" />}>
              <List.Item
                title={actionss[1]['action'][0].actionName}
                description={actionss[1]['action'][0].description}
                right={(props) => <Button style={{ padding: 8 }} mode='contained-tonal' {...props}>Act</Button>}
              />
              <List.Item
                right={(props) => <Button style={{ padding: 8 }} mode='contained-tonal' {...props}>Act</Button>}
                title={actionss[0]['action'][1].actionName}
                description={actionss[1]['action'][1].description}
              />
            </List.Accordion>
          </View>
          : <View style={styles.cardContainer} />}
      </View>}
  </ScreenWrapper>
};

const Discover = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);

  const Manage = () => {

    const [value, setValue] = React.useState('own');
    const [notificationSent, setNotificationSent] = React.useState(false);
  
    const startShareConsentFlow = async () => {
      try {
        const response = await fetch(
          'http://192.168.244.43:3001/shareConsent',
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vua: '8308171711@onemoney' })
          }
        );
        setNotificationSent(true);
      } catch (error) {
        console.log(error)
      }
    }
  
    const genderList = [
      {
        label: "Brother",
        value: "brother",
      },
      {
        label: "Sister",
        value: "sister",
      },
      {
        label: "Spouse",
        value: "spouse",
      },
      {
        label: "Kid",
        value: "kid",
      },
    ];
  
    const [showDropDown, setShowDropDown] = React.useState(false);
    const [gender, setGender] = React.useState<string>("");
  
    return <ScreenWrapper style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'own',
            label: 'My Products',
            style: styles.button2,
            showSelectedCheck: true,
          },
          {
            value: 'family',
            label: 'Family',
            style: styles.button2,
            showSelectedCheck: true,
          },
        ]}
  
        style={styles.group}
      />
  
      {value == "family" ? <View style={styles.cardContainer} >
        <List.Section style={{ marginLeft: 8 }} title="Family Members">
          <List.Accordion
            style={{ marginLeft: 8 }}
            left={(props) => <List.Icon {...props} icon="face-woman" />}
            title="Mother"
          >
  
          </List.Accordion>
          <List.Accordion
            style={{ marginLeft: 8 }}
            left={(props) => <List.Icon {...props} icon="face-man" />}
            title="Father"
          >
          </List.Accordion>
          <List.Accordion
            style={{ marginLeft: 8 }}
            left={(props) => <List.Icon {...props} icon="heart" />}
            title="Add More Members"
          >
            <View style={{ marginRight: 52 }}>
              <DropDown
                label={"Relationship"}
                mode={"outlined"}
                visible={showDropDown}
                showDropDown={() => setShowDropDown(true)}
                onDismiss={() => setShowDropDown(false)}
                value={gender}
                setValue={setGender}
                list={genderList}
              />
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
              <HelperText type="info" visible={true}>
                They will receive a notifcation to approve
              </HelperText>
              <Button onPress={startShareConsentFlow} disabled={notificationSent} mode="contained-tonal" style={{ marginHorizontal: 8 }}>
                {!notificationSent ? "Request Data Consent" : "Data consent requested"}
              </Button>
            </View>
          </List.Accordion>
        </List.Section>
      </View> :
        <Card style={styles.card} mode="contained" onPress={() => navigation.navigate('autoClaimInsuranceLoader')}>
          <Card.Title
            left={(props) => <Avatar.Icon {...props} icon="hospital" />}
            title="Niva Bupa"
            titleVariant="bodyLarge"
            right={(props) => <Button style={{ marginRight: 8 }} mode='contained' {...props}>Claim Now</Button>}
          />
        </Card>
      }
    </ScreenWrapper>
  };

  React.useEffect(() => {
    if (index == 0) {
      navigation.setParams({ headerTitle: 'DhanSahayita Portfolio' });
    }
    if (index == 1) {
      navigation.setParams({ headerTitle: 'DhanSahayita Discover' });
    }
    if (index == 2) {
      navigation.setParams({ headerTitle: 'DhanSahayita Manage' });
    }
    if (index == 3) {
      navigation.setParams({ headerTitle: 'DhanSahayita Assistant' });
    }
  }, [index]);

  const { params } = route;
  const { sourceColor, headerTitle, darkMode } = params;

  const [routes] = React.useState<RoutesState>([
    {
      key: 'portfolio',
      title: 'Portfolio',
      focusedIcon: 'bag-checked'
    },
    {
      key: 'discover',
      title: 'Discover',
      focusedIcon: 'binoculars',
      badge: true
    },
    {
      key: 'roster',
      title: 'Manage',
      focusedIcon: 'cash'
    },
    {
      key: 'chatbot',
      title: 'Assistant',
      focusedIcon: 'face-agent'
    },
  ]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const theme = colorThemes[sourceColor || 'paper'];

  const systemColorScheme = useColorScheme() || 'light';
  const colorScheme = darkMode ? 'dark' : systemColorScheme;

  const [selectedTab, setSelectedTab] = React.useState('cc');
  const [loanType, setLoanType] = React.useState('personal');
  const [appliedForBusinessLoan, setAppliedForBusinessLoan] = React.useState(false);
  const [appliedForPersonalLoan, setAppliedForPersonalLoan] = React.useState(false);

  const loanPurposeList = [
    {
      label: "Personal Loan",
      value: "personal_loan",
    },
    {
      label: "Home Loan",
      value: "home",
    },
  ];

  const startConsentFlow = () => {
    navigation.navigate("UserConsent")
    // setLoading(true)
    setTimeout(() => {
      if (loanType == "business") {
        setAppliedForBusinessLoan(true)
      } else {
        setAppliedForPersonalLoan(true)
      }
    }, 2000);
  }

  const DiscoverProducts = () => {
    return (
      <>
        <ScreenWrapper>
          <>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={styles.chipsContainer}
              contentContainerStyle={styles.chipsContent}
            >
              <Chip
                selected={selectedTab == "cc"}
                onPress={() => { setSelectedTab("cc") }}
                style={styles.chip}
                showSelectedOverlay
              >
                Credit Cards
              </Chip>
              <Chip selected={selectedTab == "loans"} onPress={() => { setSelectedTab("loans") }} style={styles.chip} showSelectedOverlay>
                Loans
              </Chip>
              <Chip selected={selectedTab == "insuarance"} onPress={() => { setSelectedTab("insuarance") }} style={styles.chip} showSelectedOverlay>
                Insuarance
              </Chip>
            </ScrollView>
            {selectedTab == "cc" ? <View style={styles.cardContainer} >
              <Card style={styles.card} mode="contained" onPress={() => { }}>
                <Card.Title
                  left={(props) => <Avatar.Icon {...props} icon="credit-card" />}
                  title="Flipkart Axis Credit Card"
                  titleVariant="bodyLarge"
                />
                <Card.Content>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Chip compact mode='outlined' icon="shopping" onPress={() => { }} style={{}}>
                      Online Shopping
                    </Chip>
                    <Chip compact mode='outlined' icon="train" onPress={openPhonePeApp} style={{ "marginLeft": 4 }}>
                      Travel
                    </Chip>
                    <Chip compact mode='outlined' icon="information" style={{ "marginLeft": 4 }}>
                      Dining
                    </Chip>
                  </ScrollView>
                  <Chip compact mode='flat' textStyle={{ color: '#20A15C' }} style={{ "marginTop": 20, backgroundColor: "#F8FFF5" }}>
                    Approx ₹8,000 savings per month
                  </Chip>
                </Card.Content>
              </Card>

              <Card style={styles.card} mode="contained">
                <Card.Title
                  left={(props) => <Avatar.Icon {...props} icon="credit-card" />}
                  title="HDFC Bank Diners Club"
                  titleVariant="bodyLarge"
                  right={(props) => <Avatar.Icon {...props} style={{ marginRight: 16, marginBottom: 4 }} icon="star" />}
                />
                <Card.Content>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Chip compact mode='outlined' onPress={handleDocumentSelection} style={{ "marginLeft": 4 }}>
                      Travel
                    </Chip>
                    <Chip compact mode='outlined' style={{ "marginLeft": 4 }}>
                      Dining
                    </Chip>
                  </ScrollView>
                  <Chip compact mode='flat' textStyle={{ color: '#20A15C' }} style={{ "marginTop": 20, backgroundColor: "#F8FFF5" }}>
                    Approx ₹6,000 savings per month
                  </Chip>
                </Card.Content>
              </Card>
            </View> : null}

            {selectedTab == "insuarance" ? <View style={styles.cardContainer} >
              <Card style={styles.card} mode="contained" onPress={() => navigation.navigate('Loan Details')}>
                <Card.Title
                  left={(props) => <Avatar.Icon {...props} icon="hospital" />}
                  title="HDFC Ergo"
                  titleVariant="bodyLarge"
                  right={(props) => <Avatar.Icon {...props} style={{ marginRight: 8 }} icon="arrow-right" />}
                />

                <Card.Content>
                  <Text variant="bodyMedium">
                    CLAIM SETTLEMENT RATIO
                  </Text>
                  <Text variant="titleMedium">
                    97.55%
                  </Text>
                  <Divider style={{ marginVertical: 8 }}></Divider>
                  <Text variant="bodyMedium">
                    NETWORK HOSPITALS
                  </Text>
                  <Text variant="titleMedium">
                    12,000+
                  </Text>
                  <Divider style={{ marginVertical: 8 }}></Divider>
                  <Text variant="bodyMedium">
                    RATING OUT OF 5
                  </Text>
                  <Text variant="titleMedium">
                    4.4
                  </Text>
                  <Chip compact textStyle={{ color: 'mediumslateblue' }} style={{ marginTop: 8 }} mode='flat'>
                    Based on your health transaction history
                  </Chip>
                </Card.Content>
              </Card>
              <Card style={styles.card} mode="contained" onPress={() => navigation.navigate('autoClaimInsuranceLoader')}>
                <Card.Title
                  left={(props) => <Avatar.Icon {...props} icon="hospital" />}
                  title="Niva Bupa"
                  titleVariant="bodyLarge"
                  right={(props) => <Avatar.Icon {...props} style={{ marginRight: 8 }} icon="arrow-right" />}
                />

                <Card.Content>
                  <Text variant="bodyMedium">
                    CLAIM SETTLEMENT RATIO
                  </Text>
                  <Text variant="titleMedium">
                    90.74%
                  </Text>
                  <Divider style={{ marginVertical: 8 }}></Divider>
                  <Text variant="bodyMedium">
                    NETWORK HOSPITALS
                  </Text>
                  <Text variant="titleMedium">
                    9,100+
                  </Text>
                  <Divider style={{ marginVertical: 8 }}></Divider>
                  <Text variant="bodyMedium">
                    RATING OUT OF 5
                  </Text>
                  <Text variant="titleMedium">
                    4
                  </Text>
                  <Chip compact textStyle={{ color: 'mediumslateblue' }} style={{ marginTop: 8 }} mode='flat'>
                    Based on your mutual fund investments
                  </Chip>
                </Card.Content>
              </Card>

              <Button mode="contained-tonal" style={styles.button}>
                Insuarance for family
              </Button>
            </View> : null}

            {selectedTab == "loans" ? <View style={styles.cardContainer} >
              <SegmentedButtons
                value={loanType}
                onValueChange={setLoanType}
                buttons={[
                  {
                    value: 'personal',
                    label: 'For me',
                    style: styles.button2,
                    showSelectedCheck: true,
                  },
                  {
                    value: 'business',
                    label: 'For my business',
                    style: styles.button2,
                    showSelectedCheck: true,
                  },
                ]}
                style={styles.group}
              />

              {loanType == "business" ?
                <>
                  {
                    appliedForBusinessLoan ?
                      <View style={styles.cardContainer}>
                        <Card style={styles.card} mode="contained" onPress={() => navigation.navigate('Loan Details')}>
                          <Card.Title
                            left={(props) => <Avatar.Icon {...props} icon="bank" />}
                            title="ICICI Bank"
                            titleVariant="bodyLarge"
                            right={(props) => <Avatar.Icon {...props} style={{ marginRight: 8 }} icon="arrow-right" />}
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
                            <Chip compact textStyle={{ color: 'mediumslateblue' }} style={{ marginTop: 8 }} mode='flat'>
                              LOWEST INTEREST
                            </Chip>
                          </Card.Content>
                        </Card>
                        <Card style={styles.card} mode="contained" onPress={() => navigation.navigate('Loan Details')}>
                          <Card.Title
                            left={(props) => <Avatar.Icon {...props} icon="bank" />}
                            title="State Bank of India"
                            titleVariant="bodyLarge"
                            right={(props) => <Avatar.Icon {...props} style={{ marginRight: 8 }} icon="arrow-right" />}
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
                              ₹ 10,400 @ 13%
                            </Text>
                            <Divider style={{ marginVertical: 8 }}></Divider>
                            <Text variant="bodyMedium">
                              Duration
                            </Text>
                            <Text variant="titleMedium">
                              6 months
                            </Text>
                            <Chip compact textStyle={{ color: 'mediumslateblue' }} style={{ marginTop: 8 }} mode='flat'>
                              HIGHEST TENURE
                            </Chip>
                          </Card.Content>
                        </Card>
                      </View> :
                      <View style={styles.cardContainer}>
                        <List.Section title="We would require following info from you">
                          <TextInput
                            mode="outlined"
                            style={styles.inputContainerStyle}
                            label="Loan Amount"
                            onChangeText={(text) => inputActionHandler('amount', text)}
                            left={
                              <TextInput.Icon
                                icon="currency-inr"
                              />
                            }
                          />
                          <HelperText type="info" visible={true}>
                            Between 1,00,000 to 5,00,000
                          </HelperText>
                          <TextInput
                            mode="outlined"
                            style={styles.inputContainerStyle}
                            label="Required Tenure"
                            onChangeText={(text) => inputActionHandler('tenure', text)}
                            left={
                              <TextInput.Icon
                                icon="calendar"
                              />
                            }
                          />
                          <HelperText type="info" visible={true}>
                            In months
                          </HelperText>
                        </List.Section>
                        <Button onPress={startConsentFlow} mode="outlined" style={styles.button}>
                          Apply for a Business Loan
                        </Button>
                      </View>
                  }
                </> : <>
                  {
                    appliedForPersonalLoan ?
                      <View style={styles.cardContainer}>
                        <Card style={styles.card} mode="contained" onPress={() => navigation.navigate('Loan Details')}>
                          <Card.Title
                            left={(props) => <Avatar.Icon {...props} icon="bank" />}
                            title="Smallcase"
                            titleVariant="bodyLarge"
                            right={(props) => <Avatar.Icon {...props} style={{ marginRight: 8 }} icon="arrow-right" />}
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
                            <Chip compact textStyle={{ color: 'mediumslateblue' }} style={{ marginTop: 8 }} mode='flat'>
                              Based on your mutual fund investments
                            </Chip>
                          </Card.Content>
                        </Card>
                        <Card style={styles.card} mode="contained" onPress={() => navigation.navigate('Loan Details')}>
                          <Card.Title
                            left={(props) => <Avatar.Icon {...props} icon="bank" />}
                            title="Bajaj Finance"
                            titleVariant="bodyLarge"
                            right={(props) => <Avatar.Icon {...props} style={{ marginRight: 8 }} icon="arrow-right" />}
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
                              ₹ 10,400 @ 13%
                            </Text>
                            <Divider style={{ marginVertical: 8 }}></Divider>
                            <Text variant="bodyMedium">
                              Duration
                            </Text>
                            <Text variant="titleMedium">
                              6 months
                            </Text>
                            <Chip compact textStyle={{ color: 'mediumslateblue' }} style={{ marginTop: 8 }} mode='flat'>
                              Based on wages received from Swiggy
                            </Chip>
                          </Card.Content>
                        </Card>
                      </View> :
                      <View style={styles.cardContainer}>
                        <List.Section title="We would require following info from you">

                          <TextInput
                            mode="outlined"
                            style={styles.inputContainerStyle}
                            label="Loan Purpose"
                            onChangeText={(text) => inputActionHandler('loanPurpose', text)}
                            left={
                              <TextInput.Icon
                                icon="home"
                              />
                            }
                          />

                          <TextInput
                            mode="outlined"
                            style={styles.inputContainerStyle}
                            label="Loan Amount"
                            onChangeText={(text) => inputActionHandler('amount', text)}
                            left={
                              <TextInput.Icon
                                icon="currency-inr"
                              />
                            }
                          />
                          <HelperText type="info" visible={true}>
                            Between 1,00,000 to 5,00,000
                          </HelperText>
                          <TextInput
                            mode="outlined"
                            style={styles.inputContainerStyle}
                            label="Required Tenure"
                            onChangeText={(text) => inputActionHandler('tenure', text)}
                            left={
                              <TextInput.Icon
                                icon="calendar"
                              />
                            }
                          />
                          <HelperText type="info" visible={true}>
                            In months
                          </HelperText>

                        </List.Section>
                        <Button onPress={startConsentFlow} mode="outlined" style={styles.button}>
                          Apply for a Personal Loan
                        </Button>
                      </View>
                  }
                </>}
            </View> : null}
          </>
        </ScreenWrapper>
      </>
    );
  };

  const openPhonePeApp = async () => {
    AppLink.maybeOpenURL("ppe://mandate?mn=Autopay&ver=01&rev=Y&purpose=14&validityend=08032024&QRts=2023-09-08T06:12:24.469828992+05:30&QRexpire=2023-09-08T06:37:24.469828992+05:30&txnType=CREATE&am=999.00&validitystart=08092023&mode=04&pa=SWIGGY8@ybl&cu=INR&amrule=MAX&mc=5812&qrMedium=00&recur=ASPRESENTED&mg=ONLINE&share=Y&block=N&tr=2200127b-&pn=Swiggy&orgid=500044&sign=MEQCIAcVgoOowP74u8zuZxr6Q2XsPNeghpDrbUrtqVHL6nzoAiBYppEv3Q+R6LL8Ar93m3p7WeEp7qVC51QJPT8nXZZg/w=", { playStoreId: 'me.lyft.android' }).then(() => {
      // do stuff
    })
      .catch((err) => {
        // handle error
      });
  }

  const handleDocumentSelection = async () => {
    let result = await DocumentPicker.getDocumentAsync({ "type": ["*/*"] });
    if (!result.cancelled) {
      // alert(result.uri);
      console.log(result)
      let { name, size, uri } = result;
      let nameParts = name.split('.');
      let fileType = nameParts[nameParts.length - 1];
      const fileToUpload = {
        name: name,
        size: size,
        uri: uri,
        type: "application/" + fileType
      };
      console.log(fileToUpload, '...............file')
      const formData = new FormData();
      formData.append('document', fileToUpload);
      const options = {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        },
      };

      fetch('http://192.168.244.43:3001/upload', options).catch((error) => console.log(error));
    }
  }

  return (
    <Provider theme={theme[colorScheme]}>
      <View style={styles.screen}>
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={headerTitle} />
        </Appbar.Header>
        <BottomNavigation
          safeAreaInsets={{ bottom: insets.bottom }}
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          labelMaxFontSizeMultiplier={2}
          renderScene={BottomNavigation.SceneMap({
            portfolio: Portfolio,
            discover: DiscoverProducts,
            roster: Manage,
            chatbot: ChatBot
          })}
          sceneAnimationEnabled
          sceneAnimationType={'opacity'}
          sceneAnimationEasing={Easing.ease}
          getLazy={({ route }) => route.key !== 'album'}
        />
      </View>
    </Provider>
  );
};

Discover.title = 'Discover';

export default Discover;

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
    margin: 8,
  },
  container: {
    marginVertical: 16,
  },
  screen: {
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
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: MD3LightTheme.colors.secondaryContainer
  },
  cardContainer: {
    marginLeft: 8,
    marginBottom: 80,
  },
  cardContainer2: {
    marginTop: 8,
    marginLeft: 16,
    marginRight: 22,
    flexDirection: 'row',
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
  button2: {
    flex: 1,
  },
  inputContainerStyle: {
    margin: 8,
  },
  group: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingBottom: 8,
    marginTop: 8
  },
});