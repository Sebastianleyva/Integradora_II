import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/home_screen';

interface HomeScreenProps {
    onLogout: () => void;
    onNavigateToRegistroSueno: () => void;
}

export default function HomeScreen({ onLogout, onNavigateToRegistroSueno }: HomeScreenProps) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Bienvenido</Text>
                <Text style={styles.subtitle}>Home Screen</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.message}>¡Iniciaste sesión exitosamente!</Text>

                <TouchableOpacity style={styles.primaryButton} onPress={onNavigateToRegistroSueno}>
                    <Text style={styles.primaryButtonText}>Hacer mi registro</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}


