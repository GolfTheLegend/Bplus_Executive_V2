import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAsyncStorage = async (key: string) => {
  try {
    const defaultValue = await AsyncStorage.getItem(key);

    return defaultValue;
  } catch (error) {
    console.log('Error getAsyncStorage:', error);
    return null;
  }
};

export const saveAsyncStorage = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);

    return true;
  } catch (error) {
    console.log('Error saveAsyncStorage:', error);
    return null;
  }
};
