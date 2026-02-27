import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchDrivers, RandomUserResult } from '../api';
import { Driver, UserLocation } from '../types';
import {
  calculateDistance,
  generateRandomRating,
  getRandomVehicleType,
  getRandomOffset,
  generateNearbyCoordinate,
} from '../utils';

const DRIVERS_CACHE_KEY = 'cached_drivers';
const FAVORITES_KEY = 'favorite_drivers';

interface DriverState {
  drivers: Driver[];
  filteredDrivers: Driver[];
  favoriteIds: string[];
  selectedDriver: Driver | null;
  userLocation: UserLocation;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filterRatingAbove4: boolean;
  filterNearest: boolean;

  loadDrivers: () => Promise<void>;
  loadCachedDrivers: () => Promise<void>;
  simulateMovement: () => void;
  selectDriver: (driver: Driver | null) => void;
  toggleFavorite: (driverId: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  setUserLocation: (location: UserLocation) => void;
  setSearchQuery: (query: string) => void;
  setFilterRatingAbove4: (value: boolean) => void;
  setFilterNearest: (value: boolean) => void;
  applyFilters: () => void;
}

const DEFAULT_LOCATION: UserLocation = {
  latitude: 28.6139, // New Delhi
  longitude: 77.209,
};

const transformToDriver = (
  user: RandomUserResult,
  userLocation: UserLocation
): Driver => {
  const nearby = generateNearbyCoordinate(
    userLocation.latitude,
    userLocation.longitude,
    8
  );
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    nearby.latitude,
    nearby.longitude
  );
  return {
    id: user.login.uuid,
    name: `${user.name.first} ${user.name.last}`,
    firstName: user.name.first,
    lastName: user.name.last,
    email: user.email,
    phone: user.phone,
    image: user.picture.large,
    thumbnail: user.picture.thumbnail,
    latitude: nearby.latitude,
    longitude: nearby.longitude,
    rating: generateRandomRating(),
    vehicleType: getRandomVehicleType(),
    distance,
    isFavorite: false,
  };
};

export const useDriverStore = create<DriverState>((set, get) => ({
  drivers: [],
  filteredDrivers: [],
  favoriteIds: [],
  selectedDriver: null,
  userLocation: DEFAULT_LOCATION,
  isLoading: false,
  error: null,
  searchQuery: '',
  filterRatingAbove4: false,
  filterNearest: false,

  loadDrivers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchDrivers(15);
      const { userLocation, favoriteIds } = get();
      const drivers = response.results.map((user) =>
        transformToDriver(user, userLocation)
      );
      // Restore favorite status
      const driversWithFavorites = drivers.map((d) => ({
        ...d,
        isFavorite: favoriteIds.includes(d.id),
      }));
      // Cache drivers
      await AsyncStorage.setItem(
        DRIVERS_CACHE_KEY,
        JSON.stringify(driversWithFavorites)
      );
      set({ drivers: driversWithFavorites, isLoading: false });
      get().applyFilters();
    } catch (err: any) {
      set({
        error: 'Failed to load drivers',
        isLoading: false,
      });
    }
  },

  loadCachedDrivers: async () => {
    try {
      const cached = await AsyncStorage.getItem(DRIVERS_CACHE_KEY);
      if (cached) {
        const drivers: Driver[] = JSON.parse(cached);
        set({ drivers });
        get().applyFilters();
      }
    } catch {
      // Silently fail
    }
  },

  simulateMovement: () => {
    const { drivers, userLocation } = get();
    const updated = drivers.map((driver) => {
      const newLat = driver.latitude + getRandomOffset();
      const newLng = driver.longitude + getRandomOffset();
      const newDistance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        newLat,
        newLng
      );
      return {
        ...driver,
        latitude: newLat,
        longitude: newLng,
        distance: newDistance,
      };
    });
    set({ drivers: updated });
    get().applyFilters();
  },

  selectDriver: (driver) => {
    set({ selectedDriver: driver });
  },

  toggleFavorite: async (driverId: string) => {
    const { favoriteIds, drivers } = get();
    let newFavorites: string[];
    if (favoriteIds.includes(driverId)) {
      newFavorites = favoriteIds.filter((id) => id !== driverId);
    } else {
      newFavorites = [...favoriteIds, driverId];
    }
    const updatedDrivers = drivers.map((d) => ({
      ...d,
      isFavorite: newFavorites.includes(d.id),
    }));
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    set({ favoriteIds: newFavorites, drivers: updatedDrivers });

    // Update selected driver if it's the one being toggled
    const { selectedDriver } = get();
    if (selectedDriver && selectedDriver.id === driverId) {
      set({
        selectedDriver: {
          ...selectedDriver,
          isFavorite: newFavorites.includes(driverId),
        },
      });
    }
    get().applyFilters();
  },

  loadFavorites: async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const favoriteIds: string[] = JSON.parse(stored);
        set({ favoriteIds });
      }
    } catch {
      // Silently fail
    }
  },

  setUserLocation: (location: UserLocation) => {
    set({ userLocation: location });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setFilterRatingAbove4: (value: boolean) => {
    set({ filterRatingAbove4: value });
    get().applyFilters();
  },

  setFilterNearest: (value: boolean) => {
    set({ filterNearest: value });
    get().applyFilters();
  },

  applyFilters: () => {
    const { drivers, searchQuery, filterRatingAbove4, filterNearest } = get();
    let result = [...drivers];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((d) => d.name.toLowerCase().includes(query));
    }

    if (filterRatingAbove4) {
      result = result.filter((d) => d.rating > 4);
    }

    if (filterNearest) {
      result = result.sort((a, b) => a.distance - b.distance).slice(0, 5);
    }

    set({ filteredDrivers: result });
  },
}));
