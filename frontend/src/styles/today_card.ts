import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 3,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
    color: "#333",
  },

  message: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },

  subMessage: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
    lineHeight: 22,
  },

  button: {
    backgroundColor: "#10B981",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  completed: {
    color: "#16A34A",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
  },

  pendingTomorrow: {
    color: "#666",
    fontSize: 15,
  },
});

export default styles;