import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/profile_screen';
import * as Yup from "yup";
import axios from "axios";

axios.defaults.withCredentials = true;

type ChangeStruct = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const initialState: ChangeStruct = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

const API_URL = 'https://integrator-krxn.onrender.com';

const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Campo requerido: Se requiere su contraseña principal para continuar"),
    newPassword: Yup.string().required("Campo requerido: Se requiere una contraseña").min(8, "Tu contrasena debe tener minimo 8 caracteres para mayor seguridad"),
    confirmPassword: Yup.string().required("Campo requerido: Confirma tu contrasena").oneOf([Yup.ref(`newPassword`)], "Las contrasenias no coinciden. Asegurate de escribir la misma contrasena en ambos campos"),
});

interface ProfileScreenProps {
    onLogout: () => void;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [usuario, setUsuario] = useState({ id: "", nombre: "", apellido: "", correo: "", fecha: "" });
    const [passwords, setPasswords] = useState<ChangeStruct>(initialState);
    useEffect(() => {
        axios.get(`${API_URL}/account/me`).then(res => {
            if (res.data.loggedIn) {
                setUsuario(res.data.usuario);
            }
        }).catch(err => {
            console.error("No hay sesión activa: ", err.response?.data || err.message);
            Alert.alert(`Error de sesión`, `No se detectó un usuario activo.\n\nSolución: Vuelve a iniciar sesión. Si el problema persiste, cierra la app y vuelve a abrirla.`);
            onLogout();
        });
    }, []);

    const handleChange = (name: keyof ChangeStruct, value: string) => {
        setPasswords({ ...passwords, [name]: value });
    };

    const handleChangePassword = async () => {
        try {
            console.log(passwords)
            await validationSchema.validate(passwords, { abortEarly: false });

            const payload = {
                contra: passwords.currentPassword,
                newcontra: passwords.newPassword,
            }

            console.info(payload)
            const estado = await axios.put(`${API_URL}/account/update-password/${usuario.id}`, payload);

            if (estado.status == 200) {
                Alert.alert('Éxito', 'Contraseña actualizada correctamente.');
            }
        } catch (err: any) {
            if (err.name === "ValidationError") {
                // Validación de Yup
                const mensajes = err.inner.map((e: any) => `• ${e.message}`).join("\n");
                Alert.alert(`Errores de la encuesta:\n ${mensajes}`);
            } else if (err.response) {
                // CORRECCIÓN: Manejo correcto del objeto de error de Axios
                const status = err.response.status;
                const backendError = err.response.data;

                if (status === 500) {
                    Alert.alert("Error interno del servidor", backendError?.error || "Contacta a soporte");
                } else if (status === 404) {
                    Alert.alert("Error de búsqueda", backendError?.message || "No hay una sesión activa disponible");
                } else if (status === 400) {
                    Alert.alert("Error de validación", backendError?.message || "Faltan datos por introducir, inténtelo de nuevo");
                } else if (status === 401) {
                    Alert.alert("Error de validación", backendError?.message || "Inserta las contraseñas correspondientes");
                } else {
                    Alert.alert(`Error del servidor`, backendError?.error || "Inténtelo de nuevo más tarde o contacta soporte");
                }
            } else if (err.message === "Network Error") {
                Alert.alert("Error de conexion", "No se pudo conectar al servidor. Verifica tu conexion a internet y que el backend este disponible.");
            } else {
                Alert.alert("Error inesperado", (err.message || "Algo salio mal. Intenta de nuevo o contacta soporte"));
            }
        } finally {
            setPasswords(initialState);
            setShowPasswordForm(false);
        }
    };

    const handleLogout = async () => {
        try {
            if (!usuario) {
                return onLogout();
            }
            const estado = await axios.get(`${API_URL}/account/logout`);

            if (estado.status == 200) {
                onLogout();
            }
        } catch (err: any) {
            if (err.response) {
                // CORRECCIÓN: Manejo correcto del objeto de error de Axios
                const status = err.response.status;
                const backendError = err.response.data;

                if (status === 500) {
                    Alert.alert("Error interno del servidor", backendError?.error || "Contacta a soporte")
                } else {
                    Alert.alert(`Error del servidor`, backendError?.error || "Inténtelo de nuevo más tarde o contacta soporte");
                }
            } else if (err.message === "Network Error") {
                Alert.alert("Error de conexion", "No se pudo conectar al servidor. Verifica tu conexion a internet y que el backend este disponible.");
            } else {
                Alert.alert("Error inesperado", (err.message || "Algo salio mal. Intenta de nuevo o contacta soporte"));
            }
        }
    }


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
                    <Text style={styles.userName}>{usuario.nombre} {usuario.apellido}</Text>
                    <Text style={styles.userEmail}>{usuario.correo}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información</Text>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Nombre</Text>
                        <Text style={styles.infoValue}>{usuario.nombre} {usuario.apellido}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Correo Electrónico</Text>
                        <Text style={styles.infoValue}>{usuario.correo}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Fecha de Registro</Text>
                        <Text style={styles.infoValue}>{usuario.fecha ? usuario.fecha : "Fecha no disponible"}</Text>
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
                                value={passwords.currentPassword}
                                onChangeText={(val) => handleChange("currentPassword", val)}
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
                                value={passwords.newPassword}
                                onChangeText={(val) => handleChange("newPassword", val)}
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
                                value={passwords.confirmPassword}
                                onChangeText={(val) => handleChange("confirmPassword", val)}
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
                </View>



                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}