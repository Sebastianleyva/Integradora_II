import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/profile_screen';

interface ProfileScreenProps {
    onLogout: () => void;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
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
                        <Text style={styles.infoLabel}>Correo Electrónico</Text>
                        <Text style={styles.infoValue}>juan@example.com</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Teléfono</Text>
                        <Text style={styles.infoValue}>+34 123 456 789</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Fecha de Registro</Text>
                        <Text style={styles.infoValue}>15 Enero 2024</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferencias</Text>
                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingText}>Configuración</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingText}>Notificaciones</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingText}>🔒 Privacidad</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}


