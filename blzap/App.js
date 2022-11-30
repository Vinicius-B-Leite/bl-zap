import 'react-native-gesture-handler';
import React from 'react';

import { SafeAreaView, StatusBar, View } from 'react-native';
import Routes from './src/routes';
import AuthProvider from './src/contexts/auth';
import ChatProvider from './src/contexts/chat';

const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <Routes />
      </ChatProvider>
    </AuthProvider>
  )
};

export default App;
