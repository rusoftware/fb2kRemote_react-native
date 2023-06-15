import AsyncStorage from '@react-native-async-storage/async-storage';

// if you need want to have hardcoded your ip, you can set it here and using in Main.js to setUrl state∫
// defaulting to my own internal ip address, you can replace it with your own
export const APIURL = 'http://192.168.100.9:8880';

export const getAPI = async () => {
  try {
    const ipAddress = await AsyncStorage.multiGet(['ipAddress', 'port']);
    const targetUrl = (ipAddress[0][1]) ? `http://${ipAddress[0][1]}:${ipAddress[1][1]}` : APIURL;

    return targetUrl;
  }
  catch (error) {
    console.log('Error retrieving API value from AsyncStorage:', error)
    return APIURL
  }
};
