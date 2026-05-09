# Registre de Desenvolupament - Projecte Digital

Aquest document conté el registre detallat de totes les accions realitzades en aquest projecte, des de la seva creació fins a l'estat actual.

## FASE 1: Disseny i Creació de la Pàgina Web

### 1. Selecció de la Tecnologia
S'ha escollit un stack modern per garantir una interfície ràpida i reactiva:
- **Framework:** Vue.js 3 (Composition API).
- **Eina de construcció:** Vite (per a un desenvolupament ultra-ràpid).
- **Estils:** CSS3 (Vanilla) amb disseny adaptatiu (responsive).

### 2. Estructura de l'Aplicació (Frontend)
La web s'ha dividit en components modulars per facilitar-ne el manteniment:
- **`App.vue`:** Component arrel que gestiona l'estat global i la navegació (Login -> Assistent).
- **`Login.vue`:** Sistema d'accés que inclou:
  - Validació de correu i contrasenya.
  - Simulació d'enviament de codi de verificació (2FA) per seguretat.
- **`Assistant.vue`:** Interfície principal del xat:
  - Disseny tipus "bomboleta" per a una millor llegibilitat.
  - Sistema de missatgeria asíncrona amb estats de càrrega ("Analitzant el problema...").

### 3. Configuració de la Intel·ligència Artificial
S'ha configurat un proxy a `vite.config.js` per connectar la web de forma segura amb l'API local d'Ollama (port 11434).

---

## FASE 2: Configuració de l'Entorn i Automatització (Intervencions Gemini CLI)

### 2026-05-08: Automatització i Reparació del Sistema

#### 1. Creació del Makefile
S'ha creat un fitxer `Makefile` a l'arrel per automatitzar tasques:
- `make install`, `make dev`, `make build`, `make clean`, `make check-ollama`.

#### 2. Instal·lació de dependències del sistema
- **Acció:** S'ha executat `sudo apt update && sudo apt install -y build-essential`.
- **Resultat:** Instal·lació de `make` i eines de compilació necessàries que faltaven al sistema.

#### 3. Reparació de la connexió amb l'IA (Ollama)
- **Acció:** S'ha detectat que el servei Ollama estava aturat i desactivat. S'ha utilitzat `systemctl enable` i `systemctl start`.
- **Persistència:** Ara l'IA s'arrenca automàticament amb l'ordinador.
- **Verificació:** S'ha confirmat la presència del model `llama3.2:1b`.

#### 4. Verificació del Servidor de Desenvolupament
- **Resultat:** El servidor s'ha aixecat satisfactòriament al port `5174`.

## FASE 3: Millores Multimodals (Visió i Documents)

### 2026-05-08: Integració de Capacitats de Visió

#### 1. Alliberament d'espai en disc
- **Problema:** El disc estava al 100% de capacitat (65GB ocupats).
- **Acció:** S'ha realitzat una neteja de fitxers temporals d'Ollama i s'ha identificat un fitxer de Docker Desktop (`Docker.raw`) que ocupava la totalitat del disc. S'han alliberat ~7GB per poder instal·lar nous models.

#### 2. Implementació de la funció de Visió (Imatges)
- **Frontend:** S'ha afegit un selector de fitxers (icona de clip) i una àrea de previsualització a `Assistant.vue`.
- **Backend:** L'assistent ara detecta si hi ha una imatge i commuta automàticament al model **Llava:7b** (especialitzat en visió).
- **Capacitat:** L'IA ara pot analitzar fotografies de cables, captures de pantalla d'errors o estats de LEDs de hardware.

#### 3. Suport per a Documents (PDF)
- **Acció:** S'ha habilitat la pujada de PDFs a la interfície.
- **Estat:** L'estructura està preparada per a la futura extracció de text o anàlisi de documents tècnics.

## FASE 4: Connexió a la Web i Suport Tècnic Actualitzat

### 2026-05-08: Implementació de Cerca a la Web

#### 1. Creació d'un Servidor de Backend (Node.js)
- **Acció:** S'ha creat una carpeta `server` amb un servei Express que actua com a intermediari entre la web i el món exterior.
- **Funcionalitat:** El servidor pot realitzar consultes a APIs de cerca (DuckDuckGo) per obtenir informació tècnica en temps real.

#### 2. Flux de Pensament de l'IA (RAG Light)
- **Disseny:** S'ha programat l'assistent perquè, quan detecti que no té prou informació o que el problema és molt nou, demani una `CERCA_WEB`.
- **Procés:** La web fa la cerca, recupera els resultats i els torna a enviar a Ollama per generar una solució basada en dades reals d'Internet.

#### 3. Actualització de l'Automatització
- **Makefile:** S'han afegit les comandes `make stop` i s'ha millorat `make dev` perquè arrenqui simultàniament el frontend de Vue i el backend de cerca.

---
*Aquest registre és un document viu que s'actualitza amb cada canvi significatiu al projecte.*
