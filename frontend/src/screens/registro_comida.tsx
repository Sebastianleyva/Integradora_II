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
import * as Yup from "yup";


interface data {
    horasSueno: string;
    calidadSueno: number;
    numeroComidas: string;
    horasComida: string;
    calidadComida: number;
    horasOcio: string;
    calidadConsumo: number;
    usoIa: boolean;
    usoIaEn: string;
    bienestar: number;
}

const validationSchema = Yup.object().shape({
    horasSueno: Yup.string(),
    calidadSueno: Yup.number(),
    numeroComidas: Yup.string().required("Por favor ingresa el número de comidas"),
    horasComida: Yup.string().required("Por favor ingresa las horas de comida"),
    calidadComida: Yup.number().min(1, "Ingresa un dato para poder continuar").max(10, "No se cómo le hiciste ._.").required("Ingresa un número para continuar"),
    horasOcio: Yup.string(),
    calidadConsumo: Yup.number(),
    usoIa: Yup.boolean(),
    usoIaEn: Yup.string(),
    bienestar: Yup.number(),
});

interface RegistroComidaProps {
    datos: data
    onNavigateToTecno: (datos:data) => void;
    onNavigateToHome: () => void;
}

export default function RegistroComida({ datos, onNavigateToTecno, onNavigateToHome }: RegistroComidaProps) {
    const [horas, setHoras] = useState<data>(datos)
    const [error, setError] = useState('');

    const handleChange = (name: keyof data, value: string | number) => {
        if (name == "calidadSueno" || name == "calidadComida") {
            setHoras({... horas!, [name]: Number(value)})
        } else {
            setHoras({... horas!, [name]: value as string})
        }
    };

    const handleContinue = async () => {
        try {
            await validationSchema.validate(horas, {abortEarly: false});

            setError('');
            onNavigateToTecno(horas);
        } catch (err: any) {
            if (err.name == "ValidationError") {
                setError(`Errores de validación:\n ${err.message}`);
            } else {
                setError(`Error inesperado: ${err.message || "Error desconocido"}`);
            }
        }
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
                            value={horas.numeroComidas}
                            onChangeText={(val) => handleChange("numeroComidas", val)}
                        />

                        <Text style={styles.label}>Horario de comidas</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 7:00am, 12:30pm, 6:00pm"
                            value={horas.horasComida}
                            onChangeText={(val) => handleChange("horasComida", val)}
                        />

                        <Text style={styles.label}>Calidad de sueño</Text>
                        <View style={styles.starRow}>
                            {Array.from({ length: 10 }, (_, index) => {
                                const starIndex = index + 1;
                                return (
                                    <TouchableOpacity
                                        key={starIndex}
                                        style={styles.starButton}
                                        onPress={() => handleChange("calidadComida", starIndex)}
                                    >
                                        <Text style={[
                                            styles.star,
                                            horas.calidadComida >= starIndex && styles.starSelected,
                                        ]}>
                                            ★
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

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
