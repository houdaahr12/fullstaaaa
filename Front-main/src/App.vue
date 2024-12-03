<template>
  <div id="app">
    <template v-if="isLoggedIn">
     <HeaderView />
      <router-view /> 
      <SidebarView />
    
        
    </template>
    <template v-else>
      <Navbar />
      <router-view /> 
      <Footer />
    </template>
    
  </div>
</template>

<script>
import Footer from "./components/Footer.vue"
import Navbar from "./components/Navbar.vue"
import SidebarView  from "./components/sidebar/SidebarView.vue";
import HeaderView from "./components/HeaderView.vue";

import axios from 'axios';

export default {
   components: { Navbar, Footer, SidebarView,HeaderView,},
data() {
    return {
      isLoggedIn: false,
      user: null,
    };
  },
  created() {
    this.checkAuthStatus();
  },
  methods: {
    async checkAuthStatus() {
      try {
        const response = await axios.get('http://localhost:3000/auth/status', { withCredentials: true });
        this.isLoggedIn = response.data.isLoggedIn;
        this.user = response.data.user;
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification :", error);
      }
    },
  },
  name: 'App',

};
</script>


<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

v-footer {
  margin-top: auto; 
}
</style>
