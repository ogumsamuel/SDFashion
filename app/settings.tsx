import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚙️</Text>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.sub}>Coming in a future week!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  emoji: { fontSize: 60, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  sub: { color: '#64748B', marginTop: 8 },
});