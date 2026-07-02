import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface Option {
    label: string;
    value: string | number;
}

interface OptionSelectorProps {
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
    options,
    value,
    onChange,
}) => {
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
                    activeOpacity={0.8}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            value === option.value &&
                            styles.buttonTextSelected,
                        ]}
                    >
                        {option.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default OptionSelector;

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginVertical: 10,
    },

    button: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#2196F3',
        backgroundColor: '#FFFFFF',
    },

    buttonSelected: {
        backgroundColor: '#2196F3',
    },

    buttonText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        color: '#2196F3',
    },

    buttonTextSelected: {
        color: '#FFFFFF',
    },
});