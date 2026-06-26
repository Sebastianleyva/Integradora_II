import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import styles from '../styles/login_screen';
import * as Yup from "yup";
import axios from "axios";

axios.defaults.withCredentials = true;

type LoginStruct = {
    email: string;
    password: string
};

const initialState: LoginStruct = {
    email: "",
    password: "",
};

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Formato de correo incorrecto").required("Es obligatorio el correo electrónico"),
    password: Yup.string().required("La contraseña es obligatoria"),
});

interface LoginScreenProps {
    onNavigateToHome: () => void;
    onNavigateToSignup: () => void;
    onNavigateToSurvey: () => void;
}

export default function LoginScreen({
    onNavigateToHome,
    onNavigateToSignup,
    onNavigateToSurvey,
}: LoginScreenProps) {
    const [session, setSession] = useState<LoginStruct>(initialState);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (name: keyof LoginStruct, value: string) => {
        setSession({ ...session, [name]: value });
    };

    const handleLogin = async () => {
        try {
            setLoading(true);
            await validationSchema.validate(session, { abortEarly: false });

            const payload = {
                correo: session.email,
                contra: session.password
            };

            console.info("Datos entregados: ", payload);

            // RECUERDA: Cambiar por IP local si estás usando un celular real
            const response = await axios.post(`http://10.0.2.2:5000/account/login`, payload);

            onNavigateToHome();
        } catch (err: any) {
            if (err.name == "ValidationError") {
                const mensajes = err.inner.map((e: any) => `• ${e.message}`).join("\n");
                Alert.alert(`Errores de validación:\n ${mensajes}`);
            } else if (err.response) {

                const statusCode = err.response.status;
                const responseData = err.response.data;

                if (statusCode == 401) {
                    Alert.alert(responseData?.error || "Credenciales incorrectas.");
                } else if (statusCode == 404) {
                    Alert.alert("No se pudo encontrar el correo electrónico.");
                } else if (statusCode == 500) {
                    Alert.alert(`Error interno: ${responseData?.error || "Error en el servidor"}`);
                } else {
                    Alert.alert(`Error del servidor: ${responseData?.error || err.message}`);
                }
            } else if (err.message === "Network Error") {
                Alert.alert("Error de Red", "No se pudo conectar al servidor. Verifica la IP de tu backend y que estén en la misma red.");
            } else {
                Alert.alert(`Error inesperado: ${err.message || "Error desconocido"}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        console.log('Ir a pantalla de recuperar contraseña');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>MyApp</Text>
                    <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
                </View>

                {/* Form Container */}
                <View style={styles.formContainer}>
                    {/* Email Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="correo@ejemplo.com"
                            placeholderTextColor="#999"
                            value={session.email}
                            onChangeText={(val) => handleChange("email", val)}
                            keyboardType="email-address"
                            editable={!loading}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Contraseña</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="••••••••"
                                placeholderTextColor="#999"
                                value={session.password}
                                onChangeText={(val) => handleChange("password", val)}
                                secureTextEntry={!showPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                                disabled={!session.password}
                            >
                                <Text style={styles.eyeIcon}>
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity
                        onPress={handleForgotPassword}
                        disabled={loading}
                        style={styles.forgotPasswordButton}
                    >
                        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Sign Up */}
                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>¿No tienes cuenta? </Text>
                    <TouchableOpacity onPress={onNavigateToSignup} disabled={loading}>
                        <Text style={styles.signupLink}>Regístrate aquí</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
