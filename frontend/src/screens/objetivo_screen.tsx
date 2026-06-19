import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/objetivo_screen';

interface ObjetivoScreenProps {
    onNavigateToHome: () => void;
}

export default function ObjetivoScreen({ onNavigateToHome }: ObjetivoScreenProps) {
    const [bienestar, setBienestar] = useState(0);

    const handleSubmit = () => {
        if (bienestar < 1) return;
        onNavigateToHome();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Objetivo</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>¿Cómo calificas tu bienestar general?</Text>
                <View style={styles.starRow}>
                    {Array.from({ length: 10 }, (_, i) => {
                        const idx = i + 1;
                        return (
                            <TouchableOpacity key={idx} onPress={() => setBienestar(idx)} style={styles.starButton}>
                                <Text style={[styles.star, bienestar >= idx && styles.starSelected]}>★</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                <Text style={styles.primaryButtonText}>Finalizar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
