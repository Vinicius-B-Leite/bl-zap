import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import AppRoutes from './app.route';

export default function Routes() {
    return (
        <NavigationContainer>
            <AppRoutes/>
        </NavigationContainer>
    );
}