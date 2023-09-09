import * as React from 'react';
import { I18nManager, Platform, Linking } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  InitialState,
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  MD2DarkTheme,
  MD2LightTheme,
  MD2Theme,
  MD3Theme,
  useTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { isWeb } from '../utils';
import DrawerItems from './DrawerItems';
import App from './RootNavigator';
import ChatBot from './Examples/ChatBot';
import LoginScreen from './Examples/LoginScreen';
import ProductSelectionScreen from './Examples/ProductSelection';
import Consent from './Examples/Consent';
import Discover from './Examples/Discover';
import LoanDetails from './Examples/LoanDetails';
import UserConsent from './Examples/UserConsent';
import ConfirmationScreen from './Examples/ConfirmationScreen';
import AutoClaimInsurance from './Examples/AutoClaimInsuarancePolicies/AutoClaimInsurance';
import AutoClaimInsuranceLoader from './Examples/AutoClaimInsuarancePolicies/AutoClaimInsuranceLoader';
import AutoClaimInsuranceForm from './Examples/AutoClaimInsuarancePolicies/AutoClaimInsuranceForm';
import AutoClaimUploadDocuments from './Examples/AutoClaimInsuarancePolicies/AutoClaimUploadDocuments';
import InsuranceClaimStatus from './Examples/AutoClaimInsuarancePolicies/InsuranceClaimStatus';
import KYCFlow from './Examples/KYCFlow';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const PREFERENCES_KEY = 'APP_PREFERENCES';

export const PreferencesContext = React.createContext<any>(null);

export const useExampleTheme = () => useTheme<MD2Theme | MD3Theme>();

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const DrawerContent = () => {
  return (
    <PreferencesContext.Consumer>
      {(preferences) => (
        <DrawerItems
          toggleTheme={preferences.toggleTheme}
          toggleRTL={preferences.toggleRtl}
          toggleThemeVersion={preferences.toggleThemeVersion}
          toggleCollapsed={preferences.toggleCollapsed}
          collapsed={preferences.collapsed}
          isRTL={preferences.rtl}
          isDarkTheme={preferences.theme.dark}
        />
      )}
    </PreferencesContext.Consumer>
  );
};

export default function PaperExample() {
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  React.useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (await Notifications.getExpoPushTokenAsync({ projectId: '8e6d02e4-94d3-40ba-8ee4-dfa90f4a84cb' })).data;
      console.log(token);
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

  useKeepAwake();

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [themeVersion, setThemeVersion] = React.useState<2 | 3>(3);
  const [rtl, setRtl] = React.useState<boolean>(
    I18nManager.getConstants().isRTL
  );
  const [collapsed, setCollapsed] = React.useState(false);

  const themeMode = isDarkMode ? 'dark' : 'light';

  const theme = {
    2: {
      light: MD2LightTheme,
      dark: MD2DarkTheme,
    },
    3: {
      light: MD3LightTheme,
      dark: MD3DarkTheme,
    },
  }[themeVersion][themeMode];

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = JSON.parse(savedStateString || '');

        setInitialState(state);
      } catch (e) {
        // ignore error
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  React.useEffect(() => {
    const restorePrefs = async () => {
      try {
        const prefString = await AsyncStorage.getItem(PREFERENCES_KEY);
        const preferences = JSON.parse(prefString || '');

        if (preferences) {
          setIsDarkMode(preferences.theme === 'dark');

          if (typeof preferences.rtl === 'boolean') {
            setRtl(preferences.rtl);
          }
        }
      } catch (e) {
        // ignore error
      }
    };

    restorePrefs();
  }, []);

  React.useEffect(() => {
    const savePrefs = async () => {
      try {
        await AsyncStorage.setItem(
          PREFERENCES_KEY,
          JSON.stringify({
            theme: themeMode,
            rtl,
          })
        );
      } catch (e) {
        // ignore error
      }

      if (I18nManager.getConstants().isRTL !== rtl) {
        I18nManager.forceRTL(rtl);
        if (!isWeb) {
          Updates.reloadAsync();
        }
      }
    };

    savePrefs();
  }, [rtl, themeMode]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme: () => setIsDarkMode((oldValue) => !oldValue),
      toggleRtl: () => setRtl((rtl) => !rtl),
      toggleCollapsed: () => setCollapsed(!collapsed),
      toggleThemeVersion: () =>
        setThemeVersion((oldThemeVersion) => (oldThemeVersion === 2 ? 3 : 2)),
      collapsed,
      rtl,
      theme,
    }),
    [rtl, theme, collapsed]
  );

  if (!isReady) {
    return null;
  }

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
    },
  };

  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
    },
  };

  const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;


  return (
    <PaperProvider theme={theme}>
      <PreferencesContext.Provider value={preferences}>
        <React.Fragment>
          <NavigationContainer
            linking={{
              prefixes: ['https://mychat.com', 'mychat://'],
              config: {
                screens: {
                  chatbot: 'chatbot',
                  Login: 'login',
                  Consent: 'Consent'
                },
              },
              async getInitialURL() {
                // First, you may want to do the default deep link handling
                // Check if app was opened from a deep link
                const url = await Linking.getInitialURL();

                if (url != null) {
                  return url;
                }

                // Handle URL from expo push notifications
                const response = await Notifications.getLastNotificationResponseAsync();

                return response?.notification.request.content.data.url;
              },
              subscribe(listener) {
                const onReceiveURL = ({ url }: { url: string }) => listener(url);

                // Listen to incoming links from deep linking
                const eventListenerSubscription = Linking.addEventListener('url', onReceiveURL);

                // Listen to expo push notifications
                const subscription = Notifications.addNotificationResponseReceivedListener(response => {
                  listener("mychat://Consent");
                });

                return () => {
                  // Clean up the event listeners
                  eventListenerSubscription.remove();
                  subscription.remove();
                };
              },
            }}
            initialState={initialState}
            theme={combinedTheme}
            onStateChange={(state) =>
              AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
            }>
            {isWeb ? (
              <App />
            ) : (
              <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="chatbot" component={ChatBot} />
                <Stack.Screen name="Product Selection" component={ProductSelectionScreen} />
                <Stack.Screen name="Consent" component={Consent} />
                <Stack.Screen name="UserConsent" component={UserConsent} />
                <Stack.Screen name="discover" component={Discover} />
                <Stack.Screen name="Loan Details" component={LoanDetails} />
                <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
                <Stack.Screen name="KYC" component={KYCFlow} />
                <Stack.Screen name="autoClaimInsuranceLoader" component={AutoClaimInsuranceLoader} />
                <Stack.Screen name="autoClaimInsurance" component={AutoClaimInsurance} />
                <Stack.Screen name="autoClaimInsuranceForm" component={AutoClaimInsuranceForm} />
                <Stack.Screen name="autoClaimUploadDocuments" component={AutoClaimUploadDocuments} />
                <Stack.Screen name="insuranceClaimStatus" component={InsuranceClaimStatus} />
              </Stack.Navigator>
            )}
            <StatusBar style={!theme.isV3 || theme.dark ? 'light' : 'dark'} />
          </NavigationContainer>
        </React.Fragment>
      </PreferencesContext.Provider>
    </PaperProvider>
  );
}
