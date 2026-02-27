export interface Driver {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  thumbnail: string;
  latitude: number;
  longitude: number;
  rating: number;
  vehicleType: string;
  distance: number;
  isFavorite: boolean;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export type VehicleType = 'Sedan' | 'SUV' | 'Hatchback' | 'Bike' | 'Van';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  DriverDetails: { driverId: string };
};

export type MainTabParamList = {
  DriverMap: undefined;
  Favorites: undefined;
};
