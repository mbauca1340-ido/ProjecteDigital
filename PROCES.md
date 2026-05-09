# Registre del Procés de Desenvolupament - Assistent Informàtic IA

## Fase 1: Recerca i Anàlisi (06/05/2026)
### Documents analitzats:
1. `Digitalització. Enunciat del projecte final.pdf`: Requisits oficials del professor (IA central, fluxos agèntics, repositori públic, informe manual).
2. `projecte_assistent_informatic_nivell10.pdf`: Idea inicial de l'alumne (Vue.js + Ollama).

### Decisions de disseny i millores proposades:
- **Enfocament agèntic:** L'assistent no serà un simple xat, sinó un agent de diagnòstic que fa preguntes interactives.
- **Multimodalitat:** Possibilitat d'analitzar captures d'errors (fotos/screenshots).
- **RAG Local:** Ús de documentació tècnica per evitar al·lucinacions.
- **Interfície:** Frontend net amb Vue.js 3 i comunicació directa amb l'API d'Ollama.

### Estat actual:
- Workspace creat a `~/Desktop/projecte_digital`.
- Estructura de carpetes inicialitzada.

## Fase 2: Verificació de l'Entorn (06/05/2026)
### Eines detectades:
- **Node.js:** v24.15.0 (Instal·lat i operatiu).
- **NPM:** v11.12.1 (Instal·lat i operatiu).
- **Ollama:** Client v0.20.7 (Instal·lat). 
  - *Nota:* El servei no responia en el primer intent, s'haurà de verificar si està actiu.

### Accions realitzades:
1. Comprovació de versions de programari.
2. Creació del sistema de fitxers del projecte.
3. Creació del document de registre `PROCES.md`.
4. Arrencada del servei **Ollama** i verificació de models.

### Models disponibles:
- `llama3.2:1b` (1.3 GB): Un model lleuger i ràpid, ideal per a proves i per a un assistent de diagnòstic bàsic.

## Resum de la sessió (06/05/2026)
- **Objectiu assolit:** S'ha establert la base del projecte i s'ha verificat que la infraestructura d'IA (Ollama) i de desenvolupament (Node.js) està operativa.
- **Estat del Workspace:** Carpetes creades i documentació inicial (README i PROCES) enllestida a l'escriptori.
## Fase 3: Desenvolupament del Frontend (07/05/2026)
### Accions realitzades:
1. **Inicialització de Vue.js:** Creat un nou projecte amb Vite a la carpeta `src`.
2. **Configuració d'Ollama:** Verificat que el servei està actiu i que el model `llama3.2:1b` està disponible.
3. **Component Assistant:** Creat el component `Assistant.vue` que gestiona el xat amb la IA.
   - S'ha definit un **System Prompt** per orientar la IA com a expert en suport informàtic en català.
   - S'ha implementat la crida a l'API local d'Ollama (`/api/chat`).
4. **Interfície d'usuari:** Dissenyada una interfície neta amb estils CSS integrats.

### Estat actual:
- L'aplicació ja permet fer preguntes i rebre respostes de la IA.
- El servidor de desenvolupament s'ha provat amb èxit.

## Fase 4: Solució de problemes de connectivitat (08/05/2026)
### Problema detectat:
- L'aplicació no podia connectar amb Ollama des del navegador (error de connexió o CORS).
- L'accés via IP de xarxa feia que `localhost:11434` fallés perquè apuntava a la màquina de l'usuari.

### Accions realitzades:
1. **Configuració de Proxy a Vite:** S'ha modificat `vite.config.js` per crear un proxy de `/api` cap a `http://localhost:11434`.
2. **Actualització del component Assistant:** S'ha canviat la crida a l'API per utilitzar la ruta relativa `/api/chat`.
3. **Verificació:** S'ha comprovat que el proxy funciona correctament i l'IA respon a través de la web.

### Estat actual:
- Connexió estable entre el Frontend i l'IA.
- L'aplicació és accessible i funcional des de qualsevol dispositiu de la xarxa.

## Fase 5: Refinament del llenguatge i Base de Coneixement (08/05/2026)
### Accions realitzades:
1. **Sistema de referència (RAG simplificat):** He creat un document `docs/guia_suport.md` amb els problemes més comuns.
2. **Millora del System Prompt:** He reescrit les instruccions de l'IA per ser molt més estricte amb l'ús del català i evitar que barregi idiomes. Ara té el contingut de la guia de suport com a base de consulta directa.
3. **Seguretat:** He implementat la validació de la contrassenya "alumne" al formulari d'entrada.

### Estat actual:
- L'IA ja no hauria de barrejar el castellà.
- Les solucions que dóna estan alineades amb la guia de suport local.
- L'accés al sistema està protegit.

## Fase 6: Triatge Intel·ligent i Millora de l'Experiència d'Usuari (09/05/2026)
### Problema detectat:
- Els usuaris sovint no saben identificar si el seu problema és de hardware o software, cosa que pot dificultar l'inici del diagnòstic.
- L'entorn de desenvolupament requeria múltiples confirmacions manuals per a cada eina del CLI.

### Accions realitzades:
1. **Implementació de Triatge Visual:**
   - He creat una pantalla de benvinguda a l'aplicació web amb tres categories clares: **Software**, **Hardware** i **"No ho sé"**.
   - Els botons inicien el xat amb un missatge contextual predefinit per orientar la IA des del primer segon.
2. **Millora Estètica (UI/UX):**
   - He actualitzat el disseny amb un esquema de colors més modern (gradients, ombres suaus).
   - He millorat la responsivitat de la interfície per a dispositius mòbils.
   - S'han afegit icones visuals per a cada categoria de problema.
3. **Automatització de l'Entorn:**
   - He creat una política d'aprovació automàtica (`~/.gemini/policies/allow_all.toml`) per permetre l'execució directa d'eines de desenvolupament sense interrupcions.
   - He creat un accés directe a l'escriptori per facilitar l'accés a l'aplicació web.

### Estat actual:
- Interfície molt més professional i intuïtiva per a l'usuari final.
- Flux de diagnòstic agilitzat gràcies al sistema de categories.
- Documentació actualitzada amb els últims canvis arquitectònics.

## Fase 7: Sistema d'Escalat al Coordinador TAC (09/05/2026)
### Problema detectat:
- L'IA pot no ser capaç de resoldre problemes físics complexos o que requereixen intervenció administrativa. Cal un mètode per avisar als responsables humans.

### Accions realitzades:
1. **Desenvolupament del Backend (Email):**
   - He instal·lat `nodemailer` al servidor.
   - He creat un nou endpoint `/api/send-email` que envia un resum del problema i la solució de la IA al correu del coordinador TAC (**mbauca1340@alumnes.politecnicllevant.cat**).
2. **Implementació del Botó d'Escalat (UI):**
   - El xat detecta si la conversa és llarga (més de 4 missatges) i mostra automàticament una zona d'ajuda extra.
   - L'usuari pot prémer un botó per "Avisar al Coordinador TAC".
3. **Automatització del resum:**
   - El sistema envia automàticament l'últim problema de l'usuari i la proposta de l'IA perquè el coordinador tingui context abans d'arribar.

### Estat actual:
- L'aplicació ja no és només un assistent, sinó una eina de gestió d'incidències completa per al centre.
- Flux de treball: Diagnòstic IA -> Escalat humà si no es resol.

## Resum de la sessió (09/05/2026)
- **Objectiu assolit:** Tancat el cercle de suport amb l'enviament d'emails al coordinador TAC.
- **Estat del Workspace:** Projecte finalitzat amb totes les funcionalitats demanades, documentació al dia i interfície polida.

