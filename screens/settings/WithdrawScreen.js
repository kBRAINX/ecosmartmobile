import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useTheme } from '../../hooks/useTheme';
import Colors from '../../constants/Colors';

// Données fictives pour les options de retrait
const WITHDRAW_OPTIONS = [
  {
    id: '1',
    title: 'Carte cadeau de 10€',
    description: 'Valable dans les magasins partenaires',
    points: 500,
    image: 'https://via.placeholder.com/100'
  },
  {
    id: '2',
    title: 'Bon d\'achat de 20€',
    description: 'Pour vos courses écologiques',
    points: 900,
    image: 'https://via.placeholder.com/100'
  },
  {
    id: '3',
    title: 'Don à une association',
    description: 'Soutenez les projets écologiques',
    points: 300,
    image: 'https://via.placeholder.com/100'
  },
  {
    id: '4',
    title: 'Réduction de 15%',
    description: 'Sur votre prochain achat écologique',
    points: 400,
    image: 'https://via.placeholder.com/100'
  }
];

export default function WithdrawScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [userPoints, setUserPoints] = useState(750);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const decrementQuantity = () => {
    const current = parseInt(quantity);
    if (current > 1) {
      setQuantity((current - 1).toString());
    }
  };

  const incrementQuantity = () => {
    const current = parseInt(quantity);
    const selected = WITHDRAW_OPTIONS.find(opt => opt.id === selectedOption);

    if (selected) {
      const maxPossible = Math.floor(userPoints / selected.points);
      if (current < maxPossible) {
        setQuantity((current + 1).toString());
      } else {
        Alert.alert(
          'Points insuffisants',
          'Vous n\'avez pas assez de points pour augmenter la quantité.'
        );
      }
    }
  };

  const handleWithdraw = () => {
    if (!selectedOption) {
      Alert.alert('Sélection requise', 'Veuillez sélectionner une option de retrait.');
      return;
    }

    if (!email) {
      Alert.alert('Email requis', 'Veuillez entrer votre email pour recevoir votre récompense.');
      return;
    }

    // Valider l'email avec une expression régulière simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Email invalide', 'Veuillez entrer une adresse email valide.');
      return;
    }

    const selected = WITHDRAW_OPTIONS.find(opt => opt.id === selectedOption);
    const totalPoints = selected.points * parseInt(quantity);

    if (totalPoints > userPoints) {
      Alert.alert('Points insuffisants', 'Vous n\'avez pas assez de points pour cette opération.');
      return;
    }

    setIsLoading(true);

    // Simuler un appel API
    setTimeout(() => {
      setIsLoading(false);

      // Mettre à jour les points de l'utilisateur
      setUserPoints(userPoints - totalPoints);

      // Afficher un message de confirmation
      Alert.alert(
        'Retrait réussi',
        `Vous avez échangé ${totalPoints} points contre ${quantity} ${selected.title}. Votre récompense sera envoyée à l'adresse email ${email}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Réinitialiser le formulaire
              setSelectedOption(null);
              setQuantity('1');

              // Retourner à l'écran précédent
              router.back();
            }
          }
        ]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors[theme].text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Échanger vos points</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.pointsInfoContainer}>
          <View style={styles.pointsBadge}>
            <Ionicons name="leaf" size={24} color="#fff" />
          </View>
          <ThemedText style={styles.pointsValue}>{userPoints}</ThemedText>
          <ThemedText style={styles.pointsLabel}>points disponibles</ThemedText>
        </View>

        <ThemedText style={styles.sectionTitle}>Options d'échange</ThemedText>

        <View style={styles.optionsContainer}>
          {WITHDRAW_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedOption === option.id && styles.selectedOption
              ]}
              onPress={() => handleOptionSelect(option.id)}
            >
              <Image source={{ uri: option.image }} style={styles.optionImage} />
              <View style={styles.optionInfo}>
                <ThemedText style={styles.optionTitle}>{option.title}</ThemedText>
                <ThemedText style={styles.optionDescription}>{option.description}</ThemedText>
                <View style={styles.optionPoints}>
                  <Ionicons name="leaf" size={16} color={Colors[theme].primary} />
                  <ThemedText style={styles.optionPointsText}>{option.points} points</ThemedText>
                </View>
              </View>
              {selectedOption === option.id && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color={Colors[theme].primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedOption && (
          <View style={styles.formContainer}>
            <ThemedText style={styles.formTitle}>Finaliser l'échange</ThemedText>

            <View style={styles.quantityContainer}>
              <ThemedText style={styles.quantityLabel}>Quantité:</ThemedText>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={decrementQuantity}
                >
                  <Ionicons name="remove" size={20} color={Colors[theme].text} />
                </TouchableOpacity>
                <ThemedText style={styles.quantityValue}>{quantity}</ThemedText>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={incrementQuantity}
                >
                  <Ionicons name="add" size={20} color={Colors[theme].text} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.totalContainer}>
              <ThemedText style={styles.totalLabel}>Total:</ThemedText>
              <View style={styles.totalPoints}>
                <Ionicons name="leaf" size={18} color={Colors[theme].primary} />
                <ThemedText style={styles.totalPointsValue}>
                  {WITHDRAW_OPTIONS.find(opt => opt.id === selectedOption).points * parseInt(quantity)} points
                </ThemedText>
              </View>
            </View>

            <Input
              label="Email de réception"
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              icon="mail-outline"
            />

            <Button
              title={isLoading ? "Traitement en cours..." : "Échanger maintenant"}
              onPress={handleWithdraw}
              disabled={isLoading}
              style={styles.withdrawButton}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24, // Pour équilibrer le bouton retour
  },
  scrollContainer: {
    flex: 1,
  },
  pointsInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  pointsBadge: {
    backgroundColor: Colors.light.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 4,
  },
  pointsLabel: {
    fontSize: 16,
    opacity: 0.7,
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  optionsContainer: {
    paddingHorizontal: 16,
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  optionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  optionPoints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionPointsText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  checkmark: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 40,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  quantityButton: {
    padding: 8,
    borderWidth: 0,
  },
  quantityValue: {
    minWidth: 40,
    textAlign: 'center',
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPoints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalPointsValue: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  withdrawButton: {
    marginTop: 16,
  },
});
