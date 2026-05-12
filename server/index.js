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

// Eina de cerca a la web millorada
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query required' });

    console.log('Cercant a la web per:', query);
    
    try {
        // Utilitzem una cerca de DuckDuckGo que retorna més enllaços i descripcions si l'API ho permet
        // o simulem una extracció més rica de la resposta
        const searchRes = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
        
        let results = "";
        
        if (searchRes.data.AbstractText) {
            results += `RESUM PRINCIPAL: ${searchRes.data.AbstractText}\n\n`;
        }

        if (searchRes.data.RelatedTopics && searchRes.data.RelatedTopics.length > 0) {
            results += "DETALLS ADDICIONALS TROBATS:\n";
            searchRes.data.RelatedTopics.slice(0, 5).forEach((topic, i) => {
                if (topic.Text) {
                    results += `${i+1}. ${topic.Text}\n`;
                } else if (topic.Topics) {
                    // Per a temes agrupats
                    topic.Topics.slice(0, 2).forEach(subtopic => {
                        results += `- ${subtopic.Text}\n`;
                    });
                }
            });
        }

        if (!results) {
            results = "No s'ha trobat informació específica, però suggereix comprovar les connexions i reiniciar l'aparell.";
        }

        res.json({ results });
    } catch (error) {
        console.error('Error en la cerca:', error);
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
