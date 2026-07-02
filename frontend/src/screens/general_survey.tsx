import React, { useState, useEffect } from 'react';
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

type GeneralSurveyStruct = {
    age: string;
    sex: string;
    career: string;
    date: Date;
    grade: string;
    work: boolean;
    previousBurnout: boolean;
    physicalActivity: boolean;
    psychiatricTreatment: boolean;
    psychologicalTreatment: boolean;
};

const initialState: GeneralSurveyStruct = {
    age: "",
    sex: "",
    career: "",
    date: new Date(),
    grade: "",
    work: false,
    previousBurnout: false,
    physicalActivity: false,
    psychiatricTreatment: false,
    psychologicalTreatment: false,
};

const validationSchema = Yup.object().shape({
    age: Yup.number().min(0, "Ingresa una edad valida (0 o mayor)").required("Campo requerido: Tu edad es necesaria"),
    sex: Yup.string().required("Campo requerido: Especifica tu sexo o selecciona 'Otro'"),
    career: Yup.string().required("Campo requerido: Ingresa tu carrera de estudio"),
    date: Yup.date().required("Campo requerido: Selecciona la fecha en que ingresaste a estudiar"),
    grade: Yup.number().min(0, "Ingresa un grado valido (0 o mayor)").required("Campo requerido: Especifica tu grado actual (ano: 2, semestre: 3, cuatrimestre: 4)"),
    work: Yup.boolean().required("Campo requerido: Indica si trabajas"),
    previousBurnout: Yup.boolean().required("Campo requerido: Indica si has sufrido de burnout antes"),
    physicalActivity: Yup.boolean().required("Campo requerido: Especifica si realizas actividad fisica"),
    psychiatricTreatment: Yup.boolean().required("Campo requerido: Indica si sigues tratamiento psiquiatrico"),
    psychologicalTreatment: Yup.boolean().required("Campo requerido: Indica si sigues tratamiento psicologico"),
});

interface GeneralSurveyProps {
    onNavigateToHome: () => void;
    onNavigateToLogin: () => void;
}

export default function GeneralSurvey({
    onNavigateToHome,
    onNavigateToLogin,
}: GeneralSurveyProps) {
    const [info, setInfo] = useState<GeneralSurveyStruct>(initialState)
    const [error, setError] = useState('');
    const [usuario, setUsuario] = useState({ id: "", nombre: "", apellido: "", correo: "" })

    useEffect(() => {
        axios.get("http://10.0.2.2:5000/account/me").then(res => {
            if (res.data.loggedIn) {
                console.log(res.data.usuario);
                setUsuario(res.data.usuario);
            }
        }).catch(err => {
            console.error("No hay sesión activa: ", err.response?.data || err.message);
            setError(`Error de sesión: No se detectó un usuario activo.\n\nSolución: Vuelve a iniciar sesión. Si el problema persiste, cierra la app y vuelve a abrirla.`);
        });
    }, []);

    const handleChange = (name: keyof GeneralSurveyStruct, value: string | number | boolean | Date) => {
        if (name === "date") {
            setInfo({ ...info, [name]: value as Date });
        } else if (name === "age" || name === "grade") {
            setInfo({ ...info, [name]: Number(value) });
        } else if (name === "sex" || name === "career") {
            setInfo({ ...info, [name]: value.toString() })
        } else {
            setInfo({ ...info, [name]: Boolean(value) })
        }
    }

    const handleSubmit = async () => {
        try {
            await validationSchema.validate(info, { abortEarly: false });

            //Payload (para poner el formato del handlesubmit)
            const payload = {
                edad: info.age,
                sexo: info.sex,
                carrera: info.career,
                fecha: info.date.toISOString(),
                n_insc: info.grade,
                burnout: info.previousBurnout,
                actividad: info.physicalActivity,
                psiquia: info.psychiatricTreatment,
                psico: info.psychologicalTreatment,
            };

            console.info("Datos entregados: ", payload);

            const status = await axios.post(`http://10.0.2.2:5000/general/${usuario.id}`, payload);

            setError('');
            Alert.alert('Encuesta completada', 'Tu encuesta ha sido registrada correctamente.');
            onNavigateToHome();
        } catch (err: any) {
            if (err.name === "ValidationError") {
                // Errores de validación de Yup
                const mensajes = err.inner.map((e: any) => `${e.message}`).join("\n");
                setError(`${mensajes}`);
            } else if (err.response) {
                const statusCode = err.response.status;
                const responseData = err.response.data;

                if (statusCode === 400) {
                    return setError(`Datos inválidos: ${responseData.error || "Verifica que todos los campos sean correctos"}`);
                } else if (statusCode === 409) {
                    return setError(`Conflicto: ${responseData.error || "Ya existe un registro con esta información. Contacta soporte"}`);
                } else if (statusCode === 500) {
                    return setError(`Error del servidor (500): ${responseData.error || "El servidor está teniendo problemas"}.\n\nIntenta de nuevo más tarde.`);
                } else {
                    setError(`Error del servidor (${statusCode}): ${responseData.error || err.message}`);
                }
            } else if (err.message === "Network Error") {
                setError("Error de conexión: No se pudo conectar al servidor.\n\nSolución:\n1. Verifica tu conexión a internet\n2. Asegúrate que el backend esté disponible");
            } else {
                // Otros errores
                setError(`Error inesperado: ${err.message || 'Algo salió mal. Intenta de nuevo o contacta soporte'}`);
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
                        <TouchableOpacity onPress={onNavigateToLogin} style={styles.backButton}>
                            <Text style={styles.backButtonText}>← Atrás</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Encuesta General</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Edad</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 22"
                            value={info.age.toString()}
                            onChangeText={(val) => handleChange("age", val)}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Sexo</Text>
                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: info.sex === 'Masculino' ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("sex", "Masculino")}
                            >
                                <Text style={styles.submitButtonText}>Masculino</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: info.sex === 'Femenino' ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("sex", "Femenino")}
                            >
                                <Text style={styles.submitButtonText}>Femenino</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: info.sex === 'Otro' ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("sex", "Otro")}
                            >
                                <Text style={styles.submitButtonText}>Otro</Text>
                            </TouchableOpacity>
                        </View>
                        {(info.sex !== 'Masculino' && info.sex !== "Femenino") && (
                            <TextInput
                                style={styles.input}
                                placeholder="Especifica tu género"
                                value={info.sex.toString()}
                                onChangeText={(val) => handleChange("sex", val)}
                                autoCapitalize="words"
                            />
                        )}

                        <Text style={styles.label}>Carrera que cursa actualmente</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Ingeniería en Sistemas"
                            value={info.career.toString()}
                            onChangeText={(val) => handleChange("career", val)}
                            autoCapitalize="words"
                        />


                        <Text style={styles.label}>Cuatrimestre actual</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 5"
                            value={info.grade.toString()}
                            onChangeText={(val) => handleChange("grade", val)}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>¿Actualmente cuenta con un empleo?</Text>
                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: info.work === true ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("work", true)}
                            >
                                <Text style={styles.submitButtonText}>Sí</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: info.work === false ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("work", false)}
                            >
                                <Text style={styles.submitButtonText}>No</Text>
                            </TouchableOpacity>

                        </View>

                        <Text style={styles.label}>¿Ha experimentado burnout previamente?</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: info.previousBurnout === true ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("previousBurnout", true)}
                            >
                                <Text style={styles.submitButtonText}>Sí</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: info.previousBurnout === false ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("previousBurnout", false)}
                            >
                                <Text style={styles.submitButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>¿Realiza actividad física regularmente?</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: info.physicalActivity === true ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("physicalActivity", true)}
                            >
                                <Text style={styles.submitButtonText}>Sí</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: info.physicalActivity === false ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("physicalActivity", false)}
                            >
                                <Text style={styles.submitButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>¿Está en tratamiento psiquiátrico?</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: info.psychiatricTreatment === true ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("psychiatricTreatment", true)}
                            >
                                <Text style={styles.submitButtonText}>Sí</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: info.psychiatricTreatment === false ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("psychiatricTreatment", false)}
                            >
                                <Text style={styles.submitButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>¿Está en tratamiento psicológico?</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: info.psychologicalTreatment === true ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("psychologicalTreatment", true)}
                            >
                                <Text style={styles.submitButtonText}>Sí</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: info.psychologicalTreatment === false ? '#2196F3' : '#ccc' }]}
                                onPress={() => handleChange("psychologicalTreatment", false)}
                            >
                                <Text style={styles.submitButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Completar Encuesta</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


