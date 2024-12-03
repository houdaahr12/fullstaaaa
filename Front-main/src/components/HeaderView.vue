<template>
  <header class="header">
    <!-- Search Bar -->
    <div class="search-bar">
      <input placeholder="Search..." type="text" class="search-input">
        <button type="submit">Go</button>
    </div>

    <!-- Icons and Profile -->
    <div class="icons-and-profile d-flex">
      <!-- Notification Icon (visible only on medium and larger screens) -->
      <button class="icon-btn d-none d-md-block">
        <i class="fas fa-bell"></i>
      </button>

      <!-- Light/Dark Mode Toggle Icon (visible only on medium and larger screens) -->
      <button class="icon-btn d-none d-md-block">
        <i class="fas fa-moon"></i>
      </button>

      <!-- Settings Icon (visible only on medium and larger screens) -->
      <button class="icon-btn d-none d-md-block me-5">
        <i class="fas fa-cog"></i>
      </button>

      <!-- User Profile (always visible) -->
      <div class="profile d-flex">
        <img
          :src="require('@/assets/user.jpg')"
          alt="User"
          class="profile-img"
        />
        <div class="profile-info">
          <span class="profile-name">utilisateur</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderView",
};
</script>

<style scoped>
/* Header Container */
.header {
  display: flex;
  justify-content: space-between; /* Space between search bar and other elements */
  align-items: center; /* Center vertically */
  padding: 1rem;
  position: relative; /* Allows fine positioning */
}

/* Centered Search Bar */
.search-bar {
  display: flex;
  justify-content: flex-start; /* Align search bar to the left */
  position: relative; /* Remove absolute positioning */
  left: 20%; /* Remove unnecessary offset */
  width: 50%; /* Adjust width of the search bar container */
}

/* Search Input */
.search-input {
  width: 100%; /* Ensure it takes full width of the container */
  padding: 0.3rem; /* Larger padding for better usability */
  border-radius: 5px;
  outline: none;
  padding: 10px;
  border: none;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}


/* Icons and Profile Section */
.icons-and-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto; /* Push to the right side */
}

/* Icon Buttons */
.icon-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #491784;
  transition: transform 0.2s ease;
}
.icon-btn:hover {
  color: hsl(268, 70%, 70%);
    transform: translateY(-3px) scale(1.05);


}

/* Profile Section */
.profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto; /* Push the profile to the right side */
}

/* Profile Image */
.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}



/* Profile Name */
.profile-name {
  font-weight: bold;
  color: #491784;
}

.search-bar button[type="submit"] {
  background-color: #491784;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  right: 0;
  transition: .9s ease;
}

.search-bar button[type="submit"]:hover {
  transform: scale(1.1);
  color: rgb(255, 255, 255);
  background-color: hsl(268, 70%, 70%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-bar {
    left: 27%;
    width: 200px; /* Make search bar wider on small screens */
  }
  .profile {
    margin-left: 1rem; /* Less margin on smaller screens */
  }
}
</style>
