import { StyleSheet } from 'react-native';

const styless = StyleSheet.create({
  consentContainer: {
    marginTop: 20,
    marginBottom: 20,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#999",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginTop: 2,
  },

  checkboxSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },

  checkboxCheck: {
    color: "#fff",
    fontWeight: "bold",
  },

  consentText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  linkText: {
    color: "#2563eb",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});

export default styless;