import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import Chat from '../screens/Chat';
import ChatRoom from '../screens/ChatRoom';

import Singin from '../screens/Singin';

const Stack = createStackNavigator()

export default function AppRoutes() {
    return (
        <Stack.Navigator screenOptions={{
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter
        }}
            initialRouteName='ChatRoom'
        >


            <Stack.Screen
                component={Singin}
                name='SingIn'
                options={{
                    title: 'Faça o login',
                    headerStyle:{
                        backgroundColor: '#080808'
                    },
                    headerTintColor: '#fff'
                }} />

            <Stack.Screen
                component={ChatRoom}
                name='ChatRoom'
                options={{
                    headerShown: false 
                }}
            />
            <Stack.Screen
                component={Chat}
                name='Chat'
                options={{
                    headerShown: false 
                }}
            />
        </Stack.Navigator>
    );
}