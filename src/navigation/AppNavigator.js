import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import BeeListScreen            from '../screens/BeeListScreen'
import BeeScreen                from '../screens/BeeScreen'
import AboutScreen              from '../screens/AboutScreen'

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={BeeListScreen}
    />
    <Stack.Screen
      name="Bee"
      component={BeeScreen}
      options={{
        route: ({ route }) => ({ title: route.params.letters }),
      }}
    />
    <Stack.Screen
      name="About"
      component={AboutScreen}
    />
  </Stack.Navigator>
)

export default AppNavigator
