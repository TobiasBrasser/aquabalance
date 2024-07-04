import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, Button, Dimensions, Alert } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [totalCapacity, setTotalCapacity] = useState(2500); 
  const [loggedAmount, setLoggedAmount] = useState(0);
  const [isEditingCapacity, setIsEditingCapacity] = useState(false);

  useEffect(() => {
    loadLoggedAmount();
    loadIndividualNeed(); 
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadIndividualNeed(); 
    }, [])
  );

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

  const loadIndividualNeed = async () => {
    try {
      const savedIndividualNeed = await AsyncStorage.getItem('@individualNeed');
      if (savedIndividualNeed !== null) {
        setTotalCapacity(parseFloat(savedIndividualNeed));
        setLoggedAmount(0); 
      }
    } catch (error) {
      console.error('Error loading individual need from AsyncStorage:', error);
    }
  };

  const saveLoggedAmount = async (newAmount) => {
    try {
      await AsyncStorage.setItem('@loggedAmount', newAmount.toString());
      setLoggedAmount(newAmount); // Update state after saving
    } catch (error) {
      console.error('Error saving logged amount to AsyncStorage:', error);
    }
  };

  const saveIndividualNeed = async (newCapacity) => {
    try {
      await AsyncStorage.setItem('@individualNeed', newCapacity.toString());
      setTotalCapacity(newCapacity); // Update state after saving
    } catch (error) {
      console.error('Error saving individual need to AsyncStorage:', error);
    }
  };

  const handleNewEntry = () => {
    let newAmount = parseFloat(inputValue);
    if (isNaN(newAmount) || newAmount <= 0) {
      alert('Please enter a valid positive number.');
      return;
    }

    if (isEditingCapacity) {
      saveIndividualNeed(newAmount); 
      setIsEditingCapacity(false); 
    } else {
      const updatedLogged = loggedAmount + newAmount;
      if (updatedLogged <= totalCapacity) {
        saveLoggedAmount(updatedLogged); 
        if (updatedLogged >= totalCapacity) {
          Alert.alert('Congratulations!', 'You have reached your daily water intake goal!');
        }
      } else {
        alert('Total logged amount cannot exceed total capacity.');
      }
    }

    setModalVisible(false);
    setInputValue('');
    setDateValue('');
    setTimeValue('');
  };
  
  const progressValue = loggedAmount / totalCapacity;
  const remainingAmount = totalCapacity - loggedAmount;

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/bottle.png')} style={styles.bottleImage} />
      <TouchableOpacity style={styles.newEntryButton} onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={24} color="#01E1FF" />
        <Text style={styles.newEntryText}>New Entry</Text>
      </TouchableOpacity>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>{loggedAmount.toFixed(2)} Liter - {(progressValue * 100).toFixed(0)}%</Text>
        <Text style={styles.remainingText}>Remaining: {remainingAmount.toFixed(2)} Liter</Text>
        <ProgressBar progress={progressValue} color="#01E1FF" style={styles.progressBar} />
        <TouchableOpacity style={styles.editButton} onPress={() => {
          setIsEditingCapacity(true);
          setModalVisible(true);
        }}>
        </TouchableOpacity>
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
            <Text style={styles.modalText}>{isEditingCapacity ? 'Edit Water Need' : 'Add New Entry'}</Text>
            <TextInput
              style={styles.input}
              placeholder={isEditingCapacity ? 'Enter new capacity (Liter)' : 'Enter amount'}
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter date (YYYY-MM-DD)"
              value={dateValue}
              onChangeText={setDateValue}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter time (HH:MM)"
              value={timeValue}
              onChangeText={setTimeValue}
            />
            <Button title="Save" onPress={handleNewEntry} />
            <Button title="Cancel" onPress={() => {
              setModalVisible(false);
              setIsEditingCapacity(false);
              setInputValue('');
              setDateValue('');
              setTimeValue('');
            }} />
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
