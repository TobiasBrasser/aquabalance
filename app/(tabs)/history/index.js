import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function History() {
  const [entries, setEntries] = useState([]);
<<<<<<< HEAD
  const [collapsedSections, setCollapsedSections] = useState({});
=======
>>>>>>> 3bedd1e43ceef7c4b4284fea7574139cc8b2a534

  useEffect(() => {
    loadEntries();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [])
  );

  const loadEntries = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem('entries');
<<<<<<< HEAD
      const parsedEntries = storedEntries ? JSON.parse(storedEntries) : [];
      setEntries(parsedEntries);
      
      const initialCollapsed = {};
      parsedEntries.forEach((item, index) => {
        if (item.section) {
          initialCollapsed[index] = true; 
        }
      });
      setCollapsedSections(initialCollapsed);
    } catch (error) {
      console.error('Failed to load data', error);
    }
  };

  const toggleSection = (index) => {
    setCollapsedSections(prevState => {
      const updatedCollapsed = { ...prevState };
      updatedCollapsed[index] = !updatedCollapsed[index];
  
      let i = index + 1;
      while (i < entries.length && !entries[i].section) {
        updatedCollapsed[i] = !updatedCollapsed[index];
        i++;
      }
      return updatedCollapsed;
    });
  };

  const deleteEntry = async (index) => {
    try {
      const updatedEntries = [...entries];
      updatedEntries.splice(index, 1);
      await AsyncStorage.setItem('entries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
    } catch (error) {
      console.error('Failed to delete entry', error);
    }
  };

  const confirmDelete = (index) => {
    Alert.alert(
      'Eintrag löschen',
      'Bist Du dir sicher, dass Du diesen Eintrag löschen möchtest?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteEntry(index), style: 'destructive' },
      ]
    );
  };

  const deleteSection = async (index) => {
    try {
      const updatedEntries = [...entries];
      const sectionDate = updatedEntries[index].date;
  
      let startIndex = index + 1;
      let endIndex = startIndex;
  
      while (endIndex < updatedEntries.length && !(updatedEntries[endIndex].section)) {
        endIndex++;
      }
 
      updatedEntries.splice(index, endIndex - startIndex + 1);
  
      await AsyncStorage.setItem('entries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
    } catch (error) {
      console.error('Failed to delete section', error);
    }
  };

  const renderEntry = ({ item, index }) => {
    if (item.section) {
      return (
        <TouchableOpacity onPress={() => toggleSection(index)}>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Icon
                name={collapsedSections[index] ? "caret-right" : "caret-down"}
                size={24}
                color="#fff"
              />
              <Text style={styles.sectionText}>Neuer Abschnitt: {item.date}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteSection(index)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }

    if (collapsedSections[index]) {
      return null; // Eintrag wird nicht gerendert, wenn der Abschnitt eingeklappt ist
    }

=======
      const entries = storedEntries ? JSON.parse(storedEntries) : [];
      setEntries(entries);
    } catch (error) {
      console.error('Failed to load data', error);
    }
  };

  const deleteEntry = async (index) => {
    try {
      const updatedEntries = [...entries];
      updatedEntries.splice(index, 1);
      await AsyncStorage.setItem('entries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
    } catch (error) {
      console.error('Failed to delete entry', error);
    }
  };

  const confirmDelete = (index) => {
    Alert.alert(
      'Eintrag löschen',
      'Bist Du dir sicher, dass Du diesen Eintrag löschen möchtest?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteEntry(index), style: 'destructive' },
      ]
    );
  };

  const renderEntry = ({ item, index }) => {
    if (item.section) {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionText}>Neuer Abschnitt: {item.date}</Text>
          <TouchableOpacity onPress={() => confirmDelete(index)}>
            <Icon name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      );
    }

>>>>>>> 3bedd1e43ceef7c4b4284fea7574139cc8b2a534
    return (
      <View style={styles.entryContainer}>
        <View style={styles.entryTextContainer}>
          <Text style={styles.entryText}>Amount: {item.inputValue} Liter</Text>
          <Text style={styles.entryText}>Date: {item.dateValue}</Text>
          <Text style={styles.entryText}>Time: {item.timeValue}</Text>
        </View>
<<<<<<< HEAD
        <TouchableOpacity onPress={() => confirmDelete(index)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
=======
        <TouchableOpacity onPress={() => confirmDelete(index)}>
>>>>>>> 3bedd1e43ceef7c4b4284fea7574139cc8b2a534
          <Icon name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
<<<<<<< HEAD
    backgroundColor: '#01E1FF',
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
=======
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  sectionText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
>>>>>>> 3bedd1e43ceef7c4b4284fea7574139cc8b2a534
  entryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
<<<<<<< HEAD
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#01E1FF',
    borderWidth: 2,
=======
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
>>>>>>> 3bedd1e43ceef7c4b4284fea7574139cc8b2a534
  },
  entryTextContainer: {
    flex: 1,
  },
  entryText: {
    fontSize: 18,
<<<<<<< HEAD
    color: '#01E1FF',
=======
    color: 'black',
>>>>>>> 3bedd1e43ceef7c4b4284fea7574139cc8b2a534
  },
});
