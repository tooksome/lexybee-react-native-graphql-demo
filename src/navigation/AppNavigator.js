import React                    from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { StyleSheet }           from 'react-native'
import { Button, Icon }         from 'react-native-elements'
//
import BeeListScreen            from '../screens/BeeListScreen'
import BeeScreen                from '../screens/BeeScreen'
import AboutScreen              from '../screens/AboutScreen'

const Stack = createStackNavigator()

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={BeeListScreen}
      options={({ navigation }) => ({
        headerRight: () => (
          <Button
            buttonStyle = {styles.headerButton}
            icon        = {<Icon name="info" color="#ccf" />}
            onPress     = {() => navigation.push("About")}
          />
        ),
      })}
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

const styles = StyleSheet.create({
  headerButton: {
    backgroundColor: "transparent",
  },
})

export default AppNavigator
