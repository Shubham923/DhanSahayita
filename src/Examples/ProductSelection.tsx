import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Avatar,
  Divider,
  Text,
  Button,
  TextInput,
  IconButton,
  List,
  Chip,
  Checkbox
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

const ProductSelectionScreen = ({ navigation, route }: Props) => {
  const [checkedLeadingControl, setCheckedLeadingControl] = React.useState<boolean>(true);
  const [selectedTabs, setSeletedTabs] = React.useState([]);
  const [isMFSelected, setMFSelected] = React.useState(false);
  const [isCCSelected, setCCSelected] = React.useState(false);
  const [isLoanSelected, setLoanSelected] = React.useState(false);
  const [isInsSelected, setInsSelected] = React.useState(false);
  const [isConsentGranted, setIsConsentGranted] = React.useState(false);

  const navigate = () => {
    if (isConsentGranted) {
      navigation.navigate('discover', {
        sourceColor: 'paper',
        headerTitle: 'DhanSahayita Discover',
        darkMode: false,
      })
    } else {
      navigation.navigate("UserConsent")
      // setLoading(true)
      setTimeout(() => {
        setIsConsentGranted(true)
      }, 2000);
    }
  }

  React.useEffect(() => {
    navigation.setParams({ headerTitle: 'DhanSahayita Product Selection' });
  }, [])

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
      <Text variant="titleMedium" style={{ color: 'gray', textAlign: "center", marginVertical: 8 }}>
        Select a few financial products you need assistance in and we’ll help you out!
      </Text>

      <List.Section>
        <View style={styles.row}>
          <Chip mode="flat" onPress={() => { setMFSelected(!isMFSelected) } } showSelectedOverlay style={styles.chip} selected={isMFSelected}>
            Mutual Funds
          </Chip>
          <Chip mode="flat" onPress={() => { setCCSelected(!isCCSelected) } } showSelectedOverlay style={styles.chip} selected={isCCSelected}>
            Credit Cards
          </Chip>
          <Chip mode="flat" onPress={() => { setLoanSelected(!isLoanSelected) } } showSelectedOverlay style={styles.chip} selected={isLoanSelected}>
            Loans
          </Chip>
          <Chip mode="flat" onPress={() => { setInsSelected(!isInsSelected) } } showSelectedOverlay style={styles.chip} selected={isInsSelected}>
            Insurance
          </Chip>
          <Chip mode="flat" onPress={() => { }} showSelectedOverlay style={styles.chip}>
            Bonds
          </Chip>
          <Chip mode="flat" onPress={() => { }} showSelectedOverlay style={styles.chip}>
            FDs
          </Chip>
          <Chip mode="flat" onPress={() => { }} showSelectedOverlay style={styles.chip}>
            Gold
          </Chip>
        </View>
      </List.Section>

      <Checkbox.Item
        style={{ marginLeft: 8, marginRight: 80 }}
        label="I accept the terms & conditions"
        status={checkedLeadingControl ? 'checked' : 'unchecked'}
        onPress={() => setCheckedLeadingControl(!checkedLeadingControl)}
        mode="android"
        position="leading"
      />

      <Button onPress={navigate} icon="login" mode="contained-tonal" disabled={!checkedLeadingControl} style={styles.button}>
        Continue
      </Button>
    </View>
  );
};

ProductSelectionScreen.title = 'Select Financial Products';

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
  chip: {
    margin: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'center'
  },
});

export default ProductSelectionScreen;
