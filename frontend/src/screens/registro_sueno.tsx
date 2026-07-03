import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/registro_sueno';
import * as Yup from "yup";
import { LikertScale } from '../components/LikertScale';
import OptionSelector from '../components/HourIntervals';

interface data {
    horasSueno: string;
    calidadSueno: number;
    numeroComidas: string;
    calidadComida: number;
    horasOcio: number;
    calidadConsumo: number;
    usoIa: boolean;
    usoIaEn: string;
    bienestar: number;
}

const initialState: data = {
    horasSueno: "",
    calidadSueno: 0,
    numeroComidas: "",
    calidadComida: 0,
    horasOcio: 0,
    calidadConsumo: 0,
    usoIa: false,
    usoIaEn: "",
    bienestar: 0,
};

const validationSchema = Yup.object().shape({
    horasSueno: Yup.string().required("Campo requerido: Selecciona cuantas horas dormiste"),
    calidadSueno: Yup.number().min(1, "Debes calificar tu calidad de sueno seleccionando una opcion en la escala").max(10, "Error interno: valor fuera de rango").required("Campo requerido: Selecciona tu calidad de sueno en la escala de opciones"),

});

const sleepOptions = [
    { label: 'Menos de 5 horas', value: 1 },
    { label: '5-6 horas', value: 2 },
    { label: '6-7 horas', value: 3 },
    { label: 'Más de 7 horas', value: 4 },
];

interface RegistroSuenoProps {
    onNavigateToComida: (datos: data) => void;
    onNavigateToHome: () => void;
}

export default function RegistroSueno({ onNavigateToComida, onNavigateToHome }: RegistroSuenoProps) {
    const [horas, setHoras] = useState<data>(initialState)
    const [error, setError] = useState('');

    const handleChange = (name: keyof data, value: string | number) => {
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
                        <Text style={styles.label}>¿Cuántas horas de sueño tuvo el día de hoy?</Text>
                        <OptionSelector
                            options={sleepOptions}
                            value={horas.horasSueno}
                            onChange={(val) => handleChange("horasSueno", val)}
                        />

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}


                    </View>
                    <View style={styles.form}>
                        <Text style={styles.label}>Del 1 al 5 ¿cómo calificaría la calidad de descanso de su sueño el día de hoy?</Text>
                        <LikertScale
                            value={horas.calidadSueno}
                            onChange={(value) => handleChange("calidadSueno", value)}
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
