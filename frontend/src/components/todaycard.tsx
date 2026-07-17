import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/today_card";

interface TodayCardProps {
    cargando: boolean;
    registroHoy: boolean;
    onRegistrar: () => void;
}

export default function TodayCard({
    cargando,
    registroHoy,
    onRegistrar,
}: TodayCardProps) {
    if (cargando) {
        return (
            <View style={styles.card}>
                <ActivityIndicator size="small" color="#4F46E5" />
            </View>
        );
    }

    if (!registroHoy) {
        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <Ionicons
                        name="calendar-outline"
                        size={22}
                        color="#4F46E5"
                    />
                    <Text style={styles.title}>Registro de hoy</Text>
                </View>

                <Text style={styles.message}>
                    Todavía no has llenado tu registro.
                </Text>

                <Text style={styles.subMessage}>
                    Tómate 5 minutos y llénalo ahora.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={onRegistrar}
                >
                    <Text style={styles.buttonText}>
                        Hacer mi registro
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="#22C55E"
                />
                <Text style={styles.title}>Registro de hoy</Text>
            </View>

            <Text style={styles.completed}>
                ¡Excelente! Ya completaste tu registro de hoy.
            </Text>

            <Text style={styles.pendingTomorrow}>
                Vuelve mañana para registrar un nuevo día.
            </Text>
        </View>
    );
}