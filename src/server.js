import express from 'express';
import json from 'body-parser';
import documentRoutes from './routes/documentRoutes.js';
import dotenv from 'dotenv';
import { procesarDescargaAutomatica } from './controllers/expedienteController.js';

dotenv.config();

const app = express();
app.use(json());
app.use('/api', documentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    console.log('Ejecutando proceso de descarga automática...');
    procesarDescargaAutomatica();
});
