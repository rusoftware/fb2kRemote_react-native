import React from "react";
import { StyleSheet, Text } from "react-native";
import { useFonts } from 'expo-font';

export default function StyledText ({h1, h2, big, small, bold, style, children}) {

  const [fontsLoaded] = useFonts({
    'Bronova': require('../assets/fonts/Bronova-Regular.ttf'),
    'Bronova Bold': require('../assets/fonts/Bronova-Bold.ttf'),
    'Roboto Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto': require('../assets/fonts/Roboto-Regular.ttf')
  });

  if (!fontsLoaded) {
    return;
  }

  const textStyles = [
    styles.text,
    h1 && styles.h1,
    h2 && styles.h2,
    big && styles.big,
    small && styles.small,
    bold && styles.bold,
    style
  ];
  
  return (
    <Text style={textStyles}>
      { children }
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginVertical: 2,
    fontFamily: 'Roboto',
    color: '#EBEBEBFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 4
  },
  h1: {
    fontSize: 20,
    marginVertical: 0,
    fontFamily: 'Bronova Bold',
    color: '#ebebebcc'
  },
  h2: {
    fontSize: 16,
    marginVertical: 2,
    fontFamily: 'Roboto',
    color: '#ebebebcc'
  },
  big: {
    fontSize: 24,
  },
  small: {
    fontSize: 10,
    fontFamily: 'Bronova'
  },
  bold: {
    fontWeight: 700
  }
})
