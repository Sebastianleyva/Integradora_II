import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    FlatList,
} from 'react-native';

export default function HistoryScreen() {
    const historyData = [
        { id: '1', title: 'Actividad 1', date: '2024-01-15', description: 'Primera actividad registrada' },
        { id: '2', title: 'Actividad 2', date: '2024-01-14', description: 'Segunda actividad registrada' },
        { id: '3', title: 'Actividad 3', date: '2024-01-13', description: 'Tercera actividad registrada' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Historial</Text>
            </View>

            <FlatList
                data={historyData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemDate}>{item.date}</Text>
                        <Text style={styles.itemDescription}>{item.description}</Text>
                    </View>
                )}
                scrollEnabled={true}
            />
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
    historyItem: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    itemDate: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
    },
});
