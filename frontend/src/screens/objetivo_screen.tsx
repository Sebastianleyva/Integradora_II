import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/objetivo_screen';
import * as Yup from "yup";
import axios from "axios";
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
        axios.get("http://10.0.2.2:5000/account/me").then(res => {
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
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Objetivo</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>Rate your overall well-being today</Text>
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
