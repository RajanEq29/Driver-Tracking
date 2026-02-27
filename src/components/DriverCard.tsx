import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Driver } from '../types';

interface DriverCardProps {
  driver: Driver;
  onPress: () => void;
  onToggleFavorite: () => void;
}

const { width } = Dimensions.get('window');

export const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  onPress,
  onToggleFavorite,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.row}>
        <Image source={{ uri: driver.thumbnail }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{driver.name}</Text>
          <Text style={styles.detail}>🚗 {driver.vehicleType}</Text>
          <Text style={styles.detail}>📍 {driver.distance} km away</Text>
          <Text style={styles.detail}>⭐ {driver.rating}</Text>
        </View>
        <TouchableOpacity onPress={onToggleFavorite} style={styles.favBtn}>
          <Text style={styles.favIcon}>
            {driver.isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    width: width - 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 3,
  },
  detail: {
    fontSize: 13,
    color: '#555',
    marginTop: 1,
  },
  favBtn: {
    padding: 8,
  },
  favIcon: {
    fontSize: 24,
  },
});
