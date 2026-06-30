import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface HourIntervalsProps {
    value: string;
    onChange: (value: string) => void;
    includeLongSleep?: boolean; // true para sueño (7-9, 9+), false para otros
}

export const HourIntervals: React.FC<HourIntervalsProps> = ({ 
    value, 
    onChange, 
    includeLongSleep = false 
}) => {
    const baseOptions = [
        { label: 'Menos de 1h', value: 'menos1' },
        { label: '1-3h', value: '1-3' },
        { label: '3-5h', value: '3-5' },
        { label: '5-7h', value: '5-7' },
        { label: 'Mas de 7h', value: 'mas7' },
    ];

    const sleepOnlyOptions = [
        { label: '7-9h', value: '7-9' },
        { label: 'Mas de 9h', value: 'mas9' },
    ];

    const options = includeLongSleep ? [...baseOptions, ...sleepOnlyOptions] : baseOptions;

    return (
        <View style={styles.container}>
            {options.map((option) => (
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
        marginVertical: 10,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#2196F3',
        backgroundColor: '#fff',
    },
    buttonSelected: {
        backgroundColor: '#2196F3',
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: '#2196F3',
    },
    buttonTextSelected: {
        color: '#fff',
    },
});
