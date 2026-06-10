import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from 'react-native';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2196F3',
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2196F3',
    },
    metricBar: {
        marginBottom: 16,
    },
    metricLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    metricValue: {
        fontSize: 12,
        color: '#999',
    },
});
