import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/registro_comida';
import * as Yup from "yup";
import { LikertScale } from '../components/LikertScale';
import OptionSelector from '../components/HourIntervals';

interface data {
    horasSueno: string;
    calidadSueno: number;
    numeroComidas: string;
    calidadComida: number;
    horasOcio: string;
    calidadConsumo: number;
    usoIa: boolean;
    usoIaEn: string;
    bienestar: number;
}

const validationSchema = Yup.object().shape({
    numeroComidas: Yup.string().required('Campo requerido: selecciona cuántas comidas tuviste hoy'),
    calidadComida: Yup.number()
        .min(1, 'Debes calificar tu experiencia al comer seleccionando una opción en la escala')
        .max(10, 'Error interno: valor fuera de rango')
        .required('Campo requerido: selecciona tu calificación en la escala'),
});

const mealOptions = [
    { label: '0 comidas', value: 1 },
    { label: '1 comida', value: 2 },
    { label: '2 comidas', value: 3 },
    { label: '3 comidas', value: 4 },
    { label: '4 o más comidas', value: 5 }
]

interface RegistroComidaProps {
    datos: data
    onNavigateToTecno: (datos: data) => void;
    onNavigateToHome: () => void;
}

export default function RegistroComida({ datos, onNavigateToTecno, onNavigateToHome }: RegistroComidaProps) {
    const [registro, setRegistro] = useState<data>(datos);
    const [error, setError] = useState('');

    const handleChange = (name: keyof data, value: string | number) => {
        if (name === 'calidadComida') {
            setRegistro({ ...registro!, [name]: Number(value) });
        } else {
            setRegistro({ ...registro!, [name]: value as string });
        }
    };

    const handleContinue = async () => {
        try {
            await validationSchema.validate(registro, { abortEarly: false });
            setError('');
            onNavigateToTecno(registro);
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
                        <Text style={styles.label}>¿Cuántas comidas realizaste hoy?</Text>
                        <OptionSelector
                            options={mealOptions}
                            value={registro.numeroComidas}
                            onChange={(val) => handleChange('numeroComidas', val)}
                        />


                        <Text style={styles.label}>Del 1 al 5 ¿cómo describiría su estado de ánimo durante las comidas del día de hoy?</Text>
                        <LikertScale
                            value={registro.calidadComida}
                            onChange={(value) => handleChange('calidadComida', value)}
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
