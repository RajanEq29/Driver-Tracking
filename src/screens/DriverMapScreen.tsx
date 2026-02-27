import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDriverStore } from '../store';
import { useDriverSimulation, useNetworkStatus } from '../hooks';
import { getCurrentLocation } from '../services';
import { OfflineBanner, DriverCard, SearchFilterBar } from '../components';
import { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const DriverMapScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const isConnected = useNetworkStatus();

  const {
    filteredDrivers,
    selectedDriver,
    userLocation,
    isLoading,
    searchQuery,
    filterRatingAbove4,
    filterNearest,
    loadDrivers,
    loadCachedDrivers,
    loadFavorites,
    selectDriver,
    toggleFavorite,
    setUserLocation,
    setSearchQuery,
    setFilterRatingAbove4,
    setFilterNearest,
  } = useDriverStore();

  // Start real-time simulation (every 3 seconds)
  useDriverSimulation(3000);

  useEffect(() => {
    const init = async () => {
      await loadFavorites();

      // Try to get user location
      const loc = await getCurrentLocation();
      if (loc) {
        setUserLocation(loc);
      }

      if (isConnected) {
        await loadDrivers();
      } else {
        await loadCachedDrivers();
      }
    };
    init();
  }, []);

  // Reload when connectivity changes
  useEffect(() => {
    if (isConnected) {
      loadDrivers();
    } else {
      loadCachedDrivers();
    }
  }, [isConnected]);

  const handleMarkerPress = useCallback(
    (driver: any) => {
      selectDriver(driver);
    },
    [selectDriver]
  );

  const handleCardPress = useCallback(() => {
    if (selectedDriver) {
      navigation.navigate('DriverDetails', { driverId: selectedDriver.id });
    }
  }, [selectedDriver, navigation]);

  const handleToggleFav = useCallback(() => {
    if (selectedDriver) {
      toggleFavorite(selectedDriver.id);
    }
  }, [selectedDriver, toggleFavorite]);

  if (isLoading && filteredDrivers.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4361ee" />
        <Text style={styles.loadingText}>Loading drivers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isConnected && <OfflineBanner />}

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterRatingAbove4={filterRatingAbove4}
        onToggleRating={() => setFilterRatingAbove4(!filterRatingAbove4)}
        filterNearest={filterNearest}
        onToggleNearest={() => setFilterNearest(!filterNearest)}
      />

      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        showsUserLocation
        showsMyLocationButton
        onPress={() => selectDriver(null)}
      >
        {filteredDrivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{
              latitude: driver.latitude,
              longitude: driver.longitude,
            }}
            title={driver.name}
            description={`${driver.vehicleType} · ⭐ ${driver.rating}`}
            onPress={() => handleMarkerPress(driver)}
            pinColor={driver.isFavorite ? '#FF6B6B' : '#4361ee'}
          />
        ))}
      </MapView>

      {selectedDriver && (
        <DriverCard
          driver={selectedDriver}
          onPress={handleCardPress}
          onToggleFavorite={handleToggleFav}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
});
