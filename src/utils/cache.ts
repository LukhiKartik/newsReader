import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'newsCache';

export const saveToCache = async (data: any) => {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
};

export const getFromCache = async () => {
  const cachedData = await AsyncStorage.getItem(CACHE_KEY);
  return cachedData ? JSON.parse(cachedData) : null;
};
