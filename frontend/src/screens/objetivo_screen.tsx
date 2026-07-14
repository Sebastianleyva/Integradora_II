import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/objetivo_screen';
import * as Yup from "yup";
import axios from "axios";
import { LikertScale } from '../components/LikertScale';

axios.defaults.withCredentials = true;

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
};

const API_URL = 'https://integrator-krxn.onrender.com';


const validationSchema = Yup.object().shape({
    bienestar: Yup.number().min(1, "Debes evaluar tu bienestar seleccionando una opcion en la escala").required("Campo requerido: Selecciona tu nivel de bienestar en la escala de opciones").max(10, "Error interno: valor fuera de rango")
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
        axios.get(`${API_URL}/account/me`).then(res => {
            if (res.data.loggedIn) {
                setUsuario(res.data.usuario);
            }
        }).catch(err => {
            console.error("No hay sesión activa: ", err.response?.data || err.message);
            setError(`Error de sesión: No se detectó un usuario activo.\n\nSolución: Vuelve a iniciar sesión. Si el problema persiste, cierra la app y vuelve a abrirla.`);
        });
    }, []);

    const handleSubmit = async () => {
        try {
            // Prevenir el envío si el ID del usuario aún no carga o falló
            if (!usuario || !usuario.id) {
                setError("Error de sesión: No se detectó un usuario activo.\n\nSolución: Vuelve a iniciar sesión. Si el problema persiste, cierra la app y vuelve a abrirla.");
                return;
            }

            await validationSchema.validate(horas, { abortEarly: false });

            const payload = {
                h_sueno: horas.horasSueno,
                cal_sueno: horas.calidadSueno,
                n_comidas: horas.numeroComidas,
                cal_consumo: horas.calidadComida,
                h_osio: horas.horasOcio,
                cal_consumo_tec: horas.calidadConsumo,
                uso_ia: horas.usoIa,
                aplicacion: horas.usoIaEn,
                pregunta_objetivo: horas.bienestar,
            };

            // Enviar al backend
            await axios.post(`${API_URL}/registros/${usuario.id}`, payload);

            Alert.alert('Registro exitoso', 'Gracias por registrar en esta encuesta');
            setError("");
            onNavigateToHome();

        } catch (err: any) {
            if (err.name === "ValidationError") {
                // Validación de Yup
                const mensajes = err.inner.map((e: any) => `• ${e.message}`).join("\n");
                setError(`Errores de la encuesta:\n ${mensajes}`);
            } else if (err.response) {
                // CORRECCIÓN: Manejo correcto del objeto de error de Axios
                const status = err.response.status;
                const backendError = err.response.data?.error || "Error desconocido";

                if (status === 500) {
                    setError("Error interno del servidor, inténtelo más tarde");
                } else if (status === 409) {
                    setError("Ya se había hecho un registro anterior, gracias por responder");
                } else if (status === 400) {
                    setError("Faltan datos por introducir, inténtelo de nuevo");
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
                <Text style={styles.label}>Calificando del 1 al 5 ¿cómo calificaría su bienestar emocional el día de hoy?</Text>
                <LikertScale
                    value={horas.bienestar}
                    onChange={(value) => handleChange("bienestar", value)}
                />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                <Text style={styles.primaryButtonText}>Finalizar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
