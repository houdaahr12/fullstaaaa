<template>
    <div class="container">
      <!-- Box for "New Task" -->
      <div class="title-box">
        <h1 class="title">Nouvelle tâche</h1>
        <button class="close-btn" @click="hideMessage">X</button>
      </div>
  
      <!-- Form box -->
      <div class="form-box">
        <form @submit.prevent="handleSubmit">
          <!-- Task Name Field with violet border -->
          <div class="form-group">
            <label for="taskName">Nom de la tâche</label>
            <div class="input-box">
                <input type="text" id="taskName" v-model="taskName" />
            </div>
          </div>
  
          <!-- Category Selection with clickable boxes -->
          <div class="form-group">
            <label>Catégorie</label>
            <div class="category-box">
              <div
                v-for="category in categories"
                :key="category"
                :class="['category', { selected: task.category === category }]"
                @click="task.category = category"
              >
                {{ category }}
              </div>
            </div>
          </div>
    <!-- Date and Time Selection -->
    <div class="form-group">
          <label for="date">Date (Optionnel)</label>
          <div class="input-box">
            <input type="date" id="date" v-model="task.date" />
          </div>
        </div>
        <div class="form-group">
          <label for="time">Heure (Optionnel)</label>
          <div class="input-box">
            <input type="time" id="time" v-model="task.time" />
          </div>
        </div>
          <!-- Importance Level Selection -->
          <div class="form-group">
            <label>Niveau d'importance</label>
            <div class="importance-boxes">
              <div 
                class="importance-box"
                :class="{ selected: task.importance === 'less' }"
                @click="selectImportance('less')"
              >
                Moins important
              </div>
              <div 
                class="importance-box"
                :class="{ selected: task.importance === 'normal' }"
                @click="selectImportance('normal')"
              >
                Important
              </div>
              <div 
                class="importance-box"
                :class="{ selected: task.importance === 'urgent' }"
                @click="selectImportance('urgent')"
              >
                Urgent
              </div>
            </div>
  
            <!-- Progress bar that changes based on importance -->
            <div class="progress-bar">
              <div
                class="progress"
                :style="{ width: progressBarWidth + '%' }"
              >
                <span class="progress-label">
                  {{ importanceLabel }}
                </span>
              </div>
            </div>
          </div>
  
          <!-- Buttons: Add and Cancel -->
          <div class="button-group">
            <button type="submit" class="btn btn-cancel">Annuler</button>
            <button type="button" @click="cancel" class="btn btn-add">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        task: {
          name: '',
          category: '',
          importance: 'less', // Default importance
        },
        categories: ['Travail', 'Personnel', 'Etude', 'Maison', 'Autre', 'Loisirs'], // Added "Loisirs"
        progressBarWidth: 33, // Default progress
        importanceLabel: 'Moins important', // Default label
        selectedDate: this.$route.query.date, // Retrieving date from the route query parameter
      };
    },
    mounted() {
      console.log('Date reçue dans AddView:', this.selectedDate); // Verifying if date is received correctly
    },
    methods: {
      handleSubmit() {
        console.log('Tâche ajoutée:', this.task);
        this.resetForm();
      },
      hideMessage() {
        this.showMessage=false;
      },
      selectImportance(importance) {
        this.task.importance = importance;
        if (importance === 'less') {
          this.progressBarWidth = 33;
          this.importanceLabel = 'Moins important';
        } else if (importance === 'normal') {
          this.progressBarWidth = 66;
          this.importanceLabel = 'Important';
        } else if (importance === 'urgent') {
          this.progressBarWidth = 100;
          this.importanceLabel = 'Urgent';
        }
      },
      closeBox() {
        console.log('Fermer la boîte "Nouvelle tâche"');
      },
      resetForm() {
        this.task.name = '';
        this.task.category = '';
        this.task.importance = 'less';
        this.progressBarWidth = 33;
        this.importanceLabel = 'Moins important';
      }
    },
  };
  </script>
  
  <style scoped>
  /* Container for centering the form */
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 115vh;
    background-color: #f5f5f5;
    width: 100%;
    padding: 20px;
  }
  
  /* Box for "New Task" */
  .title-box {
    background-color: #e8e2eb; /* Light purple */
    width: 100%;
    max-width: 600px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .title {
    font-size: 24px;
    color: #6a1b9a;
  }
  
  .close-btn {
    background-color: #e8e2eb;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #6a1b9a;
  }
  
  /* Form box */
  .form-box {
    background-color: #e8e2eb; /* Light purple */
    padding: 30px;
    border-radius: 8px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  /* Form fields */
  .form-group {
    margin-bottom: 20px;
    text-align: left;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
    color: #6a1b9a;
  }
  
  /* Task name input box with violet border */
  .input-box {
    border: 2px solid #6a1b9a;
    padding: 5px;
    border-radius: 10px;
  }
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: none;
    box-sizing: border-box;
  }
  
  /* Category selection: space between boxes (3 items per row) */
  .category-box {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 10px;
  }
  
  .category {
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    color: #6a1b9a;
    border: 2px solid #6a1b9a;
    transition: background-color 0.3s ease;
    text-align: center;
  }
  
  .category:hover {
    background-color: #cb6ce6;
  }
  
  .category.selected {
    background-color: #6a1b9a;
    color: #fff;
  }
  
  /* Importance level selection: adjusted spacing */
  .importance-boxes {
    display: flex;
    justify-content: space-evenly;
    margin-top: 1px;
    gap: 10px;
  }
  
  .importance-box {
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    color: #6a1b9a;
    border: 2px solid #6a1b9a;
    transition: background-color 0.3s ease;
    width: 30%;
    text-align: center;
  }
  
  .importance-box:hover {
    background-color: #cb6ce6;
  }
  
  .importance-box.selected {
    background-color: #6a1b9a;
    color: white;
  }
  
  /* Progress bar - increased width */
  .progress-bar {
    background-color: #ddd;
    border-radius: 5px;
    height: 30px;
    margin-top: 15px;
    width: 100%;
  }
  
  .progress {
    background-color: #6a1b9a;
    height: 100%;
    border-radius: 5px;
    position: relative;
  }
  
  .progress-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    font-weight: bold;
  }
  
  /* Buttons */
  .button-group {
    display: flex;
    justify-content: flex-end; /* Align buttons to the right */
    margin-top: 20px;
    gap: 10px;
  }
  
  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-add {
    background-color: #6a1b9a;
    color: white;
  }
  
  .btn-cancel {
    background-color: #b93030;
    color: white;
  }
  
  .btn:hover {
    opacity: 0.9;
  }
  
  /* Responsive adjustments */
  @media (max-width: 600px) {
    .category-box {
      grid-template-columns: 1fr 1fr;
    }
  
    .importance-boxes {
      flex-direction: column;
      align-items: center;
    }
  
    .importance-box {
      width: 80%;
    }
  
    .category {
      width: 100%;
    }
  
    .button-group {
      flex-direction: column;
      align-items: center;
    }
  }
  </style>
  