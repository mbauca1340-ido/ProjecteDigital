<script setup>
import { ref } from 'vue'

const question = ref('')
const chatHistory = ref([])
const loading = ref(false)

const systemPrompt = `Ets un expert en suport tècnic informàtic que parla EXCLUSIVAMENT en català. 
És vital que NO utilitzis el castellà ni cap altre idioma en les teves respostes. Si el model et suggereix paraules en castellà, tradueix-les mentalment al català abans de respondre.

OBJECTIU: Ajudar l'usuari a diagnosticar problemes de hardware i software.
ESTIL: Professional, amable, estructurat amb punts i sempre fent preguntes de seguiment si el problema no està clar.

CONTEXT TÈCNIC DE REFERÈNCIA (Fes-lo servir per a les teves solucions):
1. Pantalla negra: Cables i alimentació.
2. Sense Internet: Reiniciar router, 'ipconfig /flushdns'.
3. Ordinador lent: Administrador de tasques, espai en disc.
4. Impressores: Cua d'impressió (spooler), encallaments.
5. Virus: Windows Defender, no obrir adjunts sospitosos.

INSTRUCCIÓ CRÍTICA: Respon SEMPRE en català correcte. Evita calcs del castellà.`

const askAssistant = async () => {
  if (!question.value.trim()) return

  const userMessage = { role: 'user', content: question.value }
  chatHistory.value.push(userMessage)
  
  const currentQuestion = question.value
  question.value = ''
  loading.value = true

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory.value
        ],
        stream: false
      })
    })

    if (!response.ok) throw new Error('Ollama no respon')

    const data = await response.json()
    chatHistory.value.push({ role: 'assistant', content: data.message.content })
  } catch (error) {
    console.error('Error cridant a Ollama:', error)
    chatHistory.value.push({ role: 'assistant', content: '⚠️ Ho sento, no puc connectar amb el meu cervell d\'IA. Assegura\'t que Ollama està funcionant correctament al teu ordinador.' })
  } finally {
    loading.value = false
    // Scroll automàtic al final del xat
    setTimeout(() => {
      const window = document.querySelector('.chat-window')
      if (window) window.scrollTop = window.scrollHeight
    }, 100)
  }
}
</script>

<template>
  <div class="assistant-container">
    <header class="app-header">
      <div class="status-badge">En línia</div>
      <h1>Suport Tècnic Intel·ligent</h1>
      <p>Diagnòstic de hardware i software en temps real</p>
    </header>

    <div class="chat-window">
      <div v-if="chatHistory.length === 0" class="welcome-msg">
        <p>👋 Hola! Soc el teu assistent tècnic. Explica'm quin problema tens (ex: "La pantalla es queda en negre" o "No puc instal·lar el Chrome") i t'ajudaré a trobar la solució.</p>
      </div>
      <div v-for="(msg, index) in chatHistory" :key="index" :class="['message', msg.role]">
        <div class="avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</div>
        <div class="content">
          <strong>{{ msg.role === 'user' ? 'Tu' : 'Tècnic IA' }}</strong>
          <p>{{ msg.content }}</p>
        </div>
      </div>
      <div v-if="loading" class="message assistant">
        <div class="avatar">🤖</div>
        <div class="content">
          <p><em>Analitzant el problema...</em></p>
        </div>
      </div>
    </div>

    <div class="input-area">
      <input 
        v-model="question" 
        @keyup.enter="askAssistant" 
        placeholder="Escriu aquí el teu problema tècnic..."
        :disabled="loading"
      />
      <button @click="askAssistant" :disabled="loading" class="send-btn">
        <span>Enviar</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.assistant-container {
  max-width: 900px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  height: 90vh;
  padding: 0;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  overflow: hidden;
}

.app-header {
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  text-align: center;
  position: relative;
}

.status-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #4caf50;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

h1 { margin: 0; font-size: 1.5rem; }
header p { margin: 5px 0 0; opacity: 0.8; font-size: 0.9rem; }

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.welcome-msg {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-style: italic;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 85%;
  padding: 12px;
  border-radius: 12px;
}

.avatar { font-size: 1.5rem; }

.user {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
  flex-direction: row-reverse;
}

.assistant {
  align-self: flex-start;
  background-color: white;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.content strong { display: block; margin-bottom: 4px; font-size: 0.8rem; }
.content p { margin: 0; line-height: 1.4; white-space: pre-wrap; }

.input-area {
  padding: 20px;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

.send-btn {
  padding: 0 25px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.send-btn:hover { background-color: #0056b3; }
.send-btn:disabled { background-color: #ccc; }
</style>
