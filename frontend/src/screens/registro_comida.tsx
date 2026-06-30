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
import { LikertScale } from '../components/LikertScale';


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
    numeroComidas: Yup.string().required("Campo requerido: Ingresa el numero de comidas que tuviste en el dia (ej: 3, 4)"),
    horasComida: Yup.string(),
    calidadComida: Yup.number().min(1, "Debes calificar tu experiencia al comer seleccionando una opcion en la escala").max(10, "Error interno: valor fuera de rango").required("Campo requerido: Selecciona tu calificacion en la escala de opciones"),
    horasOcio: Yup.string(),
    calidadConsumo: Yup.number(),
    usoIa: Yup.boolean(),
    usoIaEn: Yup.string(),
    bienestar: Yup.number(),
});

interface RegistroComidaProps {
    datos: data
    onNavigateToTecno: (datos: data) => void;
    onNavigateToHome: () => void;
}

export default function RegistroComida({ datos, onNavigateToTecno, onNavigateToHome }: RegistroComidaProps) {
    const [horas, setHoras] = useState<data>(datos)
    const [error, setError] = useState('');

    const handleChange = (name: keyof data, value: string | number) => {
        if (name == "calidadSueno" || name == "calidadComida") {
            setHoras({ ...horas!, [name]: Number(value) })
        } else {
            setHoras({ ...horas!, [name]: value as string })
        }
    };

    const handleContinue = async () => {
        try {
            await validationSchema.validate(horas, { abortEarly: false });

            setError('');
            onNavigateToTecno(horas);
        } catch (err: any) {
            if (err.name == "ValidationError") {
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
                        <Text style={styles.label}>Número de comidas</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 3"
                            keyboardType="numeric"
                            value={horas.numeroComidas}
                            onChangeText={(val) => handleChange("numeroComidas", val)}
                        />


                        <Text style={styles.label}>¿Qué tan bien te sentiste al comer?</Text>
                        <LikertScale
                            value={horas.calidadComida}
                            onChange={(value) => handleChange("calidadComida", value)}
                        />

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
