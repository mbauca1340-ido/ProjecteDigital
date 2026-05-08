# Informe del Projecte: Assistent de Problemes Informàtics amb IA

**Autor:** [El teu nom]
**Data:** 07/05/2026
**Centre:** Politècnic Llevant
**Mòdul:** Digitalització

## 1. Descripció del projecte
Aquest projecte consisteix en una aplicació web que actua com un tècnic informàtic virtual. Utilitza IA local per ajudar els usuaris a diagnosticar i resoldre problemes comuns de maquinari i programari.

## 2. URL del repositori
[Aquí anirà l'enllaç de GitHub/GitLab quan el creem]

## 3. Ús de la IA
S'ha integrat la IA generativa mitjançant **Ollama**, utilitzant el model **llama3.2:1b**. 
- **Finalitat:** Analitzar els símptomes descrits per l'usuari i proposar solucions pas a pas.
- **Integració:** L'aplicació Vue.js es comunica directament amb l'API local d'Ollama (`/api/chat`).

## 4. Fluxos de treball
S'ha utilitzat un enfocament de **programació agèntica**:
- **Prompt Engineering:** S'ha definit un "System Prompt" que obliga la IA a actuar com un tècnic, a fer preguntes de seguiment i a respondre en català.
- **Interacció:** El sistema no només dóna respostes, sinó que convida l'usuari a provar coses i explicar els resultats.

## 5. Explicació del codi
- **Frontend:** Desenvolupat amb Vue.js 3 i Vite.
- **Component Assistant.vue:** Gestiona l'estat del xat, l'enviament de missatges i la recepció de respostes de la IA.
- **Estils:** CSS minimalista per a una experiència d'usuari clara.

## 6. Tecnologies utilitzades
- **Llenguatges:** JavaScript (Vue.js), HTML, CSS.
- **IA:** Ollama (Model llama3.2:1b).
- **Entorn:** Node.js, Vite.

## 7. Reptes i aprenentatges
- **Repte:** Configurar Ollama per permetre crides des d'un frontend (CORS).
- **Aprenentatge:** Com ajustar el comportament d'un model petit de 1.3B perquè sigui útil en una tasca específica.

## 8. Limitacions i millores futures
- **Limitacions:** El model petit pot cometre errors gramaticals.
- **Millores:** Afegir RAG (Retrieval-Augmented Generation) amb manuals tècnics reals i suport per a imatges.

## 9. Reflexió sobre l'ús de la IA
La IA ha estat la peça central per a la generació de solucions dinàmiques, permetent que l'assistent sigui molt més flexible que un sistema basat en regles fixes.

## 10. Instruccions d'instal·lació i ús
1. Instal·lar Ollama i descarregar el model: `ollama run llama3.2:1b`.
2. Dins la carpeta `src`, executar `npm install`.
3. Executar l'aplicació: `npm run dev`.
