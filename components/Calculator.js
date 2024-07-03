import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Calculator = ({ weight, height, activity, climate, gender }) => {
  if (!weight || !height) {
    return <Text>Bitte geben Sie Gewicht und Größe ein.</Text>;
  }

  const weightInKg = parseFloat(weight);
  const heightInCm = parseFloat(height);
  const activityNeed = parseFloat(activity);
  const climateNeed = parseFloat(climate);

  const baseNeed = weightInKg * 35 / 1000; 
  const heightNeed = (heightInCm - 160) * 0.01; 
  const genderAdjustment = gender === 'male' ? 0.4 : 0; 
  const individualNeed = baseNeed + activityNeed + climateNeed + heightNeed + genderAdjustment;

  const recommendedNeed = gender === 'male' ? 3.7 : 2.7;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wasserbedarf Ergebnisse</Text>
      
      <View style={styles.results}>
        <Text style={styles.resultText}>Individualisierter Wasserbedarf: </Text>
        <Text style={styles.resultValue}>{individualNeed.toFixed(2)} Liter pro Tag</Text>
      </View>

      <View style={styles.results}>
        <Text style={styles.resultText}>Empfohlener Wasserbedarf:</Text>
        <Text style={styles.resultValue}>{recommendedNeed.toFixed(2)} Liter pro Tag</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      marginTop: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
      color: '#007BFF',
    },
    errorText: {
      fontSize: 16,
      color: 'red',
      textAlign: 'center',
    },
    resultContainer: {
      marginTop: 20,
    },
    result: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    resultText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    resultValue: {
      fontSize: 16,
      color: '#007BFF',
    },
  });

  export default Calculator;