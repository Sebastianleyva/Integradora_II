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

const initialState: data = {
    horasSueno: "",
    calidadSueno: 0,
    numeroComidas: "",
    horasComida: "",
    calidadComida: 0,
    horasOcio: "",
    calidadConsumo: 0,
    usoIa: false,
    usoIaEn: "",
    bienestar: 0,
};

const validationSchema = Yup.object().shape({
    horasSueno: Yup.string().required("Por favor ingresa las horas del sueño"),
    calidadSueno: Yup.number().min(1, "Ingresa un dato para poder continuar").max(10, "No se cómo le hiciste ._.").required("Ingresa un número para continuar"),
    numeroComidas: Yup.string(),
    horasComida: Yup.string(),
    calidadComida: Yup.number(),
    horasOcio: Yup.string(),
    calidadConsumo: Yup.number(),
    usoIa: Yup.boolean(),
    usoIaEn: Yup.string(),
    bienestar: Yup.number()
});

interface RegistroSuenoProps {
    onNavigateToComida: (datos: data) => void;
    onNavigateToHome: () => void;
}

export default function RegistroSueno({ onNavigateToComida, onNavigateToHome }: RegistroSuenoProps) {
    const [horas, setHoras] = useState<data>(initialState)
    const [error, setError] = useState('');

    const handleChange = (name: keyof data, value: string | number) => {
        if (name == "horasSueno" && typeof value == "string") {
            const sanitized = value.replace(/[^0-9]/g, '');
        }

        if (name == "calidadSueno") {
            setHoras({ ...horas!, [name]: Number(value) })
        } else {
            setHoras({ ...horas!, [name]: value as string })
        }
    };

    const handleContinue = async () => {
        try {
            await validationSchema.validate(horas, { abortEarly: false });

            setError('');
            onNavigateToComida(horas);
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
                        <Text style={styles.label}>Horas de sueño</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 7"
                            keyboardType="numeric"
                            value={horas.horasSueno}
                            onChangeText={(val) => handleChange("horasSueno", val)}
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
                                        onPress={() => handleChange("calidadSueno", starIndex)}
                                    >
                                        <Text style={[
                                            styles.star,
                                            horas.calidadSueno >= starIndex && styles.starSelected,
                                        ]}>
                                            ★
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
            <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
                <Text style={styles.primaryButtonText}>Continuar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
