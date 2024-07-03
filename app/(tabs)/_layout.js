import { Slot, Tabs } from "expo-router" 
import { Text } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons" 
 
export default function TabsLayout() { 
    return ( 
        <Tabs> 
            <Tabs.Screen 
                name="home/index"
                options={{ 
                    title: "Home", 
                    tabBarIcon: ({ color }) => ( 
                        <Ionicons 
                            size={28} 
                            style={{ marginBottom: -3 }} 
                            name="home-outline" 
                            color={color} 
                        /> 
                    ), 
                }}
            /> 
            <Tabs.Screen 
                name="progress/index"
                options={{ 
                    title: "Progress", 
                    tabBarIcon: ({ color }) => ( 
                        <Ionicons 
                            size={28} 
                            style={{ marginBottom: -3 }} 
                            name="trending-up-outline" 
                            color={color} 
                        /> 
                    ), 
                }}
            /> 
            <Tabs.Screen 
                name="history/index"
                options={{ 
                    title: "History", 
                    tabBarIcon: ({ color }) => ( 
                        <Ionicons 
                            size={28} 
                            style={{ marginBottom: -3 }} 
                            name="clipboard-outline" 
                            color={color} 
                        /> 
                    ), 
                }}
            /> 
        </Tabs> 
    ) 
} 