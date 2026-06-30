import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/objetivo_screen';
import * as Yup from "yup";
import axios from "axios";

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
};

const validationSchema = Yup.object().shape({
    horasSueno: Yup.string(),
    calidadSueno: Yup.number(),
    numeroComidas: Yup.string(),
    horasComida: Yup.string(),
    calidadComida: Yup.number(),
    horasOcio: Yup.string(),
    calidadConsumo: Yup.number(),
    usoIa: Yup.boolean(),
    usoIaEn: Yup.string(),
    bienestar: Yup.number().min(1, "Ingresa un número para verificar tu bienestar").required("Ingresa una calificación por favor").max(10, "¿Cómo le haces?")
});

interface ObjetivoScreenProps {
    datos: data
    onNavigateToHome: () => void;
}

export default function ObjetivoScreen({ datos, onNavigateToHome }: ObjetivoScreenProps) {
    const [horas, setHoras] = useState<data>(datos);
    const [error, setError] = useState('');
    const [usuario, setUsuario] = useState({ id: "", nombre: "", apellido: "", correo: "" })

    const handleChange = (name: keyof data, value: number) => {
        setHoras({ ...horas, [name]: Number(value) })
    }

    useEffect(() => {
        axios.get("http://10.0.2.2:5000/account/me").then(res => {
            if (res.data.loggedIn) {
                setUsuario(res.data.usuario);
            }
        }).catch(err => {
            console.error("No hay sesión activa: ", err.response?.data || err.message);
            setError(`No hay sesión activa, ${err.response?.data || err.message}`);
        });
    }, []);

    const handleSubmit = async () => {
        try {
            // Prevenir el envío si el ID del usuario aún no carga o falló
            if (!usuario || !usuario.id) {
                setError("No se detectó una sesión activa. Espera un momento o vuelve a iniciar sesión.");
                return;
            }

            await validationSchema.validate(horas, { abortEarly: false });

            const payload = {
                h_sueno: horas.horasSueno,
                cal_sueno: horas.calidadSueno,
                n_comidas: horas.numeroComidas,
                hor_comidas: horas.horasComida,
                cal_consumo: horas.calidadComida,
                h_osio: horas.horasOcio,
                cal_consumo_tec: horas.calidadConsumo,
                uso_ia: horas.usoIa,
                aplicacion: horas.usoIaEn,
                pregunta_objetivo: horas.bienestar,
            };

            // Enviar al backend
            await axios.post(`http://10.0.2.2:5000/registros/${usuario.id}`, payload);

            Alert.alert('Registro exitoso', 'Gracias por registrar en esta encuesta');
            setError("");
            onNavigateToHome();

        } catch (err: any) {
            if (err.name === "ValidationError") {
                // Validación de Yup
                const mensajes = err.inner.map((e: any) => `• ${e.message}`).join("\n");
                setError(`Errores de validación:\n ${mensajes}`);
            } else if (err.response) {
                // CORRECCIÓN: Manejo correcto del objeto de error de Axios
                const status = err.response.status;
                const backendError = err.response.data?.error || "Error desconocido";

                if (status === 500 || status === 409 || status === 400) {
                    setError(`Error interno: ${backendError}`);
                } else {
                    setError(`Error del servidor: ${backendError}`);
                }
            } else {
                // Otros (Ej. falta de internet)
                setError(`Error inesperado: ${err.message || "Error de red"}`);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Objetivo</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>¿Cómo calificas tu bienestar general el día de hoy?</Text>
                <View style={styles.starRow}>
                    {Array.from({ length: 10 }, (_, i) => {
                        const idx = i + 1;
                        return (
                            <TouchableOpacity key={idx} onPress={() => handleChange("bienestar", idx)} style={styles.starButton}>
                                <Text style={[styles.star, horas.bienestar >= idx && styles.starSelected]}>★</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                <Text style={styles.primaryButtonText}>Finalizar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
