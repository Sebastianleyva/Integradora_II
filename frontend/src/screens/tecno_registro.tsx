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
import { LikertScale } from '../components/LikertScale';
import { HourIntervals } from '../components/HourIntervals';

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
    horasOcio: Yup.string().required("Campo requerido: Selecciona cuantas horas de ocio tuviste"),
    calidadConsumo: Yup.number()
        .min(1, "Debes calificar como te sentiste usando tecnologia seleccionando una opcion en la escala")
        .required("Campo requerido: Selecciona tu calificacion en la escala de opciones")
        .max(10, "Error interno: valor fuera de rango"),
    usoIa: Yup.boolean().required("Campo requerido: Selecciona si usaste IA hoy (Si o No)"),

    usoIaEn: Yup.string().when('usoIa', {
        is: true,
        then: (schema) => schema.required("Campo requerido: Especifica en que ambito usaste IA. Opciones: Escuela, Trabajo o Vida personal"),
        otherwise: (schema) => schema.notRequired(),
    }),

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
        let finalValue = value;

        if (name === "horasOcio" && typeof value === "string") {
            finalValue = value.replace(/[^0-9]/g, '');
        }

        if (name === "calidadConsumo") {
            setHoras({ ...horas, [name]: Number(finalValue) });
        } else if (name === "usoIa") {
            // Si dice que NO usó IA, limpiamos el campo 'usoIaEn' por si había seleccionado algo antes
            if (finalValue === false) {
                setHoras({ ...horas, usoIa: false, usoIaEn: '' });
            } else {
                setHoras({ ...horas, usoIa: true });
            }
        } else {
            setHoras({ ...horas, [name]: finalValue as string });
        }
    };

    const handleContinue = async () => {
        try {
            await validationSchema.validate(horas, { abortEarly: false });

            setError('');
            onNavigateToObjetivo(horas);
        } catch (err: any) {
            if (err.name === "ValidationError") {
                const mensajes = err.inner.map((e: any) => `${e.message}`).join("\n");
                setError(`${mensajes}`);
            } else {
                setError(`Error inesperado: ${err.message || "Algo salió mal. Intenta de nuevo o contacta soporte"}`)
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
                        <HourIntervals
                            value={horas.horasOcio}
                            onChange={(val) => handleChange("horasOcio", val)}
                            includeLongSleep={false}
                        />

                        <Text style={styles.label}>¿Qué tan bien te sentiste al usar tu teléfono?</Text>
                        <LikertScale
                            value={horas.calidadConsumo}
                            onChange={(value) => handleChange("calidadConsumo", value)}
                        />

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


                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
                <Text style={styles.primaryButtonText}>Continuar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
