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
    numeroComidas: Yup.string(),
    horasComida: Yup.string(),
    calidadComida: Yup.number(),
    horasOcio: Yup.string().required("Inserta las horas de ocio que tuviste"),
    calidadConsumo: Yup.number().min(1, "Selecciona la calidad de tiempo de ocio con al menos 1 estrella").required("Inserta la calidad de consumo de tecnología").max(10, "No se como le hiciste alch"),
    usoIa: Yup.boolean().required("¿De verdad medio-usaste la IA para indefinirlo?"),
    usoIaEn: Yup.string(),
    bienestar: Yup.number()
});

interface TecnoRegistroProps {
    datos: data
    onNavigateToObjetivo: (datos: data) => void;
    onNavigateToHome: () => void;
}

export default function TecnoRegistro({ datos, onNavigateToObjetivo, onNavigateToHome }: TecnoRegistroProps) {
    const [horas, setHoras] = useState<data>(datos);
    const [error, setError] = useState('');

    const handleChange = (name: keyof data, value: string | number | boolean) => {
        if (name == "horasOcio" && typeof value == "string" ) {
            const sanitized = value.replace(/[^0-9]/g, '');
        }

        if(name == "calidadConsumo") {
            setHoras({... horas, [name]: Number(value)});
        } else if (name == "usoIa") {
            setHoras({... horas, [name]: Boolean(value)});
        } else {
            setHoras({... horas, [name]: value as string});
        }
    };

    const handleContinue = async () => {
        try {
            await validationSchema.validate(datos, {abortEarly: false});

            setError('');
            onNavigateToObjetivo(horas);
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
                        <Text style={styles.label}>Horas de ocio</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 2"
                            keyboardType="numeric"
                            value={horas.horasOcio}
                            onChangeText={(val) => handleChange("horasOcio", val)}
                        />

                        <Text style={styles.label}>Calidad de consumo</Text>
                        <View style={styles.starRow}>
                            {Array.from({ length: 10 }, (_, index) => {
                                const starIndex = index + 1;
                                return (
                                    <TouchableOpacity
                                        key={starIndex}
                                        style={styles.starButton}
                                        onPress={() => handleChange("calidadConsumo", starIndex)}
                                    >
                                        <Text style={[
                                            styles.star,
                                            horas.calidadConsumo >= starIndex && styles.starSelected,
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
                                style={[styles.submitButton, { flex: 1, backgroundColor: horas.usoIa === true ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("usoIa", true)}
                            >
                                <Text style={styles.submitButtonText}>Sí</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: horas.usoIa === false ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("usoIa", false)}
                            >
                                <Text style={styles.submitButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>

                        {horas.usoIa === true && (
                            <>
                                <Text style={styles.label}>¿En qué se usó?</Text>
                                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                                    <TouchableOpacity
                                        style={[styles.submitButton, { flex: 1, backgroundColor: horas.usoIaEn === 'escuela' ? '#2196F3' : '#ccc' }]}
                                        onPress={() => handleChange("usoIaEn", 'escuela')}
                                    >
                                        <Text style={styles.submitButtonText}>Escuela</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.submitButton, { flex: 1, backgroundColor: horas.usoIaEn === 'trabajo' ? '#2196F3' : '#ccc' }]}
                                        onPress={() => handleChange("usoIaEn", 'trabajo')}
                                    >
                                        <Text style={styles.submitButtonText}>Trabajo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.submitButton, { flex: 1, backgroundColor: horas.usoIaEn === 'vida_personal' ? '#2196F3' : '#ccc' }]}
                                        onPress={() => handleChange("usoIaEn", 'vida_personal')}
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
