import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/registro_comida';

interface RegistroComidaProps {
    onNavigateToTecno: () => void;
    onNavigateToHome: () => void;
}

export default function RegistroComida({ onNavigateToTecno, onNavigateToHome }: RegistroComidaProps) {
    const [numeroComidas, setNumeroComidas] = useState('');
    const [horarioComidas, setHorarioComidas] = useState('');
    const [error, setError] = useState('');

    const handleNumeroComidaChange = (value: string) => {
        const sanitized = value.replace(/[^0-9]/g, '');
        setNumeroComidas(sanitized);
    };

    const handleContinue = () => {
        if (!numeroComidas.trim()) {
            setError('Por favor ingresa el número de comidas.');
            return;
        }

        if (!horarioComidas.trim()) {
            setError('Por favor ingresa el horario de comidas.');
            return;
        }

        setError('');
        onNavigateToTecno();
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.flex}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onNavigateToHome} style={styles.backButton}>
                            <Text style={styles.backButtonText}>← Atrás</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Número de comidas</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 3"
                            keyboardType="numeric"
                            value={numeroComidas}
                            onChangeText={handleNumeroComidaChange}
                        />

                        <Text style={styles.label}>Horario de comidas</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 7:00am, 12:30pm, 6:00pm"
                            value={horarioComidas}
                            onChangeText={setHorarioComidas}
                        />

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
                            <Text style={styles.primaryButtonText}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
