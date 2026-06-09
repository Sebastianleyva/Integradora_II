import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 24,
    },
    backButton: {
        marginBottom: 20,
    },
    backButtonText: {
        color: '#2196F3',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2196F3',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    message: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
    },
    homeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 12,
        paddingVertical: 16,
        marginHorizontal: 24,
        marginBottom: 40,
        alignItems: 'center',
    },
    homeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
