import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import HistoryCard from '../components/historial_cards';
import styles from '../styles/home_screen';
import TodayCard from '../components/todaycard';

interface HomeScreenProps {
    onLogout: () => void;
    onNavigateToRegistroSueno: () => void;
}
interface RegistroHistorial {
    id: number;
    fecha: string;
    horasSueno: string;
    comidas: number;
    horasTecnologia: string;
}

export default function HomeScreen({ onLogout, onNavigateToRegistroSueno }: HomeScreenProps) {
    const [registroHoy, setRegistroHoy] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [historial, setHistorial] = useState<RegistroHistorial[]>([]);
    const API_URL = 'https://integrator-krxn.onrender.com';

    interface RegistroResumen {
        id: number;
        fecha: string;
        horasSueno: string;
        comidas: number;
        horasTecnologia: string;
    }

    useFocusEffect(
        useCallback(() => {
            const verificarRegistro = async () => {
                try {
                    const usuario = await axios.get(`${API_URL}/account/me`);
                    if (!usuario.data.loggedIn) return;

                    const id = usuario.data.usuario.id;

                    const respuesta = await axios.get(
                        `${API_URL}/registros/${id}/existe-hoy`
                    );
                    setRegistroHoy(respuesta.data.existe);

                    const historialResponse = await axios.get(
                        `${API_URL}/registros/${id}/recientes`
                    );
                    setHistorial(historialResponse.data);
                } catch (err) {
                    console.log(err);
                } finally {
                    setCargando(false);
                }

            };
            verificarRegistro();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>¡Hola de nuevo! </Text>
                    <Text style={styles.title}>Tu Bienestar</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Sección de Acción del Día */}
                <Text style={styles.sectionTitle}>Registro de hoy</Text>
                <TodayCard
                    cargando={cargando}
                    registroHoy={registroHoy}
                    onRegistrar={onNavigateToRegistroSueno}
                />

                <Text style={styles.sectionTitle}>Historial reciente</Text>

                <View style={styles.historyContainer}>
                    {/* aquí después irá el map() */}
                </View>

                {/* Historial */}
                <Text style={styles.sectionTitle}>Historial Reciente</Text>

                {historial.length === 0 ? (
                    <Text style={styles.emptyHistory}>
                        Aún no tienes registros anteriores.
                    </Text>
                ) : (
                    historial.map((registro) => (
                        <HistoryCard
                            key={registro.id}
                            fecha={registro.fecha}
                            horasSueno={registro.horasSueno}
                            comidas={registro.comidas}
                            horasTecnologia={registro.horasTecnologia}
                        />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

