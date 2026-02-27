import * as Location from 'expo-location';
import { UserLocation } from '../types';

export const getCurrentLocation = async (): Promise<UserLocation | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.warn('Location error:', error);
    return null;
  }
};
