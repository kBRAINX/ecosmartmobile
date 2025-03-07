const mockData =
{
    "users": [
      {
        "id": "u1",
        "name": "Jean Dupont",
        "email": "jean.dupont@example.com",
        "points": 450,
        "scannedWaste": 34,
        "quizCompleted": 5,
        "avatarUrl": "/images/avatars/avatar1.png",
        "joinedDate": "2024-12-15",
        "preferences": {
          "notifications": true,
          "darkMode": false,
          "language": "fr"
        }
      },
      {
        "id": "u2",
        "name": "Marie Koné",
        "email": "marie.kone@example.com",
        "points": 1250,
        "scannedWaste": 87,
        "quizCompleted": 12,
        "avatarUrl": "/images/avatars/avatar2.png",
        "joinedDate": "2024-10-03",
        "preferences": {
          "notifications": true,
          "darkMode": true,
          "language": "fr"
        }
      }
    ],
    "wasteTypes": [
      {
        "id": "w1",
        "name": "Plastique",
        "description": "Déchets en plastique comme les bouteilles, sacs, emballages",
        "recyclingInfo": "Recyclable dans les bacs jaunes",
        "pointsPerKg": 20,
        "icon": "/images/waste/plastic.svg",
        "color": "#1E88E5"
      },
      {
        "id": "w2",
        "name": "Papier/Carton",
        "description": "Papiers, journaux, cartons, emballages papier",
        "recyclingInfo": "Recyclable dans les bacs bleus",
        "pointsPerKg": 15,
        "icon": "/images/waste/paper.svg",
        "color": "#43A047"
      },
      {
        "id": "w3",
        "name": "Verre",
        "description": "Bouteilles en verre, pots, bocaux",
        "recyclingInfo": "Recyclable dans les conteneurs verts",
        "pointsPerKg": 10,
        "icon": "/images/waste/glass.svg",
        "color": "#8E24AA"
      },
      {
        "id": "w4",
        "name": "Métal",
        "description": "Canettes, boîtes de conserve, aluminium",
        "recyclingInfo": "Recyclable dans les bacs jaunes",
        "pointsPerKg": 25,
        "icon": "/images/waste/metal.svg",
        "color": "#F9A825"
      },
      {
        "id": "w5",
        "name": "Organique",
        "description": "Déchets alimentaires, végétaux",
        "recyclingInfo": "Compostable dans les bacs marrons",
        "pointsPerKg": 5,
        "icon": "/images/waste/organic.svg",
        "color": "#6D4C41"
      },
      {
        "id": "w6",
        "name": "Électronique",
        "description": "Appareils électriques, piles, batteries",
        "recyclingInfo": "À déposer en déchetterie ou points de collecte spécifiques",
        "pointsPerKg": 30,
        "icon": "/images/waste/electronic.svg",
        "color": "#D32F2F"
      }
    ],
    "awarenessVideos": [
      {
        "id": "v1",
        "title": "Comment bien trier ses déchets",
        "description": "Apprenez les bases du tri sélectif et comment séparer correctement vos déchets pour maximiser le recyclage et protéger l'environnement.",
        "duration": "5:24",
        "thumbnailUrl": "/images/videos/tri-dechets.jpg",
        "videoUrl": "/videos/tri-dechets.mp4",
        "views": 2450,
        "likesCount": 356,
        "tags": ["tri", "recyclage", "débutant"],
        "relatedQuizId": "q1"
      },
      {
        "id": "v2",
        "title": "L'impact des déchets plastiques",
        "description": "Découvrez les conséquences environnementales des déchets plastiques et comment réduire votre empreinte écologique au quotidien.",
        "duration": "8:12",
        "thumbnailUrl": "/images/videos/impact-plastique.jpg",
        "videoUrl": "/videos/impact-plastique.mp4",
        "views": 1829,
        "likesCount": 289,
        "tags": ["plastique", "pollution", "océans"],
        "relatedQuizId": "q2"
      },
      {
        "id": "v3",
        "title": "Économie circulaire : les bases",
        "description": "Comprendre le concept d'économie circulaire et comment il peut nous aider à créer un monde plus durable en transformant nos déchets en ressources.",
        "duration": "6:45",
        "thumbnailUrl": "/images/videos/economie-circulaire.jpg",
        "videoUrl": "/videos/economie-circulaire.mp4",
        "views": 987,
        "likesCount": 154,
        "tags": ["économie circulaire", "développement durable", "ressources"],
        "relatedQuizId": "q3"
      }
    ],
    "quizzes": [
      {
        "id": "q1",
        "title": "Quiz : Maîtrisez-vous le tri des déchets ?",
        "description": "Testez vos connaissances sur le tri sélectif et le recyclage des différents types de déchets.",
        "points": 50,
        "timeLimit": 300,
        "questions": [
          {
            "id": "q1-1",
            "question": "Dans quelle poubelle doit-on jeter une bouteille en plastique ?",
            "options": [
              "Poubelle jaune",
              "Poubelle verte",
              "Poubelle grise",
              "Poubelle marron"
            ],
            "correctAnswer": 0,
            "explanation": "Les bouteilles en plastique vont dans la poubelle jaune destinée aux emballages recyclables."
          },
          {
            "id": "q1-2",
            "question": "Les emballages en carton souillés par de la nourriture sont-ils recyclables ?",
            "options": [
              "Oui, toujours",
              "Non, jamais",
              "Uniquement les parties non souillées",
              "Seulement après les avoir lavés"
            ],
            "correctAnswer": 1,
            "explanation": "Les cartons souillés par des aliments (comme les boîtes à pizza) ne sont généralement pas recyclables et doivent être jetés avec les ordures ménagères."
          },
          {
            "id": "q1-3",
            "question": "Quelle est la couleur du conteneur pour le verre en France ?",
            "options": [
              "Bleu",
              "Jaune",
              "Vert",
              "Rouge"
            ],
            "correctAnswer": 2,
            "explanation": "En France, le verre est généralement collecté dans des conteneurs de couleur verte."
          }
        ]
      },
      {
        "id": "q2",
        "title": "Quiz : Les dangers du plastique",
        "description": "Évaluez votre compréhension des risques liés aux déchets plastiques pour l'environnement.",
        "points": 75,
        "timeLimit": 400,
        "questions": [
          {
            "id": "q2-1",
            "question": "Combien de temps faut-il pour qu'une bouteille en plastique se décompose dans la nature ?",
            "options": [
              "10 à 20 ans",
              "50 à 100 ans",
              "100 à 450 ans",
              "500 à 1000 ans"
            ],
            "correctAnswer": 2,
            "explanation": "Une bouteille en plastique peut mettre entre 100 et 450 ans pour se décomposer complètement dans la nature."
          },
          {
            "id": "q2-2",
            "question": "Quelle quantité de plastique est déversée dans les océans chaque année ?",
            "options": [
              "1 million de tonnes",
              "8 millions de tonnes",
              "20 millions de tonnes",
              "50 millions de tonnes"
            ],
            "correctAnswer": 1,
            "explanation": "Environ 8 millions de tonnes de plastique finissent dans les océans chaque année."
          }
        ]
      }
    ],
    "wasteBins": [
      {
        "id": "bin1",
        "name": "Poubelle Parc Municipal",
        "location": {
          "latitude": 4.061536,
          "longitude": 9.786072
        },
        "types": ["w1", "w2", "w3", "w4"],
        "capacity": "100L",
        "lastEmptied": "2025-02-28",
        "fillLevel": 45
      },
      {
        "id": "bin2",
        "name": "Conteneur Avenue de la Liberté",
        "location": {
          "latitude": 4.063872,
          "longitude": 9.788654
        },
        "types": ["w1", "w2", "w4"],
        "capacity": "200L",
        "lastEmptied": "2025-03-02",
        "fillLevel": 20
      },
      {
        "id": "bin3",
        "name": "Point de collecte Centre Commercial",
        "location": {
          "latitude": 4.059234,
          "longitude": 9.782541
        },
        "types": ["w1", "w2", "w3", "w4", "w6"],
        "capacity": "500L",
        "lastEmptied": "2025-03-04",
        "fillLevel": 15
      },
      {
        "id": "bin4",
        "name": "Conteneur Boulevard Urbain",
        "location": {
          "latitude": 4.058193,
          "longitude": 9.785362
        },
        "types": ["w1", "w2"],
        "capacity": "150L",
        "lastEmptied": "2025-03-01",
        "fillLevel": 70
      },
      {
        "id": "bin5",
        "name": "Poubelle Marché Central",
        "location": {
          "latitude": 4.062987,
          "longitude": 9.784123
        },
        "types": ["w1", "w2", "w5"],
        "capacity": "300L",
        "lastEmptied": "2025-03-03",
        "fillLevel": 60
      }
    ],
    "withdrawalMethods": [
      {
        "id": "wm1",
        "name": "MTN Mobile Money",
        "icon": "/images/payment/mtn.svg",
        "minAmount": 500,
        "maxAmount": 100000,
        "fee": 1.5,
        "processingTime": "Instantané"
      },
      {
        "id": "wm2",
        "name": "Orange Money",
        "icon": "/images/payment/orange.svg",
        "minAmount": 500,
        "maxAmount": 100000,
        "fee": 1.2,
        "processingTime": "Instantané"
      },
      {
        "id": "wm3",
        "name": "Carte Bancaire",
        "icon": "/images/payment/card.svg",
        "minAmount": 1000,
        "maxAmount": 500000,
        "fee": 2.0,
        "processingTime": "2-3 jours ouvrables"
      }
    ],
    "scanHistory": [
      {
        "id": "s1",
        "userId": "u1",
        "wasteType": "w1",
        "quantity": 0.5,
        "pointsEarned": 10,
        "timestamp": "2025-03-02T14:30:45",
        "location": {
          "latitude": 4.060234,
          "longitude": 9.785432
        },
        "binId": "bin1"
      },
      {
        "id": "s2",
        "userId": "u1",
        "wasteType": "w2",
        "quantity": 1.2,
        "pointsEarned": 18,
        "timestamp": "2025-03-04T09:15:22",
        "location": {
          "latitude": 4.062123,
          "longitude": 9.783654
        },
        "binId": "bin5"
      },
      {
        "id": "s3",
        "userId": "u2",
        "wasteType": "w3",
        "quantity": 2.0,
        "pointsEarned": 20,
        "timestamp": "2025-03-04T16:45:12",
        "location": {
          "latitude": 4.059876,
          "longitude": 9.782345
        },
        "binId": "bin3"
      }
    ],
    "transactions": [
      {
        "id": "t1",
        "userId": "u1",
        "type": "withdrawal",
        "amount": 1000,
        "points": 200,
        "method": "wm1",
        "status": "completed",
        "timestamp": "2025-02-25T10:12:33",
        "reference": "MOMO-45678"
      },
      {
        "id": "t2",
        "userId": "u2",
        "type": "withdrawal",
        "amount": 5000,
        "points": 1000,
        "method": "wm2",
        "status": "completed",
        "timestamp": "2025-03-01T14:45:21",
        "reference": "OM-98765"
      },
      {
        "id": "t3",
        "userId": "u1",
        "type": "earning",
        "amount": 0,
        "points": 50,
        "source": "quiz_completion",
        "details": "Quiz: Maîtrisez-vous le tri des déchets ?",
        "timestamp": "2025-03-03T09:30:15"
      }
    ]
  }

  export default mockData;
