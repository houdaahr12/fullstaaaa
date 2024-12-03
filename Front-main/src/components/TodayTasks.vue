<template>
  <div class="today-tasks-card">
    <div class="header d-flex justify-content-between align-items-center fw-bold">
      <h3>Tâches d’aujourd’hui</h3>
      <button class="add" @click="goToAddTask">+</button>
    </div>
    <div class="task-list">
      <TaskDisplay
        v-for="task in sortedTasks"
        :key="task.id"
        :task="task"
        @update-task="updateTaskStatus" 
        @delete-task="handleDeleteTask"
        @trigger-edit="openEditPopup" 
      />
      <EditTask
        v-if="showEditPopup"
        :task="taskToEdit"
        @update-task="updateTaskStatus"
        @close="closeEditPopup"
      />
    </div>
  </div>
</template>

<script>
import TaskDisplay from "./TaskDisplay.vue";
import EditTask from './EditTask.vue';

import axios from 'axios';  // Import axios to make HTTP requests

export default {
  name: 'TodayTasks',
  components: {
    TaskDisplay,
    EditTask
  },
  props: {
    task: Object,
  },
  data() {
    return {
      showEditPopup: false, // Controls visibility of the edit popup
      taskToEdit: null, // Stores the task being edited
      tasks: [],  // Empty array that will be filled with data from the backend
    };
  },
  mounted() {
    // Fetch tasks from the backend
    axios.get('http://localhost:3000/api/tasks')
      .then(response => {
        this.tasks = response.data;  // Fill the tasks array with the fetched data
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  },
  computed: {
    sortedTasks() {
      return [
        ...this.tasks.filter(task => !task.completed),
        ...this.tasks.filter(task => task.completed),
      ];
    },
  },
  methods: {
    goToAddTask() {
      this.$router.push('/add'); // Navigate to the AddTask component
    },
    openEditPopup(task) {
      this.taskToEdit = task; // Set the selected task
      this.showEditPopup = true; // Show the popup
    },
    closeEditPopup() {
      this.showEditPopup = false; // Hide the popup
      this.taskToEdit = null; // Clear the selected task
    },
    updateTaskStatus(updatedTask) {
      // Find and update the task in the local tasks array
      const index = this.tasks.findIndex((t) => t.id === updatedTask.id);
      if (index !== -1) {
        this.tasks.splice(index, 1, updatedTask); // Replace the task with the updated one
      }
    
      // Update the task in the database
      axios.put(`http://localhost:3000/api/tasks/${updatedTask.id}`, updatedTask)
        .then(() => {
          console.log("Task updated successfully");
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        });
    },
    handleTaskUpdate(updatedTask) {
    // Update the task status locally when the checkbox is clicked
    const taskIndex = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = updatedTask; // Replace the updated task in the local array
    }

    // Make an API call to update the task status in the database
    axios.put(`http://localhost:3000/api/tasks/${updatedTask.id}`, updatedTask)
      .then(() => {
        console.log("Task updated successfully");
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  },
    handleDeleteTask(task) {
      // Remove the task from the current task list
      this.tasks = this.tasks.filter(t => t.id !== task.id);

      // Optionally, you can make an API call to remove it from the database
      axios.delete(`http://localhost:3000/api/tasks/${task.id}`)
        .then(() => {
          console.log('Task deleted successfully');
        })
        .catch(error => {
          console.error('Error deleting task:', error);
        });
    }
  },
};
</script>




<style>
/* Your styles here */
.today-tasks-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.3rem;
  margin-left: 150px;
  background: #f7eaff;
  width: 80%;
  max-height: 400px;
  overflow-y: auto;
  scroll-behavior: smooth;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.header {
  margin-bottom: 1rem;
  color: #491784;
  font-weight: bolder;
}

button.add {
  padding: 0.3rem;
  width: 2rem; /* Makes it a perfect circle */
  height: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
  background: #491784;
  color: #fff;
  border: none;
  border-radius: 50%; /* Ensures it's perfectly round */
  display: flex; /* Centers the "+" symbol */
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Adds subtle depth */
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

button.add:hover {
  background: hsl(268, 70%, 60%); /* Softer hover effect */
  transform: scale(1.1); /* Subtle growth effect */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* Enhance shadow on hover */
}

@media screen and (max-width: 768px) {
  .today-tasks-card{
    margin-left: 15px;
  }
}
</style>
