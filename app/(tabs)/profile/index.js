import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';

const PRIMARY_COLOR = '#A7E6FF';
const SECONDARY_COLOR = '#FFFFFF';
const TEXT_COLOR = '#000000';
const LABEL_COLOR = '#758694';

const HomeScreen = () => {
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('0');
  const [climate, setClimate] = useState('0');
  const [gender, setGender] = useState('male');
  const [waterIntake, setWaterIntake] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [errors, setErrors] = useState({ weight: '', activityLevel: '', climate: '', gender: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedWeight = await AsyncStorage.getItem('weight');
      const storedActivityLevel = await AsyncStorage.getItem('activityLevel');
      const storedClimate = await AsyncStorage.getItem('climate');
      const storedGender = await AsyncStorage.getItem('gender');
      const storedWaterIntake = await AsyncStorage.getItem('waterIntake');
      const storedShowResults = await AsyncStorage.getItem('showResults');

      if (storedWeight) setWeight(storedWeight);
      if (storedActivityLevel) setActivityLevel(storedActivityLevel);
      if (storedClimate) setClimate(storedClimate);
      if (storedGender) setGender(storedGender);
      if (storedWaterIntake) setWaterIntake(JSON.parse(storedWaterIntake));
      if (storedShowResults) setShowResults(JSON.parse(storedShowResults));
    } catch (error) {
      console.error('Failed to load data', error);
    }
  };

  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save data', error);
    }
  };

  const handleWeightChange = (value) => {
    setWeight(value);
    saveData('weight', value);
    setErrors((prevErrors) => ({ ...prevErrors, weight: '' }));
  };

  const handleActivityLevelChange = (value) => {
    setActivityLevel(value);
    saveData('activityLevel', value);
    setErrors((prevErrors) => ({ ...prevErrors, activityLevel: '' }));
  };

  const handleClimateChange = (value) => {
    setClimate(value);
    saveData('climate', value);
    setErrors((prevErrors) => ({ ...prevErrors, climate: '' }));
  };

  const handleGenderChange = (value) => {
    setGender(value);
    saveData('gender', value);
    setErrors((prevErrors) => ({ ...prevErrors, gender: '' }));
  };

  const saveIndividualNeed = async (individualNeed) => {
    try {
      await AsyncStorage.setItem('@individualNeed', individualNeed.toString());
    } catch (error) {
      console.error('Failed to save individual need to AsyncStorage:', error);
    }
  };

  const calculateWaterIntake = () => {
    const weightInKg = parseFloat(weight);
    let hasError = false;
    let newErrors = { weight: '', activityLevel: '', climate: '', gender: '' };

    if (!weight || isNaN(weightInKg) || weightInKg < 40 || weightInKg > 400) {
      newErrors.weight = 'Bitte geben Sie ein gültiges Gewicht zwischen 40 und 400 kg ein.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const baseNeed = Math.min(weightInKg * 20 / 1000, 3);
    const activityNeed = Math.min(parseFloat(activityLevel), 1.0); 
    const climateNeed = Math.min(parseFloat(climate), 0.2); 
    const genderAdjustment = gender === 'male' ? 0.4 : 0; 
    const individualNeed = baseNeed + activityNeed + climateNeed + genderAdjustment;

    const newWaterIntake = { individual: individualNeed.toFixed(2) };
    setWaterIntake(newWaterIntake);
    saveData('waterIntake', JSON.stringify(newWaterIntake));
    setShowResults(true);
    saveData('showResults', JSON.stringify(true));
    saveIndividualNeed(individualNeed);

    Keyboard.dismiss();
  };

  const handleEdit = () => {
    setShowResults(false);
    saveData('showResults', JSON.stringify(false));
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.avoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SafeAreaView style={styles.innerContainer}>
            {showResults ? (
              <View style={styles.resultsContainer}>
                <Text style={styles.header}>Wasserbedarf Ergebnisse</Text>
                <View style={styles.results}>
                  <Text style={styles.resultText}>Individualisierter Wasserbedarf: {waterIntake.individual} Liter pro Tag</Text>
                </View>
                <CustomButton style={styles.editButton} title="Bearbeiten" onPress={handleEdit} />
                <Link href="/home">
                  <Text>Fortschritt eintragen</Text>
                </Link>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Text style={styles.header}>Wasserbedarf berechnen</Text>

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={handleWeightChange}
                  placeholder="Gewicht in kg"
                  placeholderTextColor="#ccc"
                />
                {errors.weight ? <Text style={styles.errorText}>{errors.weight}</Text> : null}

                <Text style={styles.label}>Aktivitätsniveau (Stunden der Aktivität pro Tag):</Text>
                <Picker
                  selectedValue={activityLevel}
                  style={styles.picker}
                  onValueChange={handleActivityLevelChange}
                >
                  <Picker.Item label="Kaum etwas" value="0" />
                  <Picker.Item label="0.5 Stunde" value="0.2" />
                  <Picker.Item label="1 Stunde" value="0.4" />
                  <Picker.Item label="2 Stunden" value="0.5" />
                  <Picker.Item label="3+ Stunden" value="1" />
                </Picker>
                {errors.activityLevel ? <Text style={styles.errorText}>{errors.activityLevel}</Text> : null}

                <Text style={styles.label}>Klima:</Text>
                <Picker
                  selectedValue={climate}
                  style={styles.picker}
                  onValueChange={handleClimateChange}
                >
                  <Picker.Item label="Kühl" value="0" />
                  <Picker.Item label="Warm" value="0.2" />
                  <Picker.Item label="Heiß" value="0.2" />
                </Picker>
                {errors.climate ? <Text style={styles.errorText}>{errors.climate}</Text> : null}

                <Text style={styles.label}>Geschlecht:</Text>
                <Picker
                  selectedValue={gender}
                  style={styles.picker}
                  onValueChange={handleGenderChange}
                >
                  <Picker.Item label="Männlich" value="male" />
                  <Picker.Item label="Weiblich" value="female" />
                </Picker>
                {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}

                <CustomButtonPrimary title="Berechnen" onPress={calculateWaterIntake} />
              </View>
            )}
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const CustomButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const CustomButtonPrimary = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonPrimary} onPress={onPress}>
      <Text style={styles.buttonTextPrimary}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  avoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: TEXT_COLOR,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  input: {
    height: 50,
    borderColor: PRIMARY_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: SECONDARY_COLOR,
    fontSize: 16,
    color: TEXT_COLOR,
  },
  picker: {
    height: 50,
    borderColor: PRIMARY_COLOR,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: SECONDARY_COLOR,
    color: TEXT_COLOR,
  },
  label: {
    color: LABEL_COLOR,
    marginBottom: 10,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  results: {
    marginTop: 20,
    padding: 20,
  },
  resultText: {
    fontSize: 18,
    color: TEXT_COLOR,
    textAlign: 'center',
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: TEXT_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonPrimary: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonTextPrimary: {
    color: SECONDARY_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;
