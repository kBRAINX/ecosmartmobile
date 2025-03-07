import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import Button from '../../components/ui/Button';
import UserInfo from '../../components/profile/UserInfo';
import PointsCard from '../../components/profile/PointsCard';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import Colors from '../../constants/Colors';

// Données fictives pour le profil utilisateur
const MOCK_USER = {
  id: '123',
  name: 'Alex Dupont',
  email: 'alex.dupont@example.com',
  phone: '+33 6 12 34 56 78',
  avatar: 'https://via.placeholder.com/150',
  points: 750,
  level: 'Éco-héros',
  joinDate: '2024-09-15',
  stats: {
    scans: 87,
    uploads: 23,
    quizzes: 12
  }
};

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [locationService, setLocationService] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    // Simuler un appel API
    setIsLoading(true);
    setTimeout(() => {
      setUserData(MOCK_USER);
      setIsLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Déconnecter',
          onPress: () => {
            // Dans une vraie application, appeler la fonction de déconnexion du contexte d'authentification
            // logout();

            // Rediriger vers la page de connexion
            router.replace('/auth/login');
          },
          style: 'destructive'
        }
      ]
    );
  };

  const navigateToPointsScreen = () => {
    router.push('/settings/points');
  };

  const navigateToWithdrawScreen = () => {
    router.push('/settings/withdraw');
  };

  const navigateToProfileScreen = () => {
    router.push('/settings/profile');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ThemedText>Chargement...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Profil</ThemedText>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Section profil utilisateur */}
        <UserInfo
          user={userData}
          onEditPress={navigateToProfileScreen}
        />

        {/* Section des points */}
        <PointsCard
          points={userData.points}
          level={userData.level}
          onHistoryPress={navigateToPointsScreen}
          onWithdrawPress={navigateToWithdrawScreen}
        />

        {/* Section des statistiques */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Vos statistiques</ThemedText>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="scan-outline" size={24} color={Colors[theme].primary} />
              <ThemedText style={styles.statValue}>{userData.stats.scans}</ThemedText>
              <ThemedText style={styles.statLabel}>Déchets scannés</ThemedText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="cloud-upload-outline" size={24} color={Colors[theme].primary} />
              <ThemedText style={styles.statValue}>{userData.stats.uploads}</ThemedText>
              <ThemedText style={styles.statLabel}>Photos partagées</ThemedText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="school-outline" size={24} color={Colors[theme].primary} />
              <ThemedText style={styles.statValue}>{userData.stats.quizzes}</ThemedText>
              <ThemedText style={styles.statLabel}>Quiz complétés</ThemedText>
            </View>
          </View>
        </View>

        {/* Section des paramètres */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Paramètres</ThemedText>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="notifications-outline" size={22} color={Colors[theme].text} />
              <ThemedText style={styles.settingLabel}>Notifications</ThemedText>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#d1d1d1', true: Colors[theme].primaryLight }}
              thumbColor={notifications ? Colors[theme].primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="location-outline" size={22} color={Colors[theme].text} />
              <ThemedText style={styles.settingLabel}>Service de localisation</ThemedText>
            </View>
            <Switch
              value={locationService}
              onValueChange={setLocationService}
              trackColor={{ false: '#d1d1d1', true: Colors[theme].primaryLight }}
              thumbColor={locationService ? Colors[theme].primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name={isDark ? "moon-outline" : "sunny-outline"} size={22} color={Colors[theme].text} />
              <ThemedText style={styles.settingLabel}>Mode sombre</ThemedText>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#d1d1d1', true: Colors[theme].primaryLight }}
              thumbColor={isDark ? Colors[theme].primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Section d'aide et informations */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Aide et information</ThemedText>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={22} color={Colors[theme].text} />
            <ThemedText style={styles.menuItemLabel}>Centre d'aide</ThemedText>
            <Ionicons name="chevron-forward" size={22} color={Colors[theme].text} style={styles.menuItemIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={22} color={Colors[theme].text} />
            <ThemedText style={styles.menuItemLabel}>Conditions d'utilisation</ThemedText>
            <Ionicons name="chevron-forward" size={22} color={Colors[theme].text} style={styles.menuItemIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="shield-checkmark-outline" size={22} color={Colors[theme].text} />
            <ThemedText style={styles.menuItemLabel}>Politique de confidentialité</ThemedText>
            <Ionicons name="chevron-forward" size={22} color={Colors[theme].text} style={styles.menuItemIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={22} color={Colors[theme].text} />
            <ThemedText style={styles.menuItemLabel}>À propos de l'application</ThemedText>
            <Ionicons name="chevron-forward" size={22} color={Colors[theme].text} style={styles.menuItemIcon} />
          </TouchableOpacity>
        </View>

        <Button
          title="Se déconnecter"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
          icon="log-out-outline"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLabel: {
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },
  menuItemIcon: {
    opacity: 0.5,
  },
  logoutButton: {
    margin: 16,
    marginBottom: 32,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  logoutButtonText: {
    color: '#dc3545',
  },
});
