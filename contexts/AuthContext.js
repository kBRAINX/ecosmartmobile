import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement de l'application
    checkAuthStatus();
  }, []);

  // Vérifier s'il existe un token d'authentification stocké
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      // Dans une application réelle, vous récupéreriez un token JWT stocké
      const storedToken = await SecureStore.getItemAsync('userToken');

      if (storedToken) {
        // Vérifier la validité du token et récupérer les informations de l'utilisateur
        // Dans cet exemple, nous simulons une vérification réussie
        setToken(storedToken);

        // Simuler l'obtention des données utilisateur à partir d'une API
        const mockUser = {
          id: '123',
          name: 'Alex Dupont',
          email: 'alex.dupont@example.com',
          phone: '+33 6 12 34 56 78',
          avatar: 'https://via.placeholder.com/150',
          points: 750,
          level: 'Éco-héros',
          joinDate: '2024-09-15',
        };

        setUser(mockUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion utilisateur
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Dans une application réelle, vous feriez un appel API pour authentifier l'utilisateur
      // et obtenir un token JWT

      // Simulons une réponse d'API
      const mockResponse = {
        success: true,
        token: 'mock_jwt_token_123456789',
        user: {
          id: '123',
          name: 'Alex Dupont',
          email: email,
          phone: '+33 6 12 34 56 78',
          avatar: 'https://via.placeholder.com/150',
          points: 750,
          level: 'Éco-héros',
          joinDate: '2024-09-15',
        }
      };

      if (mockResponse.success) {
        // Stocker le token dans le stockage sécurisé
        await SecureStore.setItemAsync('userToken', mockResponse.token);

        // Mettre à jour l'état
        setToken(mockResponse.token);
        setUser(mockResponse.user);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        return {
          success: false,
          message: 'Identifiants incorrects. Veuillez réessayer.'
        };
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return {
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Inscription utilisateur
  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Dans une application réelle, vous feriez un appel API pour créer un nouvel utilisateur

      // Simulons une réponse d'API
      const mockResponse = {
        success: true,
        message: 'Inscription réussie'
      };

      return mockResponse;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return {
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Déconnexion utilisateur
  const logout = async () => {
    try {
      // Supprimer le token du stockage sécurisé
      await SecureStore.deleteItemAsync('userToken');

      // Réinitialiser l'état
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la déconnexion. Veuillez réessayer.'
      );
    }
  };

  // Mise à jour du profil utilisateur
  const updateProfile = async (updatedData) => {
    setIsLoading(true);
    try {
      // Dans une application réelle, vous feriez un appel API pour mettre à jour les informations de l'utilisateur

      // Simulons une mise à jour réussie
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return {
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Réinitialisation du mot de passe
  const resetPassword = async (email) => {
    try {
      // Dans une application réelle, vous feriez un appel API pour envoyer un email de réinitialisation

      // Simulons une réponse d'API
      return {
        success: true,
        message: 'Un email de réinitialisation a été envoyé à votre adresse email.'
      };
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      return {
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
      };
    }
  };

  // Vérifier si le token est valide
  const verifyToken = async () => {
    try {
      // Dans une application réelle, vous feriez un appel API pour vérifier la validité du token

      // Simulons une vérification réussie
      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        resetPassword,
        verifyToken,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
