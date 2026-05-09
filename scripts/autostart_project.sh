#!/bin/bash
# Script per carregar el Projecte Digital automàticament

PROJECT_DIR="/home/alumne/Desktop/projecte_digital"

# Aturar possibles instàncies prèvies
make -C "$PROJECT_DIR" stop

# Iniciar els servidors en segon pla
make -C "$PROJECT_DIR" dev &

# Esperar uns segons perquè el servidor estigui llest
sleep 10

# Obrir el navegador amb la web del projecte
xdg-open "http://localhost:5173/" &
