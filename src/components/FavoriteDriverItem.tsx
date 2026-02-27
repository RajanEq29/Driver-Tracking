import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Driver } from '../types';

interface FavoriteDriverItemProps {
  driver: Driver;
  onPress: () => void;
  onRemove: () => void;
}

export const FavoriteDriverItem: React.FC<FavoriteDriverItemProps> = ({
  driver,
  onPress,
  onRemove,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: driver.thumbnail }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{driver.name}</Text>
        <Text style={styles.detail}>
          🚗 {driver.vehicleType} · ⭐ {driver.rating}
        </Text>
        <Text style={styles.detail}>📍 {driver.distance} km away</Text>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  detail: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
});
