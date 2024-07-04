import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, Button, Dimensions } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const totalCapacity = 2500; 
  const [loggedAmount, setLoggedAmount] = useState(0);
  const remainingAmount = totalCapacity - loggedAmount; 
  useEffect(() => {
  
    loadLoggedAmount();
  }, []);

  const loadLoggedAmount = async () => {
    try {
      const savedLoggedAmount = await AsyncStorage.getItem('@loggedAmount');
      if (savedLoggedAmount !== null) {
        setLoggedAmount(parseFloat(savedLoggedAmount));
      }
    } catch (error) {
      console.error('Error loading logged amount from AsyncStorage:', error);
    }
  };

  const saveLoggedAmount = async (newAmount) => {
    try {
      await AsyncStorage.setItem('@loggedAmount', newAmount.toString());
    } catch (error) {
      console.error('Error saving logged amount to AsyncStorage:', error);
    }
  };

  const handleNewEntry = () => {

    const newAmount = parseFloat(inputValue);
    if (!isNaN(newAmount)) {
      const updatedLogged = loggedAmount + newAmount;
      setLoggedAmount(updatedLogged <= totalCapacity ? updatedLogged : totalCapacity);
      saveLoggedAmount(updatedLogged <= totalCapacity ? updatedLogged : totalCapacity); 
    }

    setModalVisible(false);
    setInputValue('');
  };

  const progressValue = loggedAmount / totalCapacity;

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/bottle.png')} style={styles.bottleImage} />
      <TouchableOpacity style={styles.newEntryButton} onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={24} color="#01E1FF" />
        <Text style={styles.newEntryText}>New Entry</Text>
      </TouchableOpacity>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>{loggedAmount} ml - {(progressValue * 100).toFixed(0)}%</Text>
        <Text style={styles.remainingText}>Remaining: {remainingAmount} ml</Text>
        <ProgressBar progress={progressValue} color="#01E1FF" style={styles.progressBar} />
      </View>
      <StatusBar style="auto" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add New Entry</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount (ml)"
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <Button title="Add" onPress={handleNewEntry} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  bottleImage: {
    width: 150,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  newEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#01E1FF',
    marginBottom: 20,
  },
  newEntryText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#01E1FF',
  },
  progressContainer: {
    width: screenWidth - 40,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  remainingText: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#D3D3D3', 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});