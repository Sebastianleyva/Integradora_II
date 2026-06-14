import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import HomeScreen from '../screens/home_screen';
import HistoryScreen from '../screens/history_screen';
import AnalysisScreen from '../screens/analysis_screen';
import ProfileScreen from '../screens/profile_screen';

const Tab = createBottomTabNavigator();

interface HomeTabNavigatorProps {
    onLogout: () => void;
}

export function HomeTabNavigator({ onLogout }: HomeTabNavigatorProps) {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        let iconName: string;
                        let label: string;

                        if (route.name === 'Home') {
                            iconName = '🏠';
                            label = '';
                        } else if (route.name === 'History') {
                            iconName = '📋';
                            label = '';
                        } else if (route.name === 'Analysis') {
                            iconName = '📊';
                            label = '';
                        } else if (route.name === 'Profile') {
                            iconName = '👤';
                            label = '';
                        } else {
                            iconName = '?';
                            label = route.name;
                        }

                        return (
                            <View style={styles.tabIconContainer}>
                                <Text style={[
                                    styles.tabIcon,
                                    { color: focused ? '#2196F3' : '#999' }
                                ]}>
                                    {iconName}
                                </Text>
                                <Text style={[
                                    styles.tabLabel,
                                    { color: focused ? '#2196F3' : '#999' }
                                ]}>
                                    {label}
                                </Text>
                            </View>
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
                    {() => <HomeScreen onLogout={onLogout} />}
                </Tab.Screen>

                <Tab.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{
                        title: 'Historial',
                    }}
                />

                <Tab.Screen
                    name="Analysis"
                    component={AnalysisScreen}
                    options={{
                        title: 'Análisis',
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
