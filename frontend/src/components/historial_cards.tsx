import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/historial_cards";
import { Ionicons } from "@expo/vector-icons";

interface HistoryCardProps {
    fecha: string;
    horasSueno: string;
    comidas: number;
    horasTecnologia: string;
    onPress?: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
    fecha,
    horasSueno,
    comidas,
    horasTecnologia,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <Text style={styles.fecha}>{fecha}</Text>

            <View style={styles.row}>
                <Ionicons
                    name="bed-outline"
                    size={20}
                    color="#4F46E5"
                />
                <Text style={styles.value}>{horasSueno}</Text>
            </View>

            <View style={styles.row}>
                <Ionicons
                    name="restaurant-outline"
                    size={20}
                    color="#4F46E5"
                />
                <Text style={styles.value}>{comidas}</Text>
            </View>

            <View style={styles.row}>
                <Ionicons
                    name="phone-portrait-outline"
                    size={20}
                    color="#4F46E5"
                />
                <Text style={styles.value}>{horasTecnologia}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default HistoryCard;