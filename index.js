import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from 'dotenv';
import bodyParser from 'body-parser';


dotenv.config()

const app = express()

app.use(bodyParser.json()); 

let userResponse = "";

const genAI = new GoogleGenerativeAI(process.env.API_KEY)

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",  systemInstruction: "você é um especialista em programação especializado em renderização. para interfaces de front-end. Quando descrevo um componente de um site que desejo para criar, retorne o HTML e o CSS necessários. Não dê para este código. Ofereça também algumas sugestões de design de interface.", });


app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Alerta no GET</title>
      </head>
      <body>
        <script>
          // Exibir o prompt e capturar a resposta
          const resposta = prompt('Olá, digite aqui o que deseja para o chat');
          
          // Enviar a resposta para o servidor usando fetch
          fetch('/salvar-resposta', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ resposta })
          }).then(() => {
            // Após enviar a resposta, redirecionar para uma página de confirmação
            window.location.href = '/ver-resposta';
          });
        </script>
        <h1>Bem-vindo à página com alerta!</h1>
      </body>
    </html>
  `);
});

// Rota POST para salvar a resposta do prompt
app.post('/salvar-resposta', async (req, res) => {
  userResponse = req.body.resposta; // Armazenar a resposta na variável
  res.sendStatus(200); // Enviar uma resposta de sucesso
});

// Rota para exibir a resposta armazenada
app.get('/ver-resposta', async(req, res) => {
  const result = await model.generateContent(userResponse)
  res.send(result.response.text());
});


const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})