// app/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mockData from '../constants/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    const checkUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const userData = JSON.parse(userString);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simuler une authentification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Pour la démo, on accepte n'importe quel email/mot de passe
      // et on utilise le premier utilisateur des données mockées
      const userData = mockData.users[0];

      // Stocker l'utilisateur dans AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      // Mettre à jour l'état
      setUser(userData);
      return userData;
    } catch (error) {
      setError(error.message || 'Une erreur est survenue lors de la connexion');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simuler une inscription
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Créer un nouvel utilisateur
      const newUser = {
        id: `u${Date.now()}`,
        name: userData.name,
        email: userData.email,
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

      // Stocker l'utilisateur dans AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(newUser));

      // Mettre à jour l'état
      setUser(newUser);
      return newUser;
    } catch (error) {
      setError(error.message || 'Une erreur est survenue lors de l\'inscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Supprimer l'utilisateur d'AsyncStorage
      await AsyncStorage.removeItem('user');
      // Réinitialiser l'état
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData) => {
    try {
      setIsLoading(true);
      // Mettre à jour l'utilisateur dans AsyncStorage
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      // Mettre à jour l'état
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
