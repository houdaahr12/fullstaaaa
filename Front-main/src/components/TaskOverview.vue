<template>
  <div v-if="showMessage" class="task-overview">
    <div class="task-count">
      <i class="fa-solid fa-bell bell-icon"></i>
      <span v-if="taskCount === 0">Vous n'avez aucune tâche aujourd'hui</span>
      <span v-else>Vous avez {{ taskCount }} tâche(s) Aujourd'hui!</span>
    </div>

    <button class="close-btn" @click="hideMessage">
      &times;
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      taskCount: 0, // Variable to hold the count of tasks due today
      showMessage: true, // Controls the visibility of the message
    };
  },
  created() {
    // Fetch the task count due today when the component is created
    axios.get('http://localhost:3000/api/tasks/today')
      .then(response => {
        this.taskCount = response.data.taskCount;
      })
      .catch(error => {
        console.error('Error fetching task count:', error);
      });
  },
  methods: {
    hideMessage() {
      this.showMessage = false; // Hides the message
    },
  },
};
</script>

<style scoped>
.task-overview {
  background-color: #f7eaff;
  color: #491784;
  padding: 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Space between the task count and the close button */
  margin: 20px 150px 50px 300px;
  transition: transform 0.4s ease;
}

.task-count {
  font-size: 1.2rem;
  font-weight: bold;
}

.bell-icon {
  margin-right: 0.8rem;
  font-size: 1.5rem;
  transition: transform 0.2s ease;
}

.bell-icon:hover {
  color: hsl(268, 70%, 60%);
  transform: translateY(-3px) scale(1.05);
}

.task-overview .close-btn {
  border: none;
  color: #491784 !important; /* Force the color to override */
  font-size: 1.8rem;
  font-weight: bold;
  background: none; /* Ensure no background is interfering */
  cursor: pointer;
  margin: 0;
  transition: transform 0.2s ease;
}

.task-overview .close-btn:hover {
  transform: translateY(-3px) scale(1.05);
  color: #491784;
}

/* Center task-overview for medium screens and below */
@media screen and (max-width: 768px) {
  .task-overview {
    margin: 20px 50px 50px 120px;
    display: flex;
  }
}
</style>
