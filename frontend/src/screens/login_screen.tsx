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
    email: Yup.string().email("El formato del correo es invalido. Debe ser: ejemplo@dominio.com").required("Campo requerido: Ingresa tu correo electronico"),
    password: Yup.string().required("Campo requerido: Ingresa tu contrasena"),
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
            const resp = await axios.post(`http://10.0.2.2:5000/account/login`, payload);

            if (resp.status == 200) {
                const resp2 = await axios.get(`http://10.0.2.2:5000/general/${resp.data.id}`);
                Alert.alert("Éxito", resp2.data.message);
                setLoading(false);
                if (resp2.data.encuesta) {
                    onNavigateToSurvey();
                } else {
                    onNavigateToHome();
                }
            }
        } catch (err: any) {
            if (err.name == "ValidationError") {
                const mensajes = err.inner.map((e: any) => `${e.message}`).join("\n");
                Alert.alert("Validación: ", mensajes);
            } else if (err.response) {
                const statusCode = err.response.status;
                const responseData = err.response.data;
                if (statusCode == 401) {
                    Alert.alert("Acceso denegado: ", responseData?.error || "El correo o la contraseña son incorrectos. Verifica tus datos e intenta de nuevo.");
                } else if (statusCode == 404) {
                    Alert.alert("Correo no encontrado: ", responseData?.error || "No existe una cuenta con este correo. ¿Quizas querías registrarte?");
                } else if (statusCode == 500) {
                    Alert.alert("Error del servidor (500): ", "El servidor está teniendo problemas. Intenta de nuevo más tarde.");
                } else {
                    Alert.alert("Error del servidor: (" + statusCode + "): ", responseData?.error || err.message);
                }
            } else if (err.message === "Network Error") {
                Alert.alert("Error de conexión: ", "No se pudo conectar al servidor.\n\nSolución:\n1. Verifica tu conexión a internet\n2. Asegúrate que el backend esté disponible\n3. En dispositivo físico, cambia la IP 10.0.2.2 a tu IP local");
            } else {
                Alert.alert("Error inesperado: ", `${err.message || "Algo salió mal. Intenta de nuevo o contacta soporte"}`);
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
                                    {showPassword ? 'Show' : 'Hide'}
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
