import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2196F3',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    message: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#f44336',
        borderRadius: 12,
        paddingVertical: 16,
        marginHorizontal: 24,
        marginBottom: 40,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default styles;
