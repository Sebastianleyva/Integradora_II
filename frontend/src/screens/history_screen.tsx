import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    FlatList,
} from 'react-native';
import styles from '../styles/history_screen';

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


