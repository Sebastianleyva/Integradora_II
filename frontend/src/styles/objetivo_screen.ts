import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
        justifyContent: 'space-between',
    },
    header: {
        marginTop: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2196F3',
    },
    subtitle: {
        color: '#666',
        marginTop: 6,
    },
    content: {
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    starRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    starButton: {
        padding: 6,
    },
    star: {
        fontSize: 28,
        color: '#ccc',
    },
    starSelected: {
        color: '#f4c430',
    },
    primaryButton: {
        backgroundColor: '#2196F3',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default styles;
