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
import CalendarPicker from "react-native-calendar-picker";
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/signup_screen';
import * as Yup from "yup";
import axios from "axios";

axios.defaults.withCredentials = true;

type GeneralSurveyStruct = {
    age: string;
    sex: string;
    career: string;
    institution: string;
    date: Date;
    grade: string;
    previousBurnout: boolean;
    physicalActivity: boolean;
    psychiatricTreatment: boolean;
    psychologicalTreatment: boolean;
};

const initialState: GeneralSurveyStruct = {
    age: "",
    sex: "",
    career: "",
    institution: "",
    date: new Date(),
    grade: "",
    previousBurnout: false,
    physicalActivity: false,
    psychiatricTreatment: false,
    psychologicalTreatment: false,
};

const validationSchema = Yup.object().shape({
    age: Yup.number().min(0, "Inserta una edad válida").required("Dato obligatorio"),
    sex: Yup.string().required("Es obligatorio especificar el sexo, caso contrario elige 'otro'"),
    career: Yup.string().required("La carrera estudiada es obligatoria"),
    institution: Yup.string().required("La institución de estudio es obligatorio"),
    date: Yup.date().required("Inserta una fecha válida de ingreso"),
    grade: Yup.number().min(0, "Inserta un grado válido").required("El grado de estudio es obligatorio, inserta el número independientemente de la cantidad que sea (año: 2, semestre: 3, cuatrimestre: 4)"),
    previousBurnout: Yup.boolean().required("¿No se sabe si hay burnout?"),
    physicalActivity: Yup.boolean().required("¿No se sabe si se hace condición física?"),
    psychiatricTreatment: Yup.boolean().required("¿No se sabe si se sigue tratamiento psiquiátrico?"),
    psychologicalTreatment: Yup.boolean().required("¿No se sabe si se sigue tratamiento psicológico?"),
});

interface GeneralSurveyProps {
    onNavigateToHome: () => void;
    onNavigateToLogin: () => void;
}

export default function GeneralSurvey({
    onNavigateToHome,
    onNavigateToLogin,
}: GeneralSurveyProps) {
    const [info, setInfo] = useState <GeneralSurveyStruct>(initialState)
    const [error, setError] = useState('');
    const [usuario, setUsuario] = useState({id: "", nombre: "", apellido: "", correo: ""})

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/account/me").then(res => {
            if (res.data.loggedIn) {
                setUsuario(res.data.usuario);
            }
        }).catch(err => {
            console.error("No hay sesión activa: ", err.response?.data || err.message);
        });
    }, []);

    const handleChange = (name: keyof GeneralSurveyStruct, value: string|number|boolean|Date) => {
        if (name === "date") {
            setInfo({ ...info, [name]: value as Date });
        } else if (name === "age" || name === "grade") {
            setInfo({...info, [name]: Number(value)});
        } else if (name === "sex" || name === "career" || name === "institution") {
            setInfo({...info, [name]: value.toString()})
        } else {
            setInfo({...info, [name]: Boolean(value)})
        }
    }

    const handleSubmit = async () => {
        try {
            await validationSchema.validate(info, { abortEarly: false});

            //Payload (para poner el formato del handlesubmit)
            const payload = {
                ...info,
                date: info.date.toISOString(),
            };

            console.info("Datos entregados: ", payload);

            const status = await axios.post(`http://127.0.0.1:5000/general/${usuario.id}`, payload);

            if (status.status == 400) {
                return setError(`${status.data.error}`);
            } else if (status.status == 500) {
                return setError(`Error interno: ${status.data}`)
            }

            setError('');
            Alert.alert('Encuesta completada', 'Tu encuesta ha sido registrada correctamente.');
            onNavigateToHome();
        } catch (err: any) {
            if (err.name === "ValidationError") {
                // Errores de validación de Yup
                const mensajes = err.inner.map((e: any) => `• ${e.message}`).join("\n");
                setError(`Errores de validación:\n${mensajes}`);
            } else if (err.response) {
                // Errores del backend
                setError(`Error del servidor: ${err.response.data.error || err.message}`);
            } else {
                // Otros errores
                setError(`Error inesperado: ${err.message || 'Error desconocido'}`);
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

                        <Text style={styles.label}>Carrera</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Ingeniería en Sistemas"
                            value={info.career.toString()}
                            onChangeText={(val) => handleChange("career", val)}
                            autoCapitalize="words"
                        />

                        <Text style={styles.label}>Institución Educativa</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Universidad Tecnológica de Durango"
                            value={info.institution}
                            onChangeText={(val) => handleChange("institution", val)}
                            autoCapitalize="words"
                        />

                        <Text style={styles.label}>Fecha de Ingreso</Text>
                        <View style={styles.calendarContainer}>
                        <CalendarPicker
                            onDateChange={(val: Date) => handleChange("date", val)}
                            allowRangeSelection={false}   // Solo permite seleccionar un día
                            selectedStartDate={info.date}

                            //Estilos
                            textStyle={styles.calendarText}                 
                            selectedDayStyle={styles.selectedDay}           
                            selectedDayTextStyle={styles.selectedDayText}   
                            todayTextStyle={styles.todayText}               
                            monthTitleStyle={styles.monthTitle}             
                            yearTitleStyle={styles.monthTitle}              
                            dayLabelsStyle={styles.weekDayLabels}
                            scaleFactor={350}          
                        />

                        {info.date && (
                            <Text style={styles.submitButtonText}>
                            Día seleccionado: {info.date.toDateString()}
                            </Text>
                        )}
                        </View>

                        <Text style={styles.label}>Grado/Semestre/Cuatrimestre</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 5"
                            value={info.grade.toString()}
                            onChangeText={(val) => handleChange("grade", val)}
                            keyboardType="numeric"
                        />

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

//<Text style={styles.label}>Fecha de Ingreso</Text>
//<TextInput
//    style={styles.input}
//    placeholder="Ej: 2022-01-15"
//    value={}
//    onChangeText={setDate}
///>
