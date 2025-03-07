import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import mockData from '../../constants/mockData';
// Importer les composants nécessaires pour cet écran

export default function HomeScreen() {
  const router = useRouter();

  // Vos données et logique d'écran ici

  return (
    <ScrollView>
      {/* Contenu de l'écran d'accueil */}
      <Text>Écran d'accueil</Text>
    </ScrollView>
  );
}
