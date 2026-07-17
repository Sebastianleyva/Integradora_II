import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import HomeScreen from '../screens/home_screen';
import Infoscreen from '../screens/info_screen';
import ProfileScreen from '../screens/profile_screen';

import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

interface HomeTabNavigatorProps {
    onLogout: () => void;
    onNavigateToRegistroSueno: () => void;
}

export function HomeTabNavigator({ onLogout, onNavigateToRegistroSueno }: HomeTabNavigatorProps) {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => {
                        let iconName: keyof typeof Ionicons.glyphMap;

                        switch (route.name) {
                            case "Home":
                                iconName = "home-outline";
                                break;
                            case "Info":
                                iconName = "school-outline";
                                break;
                            case "Profile":
                                iconName = "person-outline";
                                break;
                            default:
                                iconName = "ellipse-outline";
                        }
                        return (
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        );
                    },
                    tabBarLabelPosition: 'below-icon',
                    tabBarStyle: styles.tabBar,
                    tabBarActiveTintColor: '#2196F3',
                    tabBarInactiveTintColor: '#999',
                })}
            >
                <Tab.Screen
                    name="Home"
                    options={{
                        title: 'Home',
                    }}
                >
                    {() => (
                        <HomeScreen
                            onLogout={onLogout}
                            onNavigateToRegistroSueno={onNavigateToRegistroSueno}
                        />
                    )}
                </Tab.Screen>

                <Tab.Screen
                    name="Info"
                    component={Infoscreen}
                    options={{
                        title: 'Información',
                    }}
                />

                <Tab.Screen
                    name="Profile"
                    options={{
                        title: 'Perfil',
                    }}
                >
                    {() => <ProfileScreen onLogout={onLogout} />}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingBottom: 5,
        paddingTop: 5,
        height: 70,
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        fontSize: 24,
        marginBottom: 2,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
});
