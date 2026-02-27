import { VehicleType } from '../types';

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Calculate distance between two coordinates using Haversine formula (km)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

const toRad = (value: number): number => (value * Math.PI) / 180;

/**
 * Generate a random rating between 3.0 and 5.0
 */
export const generateRandomRating = (): number => {
  return parseFloat((Math.random() * 2 + 3).toFixed(1));
};

/**
 * Get a random vehicle type
 */
export const getRandomVehicleType = (): VehicleType => {
  const vehicles: VehicleType[] = ['Sedan', 'SUV', 'Hatchback', 'Bike', 'Van'];
  return vehicles[Math.floor(Math.random() * vehicles.length)];
};

/**
 * Add small random offset to simulate driver movement
 */
export const getRandomOffset = (): number => {
  return (Math.random() - 0.5) * 0.005; // ~500m offset
};

/**
 * Generate a random coordinate near a base location
 */
export const generateNearbyCoordinate = (
  baseLat: number,
  baseLng: number,
  radiusKm: number = 5
): { latitude: number; longitude: number } => {
  const radiusDeg = radiusKm / 111;
  const angle = Math.random() * 2 * Math.PI;
  const dist = Math.random() * radiusDeg;
  return {
    latitude: baseLat + dist * Math.cos(angle),
    longitude: baseLng + dist * Math.sin(angle),
  };
};
