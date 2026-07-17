import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 3,
  },

  fecha: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  label: {
    fontSize: 15,
    color: "#555",
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4F46E5",
  },
});

export default styles;