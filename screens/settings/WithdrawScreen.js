// app/screens/settings/WithdrawScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, TextInput, Button, Divider, RadioButton, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import mockData from '../../constants/mockData';

export default function WithdrawScreen() {
  const [user, setUser] = useState(null);
  const [withdrawalMethods, setWithdrawalMethods] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    // Charger les données
    setTimeout(() => {
      setUser(mockData.users[0]);
      setWithdrawalMethods(mockData.withdrawalMethods);
      setIsLoading(false);
    }, 500);
  }, []);

  const validateFields = () => {
    if (!withdrawAmount || !selectedMethod || !phoneNumber) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return false;
    }

    const amount = parseInt(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erreur', 'Montant invalide');
      return false;
    }

    // Vérifier que l'utilisateur a suffisamment de points
    const pointsNeeded = amount * 5; // 1 XAF = 5 points
    if (user && pointsNeeded > user.points) {
      Alert.alert('Erreur', 'Vous n\'avez pas assez de points');
      return false;
    }

    // Vérifier que le montant est dans les limites
    const method = withdrawalMethods.find(m => m.id === selectedMethod);
    if (method) {
      if (amount < method.minAmount) {
        Alert.alert('Erreur', `Le montant minimum est de ${method.minAmount} XAF`);
        return false;
      }
      if (amount > method.maxAmount) {
        Alert.alert('Erreur', `Le montant maximum est de ${method.maxAmount} XAF`);
        return false;
      }
    }

    // Valider le format du numéro de téléphone
    if (!/^\d{9}$/.test(phoneNumber.replace(/\s/g, ''))) {
      Alert.alert('Erreur', 'Numéro de téléphone invalide');
      return false;
    }

    return true;
  };

  const handleWithdraw = () => {
    if (!validateFields()) return;

    setIsProcessing(true);

    // Simuler une transaction
    setTimeout(() => {
      const amount = parseInt(withdrawAmount);
      const pointsUsed = amount * 5;
      const method = withdrawalMethods.find(m => m.id === selectedMethod);

      // Créer les détails de la transaction
      const transaction = {
        id: `tx-${Date.now()}`,
        amount: amount,
        points: pointsUsed,
        method: selectedMethod,
        methodName: method.name,
        phoneNumber: phoneNumber,
        timestamp: new Date().toISOString(),
        reference: `${method.name.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 100000)}`,
        fee: amount * (method.fee / 100),
        netAmount: amount * (1 - method.fee / 100)
      };

      // Mettre à jour l'utilisateur
      setUser(prev => ({
        ...prev,
        points: prev.points - pointsUsed
      }));

      setTransactionDetails(transaction);
      setIsProcessing(false);
      setSuccessModalVisible(true);
    }, 2000);
  };

  const resetForm = () => {
    setWithdrawAmount('');
    setSelectedMethod('');
    setPhoneNumber('');
    setSuccessModalVisible(false);
  };

  const calculateFee = () => {
    if (!withdrawAmount || !selectedMethod) return 0;

    const amount = parseInt(withdrawAmount);
    if (isNaN(amount)) return 0;

    const method = withdrawalMethods.find(m => m.id === selectedMethod);
    if (!method) return 0;

    return amount * (method.fee / 100);
  };

  const calculateNetAmount = () => {
    if (!withdrawAmount) return 0;

    const amount = parseInt(withdrawAmount);
    if (isNaN(amount)) return 0;

    return amount - calculateFee();
  };

  if (isLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.balanceCard}>
          <Card.Content style={styles.balanceContent}>
            <View style={styles.balanceHeader}>
              <Ionicons name="wallet-outline" size={24} color="#16a34a" />
              <Text style={styles.balanceHeaderText}>Solde disponible</Text>
            </View>
            <Text style={styles.balanceAmount}>{user.points} points</Text>
            <Text style={styles.balanceEquivalent}>
              Équivalent à {Math.floor(user.points / 5).toLocaleString()} XAF
            </Text>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Convertir mes points</Text>

        <Card style={styles.formCard}>
          <Card.Content>
            <View style={styles.amountInputContainer}>
              <Text style={styles.formLabel}>Montant à retirer (XAF)</Text>
              <TextInput
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="numeric"
                mode="outlined"
                placeholder="Ex: 5000"
                style={styles.textInput}
                outlineColor="#ddd"
                activeOutlineColor="#16a34a"
                disabled={isProcessing}
              />
              <Text style={styles.pointsEquivalent}>
                {withdrawAmount
                  ? `Équivalent à ${parseInt(withdrawAmount) * 5 || 0} points`
                  : 'Entrez un montant pour voir l\'équivalent en points'
                }
              </Text>
            </View>

            <Divider style={styles.divider} />

            <Text style={styles.formLabel}>Méthode de retrait</Text>
            <RadioButton.Group
              onValueChange={value => setSelectedMethod(value)}
              value={selectedMethod}
            >
              {withdrawalMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    selectedMethod === method.id && styles.selectedMethodCard
                  ]}
                  onPress={() => setSelectedMethod(method.id)}
                  disabled={isProcessing}
                >
                  <View style={styles.methodContent}>
                    <Image
                      source={{ uri: method.icon }}
                      style={styles.methodIcon}
                    />
                    <View style={styles.methodInfo}>
                      <Text style={styles.methodName}>{method.name}</Text>
                      <Text style={styles.methodDetails}>
                        Frais: {method.fee}% • Min: {method.minAmount} XAF •
                        Délai: {method.processingTime}
                      </Text>
                    </View>
                    <RadioButton
                      value={method.id}
                      disabled={isProcessing}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </RadioButton.Group>

            <Divider style={styles.divider} />

            <View>
              <Text style={styles.formLabel}>
                {selectedMethod === 'wm1'
                  ? 'Numéro MTN'
                  : selectedMethod === 'wm2'
                    ? 'Numéro Orange'
                    : 'Numéro de carte'
                }
              </Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                mode="outlined"
                placeholder={selectedMethod === 'wm3'
                  ? '1234 5678 9012 3456'
                  : '6XX XXX XXX'
                }
                keyboardType="phone-pad"
                style={styles.textInput}
                outlineColor="#ddd"
                activeOutlineColor="#16a34a"
                disabled={isProcessing || !selectedMethod}
              />
            </View>

            {selectedMethod && withdrawAmount && (
              <>
                <Divider style={styles.divider} />
                <Card style={styles.summaryCard}>
                  <Card.Content>
                    <Text style={styles.summaryTitle}>Récapitulatif</Text>
                    <View style={styles.summaryRow}>
                      <Text>Montant:</Text>
                      <Text>{parseInt(withdrawAmount).toLocaleString() || 0} XAF</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text>Frais ({withdrawalMethods.find(m => m.id === selectedMethod)?.fee}%):</Text>
                      <Text>{calculateFee().toLocaleString()} XAF</Text>
                    </View>
                    <Divider style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                      <Text style={styles.totalLabel}>Total à recevoir:</Text>
                      <Text style={styles.totalAmount}>{calculateNetAmount().toLocaleString()} XAF</Text>
                    </View>
                  </Card.Content>
                </Card>
              </>
            )}

            <Button
              mode="contained"
              onPress={handleWithdraw}
              style={styles.withdrawButton}
              disabled={isProcessing || !selectedMethod || !withdrawAmount || !phoneNumber}
              loading={isProcessing}
            >
              {isProcessing ? 'Traitement en cours...' : 'Confirmer le retrait'}
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>À noter:</Text>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={16} color="#4b5563" style={styles.infoIcon} />
            <Text style={styles.infoText}>Le taux de conversion est de 5 points = 1 XAF.</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={16} color="#4b5563" style={styles.infoIcon} />
            <Text style={styles.infoText}>Des frais s'appliquent selon la méthode de retrait.</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="warning-outline" size={16} color="#f59e0b" style={styles.infoIcon} />
            <Text style={styles.infoText}>Assurez-vous que les informations de contact sont correctes.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal de succès */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={36} color="#fff" />
            </View>

            <Text style={styles.modalTitle}>Retrait réussi !</Text>
            <Text style={styles.modalSubtitle}>Votre demande a été traitée avec succès.</Text>

            {transactionDetails && (
              <View style={styles.transactionDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Montant:</Text>
                  <Text style={styles.detailValue}>{transactionDetails.amount.toLocaleString()} XAF</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Méthode:</Text>
                  <Text style={styles.detailValue}>{transactionDetails.methodName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Numéro:</Text>
                  <Text style={styles.detailValue}>{transactionDetails.phoneNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Référence:</Text>
                  <Text style={styles.detailValue}>{transactionDetails.reference}</Text>
                </View>
              </View>
            )}

            <Button
              mode="contained"
              onPress={resetForm}
              style={styles.closeButton}
            >
              Fermer
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContent: {
      padding: 16,
    },
    balanceCard: {
      marginBottom: 16,
      borderRadius: 8,
    },
    balanceContent: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    balanceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    balanceHeaderText: {
      fontSize: 16,
      marginLeft: 8,
    },
    balanceAmount: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#16a34a',
      marginTop: 8,
    },
    balanceEquivalent: {
      color: '#666',
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    formCard: {
      marginBottom: 16,
      borderRadius: 8,
    },
    formLabel: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 8,
    },
    amountInputContainer: {
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: '#fff',
    },
    pointsEquivalent: {
      fontSize: 12,
      color: '#666',
      marginTop: 4,
    },
    divider: {
      marginVertical: 16,
    },
    methodCard: {
      borderWidth: 1,
      borderColor: '#e2e8f0',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    selectedMethodCard: {
      borderColor: '#16a34a',
      backgroundColor: '#f0fdf4',
    },
    methodContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    methodIcon: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
    },
    methodInfo: {
      flex: 1,
      marginLeft: 12,
    },
    methodName: {
      fontWeight: '500',
    },
    methodDetails: {
      fontSize: 12,
      color: '#666',
    },
    summaryCard: {
      backgroundColor: '#f8fafc',
      marginBottom: 16,
    },
    summaryTitle: {
      fontWeight: '500',
      marginBottom: 8,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    summaryDivider: {
      marginVertical: 8,
    },
    totalLabel: {
      fontWeight: '500',
    },
    totalAmount: {
      fontWeight: 'bold',
      color: '#16a34a',
    },
    withdrawButton: {
      backgroundColor: '#16a34a',
    },
    infoSection: {
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 8,
      marginBottom: 24,
    },
    infoTitle: {
      fontWeight: '500',
      marginBottom: 8,
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    infoIcon: {
      marginRight: 8,
      marginTop: 2,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: '#4b5563',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
    },
    successIconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#16a34a',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    modalSubtitle: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginBottom: 16,
    },
    transactionDetails: {
      backgroundColor: '#f8fafc',
      borderRadius: 8,
      padding: 16,
      width: '100%',
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    detailLabel: {
      color: '#666',
    },
    detailValue: {
      fontWeight: '500',
    },
    closeButton: {
      width: '100%',
      backgroundColor: '#16a34a',
    },
  });
