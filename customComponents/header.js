import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import StyledText from "./styledText";
import { useFonts } from 'expo-font';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

export default function Header ({
  title,
  showHomeButton,
  showExtraButton,
  handlePageChange,
  style
}) {

  const [fontsLoaded] = useFonts({
    'Bronova': require('../assets/fonts/Bronova-Regular.ttf'),
    'Bronova Bold': require('../assets/fonts/Bronova-Bold.ttf'),
    'Roboto Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto': require('../assets/fonts/Roboto-Regular.ttf')
  });

  if (!fontsLoaded) {
    return;
  }

  const headerStyles = [
    styles.header,
    style
  ];

  return (
    <View style={headerStyles}>
      <View style={styles.backButton}>
        {showHomeButton && 
          <TouchableOpacity onPress={() => handlePageChange('player')}>
            <View>
              <MaterialIcons name="chevron-left" size={38} style={styles.back} color="#ebebeb" />
            </View>
          </TouchableOpacity>
        || 
          <TouchableOpacity onPress={() => handlePageChange('setup')}>
            <View>
              <MaterialCommunityIcons name="menu" size={24} style={styles.back} color="#ebebeb" />
            </View>
          </TouchableOpacity>
        }
      </View>
      <View style={styles.headerTitle}>
        <StyledText style={styles.sectionTitle}>{ title }</StyledText>
      </View>
      <View style={styles.settingButton}>
        { showExtraButton }
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 34,
    alignItems: 'center',
    height: 30
  },
  sectionTitle: {
    color: '#ebebebff',
    marginTop: 6
  },
  backButton: {
    width: 40,
    alignItems: 'center'
  },
  settingButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
