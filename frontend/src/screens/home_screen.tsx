import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/home_screen';
import axios from 'axios';
const API_URL = 'https://integrator-krxn.onrender.com';

interface HomeScreenProps {
    onLogout: () => void;
    onNavigateToRegistroSueno: () => void;
}


export default function HomeScreen({ onLogout, onNavigateToRegistroSueno }: HomeScreenProps) {
    const [registroHoy, setRegistroHoy] = useState(false);
    const [cargando, setCargando] = useState(true);
    useEffect(() => {

        const verificarRegistro = async () => {
            try {

                const usuario = await axios.get(`${API_URL}/account/me`);

                if (!usuario.data.loggedIn) {
                    return;
                }

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

    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Bienvenido</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.message}>¡Iniciaste sesión exitosamente!</Text>

                {cargando ? (

                    <Text>Comprobando registro...</Text>

                ) : registroHoy ? (

                    <Text
                        style={{
                            textAlign: 'center',
                            color: 'green',
                            fontSize: 16,
                        }}
                    >
                        ✅ Ya realizaste tu registro del día.
                    </Text>

                ) : (

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={onNavigateToRegistroSueno}
                    >
                        <Text style={styles.primaryButtonText}>
                            Hacer mi registro
                        </Text>
                    </TouchableOpacity>

                )}
            </View>

        </SafeAreaView>
    );
}


