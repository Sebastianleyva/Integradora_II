import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface LikertScaleProps {
    value: number;
    onChange: (value: number) => void;
}

const LIKERT_OPTIONS = [
    { label: 'Muy malo', value: 2 },
    { label: 'Malo', value: 4 },
    { label: 'Normal', value: 6 },
    { label: 'Bueno', value: 8 },
    { label: 'Muy bueno', value: 10 },
];

export const LikertScale: React.FC<LikertScaleProps> = ({ value, onChange }) => {
    return (
        <View style={styles.container}>
            {LIKERT_OPTIONS.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={[
                        styles.button,
                        value === option.value && styles.buttonSelected,
                    ]}
                    onPress={() => onChange(option.value)}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            value === option.value && styles.buttonTextSelected,
                        ]}
                    >
                        {option.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 10,
        marginBottom: 24,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    buttonSelected: {
        borderColor: '#2196F3',
        backgroundColor: '#e3f2fd',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    buttonTextSelected: {
        color: '#2196F3',
        fontWeight: '700',
    },
});
