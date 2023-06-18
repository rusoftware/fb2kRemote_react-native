import React, { useEffect, useState } from 'react'
import { StyleSheet, Dimensions, View, TextInput, TouchableWithoutFeedback } from 'react-native'
import Header from '../customComponents/header'
import { MaterialIcons } from '@expo/vector-icons'
import StyledText from '../customComponents/styledText'
import AsyncStorage from '@react-native-async-storage/async-storage'

const windowWidth = Dimensions.get('window').width

const AppConfig = ({
  handlePageChange,
  setApiUrl
}) => {
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('8880');

  useEffect(() => {
    getSavedIP = async() => {
      const savedIP = await AsyncStorage.multiGet(['ipAddress', 'port'])
      setIpAddress(savedIP[0][1])
      setPort(savedIP[1][1])
    }

    getSavedIP()
  }, [])

  const handleSave = async (ipAddress) => {
    try {
      //await AsyncStorage.clear()
      await AsyncStorage.multiSet([['ipAddress', ipAddress], ['port', port]]);
      setApiUrl(`http://${ipAddress}:${ipAddress}`)
      handlePageChange('player')
      console.log('Dirección IP guardada correctamente');
    } catch (error) {
      console.log('Error al guardar la dirección IP:', error);
    }
  };

  return (
    <View style={styles.setupPage}>
      <Header
        title="Setup page"
        showHomeButton={ true }
        handlePageChange={handlePageChange}
      />

      <View style={styles.formContainer}>
        <StyledText style={styles.labelText}>IP Address:</StyledText>
        <TextInput
          placeholder="Ingrese la dirección IP"
          value={ipAddress}
          onChangeText={setIpAddress}
          style={styles.inputText}
        />
        <StyledText style={styles.labelText}>Port (8880 by default):</StyledText>
        <TextInput
          placeholder="Port: 8880 by default"
          value={port}
          onChangeText={setPort}
          style={styles.inputText}
        />
        <TouchableWithoutFeedback onPress={() => handleSave(ipAddress)}>
          <View style={styles.formBtn}>
            <StyledText>Save Settings</StyledText>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  setupPage: {
    width: windowWidth,
    maxWidth: windowWidth,
    overflow: 'hidden',
    alignSelf: 'center',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 50
  },
  textHeader: {
    paddingTop: 8
  },
  formContainer: {
    width: windowWidth - 80,
    alignSelf: 'center',
    marginTop: 60,
    flex: 1
  },
  inputText: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  labelText: {
    marginTop: 4,
    marginTop: 12
  },
  formBtn: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  }
})

export default AppConfig;
