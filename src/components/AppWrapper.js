import * as React              from 'react'
import { Platform, StatusBar, StyleSheet, SafeAreaView,
}                              from 'react-native'
import { DefaultTheme, DarkTheme,
}                              from '@react-navigation/native'
import { ThemeProvider, colors,
}                              from 'react-native-elements'
import { Appearance, AppearanceProvider, useColorScheme,
}                              from 'react-native-appearance'

Appearance.getColorScheme()
/* const colorSchemes = {
 *   light: {
 *     // background: '#eec',
 *     // text:       '333',
 *   },
 *   dark: {
 *     // background: '#333',
 *     // text:       '#fff',
 *   },
 * }
 *  */

const baseTheme = {
  colors: {
    ...Platform.select({
      default: colors.platform.android,
      ios:     colors.platform.ios,
    }),
  },
  ListItem: {
    titleStyle: {
      color:           DefaultTheme.colors.text,
    },
    containerStyle: {
      backgroundColor: DefaultTheme.colors.background,
    },
  },
  Input: {
    inputContainerStyle: { borderBottomColor: 'transparent' },
    inputStyle: {
      fontSize:       24,
      marginVertical: 4,
      marginRight:    0,
      paddingLeft:    8,
    },
  },
  Button: {
    buttonStyle: {
      borderRadius:      8,
    },
  },
}

const rneDarkTheme = {
  ...baseTheme,
  colors: {
  },
  ListItem: {
    titleStyle: {
      color:           DarkTheme.colors.text,
    },
    containerStyle: {
      backgroundColor: DarkTheme.colors.background,
    },
  },
}

const AppWrapper = ({ children }) => {
  const colorScheme = useColorScheme()
  // const rnColors = colorSchemes[colorScheme] || colorSchemes.light
  const navTheme = (colorScheme === 'dark' ? DarkTheme    : DefaultTheme)
  const theme    = (colorScheme === 'dark' ? rneDarkTheme : baseTheme)
  const barStyle = (colorScheme === 'dark' ? 'light-content' : 'dark-content')

  // console.log(colors, theme, 'scheme', colorScheme, 'colors', rnColors, 'dkTheme', DarkTheme, DefaultTheme)

  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: navTheme.colors.background }}>
      <AppearanceProvider>
        <ThemeProvider theme={theme}>
          <StatusBar barStyle={barStyle} />
          { children({ navTheme }) }
        </ThemeProvider>
      </AppearanceProvider>
    </SafeAreaView>
  )
}

const tintColor = '#2f95dc'

export default AppWrapper
export {
  AppWrapper,
  tintColor,
  /* tabIconDefault:       '#ccc',
   * tabIconSelected:      tintColor,
   * tabBar:               '#fefefe',
   * errorBackground:      'red',
   * errorText:            '#fff',
   * warningBackground:    '#EAEB5E',
   * warningText:          '#666804',
   * noticeBackground:     tintColor,
   * noticeText:           '#fff', */
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
