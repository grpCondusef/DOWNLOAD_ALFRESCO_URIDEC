import express from 'express';
import { downloadAllDocuments } from '../application/documentService.js';

const documentRoutes = express.Router();

// Ruta para obtener documentos y descargarlos automáticamente en orden
documentRoutes.get('/documents/:claveExpediente', async (req, res) => {
    try {
        const claveExpediente = req.params.claveExpediente;
        await downloadAllDocuments(claveExpediente, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default documentRoutes;
