import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import styles from '../styles/signup_screen';

interface SignupScreenProps {
    onNavigateToHome: () => void;
    onNavigateToLogin: () => void;
}

export default function SignupScreen({
    onNavigateToHome,
    onNavigateToLogin,
}: SignupScreenProps) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateToLogin} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Atrás</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Registro</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.message}>Pantalla de Registro</Text>
                <Text style={styles.subtitle}>Aquí irá el formulario de registro</Text>
            </View>

            <TouchableOpacity style={styles.homeButton} onPress={onNavigateToHome}>
                <Text style={styles.homeButtonText}>Ir a Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}


