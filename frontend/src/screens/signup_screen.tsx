import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import styles from '../styles/signup_screen';

interface SignupScreenProps {
    onNavigateToHome: () => void;
    onNavigateToLogin: () => void;
}

export default function SignupScreen({
    onNavigateToHome,
    onNavigateToLogin,
}: SignupScreenProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [school, setSchool] = useState('');
    const [major, setMajor] = useState('');
    const [error, setError] = useState('');

    const handleRegister = () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword || !school.trim() || !major.trim()) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setError('');
        Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
        onNavigateToHome();
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onNavigateToLogin} style={styles.backButton}>
                            <Text style={styles.backButtonText}>← Atrás</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Registro</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Nombre</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            value={firstName}
                            onChangeText={setFirstName}
                            autoCapitalize="words"
                        />

                        <Text style={styles.label}>Apellido(s)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Apellido(s)"
                            value={lastName}
                            onChangeText={setLastName}
                            autoCapitalize="words"
                        />

                        <Text style={styles.label}>Correo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Verificar contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Repetir contraseña"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Escuela</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Escuela en la que estudias"
                            value={school}
                            onChangeText={setSchool}
                            autoCapitalize="words"
                        />

                        <Text style={styles.label}>Carrera</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Carrera"
                            value={major}
                            onChangeText={setMajor}
                            autoCapitalize="words"
                        />

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
                            <Text style={styles.submitButtonText}>Crear cuenta</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


