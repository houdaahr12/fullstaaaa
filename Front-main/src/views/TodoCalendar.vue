<template>
    <div class="calendar-container">
      <!-- En-tête du calendrier -->
      <div class="calendar-header">
        <button @click="prevMonth">&lt;</button>
        <span>{{ monthNames[currentMonth] }} {{ currentYear }}</span>
        <button @click="nextMonth">&gt;</button>
      </div>
  
      <!-- Grille du calendrier -->
      <div class="calendar-grid">
        <div class="day-name" v-for="day in dayNames" :key="day">{{ day }}</div>
        <div
          class="day"
          v-for="day in daysInMonth"
          :key="day.date"
          :class="{ 'is-today': day.isToday, 'is-empty': !day.date }"
          @click="selectDate(day.date)"
        >
          {{ day.day }}
        </div>
      </div>
  
      <!-- Affichage des tâches pour la date sélectionnée -->
      <div v-if="selectedDate" class="selected-date-box">
        <div class="selected-date">
          <h2>Tâches pour {{ formatSelectedDate(selectedDate) }}</h2>
          <ul>
            <li v-for="(task, index) in tasks" :key="index">{{ task }}</li>
          </ul>
          <button @click="goToAddView">Ajouter une nouvelle tâche</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth(),
        selectedDate: null,
        tasks: [],
        dayNames: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"], // Jours de la semaine
      };
    },
    computed: {
      daysInMonth() {
        const days = [];
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const lastDate = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
  
        for (let i = 0; i < firstDay; i++) {
          days.push({ day: "", date: null });
        }
  
        for (let i = 1; i <= lastDate; i++) {
          const date = new Date(this.currentYear, this.currentMonth, i);
          days.push({
            day: i,
            date: this.formatDate(date),
            isToday: this.isToday(date),
          });
        }
  
        return days;
      },
      monthNames() {
        return [
          "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
          "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
        ];
      },
    },
    methods: {
      isToday(date) {
        const today = new Date();
        return (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
        );
      },
      formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      },
      formatSelectedDate(date) {
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
      },
      prevMonth() {
        if (this.currentMonth === 0) {
          this.currentMonth = 11;
          this.currentYear--;
        } else {
          this.currentMonth--;
        }
      },
      nextMonth() {
        if (this.currentMonth === 11) {
          this.currentMonth = 0;
          this.currentYear++;
        } else {
          this.currentMonth++;
        }
      },
      selectDate(date) {
        this.selectedDate = date;
        this.loadTasksForDate(date);
      },
      loadTasksForDate(date) {
        const storedTasks = localStorage.getItem(date);
        this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
      },
      goToAddView() {
        if (this.selectedDate) {
          this.$router.push({
            name: "AddView",
            query: { date: this.selectedDate }, // Paramètre de date
          });
        } else {
          alert("Veuillez sélectionner une date avant d'ajouter une tâche !");
        }
      }
    },
  };
  </script>
  
  
  <style scoped>
  .calendar-container {
    width: 100%;
    max-width: 500px;
    margin: auto;
    text-align: center;
    font-family: Arial, sans-serif;
    padding: 10px;
    box-sizing: border-box;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;
    flex-wrap: wrap; /* Pour permettre la flexibilité sur petits écrans */
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }

  .day-name {
    font-weight: bold;
    color: #555;
    font-size: 14px;
  }

  .day {
    padding: 15px;
    font-size: 14px;
    border: 1px solid #1b1919;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
  }

  .day.is-empty {
    background-color: #f9f9f9;
    pointer-events: none;
  }

  .day:hover {
    background-color: #9773a3;
  }

  .is-today {
    background-color: #b83697;
    color: white;
  }

  .selected-date-box {
    margin-top: 20px;
    font-size: 18px;
    color: #333;
  }

  button {
    padding: 10px 15px;
    margin-top: 10px;
    background-color: #671b6d;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }

  button:hover {
    background-color: #a65dc7;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .calendar-grid {
      grid-template-columns: repeat(4, 1fr); /* Réduction du nombre de colonnes */
    }

    .day {
      padding: 10px;
      font-size: 12px;
    }

    .day-name {
      font-size: 12px;
    }

    .calendar-header {
      flex-direction: column; /* Header en colonne pour petits écrans */
    }
  }

  @media (max-width: 480px) {
    .calendar-grid {
      grid-template-columns: repeat(2, 1fr); /* Encore moins de colonnes pour les très petits écrans */
    }

    .day {
      padding: 8px;
      font-size: 10px;
    }

    .selected-date-box {
      font-size: 14px;
    }

    button {
      padding: 8px 10px;
      font-size: 12px;
    }
  }
</style>
