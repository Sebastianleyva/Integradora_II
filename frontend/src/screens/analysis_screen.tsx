import React from 'react';
import {
    View,
    Text,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/analysis_screen';

export default function AnalysisScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Análisis</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Estadísticas Generales</Text>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Total de Actividades:</Text>
                        <Text style={styles.statValue}>24</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Esta Semana:</Text>
                        <Text style={styles.statValue}>8</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Promedio por Día:</Text>
                        <Text style={styles.statValue}>3.4</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Métricas</Text>
                    <View style={styles.metricBar}>
                        <Text style={styles.metricLabel}>Productividad</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '75%' }]} />
                        </View>
                        <Text style={styles.metricValue}>75%</Text>
                    </View>
                    <View style={styles.metricBar}>
                        <Text style={styles.metricLabel}>Consistencia</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '85%' }]} />
                        </View>
                        <Text style={styles.metricValue}>85%</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


