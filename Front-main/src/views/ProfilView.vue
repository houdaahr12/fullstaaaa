<template>
  <div class="container">
    <h2 class="heading">Mon Profil</h2>

    <div class="profile-photo-section">
      <img :src="require('@/assets/user.jpg')" alt="Photo de profil" class="profile-photo" />
      <input type="file" @change="onPhotoChange" class="input" />
      <button @click="uploadPhoto" class="login-button">Changer photo de profil</button>
    </div>

    <form @submit.prevent="saveChanges" class="form">
      <div v-if="!isEditing">
        <p>Prénom : {{ profile.name }}</p>
        <p>Nom :{{ profile.surname }}</p>
        <p>Email : {{ profile.email }}</p>
        <p>Mot de passe :   ********</p>
        <button type="button" @click="isEditing = true" class="login-button">Modifier</button>
      </div>

      <div v-if="isEditing">
        <input type="text" v-model="profile.name" placeholder="Changer le prénom" class="input" />
        <input type="text" v-model="profile.surname" placeholder="Changer le nom" class="input" />
        <input type="email" v-model="profile.email" placeholder="Changer l'email" class="input" />
        <input type="password" v-model="profile.password" placeholder="Changer le mot de passe" class="input" />
        <button type="submit" class="login-button">Enregistrer les changements</button>
        <button type="button" @click="isEditing = false" class="login-button">Annuler</button>
      </div>
    </form>
  </div>
<!-- Conteneur pour les statistiques -->
<div class="container">
  <h2 class="heading">Statistiques des tâches</h2>

  <div class="statistics">
    <div class="stat-card">
      <p>Tâches terminées : <br />{{ stats.completedTasks }} / {{ stats.totalTasks }}</p>
    </div>
    <div class="stat-card">
      <p>Tâches en cours :  <br />{{ stats.pendingTasks }}</p>
    </div>
    <div class="stat-card">
      <p>Pourcentage de réalisation : <br /> {{ stats.completionPercentage }}%</p>
    </div>
  </div>
</div>

  
  <!-- Conteneur pour le graphique -->
  <div class="container">
    <h2 class="heading">Graphique de Réalisation par Semaine</h2>
    <div class="chart-container">
      <canvas id="weeklyTasksChart"></canvas>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Chart } from "chart.js";

export default {
  data() {
    return {
      isEditing: false, // Pour savoir si on est en mode modification
      profilePhoto: "/default-profile.jpg",
      profile: {
        name: "",
        surname: "",
        email: "",
        password: "",
      },
      stats: {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        completionPercentage: 0,
      },
      weeklyStats: [], // Pour les données hebdomadaires
    };
  },
  methods: {
    async fetchProfileData() {
      try {
        const response = await axios.get("http://localhost:3000/profile", { withCredentials: true });
        console.log(response.data);
        this.profile.name = response.data.name;
        this.profile.surname = response.data.surname;
        this.profile.email = response.data.email;
      } catch (error) {
        console.error("Erreur lors du chargement des données du profil :", error);
      }
    },
    async fetchTaskStatistics() {
      try {
        const response = await axios.get("http://localhost:3000/tasks/stats", { withCredentials: true });
        const data = response.data;

        // Mettre à jour les statistiques des tâches
        this.stats.totalTasks = data.totalTasks;
        this.stats.completedTasks = data.completedTasks;
        this.stats.pendingTasks = data.pendingTasks;

        // Calculer le pourcentage de réalisation
        if (this.stats.totalTasks > 0) {
          this.stats.completionPercentage = ((this.stats.completedTasks / this.stats.totalTasks) * 100).toFixed(2);
        } else {
          this.stats.completionPercentage = 0;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques des tâches :", error);
      }
    },
    async fetchWeeklyStats() {
      try {
        const response = await axios.get("http://localhost:3000/tasks/weeklyStats", { withCredentials: true });
        this.weeklyStats = response.data; // Structure attendue : { semaine: [complet, total] }

        this.renderWeeklyChart();
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques hebdomadaires :", error);
      }
    },
    renderWeeklyChart() {
      const ctx = document.getElementById('weeklyTasksChart').getContext('2d');
      
      const labels = this.weeklyStats.map(stat => `Semaine ${stat.week}`);
      const completedTasks = this.weeklyStats.map(stat => stat.completed);
      const totalTasks = this.weeklyStats.map(stat => stat.total);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Tâches terminées',
              data: completedTasks,
              backgroundColor: 'rgba(82, 163, 255, 0.7)',
              borderColor: 'rgba(82, 163, 255, 1)',
              borderWidth: 1
            },
            {
              label: 'Tâches totales',
              data: totalTasks,
              backgroundColor: 'rgba(199, 199, 199, 0.7)',
              borderColor: 'rgba(199, 199, 199, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: Math.max(...totalTasks) + 1,
            }
          }
        }
      });
    },
    onPhotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePhoto = URL.createObjectURL(file);
      }
    },
    async uploadPhoto() {
      // Ajoute la logique pour uploader la photo
    },
    async saveChanges() {
      const updatedProfile = {};

      if (this.profile.name) updatedProfile.name = this.profile.name;
      if (this.profile.surname) updatedProfile.surname = this.profile.surname;
      if (this.profile.email) updatedProfile.email = this.profile.email;
      if (this.profile.password) updatedProfile.password = this.profile.password;

      try {
        await axios.put("http://localhost:3000/profile", updatedProfile, { withCredentials: true });
        alert("Les changements ont été enregistrés !");
      } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
      }
    },
  },
  mounted() {
    this.fetchProfileData();
    this.fetchTaskStatistics();
    this.fetchWeeklyStats(); // Récupère les statistiques hebdomadaires
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  background: #F8F9FD;
  border-radius: 50px;
  padding: 30px;
  border: 5px solid #fff;
  box-shadow: rgba(182, 133, 215, 0.878) 0px 30px 30px -20px;
  margin: 30px auto;

}

.heading {
  text-align: center;
  font-weight: 900;
  font-size: 32px;
  color: rgb(133, 16, 211);
}

.profile-photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
  box-shadow: #eccfff 0px 10px 10px -5px;
}

.input {
  width: 100%;
  background: white;
  border: none;
  padding: 15px 20px;
  border-radius: 20px;
  margin-top: 15px;
  box-shadow: #eecfff 0px 10px 10px -5px;
  border-inline: 2px solid transparent;
}

.input::placeholder {
  color: rgb(170, 170, 170);
}

.input:focus {
  outline: none;
  border-inline: 2px solid #7b12d1;
}

 
 .login-button {
   display: block;
   width: 100%;
   font-weight: bold;
   background: linear-gradient(45deg, rgb(162, 16, 211) 0%, rgb(114, 18, 209) 100%);
   color: white;
   padding: 15px;
   margin: 20px auto;
   border-radius: 20px;
   box-shadow: rgba(167, 133, 215, 0.878) 0px 20px 10px -15px;
   border: none;
   transition: all 0.2s ease-in-out;
 }
 
 .login-button:hover {
   transform: scale(1.03);
   box-shadow: rgba(179, 133, 215, 0.878) 0px 23px 10px -20px;
 }
 
 .login-button:active {
   transform: scale(0.95);
   box-shadow: rgba(174, 133, 215, 0.878) 0px 15px 10px -10px;
 }
 .statistics {
  display: flex;
  justify-content: space-between; /* Distribue les cartes sur une seule ligne */
  gap: 20px; /* Ajoute de l'espace entre les cartes */
  margin-top: 20px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: rgba(182, 133, 215, 0.4) 0px 20px 20px -10px;
  width: 30%; /* Ajustez la largeur de chaque carte */
  text-align: center;
}

.stat-card p {
  font-size: 20px;
  margin: 10px 0;
  color: gray;
}

 </style>
 