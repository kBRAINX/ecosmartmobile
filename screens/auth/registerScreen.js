import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useTheme } from '../../hooks/useTheme';
import Colors from '../../constants/Colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Le nom est requis';

    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Format d\'email invalide';
      }
    }

    if (phone) {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Format de numéro de téléphone invalide';
      }
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Vous devez accepter les conditions d\'utilisation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simuler un appel API
    setTimeout(() => {
      setIsLoading(false);

      // Dans une vraie application, vous enregistreriez l'utilisateur ici

      Alert.alert(
        'Inscription réussie',
        'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/auth/login'),
          },
        ]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors[theme].text} />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Inscription</ThemedText>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Nom complet"
              placeholder="Entrez votre nom"
              value={name}
              onChangeText={setName}
              icon="person-outline"
              error={errors.name}
              autoCapitalize="words"
            />

            <Input
              label="Email"
              placeholder="Entrez votre email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              error={errors.email}
            />

            <Input
              label="Téléphone (optionnel)"
              placeholder="Entrez votre numéro de téléphone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              icon="call-outline"
              error={errors.phone}
            />

            <View style={styles.passwordContainer}>
              <Input
                label="Mot de passe"
                placeholder="Créez votre mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={hidePassword}
                icon="lock-closed-outline"
                error={errors.password}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setHidePassword(!hidePassword)}
              >
                <Ionicons
                  name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                  size={24}
                  color={Colors[theme].text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <Input
                label="Confirmer le mot de passe"
                placeholder="Confirmez votre mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={hideConfirmPassword}
                icon="lock-closed-outline"
                error={errors.confirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
              >
                <Ionicons
                  name={hideConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={24}
                  color={Colors[theme].text}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <View style={styles.checkboxContainer}>
                <View style={[
                  styles.checkbox,
                  acceptTerms && styles.checkboxChecked
                ]}>
                  {acceptTerms && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </View>
              <ThemedText style={styles.termsText}>
                J'accepte les <ThemedText style={styles.termsLink}>conditions d'utilisation</ThemedText> et la <ThemedText style={styles.termsLink}>politique de confidentialité</ThemedText>
              </ThemedText>
            </TouchableOpacity>

            {errors.terms && (
              <ThemedText style={styles.termsError}>{errors.terms}</ThemedText>
            )}

            <Button
              title="S'inscrire"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.registerButton}
            />
          </View>

          <View style={styles.loginContainer}>
            <ThemedText style={styles.loginText}>
              Déjà un compte ?
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <ThemedText style={styles.loginLink}>
                Se connecter
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24, // Pour équilibrer le bouton retour
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '55%',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkboxContainer: {
    marginRight: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.light.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
  },
  termsLink: {
    color: Colors.light.primary,
    fontWeight: '500',
  },
  termsError: {
    fontSize: 14,
    color: Colors.light.error,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 28,
  },
  registerButton: {
    marginTop: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginLeft: 8,
  },
});
