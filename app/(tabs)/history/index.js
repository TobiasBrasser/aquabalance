import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';


const screenWidth = Dimensions.get('window').width;

const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [2, 2.5, 1.8, 3, 2, 1.5, 2.1]
    }
  ]
};

const chartConfig = {
  backgroundColor: "#FFFFFF", 
  backgroundGradientFrom: "#FFFFFF", 
  backgroundGradientTo: "#FFFFFF", 
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(1, 225, 255, ${opacity})`, 
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
  style: {
    borderRadius: 16,
    backgroundColor: 'white'
  },
  fillShadowGradient: "#01E1FF",
  fillShadowGradientOpacity: 1,
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#007E8F"
  }
};

export default function History() {
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.averageText}>Average: 2.4 l</Text>
        <BarChart
          style={styles.chart}
          data={data}
          width={screenWidth - 40}
          height={300}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
      </View>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total: 612 l</Text>
      </View>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Avg. Size: 300 ml</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  averageText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 16,
  },
});
 