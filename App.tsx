import 'react-native-gesture-handler';
import * as React from 'react';
import { DefaultTheme, Provider as PaperProvider, ToggleButton } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import axios from 'axios';

import AppNavigator from './src/navigation/AppNavigator';
import Colors from './src/constants/Colors';
import { BASE_URL } from './src/constants/base_url';
import { store } from './src/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getNotificationToken, registerNotification } from './src/lib/Notifee';

axios.defaults.baseURL = BASE_URL;

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
  },
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <SafeAreaProvider>
        <Provider store={store}>
          <PaperProvider theme={theme}>
            <AppNavigator />
          </PaperProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
