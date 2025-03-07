import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import VideosListScreen from './awareness/VideosListScreen';
import VideoDetailScreen from './awareness/VideoDetailScreen';
import QuizListScreen from './awareness/QuizListScreen';
import QuizDetailScreen from './awareness/QuizDetailScreen';
import QuizResultScreen from './awareness/QuizResultScreen';

const Tab = createMaterialTopTabNavigator();
const VideosStack = createStackNavigator();
const QuizStack = createStackNavigator();

function VideosStackScreen() {
  return (
    <VideosStack.Navigator>
      <VideosStack.Screen
        name="VideosList"
        component={VideosListScreen}
        options={{ headerShown: false }}
      />
      <VideosStack.Screen
        name="VideoDetail"
        component={VideoDetailScreen}
        options={{ title: 'Vidéo' }}
      />
    </VideosStack.Navigator>
  );
}

function QuizStackScreen() {
  return (
    <QuizStack.Navigator>
      <QuizStack.Screen
        name="QuizList"
        component={QuizListScreen}
        options={{ headerShown: false }}
      />
      <QuizStack.Screen
        name="QuizDetail"
        component={QuizDetailScreen}
        options={{ title: 'Quiz' }}
      />
      <QuizStack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{ title: 'Résultat', headerShown: false }}
      />
    </QuizStack.Navigator>
  );
}

export default function AwarenessScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#16a34a',
        tabBarIndicatorStyle: { backgroundColor: '#16a34a' },
      }}
    >
      <Tab.Screen
        name="Videos"
        component={VideosStackScreen}
        options={{
          tabBarLabel: 'Vidéos',
          tabBarIcon: ({ color }) => (
            <Ionicons name="play-circle-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={QuizStackScreen}
        options={{
          tabBarLabel: 'Quiz',
          tabBarIcon: ({ color }) => (
            <Ionicons name="help-circle-outline" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
