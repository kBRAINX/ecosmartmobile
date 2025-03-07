import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function AwarenessScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Sensibilisation</Text>

      <TouchableOpacity
        onPress={() => router.push('/(awareness)/videos/')}
      >
        <Text>Vidéos éducatives</Text>
        <Text>
          Découvrez des vidéos sur le recyclage et l'environnement
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/(awareness)/quiz/')}
      >
        <Text>Quiz interactifs</Text>
        <Text>
          Testez vos connaissances et gagnez des points
        </Text>
      </TouchableOpacity>
    </View>
  );
}
