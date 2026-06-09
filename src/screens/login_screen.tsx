import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

interface LoginScreenProps {
    onNavigateToHome: () => void;
    onNavigateToSignup: () => void;
}

export default function LoginScreen({
    onNavigateToHome,
    onNavigateToSignup,
}: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onNavigateToHome();
        }, 800);
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
                            value={email}
                            onChangeText={setEmail}
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
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                                disabled={!password}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    logo: {
        fontSize: 36,
        fontWeight: '800',
        color: '#2196F3',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    formContainer: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
        paddingRight: 50,
    },
    eyeButton: {
        position: 'absolute',
        right: 16,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeIcon: {
        fontSize: 18,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#2196F3',
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#2196F3',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2196F3',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    signupText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    signupLink: {
        color: '#2196F3',
        fontSize: 14,
        fontWeight: '700',
    },
});
