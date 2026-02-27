import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDriverStore } from '../store';
import { FavoriteDriverItem } from '../components';
import { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const drivers = useDriverStore((s) => s.drivers);
  const favoriteIds = useDriverStore((s) => s.favoriteIds);
  const toggleFavorite = useDriverStore((s) => s.toggleFavorite);

  const favoriteDrivers = drivers.filter((d) => favoriteIds.includes(d.id));

  if (favoriteDrivers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🤍</Text>
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptySubtitle}>
          Mark drivers as favorite from the map to see them here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        ❤️ {favoriteDrivers.length} Favorite Driver
        {favoriteDrivers.length !== 1 ? 's' : ''}
      </Text>
      <FlatList
        data={favoriteDrivers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <FavoriteDriverItem
            driver={item}
            onPress={() =>
              navigation.navigate('DriverDetails', { driverId: item.id })
            }
            onRemove={() => toggleFavorite(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});
