const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Proxy per a Ollama
app.post('/api/chat', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:11434/api/chat', req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error Ollama:', error.message);
        res.status(500).json({ error: 'Ollama error' });
    }
});

// Eina de cerca a la web (simulada o via API externa)
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query required' });

    console.log('Cercant a la web per:', query);
    
    try {
        // Aquí podríem usar una API com Tavily, Serper, o fins i tot un scraper simple.
        // Per a aquest projecte, usarem una cerca de DuckDuckGo via un proxy o API lliure si és possible.
        // Com a prova, farem una crida a una API de cerca lliure.
        const searchRes = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`);
        
        let results = searchRes.data.AbstractText || "No s'han trobat resultats directes.";
        if (searchRes.data.RelatedTopics && searchRes.data.RelatedTopics.length > 0) {
            results += "\n\nTemes relacionats:\n" + searchRes.data.RelatedTopics.slice(0, 3).map(t => t.Text).join('\n');
        }

        res.json({ results });
    } catch (error) {
        res.status(500).json({ results: "Error en la cerca a la web." });
    }
});

const nodemailer = require('nodemailer');

// Configuració de transport per a l'email
// Nota: En producció caldria configurar un compte real (SMTP o OAuth2)
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email', // Servei de proves
    port: 587,
    auth: {
        user: 'test-user@ethereal.email',
        pass: 'test-pass'
    }
});

// Endpoint per enviar el resum al coordinador TAC
app.post('/api/send-email', async (req, res) => {
    const { userProblem, aiSolution, chatHistory } = req.body;
    const coordinatorEmail = 'mbauca1340@alumnes.politecnicllevant.cat';

    const mailOptions = {
        from: '"Assistent IA Suport" <suport-ia@politecnicllevant.cat>',
        to: coordinatorEmail,
        subject: `⚠️ Alerta Suport: Problema no resolt - ${new Date().toLocaleDateString()}`,
        html: `
            <h2>Resum d'Incidència TAC</h2>
            <p><strong>Problema detectat:</strong> ${userProblem}</p>
            <p><strong>Possible solució proposada per la IA:</strong></p>
            <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
                ${aiSolution.replace(/\n/g, '<br>')}
            </div>
            <hr>
            <p><small>Aquest correu s'ha generat automàticament des de l'Assistent Tècnic Intel·ligent.</small></p>
        `
    };

    try {
        // En un entorn real, aquí s'enviaria el correu. Per a la prova, ho simularem.
        console.log(`Simulant enviament de correu a: ${coordinatorEmail}`);
        console.log(`Contingut: ${userProblem}`);
        
        // Simulem un retard per fer-ho més realista
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        res.json({ success: true, message: 'Correu enviat correctament al coordinador TAC.' });
    } catch (error) {
        console.error('Error enviant email:', error);
        res.status(500).json({ error: 'No s\'ha pogut enviar el correu.' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor de suport actiu al port ${PORT}`);
});
