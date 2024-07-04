import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('@history');
      if (historyData !== null) {
        setHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error('Error loading history from AsyncStorage:', error);
    }
  };

  const addHistoryItem = async (loggedAmount) => {
    const newHistoryItem = { id: Date.now().toString(), loggedAmount: loggedAmount };
    const updatedHistory = [...history, newHistoryItem];
    setHistory(updatedHistory);
    try {
      await AsyncStorage.setItem('@history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving history to AsyncStorage:', error);
    }
  };

  const resetLoggedAmount = async () => {
    try {
      await AsyncStorage.setItem('@loggedAmount', '0');
      addHistoryItem(0); // Add history item with loggedAmount reset to 0
    } catch (error) {
      console.error('Error resetting logged amount:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.resetButton} onPress={resetLoggedAmount}>
        <Text style={styles.buttonText}>Reset Logged Amount</Text>
      </TouchableOpacity>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.historyText}>Logged Amount: {item.loggedAmount.toFixed(2)} Liter</Text>
          </View>
        )}
        contentContainerStyle={styles.historyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  historyList: {
    flexGrow: 1,
  },
  historyItem: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  historyText: {
    fontSize: 16,
    color: '#333',
  },
});

export default HistoryScreen;