import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/home/HomeScreen';

import AwarenessScreen from '../screens/awareness/AwarenessScreen';
import VideoListScreen from '../screens/awareness/VideoListScreen';
import VideoDetailScreen from '../screens/awareness/VideoDetailScreen';
import QuizListScreen from '../screens/awareness/QuizListScreen';
import QuizDetailScreen from '../screens/awareness/QuizDetailScreen';

import ScannerScreen from '../screens/scanner/ScannerScreen';
import ResultScreen from '../screens/scanner/ResultScreen';

import MapScreen from '../screens/map/MapScreen';
import BinDetailScreen from '../screens/map/BinDetailScreen';

import SettingsScreen from '../screens/settings/SettingsScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import PointsScreen from '../screens/settings/PointsScreen';
import WithdrawScreen from '../screens/settings/WithdrawScreen';

const HomeStack = createStackNavigator();
const AwarenessStack = createStackNavigator();
const ScannerStack = createStackNavigator();
const MapStack = createStackNavigator();
const SettingsStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Accueil' }} />
    </HomeStack.Navigator>
  );
}

function AwarenessStackScreen() {
  return (
    <AwarenessStack.Navigator>
      <AwarenessStack.Screen name="AwarenessMain" component={AwarenessScreen} options={{ title: 'Sensibilisation' }} />
      <AwarenessStack.Screen name="VideoList" component={VideoListScreen} options={{ title: 'Vidéos' }} />
      <AwarenessStack.Screen name="VideoDetail" component={VideoDetailScreen} options={{ title: 'Détail de la vidéo' }} />
      <AwarenessStack.Screen name="QuizList" component={QuizListScreen} options={{ title: 'Quiz' }} />
      <AwarenessStack.Screen name="QuizDetail" component={QuizDetailScreen} options={{ title: 'Détail du quiz' }} />
    </AwarenessStack.Navigator>
  );
}

function ScannerStackScreen() {
  return (
    <ScannerStack.Navigator>
      <ScannerStack.Screen name="ScannerMain" component={ScannerScreen} options={{ title: 'Scanner' }} />
      <ScannerStack.Screen name="Result" component={ResultScreen} options={{ title: 'Résultat' }} />
    </ScannerStack.Navigator>
  );
}

function MapStackScreen() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen name="MapMain" component={MapScreen} options={{ title: 'Carte' }} />
      <MapStack.Screen name="BinDetail" component={BinDetailScreen} options={{ title: 'Point de collecte' }} />
    </MapStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} options={{ title: 'Paramètres' }} />
      <SettingsStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
      <SettingsStack.Screen name="Points" component={PointsScreen} options={{ title: 'Points' }} />
      <SettingsStack.Screen name="Withdraw" component={WithdrawScreen} options={{ title: 'Retrait' }} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Awareness') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Scanner') {
            iconName = 'camera';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Awareness" component={AwarenessStackScreen} options={{ headerShown: false }} />
      <Tab.Screen
        name="Scanner"
        component={ScannerStackScreen}
        options={{
          headerShown: false,
          tabBarButton: (props) => (
            <ScanButton {...props} />
          )
        }}
      />
      <Tab.Screen name="Map" component={MapStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsStackScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function ScanButton(props) {
  return (
    <TouchableOpacity
      {...props}
      style={{
        top: -15,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#16a34a',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
      }}>
        <Ionicons name="camera" size={30} color="white" />
      </View>
    </TouchableOpacity>
  );
}
