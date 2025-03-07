import { Redirect } from 'expo-router';

export default function TabIndex() {
  // Rediriger vers l'onglet d'accueil par défaut
  return <Redirect href="/home" />;
}
