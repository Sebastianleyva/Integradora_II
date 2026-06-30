import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    backButton: {
        marginBottom: 12,
    },
    backButtonText: {
        color: '#2196F3',
        fontSize: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2196F3',
        marginBottom: 8,
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#f1f3f5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
    },
    starRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    starButton: {
        padding: 6,
    },
    star: {
        fontSize: 24,
        color: '#ccc',
    },
    starSelected: {
        color: '#f4c430',
    },
    errorText: {
        color: '#d32f2f',
        marginBottom: 16,
        fontSize: 14,
    },
    primaryButton: {
         backgroundColor: '#2196F3',
        borderRadius: 12,
        paddingVertical: 12,
        marginTop: 12,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default styles;
