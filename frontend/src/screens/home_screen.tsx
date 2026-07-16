import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import HistoryCard from '../components/historial_cards';
import styles from '../styles/home_screen';

interface HomeScreenProps {
    onLogout: () => void;
    onNavigateToRegistroSueno: () => void;
}

export default function HomeScreen({ onLogout, onNavigateToRegistroSueno }: HomeScreenProps) {
    const [registroHoy, setRegistroHoy] = useState(false);
    const [cargando, setCargando] = useState(true);
    const API_URL = 'https://integrator-krxn.onrender.com';

    useFocusEffect(
        useCallback(() => {
            const verificarRegistro = async () => {
                try {
                    // Idealmente, guarda el ID del usuario en un estado global (Redux/Context)
                    // o en AsyncStorage para no pedirlo al servidor en cada focus.
                    const usuario = await axios.get(`${API_URL}/account/me`);
                    if (!usuario.data.loggedIn) return;

                    const id = usuario.data.usuario.id;
                    const respuesta = await axios.get(
                        `${API_URL}/registros/${id}/existe-hoy`
                    );
                    setRegistroHoy(respuesta.data.existe);
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
                <View style={styles.actionCard}>
                    {cargando ? (
                        <ActivityIndicator size="small" color="#4F46E5" />
                    ) : registroHoy ? (
                        <View style={styles.doneContainer}>
                            <Text style={styles.doneText}>
                                🎉 ¡Excelente! Ya completaste tu registro de hoy.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.pendingContainer}>
                            <Text style={styles.pendingText}>¿Cómo va tu día? Registra tus hábitos.</Text>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={onNavigateToRegistroSueno}
                            >
                                <Text style={styles.primaryButtonText}>
                                    Hacer mi registro
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Historial */}
                <Text style={styles.sectionTitle}>Historial Reciente</Text>

                <View style={styles.historyContainer}>
                    <HistoryCard
                        fecha="Hoy"
                        horasSueno="7 h"
                        comidas={3}
                        horasTecnologia="4 h"
                    />
                    <HistoryCard
                        fecha="Ayer"
                        horasSueno="6 h"
                        comidas={2}
                        horasTecnologia="5 h"
                    />
                    <HistoryCard
                        fecha="13 de julio"
                        horasSueno="8 h"
                        comidas={4}
                        horasTecnologia="3 h"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

