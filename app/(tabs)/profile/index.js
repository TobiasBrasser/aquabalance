import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('0');
  const [climate, setClimate] = useState('0');
  const [gender, setGender] = useState('male');
  const [waterIntake, setWaterIntake] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedWeight = await AsyncStorage.getItem('weight');
      const storedHeight = await AsyncStorage.getItem('height');
      const storedActivityLevel = await AsyncStorage.getItem('activityLevel');
      const storedClimate = await AsyncStorage.getItem('climate');
      const storedGender = await AsyncStorage.getItem('gender');
      const storedWaterIntake = await AsyncStorage.getItem('waterIntake');

      if (storedWeight) setWeight(storedWeight);
      if (storedHeight) setHeight(storedHeight);
      if (storedActivityLevel) setActivityLevel(storedActivityLevel);
      if (storedClimate) setClimate(storedClimate);
      if (storedGender) setGender(storedGender);
      if (storedWaterIntake) setWaterIntake(JSON.parse(storedWaterIntake));
    } catch (error) {
      console.error('Failed to load data', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('weight', weight);
      await AsyncStorage.setItem('height', height);
      await AsyncStorage.setItem('activityLevel', activityLevel);
      await AsyncStorage.setItem('climate', climate);
      await AsyncStorage.setItem('gender', gender);
      if (waterIntake) {
        await AsyncStorage.setItem('waterIntake', JSON.stringify(waterIntake));
      }
    } catch (error) {
      console.error('Failed to save data', error);
    }
  };

  const calculateWaterIntake = () => {
    const weightInKg = parseFloat(weight);
    const heightInCm = parseFloat(height);
    
    const baseNeed = weightInKg * 35 / 1000;
    const activityNeed = parseFloat(activityLevel); 
    const climateNeed = parseFloat(climate); 
    const heightNeed = (heightInCm - 160) * 0.01; 
    const genderAdjustment = gender === 'male' ? 0.4 : 0; 
    const individualNeed = baseNeed + activityNeed + climateNeed + heightNeed + genderAdjustment;

    const recommendedNeed = gender === 'male' ? 3.7 : 2.7;

    const newWaterIntake = { individual: individualNeed.toFixed(2), recommended: recommendedNeed.toFixed(2) };
    setWaterIntake(newWaterIntake);
    saveData();

    // Tastatur ausblenden
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.avoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SafeAreaView style={styles.innerContainer}>
            <Text style={styles.header}>Wasserbedarf berechnen</Text>
          
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
              placeholder="Gewicht in kg"
            />
      
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
              placeholder="Größe in cm"
            />
      
            <Text>Aktivitätsniveau (Stunden der Aktivität pro Tag):</Text>
            <Picker
              selectedValue={activityLevel}
              style={styles.picker}
              onValueChange={(itemValue) => setActivityLevel(itemValue)}
            >
              <Picker.Item label="Kaum etwas" value="0" />
              <Picker.Item label="0.5 Stunde" value="0.5" />
              <Picker.Item label="1 Stunden" value="1" />
              <Picker.Item label="2 Stunden" value="2" />
              <Picker.Item label="3+ Stunden" value="3" />
            </Picker>
      
            <Text>Klima:</Text>
            <Picker
              selectedValue={climate}
              style={styles.picker}
              onValueChange={(itemValue) => setClimate(itemValue)}
            >
              <Picker.Item label="Kühl" value="0" />
              <Picker.Item label="Warm" value="0.5" />
              <Picker.Item label="Heiß" value="1" />
            </Picker>
      
            <Text>Geschlecht:</Text>
            <Picker
              selectedValue={gender}
              style={styles.picker}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Männlich" value="male" />
              <Picker.Item label="Weiblich" value="female" />
            </Picker>
      
            <Button title="Berechnen" onPress={calculateWaterIntake} />
      
            {waterIntake && (
              <View style={styles.results}>
                <Text>Individualisierter Wasserbedarf: {waterIntake.individual} Liter pro Tag</Text>
                <Text>Empfohlener Wasserbedarf: {waterIntake.recommended} Liter pro Tag</Text>
              </View>
            )}
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  results: {
    marginTop: 20,
  },
});

export default HomeScreen;