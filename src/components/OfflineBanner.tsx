import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const OfflineBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>⚠ You are offline — showing cached data</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
