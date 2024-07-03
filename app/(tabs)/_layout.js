import { Slot, Tabs } from "expo-router" 
import { Text } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons" 
import { MaterialIcons } from '@expo/vector-icons';
 
export default function TabsLayout() { 
    return ( 
        <Tabs> 
            <Tabs.Screen 
                name="home/index"
                options={{ 
                    title: "Home", 
                    tabBarIcon: ({ color }) => ( 
                        <MaterialIcons name="home" size={30}/>
                    ), 
                }}
            /> 
            <Tabs.Screen 
                name="progress/index"
                options={{ 
                    title: "Progress", 
                    tabBarIcon: ({ color }) => ( 
                        <MaterialIcons name="person" size={30} color="#000" />
                    ), 
                }}
            /> 
            <Tabs.Screen 
                name="history/index"
                options={{ 
                    title: "History", 
                    tabBarIcon: ({ color }) => ( 
                        <MaterialIcons name="history" size={30} color="#000" />
                    ), 
                }}
            /> 
        </Tabs> 
    ) 
} 