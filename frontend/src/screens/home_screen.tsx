import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import styles from '../styles/home_screen';

interface HomeScreenProps {
    onLogout: () => void;
}

export default function HomeScreen({ onLogout }: HomeScreenProps) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Bienvenido</Text>
                <Text style={styles.subtitle}>Home Screen</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.message}>¡Iniciaste sesión exitosamente!</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}


