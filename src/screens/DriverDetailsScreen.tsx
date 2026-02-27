import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useDriverStore } from '../store';
import { RootStackParamList } from '../types';

type DetailsRouteProp = RouteProp<RootStackParamList, 'DriverDetails'>;

export const DriverDetailsScreen: React.FC = () => {
  const route = useRoute<DetailsRouteProp>();
  const navigation = useNavigation();
  const { driverId } = route.params;

  const drivers = useDriverStore((s) => s.drivers);
  const toggleFavorite = useDriverStore((s) => s.toggleFavorite);

  const driver = useMemo(
    () => drivers.find((d) => d.id === driverId),
    [drivers, driverId]
  );

  if (!driver) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Driver not found</Text>
      </View>
    );
  }

  const handleCall = () => {
    Alert.alert('Calling Driver', `Dialing ${driver.phone}...`, [
      { text: 'OK' },
    ]);
  };

  const handleFavorite = () => {
    toggleFavorite(driver.id);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: driver.image }} style={styles.avatar} />
        <Text style={styles.name}>{driver.name}</Text>
        <Text style={styles.email}>{driver.email}</Text>
      </View>

      {/* Info Cards */}
      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Rating</Text>
          <Text style={styles.infoValue}>⭐ {driver.rating}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Vehicle</Text>
          <Text style={styles.infoValue}>🚗 {driver.vehicleType}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Distance</Text>
          <Text style={styles.infoValue}>📍 {driver.distance} km</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={styles.infoValue}>🟢 Online</Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>Contact Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone</Text>
          <Text style={styles.detailValue}>{driver.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue}>{driver.email}</Text>
        </View>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Latitude</Text>
          <Text style={styles.detailValue}>
            {driver.latitude.toFixed(6)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Longitude</Text>
          <Text style={styles.detailValue}>
            {driver.longitude.toFixed(6)}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={handleCall}
          activeOpacity={0.85}
        >
          <Text style={styles.callBtnText}>📞 Call Driver</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.favBtn,
            driver.isFavorite && styles.favBtnActive,
          ]}
          onPress={handleFavorite}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.favBtnText,
              driver.isFavorite && styles.favBtnTextActive,
            ]}
          >
            {driver.isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  content: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    fontSize: 18,
    color: '#999',
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    marginBottom: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 10,
  },
  infoCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  detailSection: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  actions: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  callBtn: {
    backgroundColor: '#4361ee',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4361ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  callBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  favBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  favBtnActive: {
    borderColor: '#FF6B6B',
    backgroundColor: '#fff5f5',
  },
  favBtnText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '700',
  },
  favBtnTextActive: {
    color: '#FF6B6B',
  },
});
