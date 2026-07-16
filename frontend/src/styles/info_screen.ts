import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', 
    },
    header: {
        // backgroundColor: '#1E3A8A', // Azul Marino Académico
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 25,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        // Sombras ligeras para elevación elegante
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    backButton: {
        marginBottom: 15,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#93C5FD',
        fontSize: 14,
        fontWeight: '600',
    },
    headerTextContainer: {
        marginBottom: 10,
    },
    institution: {
        color: '#93C5FD',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#090808',
        marginTop: 4,
    },
    ethicsBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#10B981', // Verde esmeralda para el aval ético
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 5,
    },
    ethicsText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 20,
    },
    introCard: {
        backgroundColor: '#EFF6FF', // Fondo azul claro suave
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    introText: {
        fontSize: 14,
        color: '#1E40AF',
        lineHeight: 22,
        fontWeight: '500',
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 18,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    bodyText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 21,
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    footerNote: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 10,
    },
    contactButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#1E3A8A',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    contactButtonText: {
        color: '#1E3A8A',
        fontSize: 14,
        fontWeight: '600',
    },
    version: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 20,
    },
    section: {
        marginBottom: 20,
    },
});

export default styles;

