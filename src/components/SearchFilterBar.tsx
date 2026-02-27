import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  filterRatingAbove4: boolean;
  onToggleRating: () => void;
  filterNearest: boolean;
  onToggleNearest: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  filterRatingAbove4,
  onToggleRating,
  filterNearest,
  onToggleNearest,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search driver by name..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, filterRatingAbove4 && styles.filterActive]}
          onPress={onToggleRating}
        >
          <Text
            style={[
              styles.filterText,
              filterRatingAbove4 && styles.filterTextActive,
            ]}
          >
            ⭐ Rating &gt; 4
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filterNearest && styles.filterActive]}
          onPress={onToggleNearest}
        >
          <Text
            style={[
              styles.filterText,
              filterNearest && styles.filterTextActive,
            ]}
          >
            📍 Nearest 5
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    color: '#333',
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  filterBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  filterActive: {
    backgroundColor: '#4361ee',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  filterTextActive: {
    color: '#fff',
  },
});
