import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/profile_screen';

interface ProfileScreenProps {
    onLogout: () => void;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Completa todos los campos.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las nuevas contraseñas no coinciden.');
            return;
        }

        Alert.alert('Éxito', 'Contraseña actualizada correctamente.');

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordForm(false);
    };

    const showTerms = () => {
        Alert.alert(
            'Términos y Condiciones',
            'Aquí se mostrarán los términos y condiciones de la aplicación.'
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Perfil</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>👤</Text>
                    </View>
                    <Text style={styles.userName}>Juan Pérez</Text>
                    <Text style={styles.userEmail}>juan@example.com</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información</Text>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Nombre</Text>
                        <Text style={styles.infoValue}>Juan Pérez</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Correo Electrónico</Text>
                        <Text style={styles.infoValue}>juan@example.com</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Fecha de Registro</Text>
                        <Text style={styles.infoValue}>15 Enero 2024</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => setShowPasswordForm(!showPasswordForm)}
                    >
                        <Text style={styles.settingText}>🔒 Cambiar contraseña</Text>
                    </TouchableOpacity>

                    {showPasswordForm && (
                        <View
                            style={{
                                backgroundColor: '#fff',
                                padding: 16,
                                borderRadius: 8,
                                marginTop: 10,
                            }}
                        >
                            <TextInput
                                placeholder="Contraseña actual"
                                secureTextEntry
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 6,
                                    padding: 12,
                                    marginBottom: 12,
                                }}
                            />

                            <TextInput
                                placeholder="Nueva contraseña"
                                secureTextEntry
                                value={newPassword}
                                onChangeText={setNewPassword}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 6,
                                    padding: 12,
                                    marginBottom: 12,
                                }}
                            />

                            <TextInput
                                placeholder="Confirmar nueva contraseña"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 6,
                                    padding: 12,
                                    marginBottom: 16,
                                }}
                            />

                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#2196F3',
                                    padding: 14,
                                    borderRadius: 6,
                                    alignItems: 'center',
                                }}
                                onPress={handleChangePassword}
                            >
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontWeight: '600',
                                        fontSize: 15,
                                    }}
                                >
                                    Guardar contraseña
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={showTerms}
                    >
                        <Text style={styles.settingText}>
                            📄 Ver Términos y Condiciones
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={onLogout}
                >
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}