# Contingut per a la Presentació en Canva
**Projecte:** Assistent Tècnic Intel·ligent
**Autor:** Miquel Bauçà Rigo

---

## Diapositiva 1: Portada
*   **Títol:** Assistent Tècnic Intel·ligent
*   **Subtítol:** Suport, Diagnòstic i Aprenentatge amb IA Local
*   **Dades:** Miquel Bauçà Rigo | CIFP Politècnic Llevant
*   **Icona sugerida:** Un robot amb una clau anglesa o un cervell digital.

## Diapositiva 2: El Problema
*   **Punts clau:**
    *   Usuaris principiants frustrats.
    *   Saturació del servei tècnic (TAC) amb dubtes trivials.
    *   Manca d'autonomia tecnològica.
*   **Frase ganxo:** "No li donis el peix, ensenya'l a pescar."

## Diapositiva 3: La Solució
*   **Què és?:** Un agent de diagnòstic interactiu.
*   **Diferenciador:** No dóna la solució directament; guia l'usuari pas a pas perquè aprengui a arreglar-ho ell mateix.
*   **Privacitat:** Tot s'executa localment (Ollama).

## Diapositiva 4: Stack Tecnològic
*   **Frontend:** Vue.js 3 + Vite.
*   **Backend:** Node.js + Express.
*   **IA (Models):** 
    *   `llama3.2:1b` (Raonament i text).
    *   `llava:7b` (Visió artificial per a fotos d'errors).
*   **Cerca:** DuckDuckGo API (Dades en temps real).

## Diapositiva 5: Flux de Treball Agèntic
*   **Procés:**
    1. L'usuari explica el problema.
    2. L'IA analitza si té prou dades.
    3. Si cal, l'IA fa una `CERCA_WEB` autònoma.
    4. L'IA sintetitza la informació i comença el diagnòstic.

## Diapositiva 6: Filosofia "Pas a Pas"
*   **La Regla d'Or:** Només una instrucció per missatge.
*   **Objectiu:** Evitar que l'usuari s'aclapiari.
*   **Interacció:** L'IA pregunta "Què veus?" o "Ha funcionat?" abans de seguir.

## Diapositiva 7: Gestió d'Escalat (TAC)
*   **Filtre intel·ligent:** El botó d'avís al coordinador TAC està ocult.
*   **Condició:** Només apareix si l'usuari insisteix 5 vegades en que no pot resoldre-ho.
*   **Resultat:** Reducció dràstica d'incidències innecessàries al servei tècnic.

## Diapositiva 8: Demostració Tècnica
*   **Títol:** Demo en Viu.
*   **Punts a destacar durant la demo:**
    *   Triatge inicial (Software/Hardware).
    *   Pujada d'imatges del problema.
    *   Respostes en català planer i senzill.

## Diapositiva 9: Reptes i Aprenentatges
*   **Reptes:** Configuració de Proxys CORS i optimització de prompts per a català.
*   **Aprenentatge:** Gestió de models de llenguatge en local i disseny d'interfícies per a usuaris no tècnics.

## Diapositiva 10: Cloenda i Contacte
*   **Resum:** Un assistent que empodera l'usuari i optimitza el suport del centre.
*   **Autor:** Miquel Bauçà Rigo.
*   **Email:** mbauca1340@alumnes.politecnicllevant.cat
*   **Repositori:** [Enllaç de GitHub]
