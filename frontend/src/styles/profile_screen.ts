import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2196F3',
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 40,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#999',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
    },
    infoItem: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8,
        borderRadius: 6,
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    settingItem: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8,
        borderRadius: 6,
    },
    settingText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2196F3',
    },
    logoutButton: {
        backgroundColor: '#f44336',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default styles;
