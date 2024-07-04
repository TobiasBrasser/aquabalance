import { Slot, Tabs, Stack } from "expo-router" 
import { MaterialIcons } from '@expo/vector-icons';
 
export default function TabsLayout() { 
    return ( 
        <>
            <Tabs
            screenOptions={{
                tabBarHideOnKeyboard: true
            }}> 
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
                    name="profile/index"
                    options={{ 
                        title: "Profile", 
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
        </>
    ) 
} 