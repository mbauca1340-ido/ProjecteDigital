<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login-success'])

const email = ref('')
const password = ref('')
const step = ref('login') // 'login' or 'verify'
const verificationCode = ref('')
const generatedCode = ref('')
const error = ref('')

const handleLogin = () => {
  if (email.value && password.value) {
    if (password.value !== 'alumne') {
      error.value = "Contrassenya incorrecta."
      return
    }
    
    // Generem un codi aleatori
    generatedCode.value = Math.floor(1000 + Math.random() * 9000).toString()
    
    if (email.value === 'mbauca1340@alumnes.politecnicllevant.cat') {
      alert("Hola Miquel! Com que estem en mode de proves, el teu codi de verificació és: " + generatedCode.value);
    } else {
      alert("S'ha enviat un codi al teu correu: " + generatedCode.value);
    }
    
    console.log("CODI PER A " + email.value + ":", generatedCode.value)
    step.value = 'verify'
    error.value = ''
  } else {
    error.value = "Si us plau, omple tots els camps."
  }
}

const handleVerify = () => {
  if (verificationCode.value === generatedCode.value) {
    emit('login-success')
  } else {
    error.value = "Codi incorrecte. Torna-ho a provar."
  }
}
</script>

<template>
  <div class="login-container">
    <div v-if="step === 'login'" class="login-box">
      <h2>Iniciar Sessió</h2>
      <p>Projecte Assistent Informàtic</p>
      <div class="input-group">
        <label>Correu Electrònic</label>
        <input v-model="email" type="email" placeholder="usuari@exemple.com" />
      </div>
      <div class="input-group">
        <label>Contrassenya</label>
        <input v-model="password" type="password" placeholder="********" />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button @click="handleLogin">Enviar Codi</button>
    </div>

    <div v-else class="login-box">
      <h2>Verificació</h2>
      <p>Introdueix el codi de 4 dígits que has rebut.</p>
      <div class="input-group">
        <input v-model="verificationCode" type="text" maxlength="4" placeholder="0000" class="code-input" />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button @click="handleVerify">Verificar i Entrar</button>
      <button class="link-btn" @click="step = 'login'">Tornar enrere</button>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 { margin-bottom: 10px; color: #333; }
p { color: #666; margin-bottom: 20px; }

.input-group {
  text-align: left;
  margin-bottom: 15px;
}

label { display: block; margin-bottom: 5px; font-weight: bold; color: #555; }

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

.code-input {
  font-size: 24px;
  letter-spacing: 10px;
  text-align: center;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

button:hover { background-color: #45a049; }

.link-btn {
  background: none;
  color: #2196f3;
  margin-top: 15px;
}
.link-btn:hover { text-decoration: underline; background: none; }

.error { color: #d32f2f; font-size: 14px; margin-top: 10px; }
</style>
