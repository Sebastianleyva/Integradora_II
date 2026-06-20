import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingVertical: 30,
        paddingHorizontal: 24,
    },
    backButton: {
        marginBottom: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#2196F3',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2196F3',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    message: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
    },
    form: {
        width: '100%',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 40,
    },
    label: {
        fontSize: 14,
        color: '#444',
        marginBottom: 8,
        marginTop: 16,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 14,
        marginTop: 12,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#2196F3',
        borderRadius: 12,
        paddingVertical: 16,
        marginTop: 24,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    calendarContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 8,
    marginVertical: 10,
    alignSelf: 'center',
    width: '95%', // responsivo: se adapta al ancho de pantalla
    },
    calendarText: {
        fontSize: 12, // más pequeño
        color: '#333',
    },
    selectedDay: {
        backgroundColor: '#2196F3',
        borderRadius: 6,
    },
    selectedDayText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '600',
    },
    todayText: {
        color: '#d32f2f',
        fontWeight: '700',
        fontSize: 12,
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2196F3',
        marginBottom: 6,
    },
    weekDayLabels: {
        fontSize: 11,
        fontWeight: '500',
        color: '#555',
    },
});

export default styles;
