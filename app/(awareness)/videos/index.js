import { useRouter } from 'expo-router';

export default function MyScreen() {
  const router = useRouter();

  // Navigation vers une autre page
  const goToVideoDetail = (videoId) => {
    router.push(`/(awareness)/videos/${videoId}`);
  };

  return (
    <View>
      <Button title="Voir la vidéo" onPress={() => goToVideoDetail('v1')} />
    </View>
  );
}
