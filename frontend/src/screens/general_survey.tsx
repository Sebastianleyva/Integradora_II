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

interface GeneralSurveyProps {
    onNavigateToHome: () => void;
    onNavigateToLogin: () => void;
}

export default function GeneralSurvey({
    onNavigateToHome,
    onNavigateToLogin,
}: GeneralSurveyProps) {
    const [age, setAge] = useState('');
    const [sex, setSex] = useState('');
    const [sexOther, setSexOther] = useState('');
    const [career, setCareer] = useState('');
    const [school, setSchool] = useState('');
    const [date, setDate] = useState('');
    const [grade, setGrade] = useState('');
    const [previousBurnout, setPreviousBurnout] = useState('');
    const [physicalActivity, setPhysicalActivity] = useState('');
    const [psychiatricTreatment, setPsychiatricTreatment] = useState('');
    const [psychologicalTreatment, setPsychologicalTreatment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!age.trim() || !sex || !career.trim() || !school.trim() || !date.trim() || !grade) {
            setError('Todos los campos obligatorios deben completarse.');
            return;
        }

        if (sex === 'Otro' && !sexOther.trim()) {
            setError('Por favor especifica tu género.');
            return;
        }

        setError('');
        Alert.alert('Encuesta completada', 'Tu encuesta ha sido registrada correctamente.');
        onNavigateToHome();
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
                            value={age}
                            onChangeText={setAge}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Sexo</Text>
                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: sex === 'M' ? '#2196F3' : '#ccc' }]}
                                onPress={() => setSex('M')}
                            >
                                <Text style={styles.submitButtonText}>Masculino</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: sex === 'F' ? '#2196F3' : '#ccc' }]}
                                onPress={() => setSex('F')}
                            >
                                <Text style={styles.submitButtonText}>Femenino</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: sex === 'Otro' ? '#2196F3' : '#ccc' }]}
                                onPress={() => setSex('Otro')}
                            >
                                <Text style={styles.submitButtonText}>Otro</Text>
                            </TouchableOpacity>
                        </View>
                        {sex === 'Otro' && (
                            <TextInput
                                style={styles.input}
                                placeholder="Especifica tu género"
                                value={sexOther}
                                onChangeText={setSexOther}
                                autoCapitalize="words"
                            />
                        )}

                        <Text style={styles.label}>Carrera</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Ingeniería en Sistemas"
                            value={career}
                            onChangeText={setCareer}
                            autoCapitalize="words"
                        />

                        <Text style={styles.label}>Institución Educativa</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Universidad..."
                            value={school}
                            onChangeText={setSchool}
                            autoCapitalize="words"
                        />

                        <Text style={styles.label}>Fecha de Ingreso</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 2022-01-15"
                            value={date}
                            onChangeText={setDate}
                        />

                        <Text style={styles.label}>Grado/Semestre/Cuatrimestre</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 5"
                            value={grade}
                            onChangeText={setGrade}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>¿Ha experimentado burnout previamente?</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: previousBurnout === 'Sí' ? '#2196F3' : '#ccc' }]}
                                onPress={() => setPreviousBurnout('Sí')}
                            >
                                <Text style={styles.submitButtonText}>Sí</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: previousBurnout === 'No' ? '#2196F3' : '#ccc' }]}
                                onPress={() => setPreviousBurnout('No')}
                            >
                                <Text style={styles.submitButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>¿Realiza actividad física regularmente?</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: physicalActivity === 'Sí' ? '#2196F3' : '#ccc' }]}
                                onPress={() => setPhysicalActivity('Sí')}
                            >
                                <Text style={styles.submitButtonText}>Sí</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: physicalActivity === 'No' ? '#2196F3' : '#ccc' }]}
                                onPress={() => setPhysicalActivity('No')}
                            >
                                <Text style={styles.submitButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>¿Está en tratamiento psiquiátrico?</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: psychiatricTreatment === 'Sí' ? '#2196F3' : '#ccc' }]}
                                onPress={() => setPsychiatricTreatment('Sí')}
                            >
                                <Text style={styles.submitButtonText}>Sí</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: psychiatricTreatment === 'No' ? '#2196F3' : '#ccc' }]}
                                onPress={() => setPsychiatricTreatment('No')}
                            >
                                <Text style={styles.submitButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>¿Está en tratamiento psicológico?</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: psychologicalTreatment === 'Sí' ? '#2196F3' : '#ccc' }]}
                                onPress={() => setPsychologicalTreatment('Sí')}
                            >
                                <Text style={styles.submitButtonText}>Sí</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { flex: 1, backgroundColor: psychologicalTreatment === 'No' ? '#2196F3' : '#ccc' }]}
                                onPress={() => setPsychologicalTreatment('No')}
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