<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import Assistant from './components/Assistant.vue'

const isLoggedIn = ref(false)

const handleLoginSuccess = () => {
  isLoggedIn.value = true
}
</script>

<template>
  <div class="app-wrapper">
    <transition name="fade" mode="out-in">
      <Login v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
      <Assistant v-else />
    </transition>
  </div>
</template>

<style>
/* Estils globals bàsics */
body {
  margin: 0;
  padding: 0;
  background-color: #f0f2f5;
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app-wrapper {
  min-height: 100vh;
}

/* Animació de transició */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
