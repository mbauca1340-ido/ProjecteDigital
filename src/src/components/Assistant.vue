<script setup>
import { ref } from 'vue'

const question = ref('')
const chatHistory = ref([])
const loading = ref(false)
const showTACButton = ref(false)
const emailSent = ref(false)
const selectedFile = ref(null)
const filePreview = ref(null)
const fileInput = ref(null)

const systemPrompt = `Ets un expert en suport tècnic informàtic que parla EXCLUSIVAMENT en català. 
El teu objectiu és ajudar usuaris PRINCIPIANTS que no tenen coneixements tècnics.

NORMES DE COMUNICACIÓ:
1. LLENGUATGE MOLT SENZILL: No utilitzis paraules tècniques. Digues "aparell" en lloc de "perifèric", "cable" en lloc de "connexió física", etc.
2. PAS A PAS: Explica les coses a poc a poc, pas a pas, perquè l'usuari ho pugui fer ell mateix.
3. INTUÏTIU: Fes servir exemples fàcils d'entendre.
4. AMABILITAT: Sigues pacient i ajuda a l'usuari a no posar-se nerviós.

Si després d'uns quants intents el problema persisteix, suggereix amb delicadesa que usin el botó per avisar al coordinador TAC.

RECORDA: Respon SEMPRE en català correcte però molt planer.`

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  selectedFile.value = file
  
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => { filePreview.value = e.target.result }
    reader.readAsDataURL(file)
  } else {
    filePreview.value = null
  }
}

const triggerFileUpload = () => {
  fileInput.value.click()
}

const clearFile = () => {
  selectedFile.value = null
  filePreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = (error) => reject(error)
  })
}

const askAssistant = async (initialMessage = null) => {
  if (initialMessage) {
    question.value = initialMessage
  }
  
  if (!question.value.trim() && !selectedFile.value) return

  const userMessage = { 
    role: 'user', 
    content: question.value,
    hasImage: !!filePreview.value,
    imagePreview: filePreview.value,
    fileName: selectedFile.value ? selectedFile.value.name : null
  }
  
  chatHistory.value.push(userMessage)
  
  const currentQuestion = question.value
  const currentFile = selectedFile.value
  question.value = ''
  clearFile()
  loading.value = true

  try {
    let images = []
    if (currentFile && currentFile.type.startsWith('image/')) {
      const base64 = await fileToBase64(currentFile)
      images = [base64]
    }

    // Pas 1: Consultar a Ollama
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: images.length > 0 ? 'llava:7b' : 'llama3.2:1b',
        messages: [
          { role: 'system', content: systemPrompt + " Si no saps la resposta o necessites informació actualitzada, respon exactament amb la paraula: CERCA_WEB" },
          ...chatHistory.value.map(m => ({
            role: m.role,
            content: m.content,
            ...(m.role === 'user' && images.length > 0 && m === userMessage ? { images } : {})
          }))
        ],
        stream: false
      })
    })

    if (!response.ok) throw new Error('Ollama no respon')
    const data = await response.json()
    let assistantContent = data.message.content

    // Pas 2: Si Ollama demana una cerca web
    if (assistantContent.includes('CERCA_WEB')) {
      console.log("Iniciant cerca web per:", currentQuestion)
      const searchRes = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(currentQuestion)}`)
      const searchData = await searchRes.json()
      
      // Tornem a preguntar a Ollama amb la informació de la web
      const finalResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:1b',
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatHistory.value,
            { role: 'system', content: `Informació trobada a la web: ${searchData.results}. Utilitza aquesta informació per respondre a l'usuari en català.` }
          ],
          stream: false
        })
      })
      const finalData = await finalResponse.json()
      assistantContent = finalData.message.content
    }

    chatHistory.value.push({ role: 'assistant', content: assistantContent })
    
    // Si el xat s'allarga, suggerim avisar al TAC
    if (chatHistory.value.length >= 4) {
      showTACButton.value = true
    }
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

const selectCategory = (category) => {
  let initialMsg = ''
  if (category === 'software') initialMsg = 'Tinc un problema de software.'
  if (category === 'hardware') initialMsg = 'Tinc un problema de hardware.'
  if (category === 'dontknow') initialMsg = 'No sé quin tipus de problema tinc, em pots ajudar a identificar-lo?'
  
  askAssistant(initialMsg)
}

const sendToTAC = async () => {
  loading.value = true
  try {
    const userProblem = chatHistory.value.find(m => m.role === 'user')?.content || 'Problema no especificat'
    const aiSolution = chatHistory.value.filter(m => m.role === 'assistant').pop()?.content || 'Cap solució proposada'

    const response = await fetch('http://localhost:3001/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userProblem, aiSolution })
    })

    if (response.ok) {
      emailSent.value = true
      showTACButton.value = false
      chatHistory.value.push({ 
        role: 'assistant', 
        content: '✅ He enviat un resum del teu problema al coordinador TAC (mbauca1340). Et contactarà aviat.' 
      })
    }
  } catch (error) {
    console.error('Error enviant al TAC:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="assistant-container">
    <header class="app-header">
      <div class="status-badge">IA Activa</div>
      <h1>Assistent Tècnic Intel·ligent</h1>
      <p>Diagnòstic expert pas a pas</p>
    </header>

    <div class="chat-window">
      <div v-if="chatHistory.length === 0" class="triage-area">
        <div class="welcome-text">
          <h2>Hola! Què t'ha passat avui?</h2>
          <p>Selecciona una categoria o escriu directament a sota.</p>
        </div>
        
        <div class="triage-grid">
          <button class="triage-card software" @click="selectCategory('software')">
            <span class="card-icon">💻</span>
            <div class="card-content">
              <h3>Software</h3>
              <p>Programes, virus, lentitud, Windows...</p>
            </div>
          </button>

          <button class="triage-card hardware" @click="selectCategory('hardware')">
            <span class="card-icon">🔌</span>
            <div class="card-content">
              <h3>Hardware</h3>
              <p>Pantalla, sorolls, no engega, cables...</p>
            </div>
          </button>

          <button class="triage-card unknown" @click="selectCategory('dontknow')">
            <span class="card-icon">❓</span>
            <div class="card-content">
              <h3>No ho sé</h3>
              <p>Ajuda'm a diagnosticar el problema.</p>
            </div>
          </button>
        </div>
      </div>

      <div v-for="(msg, index) in chatHistory" :key="index" :class="['message', msg.role]">
        <div class="avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</div>
        <div class="content">
          <strong>{{ msg.role === 'user' ? 'Tu' : 'Tècnic IA' }}</strong>
          <div v-if="msg.hasImage" class="message-image">
            <img :src="msg.imagePreview" alt="Imatge del problema" />
          </div>
          <div v-else-if="msg.fileName" class="message-file">
            <span class="file-icon">📄</span> {{ msg.fileName }}
          </div>
          <p>{{ msg.content }}</p>
        </div>
      </div>
      <div v-if="loading" class="message assistant">
        <div class="avatar">🤖</div>
        <div class="content">
          <p><em>Analitzant el problema...</em></p>
        </div>
      </div>

      <!-- Àrea d'ajuda extra TAC -->
      <div v-if="showTACButton && !emailSent" class="tac-help-area">
        <p>No has pogut resoldre el problema? Vols avisar al servei tècnic?</p>
        <button @click="sendToTAC" class="tac-btn" :disabled="loading">
          📧 Avisar al Coordinador TAC
        </button>
      </div>
    </div>

    <div class="preview-area" v-if="selectedFile">
      <div class="preview-card">
        <div v-if="filePreview" class="img-preview">
          <img :src="filePreview" />
        </div>
        <div v-else class="file-info">
          <span>📄 {{ selectedFile.name }}</span>
        </div>
        <button class="remove-file" @click="clearFile">✕</button>
      </div>
    </div>

    <div class="input-area">
      <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*,application/pdf" style="display: none">
      <button class="file-btn" @click="triggerFileUpload" title="Adjuntar imatge o PDF">
        📎
      </button>
      <input 
        v-model="question" 
        @keyup.enter="askAssistant()" 
        placeholder="Explica'm què passa amb les teves paraules..."
        :disabled="loading"
      />
      <button @click="askAssistant()" :disabled="loading || (!question.trim() && !selectedFile)" class="send-btn">
        <span class="btn-text">Enviar</span>
        <span class="btn-icon">✈️</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.assistant-container {
  max-width: 1000px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  height: 92vh;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.15);
  overflow: hidden;
}

.app-header {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 25px;
  text-align: center;
  position: relative;
  border-bottom: 4px solid #3498db;
}

.status-badge {
  position: absolute;
  top: 25px;
  right: 25px;
  background: #2ecc71;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 0 15px rgba(46, 204, 113, 0.4);
}

h1 { margin: 0; font-size: 1.8rem; font-weight: 700; }
header p { margin: 8px 0 0; opacity: 0.9; font-size: 1rem; }

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 25px;
  background-color: #f4f7f9;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Estils de Triatge */
.triage-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 40px 0;
}

.welcome-text {
  text-align: center;
}

.welcome-text h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.welcome-text p {
  color: #7f8c8d;
}

.triage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 800px;
}

.triage-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  border: 2px solid #eef2f7;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.triage-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
  border-color: #3498db;
}

.card-icon { font-size: 2.5rem; }
.card-content h3 { margin: 0; color: #2c3e50; font-size: 1.1rem; }
.card-content p { margin: 5px 0 0; font-size: 0.85rem; color: #7f8c8d; }

.software:hover { background-color: #ebf5ff; }
.hardware:hover { background-color: #fff4eb; }
.unknown:hover { background-color: #f3f0ff; }

.message {
  display: flex;
  gap: 15px;
  max-width: 80%;
  padding: 15px;
  border-radius: 18px;
  position: relative;
}

.user {
  align-self: flex-end;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  flex-direction: row-reverse;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.assistant {
  align-self: flex-start;
  background-color: white;
  border: 1px solid #eef2f7;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}

.tac-help-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 25px;
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
  border: 2px dashed #f1c40f;
  border-radius: 20px;
  margin: 10px 0;
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.tac-help-area p {
  margin: 0;
  color: #856404;
  font-weight: 700;
  font-size: 1rem;
}

.tac-btn {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(230, 126, 34, 0.3);
}

.tac-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(230, 126, 34, 0.4);
}

.tac-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.content strong { display: block; margin-bottom: 6px; font-size: 0.85rem; letter-spacing: 0.5px; }

.input-area {
  padding: 25px;
  background: white;
  border-top: 1px solid #eef2f7;
  display: flex;
  gap: 15px;
  align-items: center;
}

input {
  flex: 1;
  padding: 18px;
  border: 2px solid #eef2f7;
  border-radius: 15px;
  font-size: 1rem;
  background-color: #f8f9fa;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #3498db;
  background-color: white;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
}

.send-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 25px;
  height: 56px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.send-btn:hover { background-color: #2980b9; transform: scale(1.02); }
.send-btn:disabled { background-color: #bdc3c7; cursor: not-allowed; }

.btn-icon { font-size: 1.2rem; }

@media (max-width: 600px) {
  .triage-grid { grid-template-columns: 1fr; }
  .btn-text { display: none; }
  .send-btn { padding: 0 15px; }
}
</style>
