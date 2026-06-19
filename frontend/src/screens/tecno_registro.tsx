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
import styles from '../styles/tecno_registro';

interface TecnoRegistroProps {
    onNavigateToObjetivo: () => void;
    onNavigateToHome: () => void;
}

export default function TecnoRegistro({ onNavigateToObjetivo, onNavigateToHome }: TecnoRegistroProps) {
    const [horasOcio, setHorasOcio] = useState('');
    const [calidadConsumo, setCalidadConsumo] = useState(0);
    const [seUsoIA, setSeUsoIA] = useState<'Sí' | 'No' | ''>('');
    const [usoIAEn, setUsoIAEn] = useState<'escuela' | 'trabajo' | 'vida_personal' | ''>('');
    const [error, setError] = useState('');

    const handleHorasOcioChange = (value: string) => {
        const sanitized = value.replace(/[^0-9]/g, '');
        setHorasOcio(sanitized);
    };

    const handleContinue = () => {
        if (!horasOcio.trim()) {
            setError('Por favor ingresa las horas de ocio.');
            return;
        }

        if (calidadConsumo < 1) {
            setError('Selecciona la calidad de consumo con al menos una estrella.');
            return;
        }

        if (seUsoIA === '') {
            setError('Indica si se usó IA (Sí/No).');
            return;
        }

        if (seUsoIA === 'Sí' && usoIAEn === '') {
            setError('Selecciona en qué se usó la IA.');
            return;
        }

        setError('');
        onNavigateToObjetivo();
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
                        <Text style={styles.label}>Horas de ocio</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 2"
                            keyboardType="numeric"
                            value={horasOcio}
                            onChangeText={handleHorasOcioChange}
                        />

                        <Text style={styles.label}>Calidad de consumo</Text>
                        <View style={styles.starRow}>
                            {Array.from({ length: 10 }, (_, index) => {
                                const starIndex = index + 1;
                                return (
                                    <TouchableOpacity
                                        key={starIndex}
                                        style={styles.starButton}
                                        onPress={() => setCalidadConsumo(starIndex)}
                                    >
                                        <Text style={[
                                            styles.star,
                                            calidadConsumo >= starIndex && styles.starSelected,
                                        ]}>
                                            ★
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Text style={[styles.label, { marginTop: 8 }]}>¿Se usó IA?</Text>
                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: seUsoIA === 'Sí' ? '#2196F3' : '#ccc' }]}
                                onPress={() => setSeUsoIA('Sí')}
                            >
                                <Text style={styles.submitButtonText}>Sí</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: seUsoIA === 'No' ? '#2196F3' : '#ccc' }]}
                                onPress={() => setSeUsoIA('No')}
                            >
                                <Text style={styles.submitButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>

                        {seUsoIA === 'Sí' && (
                            <>
                                <Text style={styles.label}>¿En qué se usó?</Text>
                                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                                    <TouchableOpacity
                                        style={[styles.submitButton, { flex: 1, backgroundColor: usoIAEn === 'escuela' ? '#2196F3' : '#ccc' }]}
                                        onPress={() => setUsoIAEn('escuela')}
                                    >
                                        <Text style={styles.submitButtonText}>Escuela</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.submitButton, { flex: 1, backgroundColor: usoIAEn === 'trabajo' ? '#2196F3' : '#ccc' }]}
                                        onPress={() => setUsoIAEn('trabajo')}
                                    >
                                        <Text style={styles.submitButtonText}>Trabajo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.submitButton, { flex: 1, backgroundColor: usoIAEn === 'vida_personal' ? '#2196F3' : '#ccc' }]}
                                        onPress={() => setUsoIAEn('vida_personal')}
                                    >
                                        <Text style={styles.submitButtonText}>Vida personal</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

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
