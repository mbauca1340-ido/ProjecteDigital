# Makefile per al Projecte Digital

# Directori on es troba el codi font i el package.json
SRC_DIR = src

.PHONY: help install dev build preview clean check-ollama stop

help:
	@echo "Comandes disponibles:"
	@echo "  make install      - Instal·la les dependències del projecte"
	@echo "  make dev          - Arrenca el servidor de desenvolupament (Vite + Backend)"
	@echo "  make build        - Genera la versió de producció"
	@echo "  make preview      - Previsualitza la versió de producció construïda"
	@echo "  make clean        - Elimina node_modules i la carpeta de distribució (dist)"
	@echo "  make check-ollama - Comprova si el servei d'Ollama està actiu"
	@echo "  make stop         - Atura tots els servidors en execució"

check-ollama:
	@curl -s http://localhost:11434/api/tags > /dev/null && echo "Ollama està actiu! ✅" || echo "Ollama NO està actiu. ❌ (Recorda iniciar-lo)"

install:
	cd $(SRC_DIR) && npm install
	cd server && npm install

dev:
	(cd server && node index.js & cd $(SRC_DIR) && npm run dev)

stop:
	pkill -f "node index.js" || true
	pkill -f "vite" || true

build:
	cd $(SRC_DIR) && npm run build

preview:
	cd $(SRC_DIR) && npm run preview

clean:
	rm -rf $(SRC_DIR)/node_modules $(SRC_DIR)/dist server/node_modules
