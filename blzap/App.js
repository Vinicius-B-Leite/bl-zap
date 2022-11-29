import 'react-native-gesture-handler';
import React from 'react';

import { SafeAreaView, StatusBar, View } from 'react-native';
import Routes from './src/routes';
import AuthProvider from './src/contexts/auth';

const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
};

export default App;
