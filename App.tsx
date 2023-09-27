import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useI18n } from "./src/localization";

export default function App() {
  const [locale, setLocale] = useState();

  const { i18n } = useI18n();
  return (
    <View style={styles.container}>
      <Text>{locale}</Text>
      <Text>{i18n.t("greeting")}</Text>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Text>{i18n.t("subscribe")}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
