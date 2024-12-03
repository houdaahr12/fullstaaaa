<template>
    <div class="categories-container">
      <!-- Première ligne de catégories (3 catégories en haut) -->
      <div class="categories-row">
        <!-- Catégorie Travail -->
        <div :class="['category-box', 'travail']">
          <h3>Travail</h3>
          <div v-if="tasks.travail.length === 0">Vous n'avez pas de tâche!</div>
          <div v-else>
            <ul>
              <li v-for="task in tasks.travail" :key="task.id">{{ task.name }}</li>
            </ul>
          </div>
          <button :class="['button', 'travail']" @click="addTask('travail')">Ajouter une tâche</button>
        </div>
  
        <!-- Catégorie Personnel -->
        <div :class="['category-box', 'personnel']">
          <h3>Personnel</h3>
          <div v-if="tasks.personnel.length === 0">Vous n'avez pas de tâche!</div>
          <div v-else>
            <ul>
              <li v-for="task in tasks.personnel" :key="task.id">{{ task.name }}</li>
            </ul>
          </div>
          <button :class="['button', 'personnel']" @click="addTask('personnel')">Ajouter une tâche</button>
        </div>
  
        <!-- Catégorie Etude -->
        <div :class="['category-box', 'etude']">
          <h3>Etude</h3>
          <div v-if="tasks.etude.length === 0">Vous n'avez pas de tâche!</div>
          <div v-else>
            <ul>
              <li v-for="task in tasks.etude" :key="task.id">{{ task.name }}</li>
            </ul>
          </div>
          <button :class="['button', 'etude']" @click="addTask('etude')">Ajouter une tâche</button>
        </div>
      </div>
  
      <!-- Deuxième ligne de catégories (3 catégories en bas) -->
      <div class="categories-row">
        <!-- Catégorie Maison -->
        <div :class="['category-box', 'maison']">
          <h3>Maison</h3>
          <div v-if="tasks.maisons.length === 0">Vous n'avez pas de tâche!</div>
          <div v-else>
            <ul>
              <li v-for="task in tasks.maisons" :key="task.id">{{ task.name }}</li>
            </ul>
          </div>
          <button :class="['button', 'maison']" @click="addTask('maisons')">Ajouter une tâche</button>
        </div>
  
        <!-- Catégorie Autre -->
        <div :class="['category-box', 'autre']">
          <h3>Autre</h3>
          <div v-if="tasks.autre.length === 0">Vous n'avez pas de tâche!</div>
          <div v-else>
            <ul>
              <li v-for="task in tasks.autre" :key="task.id">{{ task.name }}</li>
            </ul>
          </div>
          <button :class="['button', 'autre']" @click="addTask('autre')">Ajouter une tâche</button>
        </div>
  
        <!-- Catégorie Loisirs -->
        <div :class="['category-box', 'loisirs']">
          <h3>Loisirs</h3>
          <div v-if="tasks.loisirs.length === 0">Vous n'avez pas de tâche!</div>
          <div v-else>
            <ul>
              <li v-for="task in tasks.loisirs" :key="task.id">{{ task.name }}</li>
            </ul>
          </div>
          <button :class="['button', 'loisirs']" @click="addTask('loisirs')">Ajouter une tâche</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'; // Pour effectuer des requêtes HTTP
  
  export default {
    data() {
      return {
        tasks: {
          travail: [],
          personnel: [],
          etude: [],
          maisons: [],
          autre: [],
          loisirs: []
        }
      };
    },
    mounted() {
      this.loadTasks(); // Charger les tâches au chargement du composant
    },
    methods: {
      // Charger les tâches depuis l'API (connexion à la base de données)
      async loadTasks() {
        try {
          // Requête pour récupérer les tâches par catégorie
          const response = await axios.get('http://localhost:3000/api/tasks'); // Exemple d'API
          this.tasks = response.data;
        } catch (error) {
          console.error("Erreur lors du chargement des tâches :", error);
        }
      },
  
      // Ajouter une tâche dans la catégorie spécifiée
      async addTask(category) {
        const taskName = prompt('Entrez le nom de la tâche:');
        if (taskName) {
          try {
            // Requête pour ajouter la tâche dans la base de données
            await axios.post('http://localhost:3000/api/tasks', {
              category: category,
              name: taskName
            });
            // Recharger les tâches après ajout
            this.loadTasks();
          } catch (error) {
            console.error("Erreur lors de l'ajout de la tâche :", error);
          }
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Container principal qui englobe tout le contenu */
  .categories-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-left: 250px; /* Espace pour la sidebar */
    padding: 20px;
    flex-grow: 1;
  }
  
  /* Organisation des catégories en lignes */
  .categories-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
  }
  
  /* Style de chaque boîte de catégorie */
  .category-box {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    margin: 10px;
    flex: 1 1 calc(33.333% - 20px); /* Prend 33% de la largeur avec des marges */
    max-width: 300px; /* Limite la largeur maximale de chaque boîte */
    box-sizing: border-box;
    transition: transform 0.3s ease-in-out;
    max-height: 350px; /* Limite la hauteur de chaque catégorie */
    overflow-y: auto; /* Scroll vertical si contenu dépasse */
    scroll-behavior: smooth; 
    background-color: #f9f9f9;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .category-box::-webkit-scrollbar {
    width: 8px;
  }
  
  .category-box::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }
  
  .category-box::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  /* Effet de survol */
  .category-box:hover {
    transform: scale(1.05);
  }
  
  /* Titre des catégories */
  .category-box h3 {
    font-size: 1.4rem;
    margin-bottom: 15px;
    color: #333;
    text-transform: uppercase;
    font-weight: bold;
  }
  
  /* Liste des tâches */
  .category-box ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .category-box ul li {
    margin: 10px 0;
    color: #333;
    font-size: 1rem;
    font-weight: 500;
  }
  
  /* Boutons d'ajout de tâche */
  .button {
    margin-top: 20px;
    padding: 10px 20px;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #922e92; /* Couleur principale */
    transition: background-color 0.3s ease-in-out;
  }
  
  .button:hover {
    background-color: #48203c3c; /* Effet de survol */
  }
  
  /* Couleur spécifique pour chaque catégorie */
  .category-box.travail {
    background-color: #cb6ce6;
  }
  
  .category-box.personnel {
    background-color: #b28cc5;
  }
  
  .category-box.etude {
    background-color: #845d8f;
  }
  
  .category-box.maison {
    background-color: #d89ed8;
  }
  
  .category-box.autre {
    background-color: #894e97;
  }
  
  .category-box.loisirs {
    background-color: #c56ab3;
  }
  
  /* Media Query pour les petits écrans (tablettes, smartphones) */
  @media screen and (max-width: 768px) {
    .categories-container {
      margin-left: 10; /* Enlever l'espace pour la sidebar */
    }
  
    .category-box {
      flex: 1 1 100%; 
      max-width: none; 
      height: auto; 
    }
  }
  </style>
  