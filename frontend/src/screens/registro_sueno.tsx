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
import styles from '../styles/registro_sueno';

interface RegistroSuenoProps {
    onNavigateToComida: () => void;
    onNavigateToHome: () => void;
}

export default function RegistroSueno({ onNavigateToComida, onNavigateToHome }: RegistroSuenoProps) {
    const [horasSueno, setHorasSueno] = useState('');
    const [calidadSueno, setCalidadSueno] = useState(0);
    const [error, setError] = useState('');

    const handleHorasChange = (value: string) => {
        const sanitized = value.replace(/[^0-9]/g, '');
        setHorasSueno(sanitized);
    };

    const handleContinue = () => {
        if (!horasSueno.trim()) {
            setError('Por favor ingresa las horas de sueño.');
            return;
        }

        if (calidadSueno < 1) {
            setError('Selecciona la calidad de sueño con al menos una estrella.');
            return;
        }

        setError('');
        onNavigateToComida();
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
                        <Text style={styles.label}>Horas de sueño</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 7"
                            keyboardType="numeric"
                            value={horasSueno}
                            onChangeText={handleHorasChange}
                        />



                        {error ? <Text style={styles.errorText}>{error}</Text> : null}


                    </View>
                    <View style={styles.form}>
                        <Text style={styles.label}>Calidad de sueño</Text>
                        <View style={styles.starRow}>
                            {Array.from({ length: 10 }, (_, index) => {
                                const starIndex = index + 1;
                                return (
                                    <TouchableOpacity
                                        key={starIndex}
                                        style={styles.starButton}
                                        onPress={() => setCalidadSueno(starIndex)}
                                    >
                                        <Text style={[
                                            styles.star,
                                            calidadSueno >= starIndex && styles.starSelected,
                                        ]}>
                                            ★
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    </View>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
                        <Text style={styles.primaryButtonText}>Continuar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
