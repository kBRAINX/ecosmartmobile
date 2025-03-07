// app/(auth)/register.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mockData from '../../constants/mockData';

// Composants UI
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function RegisterScreen() {
  const router = useRouter();

  // État du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Modification des champs du formulaire
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Évaluer la force du mot de passe si le champ modifié est le mot de passe
    if (field === 'password') {
      evaluatePasswordStrength(value);
    }
  };

  // Évaluation de la force du mot de passe
  const evaluatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  };

  // Obtenir la couleur de la force du mot de passe
  const getStrengthColor = () => {
    if (passwordStrength < 2) return '#ef4444'; // Faible - Rouge
    if (passwordStrength < 4) return '#f59e0b'; // Moyen - Orange
    return '#16a34a'; // Fort - Vert
  };

  // Obtenir le texte de la force du mot de passe
  const getStrengthText = () => {
    if (passwordStrength < 2) return 'Faible';
    if (passwordStrength < 4) return 'Moyen';
    return 'Fort';
  };

  // Soumettre le formulaire d'inscription
  const handleSubmit = async () => {
    try {
      // Validation basique
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Tous les champs sont obligatoires');
        return;
      }

      // Validation du format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Adresse email invalide');
        return;
      }

      // Validation de la correspondance des mots de passe
      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      // Validation de la force du mot de passe
      if (passwordStrength < 3) {
        setError('Votre mot de passe est trop faible');
        return;
      }

      // Validation des conditions d'utilisation
      if (!formData.agreeTerms) {
        setError('Vous devez accepter les conditions d\'utilisation');
        return;
      }

      setIsLoading(true);

      // Simuler une requête à l'API d'inscription
      setTimeout(async () => {
        // Création d'un nouvel utilisateur pour la démo
        const newUser = {
          id: `u${Date.now()}`,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          points: 0,
          scannedWaste: 0,
          quizCompleted: 0,
          avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
          joinedDate: new Date().toISOString(),
          preferences: {
            notifications: true,
            darkMode: false,
            language: 'fr'
          }
        };

        // Dans une application réelle, on enverrait les données à un backend
        // Ici, on va simplement stocker localement pour la démo
        try {
          await AsyncStorage.setItem('user', JSON.stringify(newUser));

          // Afficher un message de succès
          Alert.alert(
            "Inscription réussie !",
            "Votre compte a été créé avec succès.",
            [
              { text: "OK", onPress: () => router.replace('/(tabs)/home') }
            ]
          );
        } catch (storageError) {
          console.error('Erreur de stockage:', storageError);
          setError('Une erreur est survenue lors de la création du compte');
        }

        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setError('Une erreur inattendue est survenue');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>
            Rejoignez EcoWaste et commencez à transformer vos déchets en opportunités
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.nameRow}>
              <Input
                label="Prénom"
                value={formData.firstName}
                onChangeText={(value) => handleChange('firstName', value)}
                placeholder="Jean"
                style={styles.nameInput}
              />

              <Input
                label="Nom"
                value={formData.lastName}
                onChangeText={(value) => handleChange('lastName', value)}
                placeholder="Dupont"
                style={styles.nameInput}
              />
            </View>

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              placeholder="jean.dupont@exemple.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Mot de passe"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              placeholder="••••••••"
              secureTextEntry
            />

            {formData.password ? (
              <View style={styles.passwordStrength}>
                <View style={styles.strengthBar}>
                  <View
                    style={[
                      styles.strengthIndicator,
                      {
                        width: `${passwordStrength * 20}%`,
                        backgroundColor: getStrengthColor()
                      }
                    ]}
                  />
                </View>
                <Text style={styles.strengthText}>
                  Force: <Text style={{ color: getStrengthColor() }}>{getStrengthText()}</Text>
                </Text>
              </View>
            ) : null}

            <Input
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              placeholder="••••••••"
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => handleChange('agreeTerms', !formData.agreeTerms)}
              activeOpacity={0.7}
            >
              <View style={styles.checkbox}>
                {formData.agreeTerms && (
                  <Ionicons name="checkmark" size={16} color="#16a34a" />
                )}
              </View>
              <Text style={styles.termsText}>
                J'accepte les{' '}
                <Text style={styles.termsLink}>conditions d'utilisation</Text>
                {' '}et la{' '}
                <Text style={styles.termsLink}>politique de confidentialité</Text>
              </Text>
            </TouchableOpacity>

            <Button
              title={isLoading ? "Création en cours..." : "Créer un compte"}
              onPress={handleSubmit}
              disabled={isLoading}
              loading={isLoading}
              style={styles.registerButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                <Ionicons name="logo-google" size={20} color="#fff" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                <Ionicons name="logo-facebook" size={20} color="#fff" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444',
    marginLeft: 8,
    flex: 1,
  },
  form: {
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    flex: 0.48,
  },
  passwordStrength: {
    marginTop: -8,
    marginBottom: 16,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  strengthIndicator: {
    height: '100%',
  },
  strengthText: {
    fontSize: 12,
    color: '#666',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  termsLink: {
    color: '#16a34a',
  },
  registerButton: {
    backgroundColor: '#16a34a',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#6b7280',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  googleButton: {
    backgroundColor: '#ea4335',
  },
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  socialButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#6b7280',
  },
  footerLink: {
    color: '#16a34a',
    fontWeight: '500',
    marginLeft: 4,
  },
});
