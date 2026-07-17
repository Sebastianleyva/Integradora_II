import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    welcomeText: {
        fontSize: 14,
        color: '#6B7280',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
    },
    logoutButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#FEE2E2',
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: '600',
        fontSize: 13,
    },
    scrollContent: {
        padding: 20,
    },
    actionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    pendingContainer: {
        alignItems: 'center',
    },
    pendingText: {
        fontSize: 15,
        color: '#4B5563',
        marginBottom: 15,
        textAlign: 'center',
    },
    primaryButton: {
        backgroundColor: '#10B981', 
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    doneContainer: {
        alignItems: 'center',
        paddingVertical: 5,
    },
    doneText: {
        textAlign: 'center',
        color: '#059669',
        fontSize: 15,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 15,
    },
    historyContainer: {
        gap: 12, 
    },
    emptyHistory: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginVertical: 25,
},
});

export default styles;
