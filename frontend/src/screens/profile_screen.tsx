import React, { useState, useEffect } from 'react';
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
import styless from '../styles/link_text';
import modalStyles from '../styles/modalstyles';
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
    const [usuario, setUsuario] = useState({ id: "", nombre: "", apellido: "", correo: "" });
    const [passwords, setPasswords] = useState<ChangeStruct>(initialState);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showConsentModal, setShowConsentModal] = useState(false);

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
                        <Text style={styles.infoValue}>?? de ???? del ????</Text>
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


                <View style={styles.section}>
                    <TouchableOpacity
                        onPress={() => setShowPrivacyModal(true)} // Abre el modal de privacidad

                    >
                        <Text style={styless.linkText}>
                            Ver Aviso de Privacidad
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setShowConsentModal(true)} // Abre el modal de consentimiento
                    >
                        <Text style={styless.linkText}>
                            Ver Consentimiento Informado
                        </Text>
                    </TouchableOpacity>

                </View>
                {/* MODAL DE AVISO DE PRIVACIDAD */}
                <Modal
                    visible={showPrivacyModal}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={modalStyles.modalOverlay}>
                        <View style={modalStyles.modalContent}>
                            <Text style={modalStyles.modalTitle}>Aviso de Privacidad</Text>
                            <ScrollView style={modalStyles.modalScroll}>
                                <Text style={modalStyles.modalText}>
                                    AVISO DE PRIVACIDAD
                                    Última actualización: a Junio del 2026
                                    El presente Aviso de Privacidad regula el tratamiento de los datos personales recabados a través de la aplicación móvil desarrollada como parte del proyecto de investigación orientado al análisis de factores asociados al burnout académico en estudiantes universitarios.
                                    1.	Responsable del tratamiento de datos:
                                    •	Barraza Torres Jesús Daniel
                                    •	Cardiel Mares Emiliano Arturo
                                    •	Flores Hernández José Fernando
                                    •	Rivera Leyva Sebastián
                                    •	Rodríguez Sánchez Carlos Manuel

                                    Los datos personales serán tratados por el equipo desarrollador e investigador responsable del proyecto, integrado por estudiantes de Universidad Tecnológica de Durango con fines exclusivamente académicos y de investigación.
                                    2.	Datos que se recopilan
                                    La aplicación podrá recopilar la siguiente información:
                                    •	Correo electrónico de registro.
                                    •	Información demográfica proporcionada voluntariamente (edad, sexo, carrera, semestre u otros datos académicos).
                                    •	Información relacionada con hábitos de sueño.
                                    •	Información relacionada con hábitos alimenticios.
                                    •	Información relacionada con el uso de tecnologías digitales (teléfono móvil, computadora, videojuegos u otras plataformas).
                                    •	Respuestas a cuestionarios de bienestar, estrés o agotamiento académico.
                                    •	Datos estadísticos derivados del uso de la aplicación.
                                    No se solicitarán datos financieros, documentos oficiales de identificación ni información ajena a los objetivos del proyecto.
                                    3.	Finalidad del tratamiento de los datos
                                    La información recopilada será utilizada exclusivamente para:
                                    •	Desarrollar y evaluar herramientas tecnológicas para el monitoreo de hábitos estudiantiles.
                                    •	Analizar la relación entre hábitos de sueño, alimentación, uso de tecnologías y riesgo de burnout académico.
                                    •	Generar estadísticas agregadas para fines de investigación.
                                    •	Elaborar reportes, artículos científicos, trabajos académicos o presentaciones derivadas del proyecto.
                                    En ningún caso la información será utilizada con fines comerciales.
                                    4.	Confidencialidad y anonimización
                                    Los datos serán tratados de forma confidencial.
                                    Siempre que sea posible, la información será anonimizada o pseudonimizada antes de ser utilizada en procesos de análisis estadístico o investigación.
                                    Los resultados obtenidos serán presentados de forma agregada, evitando la identificación individual de los participantes.
                                    5.	Transferencia de datos
                                    Los datos personales no serán vendidos, cedidos ni compartidos con terceros ajenos al proyecto, salvo obligación legal o requerimiento de autoridad competente.
                                    6.	Participación voluntaria
                                    La participación en este proyecto es completamente voluntaria.
                                    Los usuarios podrán dejar de utilizar la aplicación o solicitar la eliminación de sus datos en cualquier momento mediante los canales de contacto establecidos.
                                    La negativa para proporcionar información o la solicitud de eliminación de datos no generará ningún tipo de sanción o consecuencia académica.
                                    7.	Seguridad de la información
                                    El equipo responsable implementará medidas razonables de seguridad para proteger la información contra pérdida, alteración, acceso no autorizado o uso indebido.
                                    Sin embargo, ningún sistema informático puede garantizar una seguridad absoluta.
                                    8.	Derechos del usuario
                                    Los participantes podrán:
                                    •	Solicitar información sobre los datos almacenados.
                                    •	Solicitar la corrección de información incorrecta.
                                    •	Solicitar la eliminación de sus datos cuando lo consideren pertinente.
                                    •	Retirar su consentimiento para el tratamiento de datos.
                                    Para ejercer estos derechos deberán comunicarse mediante el correo de contacto indicado anteriormente.
                                    9.	Aceptación
                                    Al registrarse y utilizar la aplicación, el usuario declara haber leído y comprendido el presente Aviso de Privacidad y acepta el tratamiento de sus datos conforme a los términos aquí establecidos.
                                </Text>
                            </ScrollView>
                            <TouchableOpacity
                                style={modalStyles.closeButton}
                                onPress={() => setShowPrivacyModal(false)}
                            >
                                <Text style={modalStyles.closeButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showConsentModal}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={modalStyles.modalOverlay}>
                        <View style={modalStyles.modalContent}>
                            <Text style={modalStyles.modalTitle}>Consentimiento Informado</Text>
                            <ScrollView style={modalStyles.modalScroll}>
                                <Text style={modalStyles.modalText}>
                                    CONSENTIMIENTO INFORMADO PARA PARTICIPAR EN EL PROYECTO DE INVESTIGACIÓN
                                    Nombre del proyecto:
                                    factores conductuales que guían al burnout académico
                                    Institución:
                                    Universidad Tecnológica de Durango
                                    Investigadores responsables:
                                    •	Barraza Torres Jesús Daniel
                                    •	Cardiel Mares Emiliano Arturo
                                    •	Flores Hernández José Fernando
                                    •	Rivera Leyva Sebastián
                                    •	Rodríguez Sánchez Carlos Manuel

                                    Fecha:
                                    A Junio del 2026
                                    1.	Introducción
                                    Se le invita a participar voluntariamente en un proyecto de investigación cuyo propósito es estudiar la relación entre los hábitos de uso de tecnologías digitales, la calidad del sueño, los hábitos alimenticios y el riesgo de agotamiento académico (burnout) en estudiantes universitarios.
                                    Antes de decidir si desea participar, es importante que lea cuidadosamente la siguiente información.
                                    2.	Objetivo de la investigación
                                    El objetivo de este estudio es identificar patrones y factores asociados al bienestar estudiantil y al riesgo de burnout académico mediante el análisis de información relacionada con hábitos cotidianos, con el fin de desarrollar herramientas tecnológicas que permitan comprender mejor estos fenómenos y apoyar futuras estrategias de prevención.
                                    3.	¿Qué implica participar?
                                    Si acepta participar, se le solicitará:
                                    •	Crear una cuenta dentro de la aplicación.
                                    •	Proporcionar información demográfica básica relacionada con su contexto académico.
                                    •	Registrar periódicamente información sobre hábitos de sueño, alimentación y uso de tecnologías digitales.
                                    •	Responder cuestionarios relacionados con bienestar, estrés o agotamiento académico.
                                    •	Utilizar la aplicación durante el periodo de investigación establecido por los responsables del proyecto.
                                    La participación requerirá únicamente algunos minutos por día o por semana, dependiendo de la frecuencia de uso de la aplicación.
                                    4.	Riesgos de la participación
                                    La participación en este estudio representa un riesgo mínimo.
                                    Sin embargo, algunas preguntas relacionadas con hábitos personales, estrés o bienestar emocional podrían generar incomodidad o reflexión personal en algunos participantes.
                                    Usted puede omitir preguntas que no desee responder o retirarse del estudio en cualquier momento sin necesidad de justificar su decisión.
                                    5.	Beneficios esperados
                                    La participación puede ayudar al usuario a reflexionar sobre sus hábitos personales y contribuir al desarrollo de conocimiento científico sobre el bienestar estudiantil.
                                    Aunque no se garantiza un beneficio directo individual, la información obtenida podrá contribuir al desarrollo de herramientas y estrategias para mejorar la salud y el bienestar de estudiantes universitarios.
                                    6.	Confidencialidad
                                    Toda la información proporcionada será tratada de manera confidencial.
                                    Los datos recopilados serán utilizados únicamente con fines académicos y de investigación.
                                    Los resultados del estudio podrán publicarse en informes, congresos o artículos científicos, pero en ningún caso se divulgará información que permita identificar personalmente a los participantes.
                                    7.	Participación voluntaria
                                    Su participación es completamente voluntaria.
                                    Puede negarse a participar o retirarse del estudio en cualquier momento sin recibir ninguna penalización o consecuencia académica.
                                    La decisión de abandonar el estudio no afectará su relación con la institución educativa ni con los investigadores responsables.
                                    8.	Uso de los resultados
                                    La información recopilada podrá ser utilizada para:
                                    •	Elaboración de reportes académicos.
                                    •	Presentaciones en congresos científicos.
                                    •	Publicaciones académicas.
                                    •	Desarrollo y evaluación de herramientas tecnológicas relacionadas con el proyecto.
                                    Toda difusión de resultados se realizará de manera agregada y anónima.
                                    9.	Importante
                                    Esta aplicación y el proyecto de investigación NO constituyen una herramienta médica, psicológica o de diagnóstico clínico.
                                    Los resultados obtenidos representan únicamente indicadores o estimaciones utilizadas con fines académicos y de investigación.
                                    Si usted considera que presenta problemas relacionados con su salud física o mental, se recomienda buscar orientación profesional especializada.
                                    10.	Declaración de consentimiento
                                    Declaro que he leído y comprendido la información anterior.
                                    He tenido la oportunidad de conocer los objetivos y características del estudio.
                                    Entiendo que mi participación es voluntaria y que puedo retirarme en cualquier momento.
                                    Acepto participar en el proyecto de investigación y autorizo el tratamiento de mis datos conforme a lo establecido en el Aviso de Privacidad correspondiente.
                                    □ Acepto participar voluntariamente en esta investigación.
                                    □ He leído y acepto el Aviso de Privacidad.
                                </Text>
                            </ScrollView>
                            <TouchableOpacity
                                style={modalStyles.closeButton}
                                onPress={() => setShowConsentModal(false)}
                            >
                                <Text style={modalStyles.closeButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


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