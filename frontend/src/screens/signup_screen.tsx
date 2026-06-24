import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/signup_screen';
import * as Yup from "yup";
import axios from "axios";

axios.defaults.withCredentials = true;

type RegisterStruct = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const initialState: RegisterStruct = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Es obligatorio insertar tu/s nombre/s"),
    lastName: Yup.string().required("Es obligatorio insertar tus apellidos"),
    email: Yup.string().email("Formato de correo incorrecto").required("Es obligatorio el correo electrónico"),
    password: Yup.string().required("La contraseña es obligatoria").min(8, "La contraseña debe de tener un mínimo de 8 carácteres"),
    confirmPassword: Yup.string().required("Es obligatorio confirmar la contraseña").oneOf([Yup.ref(`password`)], "Las contraseñas no coinciden"),
});

interface SignupScreenProps {
    onNavigateToHome: () => void;
    onNavigateToLogin: () => void;
}

export default function SignupScreen({
    onNavigateToHome,
    onNavigateToLogin,
}: SignupScreenProps) {
    const [session, setSession] = useState<RegisterStruct>(initialState)
    const [error, setError] = useState('');

    const handleChange = (name: keyof RegisterStruct, value: string) => {
        setSession({... session, [name]: value})
    };

    const handleRegister = async () => {
        try {
            //Validación
            await validationSchema.validate(session, {abortEarly: false});
            
            const payload = {
                nombre: session.firstName,
                apellidos: session.lastName,
                correo: session.email,
                contra: session.password,
            };

            console.info("Dato entregados: ", payload);

            const status = await axios.post(`http://10.0.2.2:5000/account/register`, payload);

            setError('');
            Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
            onNavigateToHome();
        } catch (err: any) {
            if (err.name == "ValidationError") {
                //Validación de Yup
                const mensajes = err.inner.map((e: any) => `• ${e.message}`).join("\n");
                setError(`Errores de validación:\n ${mensajes}`);
            } else if (err.response) {
                //Backend
                if (err.status == 500) {
                    return setError(`Error interno: ${err.data.error}`)
                } else {
                    setError(`Error del servidor: ${err.response.data.error || err.message}`);
                }
            } else {
                //Otros
                setError(`Error inesperado: ${err.message || "Error desconocido"}`);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => {
                                console.log('Botón atrás presionado');
                                onNavigateToLogin();
                            }}
                            style={styles.backButton}
                            activeOpacity={0.6}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Text style={styles.backButtonText}>Atrás</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Registro</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Nombre</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            value={session.firstName}
                            onChangeText={(val) => handleChange("firstName", val)}
                            autoCapitalize="words"
                        />

                        <Text style={styles.label}>Apellido(s)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Apellido(s)"
                            value={session.lastName}
                            onChangeText={(val) => handleChange("lastName", val)}
                            autoCapitalize="words"
                        />

                        <Text style={styles.label}>Correo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            value={session.email}
                            onChangeText={(val) => handleChange("email", val)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            value={session.password}
                            onChangeText={(val) => handleChange("password", val)}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Verificar contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Repetir contraseña"
                            value={session.confirmPassword}
                            onChangeText={(val) => handleChange("confirmPassword", val)}
                            secureTextEntry
                            autoCapitalize="none"
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
