import React, { useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [imcResult, setImcResult] = useState(null);
  const [classification, setClassification] = useState({ text: '', color: '#757575' });

  useEffect(() => {
    if (loginError) setLoginError('');
  }, [email, password]);

  const handleLogin = () => {
    Keyboard.dismiss();
    if (email.toLowerCase() === 'malbuquerque372@gmail.com' && password === '123456') {
      setIsLogged(true);
      setLoginError('');
    } else {
      setLoginError('E-mail ou senha incorretos!');
    }
  };

  const getClassification = (imc) => {
    if (imc < 16) return { text: 'Magreza Grave', color: '#B71C1C' };
    if (imc < 17) return { text: 'Magreza Moderada', color: '#D32F2F' };
    if (imc < 18.5) return { text: 'Magreza Leve', color: '#FF7043' };
    if (imc < 25) return { text: 'Peso Normal', color: '#4CAF50' };
    if (imc < 30) return { text: 'Sobrepeso', color: '#FFB300' };
    if (imc < 35) return { text: 'Obesidade Grau I', color: '#F4511E' };
    if (imc < 40) return { text: 'Obesidade Grau II', color: '#E64A19' };
    return { text: 'Obesidade Grau III', color: '#C62828' };
  };

  const calculateIMC = () => {
    Keyboard.dismiss();

    if (!weight || !height) {
      setImcResult(null);
      setClassification({ text: 'Preencha peso e altura.', color: '#757575' });
      return;
    }

    const w = parseFloat(weight.replace(',', '.'));
    const h = parseFloat(height.replace(',', '.'));

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setImcResult(null);
      setClassification({ text: 'Valores inválidos.', color: '#C62828' });
      return;
    }

    const meters = h / 100;
    const imcCalc = w / (meters * meters);

    setImcResult(imcCalc.toFixed(2));
    setClassification(getClassification(imcCalc));
  };

  const resultStyle = useMemo(
    () => [styles.resultText, { color: classification.color }],
    [classification.color]
  );

  if (!isLogged) {
    return (
      <View style={styles.container}>
        {Platform.OS !== 'web' && (
          <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />
        )}

        <View style={styles.header}>
          <Text style={styles.headerText}>Login</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#90A4AE"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#90A4AE"
          />

          {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {Platform.OS !== 'web' && (
        <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />
      )}

      <View style={styles.header}>
        <Text style={styles.headerText}>Calculadora de IMC</Text>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            setIsLogged(false);
            setWeight('');
            setHeight('');
            setImcResult(null);
            setClassification({ text: '', color: '#757575' });
          }}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Peso (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 75.5"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholderTextColor="#90A4AE"
        />

        <Text style={styles.label}>Altura (cm)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 175"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          placeholderTextColor="#90A4AE"
        />

        <TouchableOpacity style={styles.button} onPress={calculateIMC}>
          <Text style={styles.buttonText}>Calcular IMC</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>Seu Resultado:</Text>

        {imcResult ? (
          <View style={styles.resultDisplay}>
            <Text style={resultStyle}>{imcResult}</Text>
            <Text style={[styles.classificationText, { color: classification.color }]}>
              {classification.text}
            </Text>
          </View>
        ) : (
          <Text style={styles.placeholderText}>Insira os dados para calcular.</Text>
        )}
      </View>

      <View style={styles.table}>
        <Text style={styles.tableTitle}>Classificação do IMC</Text>

        <View style={styles.tableRowHeader}>
          <Text style={styles.tableCellHeader}>IMC (kg/m²)</Text>
          <Text style={styles.tableCellHeader}>Classificação</Text>
        </View>

        {[
          { range: '< 16', label: 'Magreza Grave', color: '#B71C1C' },
          { range: '16 - 16.9', label: 'Magreza Moderada', color: '#D32F2F' },
          { range: '17 - 18.4', label: 'Magreza Leve', color: '#FF7043' },
          { range: '18.5 - 24.9', label: 'Peso Normal', color: '#4CAF50' },
          { range: '25 - 29.9', label: 'Sobrepeso', color: '#FFB300' },
          { range: '30 - 34.9', label: 'Obesidade Grau I', color: '#F4511E' },
          { range: '35 - 39.9', label: 'Obesidade Grau II', color: '#E64A19' },
          { range: '>= 40', label: 'Obesidade Grau III', color: '#C62828' },
        ].map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.range}</Text>
            <Text style={[styles.tableCell, { color: item.color, fontWeight: '500' }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  header: {
    backgroundColor: '#1E88E5',
    paddingVertical: 22,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },

  headerText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },

  logoutButton: { position: 'absolute', right: 15, padding: 5 },
  logoutText: { color: '#FFEB3B', fontSize: 16, fontWeight: 'bold' },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },

  label: { fontSize: 16, color: '#424242', fontWeight: '600', marginBottom: 6, marginTop: 10 },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: '#FAFAFA'
  },

  button: {
    backgroundColor: '#1E88E5',
    padding: 15,
    borderRadius: 8,
    marginTop: 25,
    alignItems: 'center',
  },

  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  resultCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },

  resultTitle: { fontSize: 18, fontWeight: '600', color: '#1E88E5', marginBottom: 10 },

  resultDisplay: { alignItems: 'center' },
  resultText: { fontSize: 48, fontWeight: 'bold', marginBottom: 5 },
  classificationText: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  placeholderText: { fontSize: 16, color: '#757575', textAlign: 'center' },

  errorText: {
    color: '#C62828',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },

  table: { backgroundColor: '#FFF', borderRadius: 12, marginHorizontal: 20, padding: 15, marginBottom: 30 },
  tableTitle: { fontSize: 18, fontWeight: 'bold', color: '#424242', marginBottom: 10, textAlign: 'center' },

  tableRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#BDBDBD',
    marginBottom: 5,
  },

  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  tableCell: { flex: 1, fontSize: 14, color: '#616161' },
  tableCellHeader: { flex: 1, fontSize: 15, fontWeight: 'bold', color: '#424242' },
});
