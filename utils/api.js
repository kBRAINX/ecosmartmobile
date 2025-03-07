import mockData from '../constants/mockData';

// Simulations de délais
const NETWORK_DELAY = 800;

// Classe pour les erreurs API
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Simuler les délais réseau
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Service utilisateur
export const userService = {
  // Récupérer le profil utilisateur
  getUserProfile: async (userId) => {
    await delay(NETWORK_DELAY);
    const user = mockData.users.find(u => u.id === userId);
    if (!user) throw new ApiError('Utilisateur non trouvé', 404);
    return user;
  },

  // Mettre à jour le profil
  updateUserProfile: async (userId, userData) => {
    await delay(NETWORK_DELAY);
    // Dans une application réelle, nous mettrions à jour les données
    return { ...userData, id: userId };
  }
};

// Service de déchets
export const wasteService = {
  // Récupérer les types de déchets
  getWasteTypes: async () => {
    await delay(NETWORK_DELAY);
    return mockData.wasteTypes;
  },

  // Simuler l'analyse d'une image
  analyzeWaste: async (imageUri) => {
    await delay(NETWORK_DELAY * 2);
    // Choisir un type de déchet aléatoire
    const randomIndex = Math.floor(Math.random() * mockData.wasteTypes.length);
    const detectedWaste = mockData.wasteTypes[randomIndex];

    // Générer une confiance aléatoire
    const confidence = Math.random() * 30 + 70; // Entre 70 et 100

    // Trouver une poubelle proche qui accepte ce type de déchet
    const nearestBin = mockData.wasteBins.find(bin => bin.types.includes(detectedWaste.id));

    return {
      wasteType: detectedWaste,
      confidence,
      nearestBin
    };
  }
};

// Service de carte
export const mapService = {
  // Récupérer les poubelles
  getBins: async () => {
    await delay(NETWORK_DELAY);
    return mockData.wasteBins;
  },

  // Récupérer une poubelle spécifique
  getBin: async (binId) => {
    await delay(NETWORK_DELAY);
    const bin = mockData.wasteBins.find(b => b.id === binId);
    if (!bin) throw new ApiError('Poubelle non trouvée', 404);
    return bin;
  }
};

// Service de sensibilisation
export const awarenessService = {
  // Récupérer les vidéos
  getVideos: async () => {
    await delay(NETWORK_DELAY);
    return mockData.awarenessVideos;
  },

  // Récupérer une vidéo spécifique
  getVideo: async (videoId) => {
    await delay(NETWORK_DELAY);
    const video = mockData.awarenessVideos.find(v => v.id === videoId);
    if (!video) throw new ApiError('Vidéo non trouvée', 404);
    return video;
  },

  // Récupérer les quiz
  getQuizzes: async () => {
    await delay(NETWORK_DELAY);
    return mockData.quizzes;
  },

  // Récupérer un quiz spécifique
  getQuiz: async (quizId) => {
    await delay(NETWORK_DELAY);
    const quiz = mockData.quizzes.find(q => q.id === quizId);
    if (!quiz) throw new ApiError('Quiz non trouvé', 404);
    return quiz;
  }
};

// Service de transaction
export const transactionService = {
  // Récupérer les transactions d'un utilisateur
  getUserTransactions: async (userId) => {
    await delay(NETWORK_DELAY);
    return mockData.transactions.filter(t => t.userId === userId);
  },

  // Créer une demande de retrait
  createWithdrawal: async (userId, data) => {
    await delay(NETWORK_DELAY * 2);

    const { amount, method, phoneNumber } = data;

    // Vérifier si l'utilisateur a assez de points
    const user = mockData.users.find(u => u.id === userId);
    if (!user) throw new ApiError('Utilisateur non trouvé', 404);

    const pointsNeeded = amount * 5; // 1 XAF = 5 points
    if (user.points < pointsNeeded) {
      throw new ApiError('Points insuffisants', 400);
    }

    // Créer une transaction
    const transaction = {
      id: `tx-${Date.now()}`,
      userId,
      type: 'withdrawal',
      amount,
      points: pointsNeeded,
      method,
      status: 'completed',
      timestamp: new Date().toISOString(),
      reference: `${method.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 100000)}`
    };

    return transaction;
  }
};
