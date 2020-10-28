import * as React from 'react';
import { View, Text,Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './views/Home'
import LoginScreen from './views/Login'
import RegisterScreen from './views/Register'



const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name="Login" 
        options={{headerShown:false}}
        component={LoginScreen} />  
        <Stack.Screen 
        name="Register" 
        options={{headerShown:false}}
        component={RegisterScreen} />
        <Stack.Screen 
        name="Home" 
        component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
