import React           from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
}                      from 'react-native';
import * as WebBrowser from 'expo-web-browser';
//
import Colors from '../lib/Colors';


const WebLink = ({ url, children, style, ...props }) => (
  <TouchableOpacity
    onPress={() => WebBrowser.openBrowserAsync(url)}
  >
    <Text
      {...props} // eslint-disable-line react/jsx-props-no-spreading
      accessibilityRole="link"
      style={[styles.linkedText, style]}
    >
      {children}
    </Text>
  </TouchableOpacity>
);

export default WebLink

const styles = StyleSheet.create({
  linkedText: {
    color:      Colors.linkColor,
    textAlign: 'center',
  },
});
