const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL; // Use a variável de ambiente para a URL do banco de dados

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { playerName, round } = req.body;

        const client = new Client({
            connectionString,
        });

        try {
            await client.connect();
            const now = new Date();
            const date = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD

            const insertQuery = 'INSERT INTO alunos (nome, data, fase) VALUES ($1, $2, $3)';
            await client.query(insertQuery, [playerName, date, round]);

            res.status(200).json({ message: 'Dados salvos com sucesso!' });
        } catch (err) {
            console.error('Erro ao salvar dados:', err);
            res.status(500).json({ error: 'Erro ao salvar dados' });
        } finally {
            await client.end();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};