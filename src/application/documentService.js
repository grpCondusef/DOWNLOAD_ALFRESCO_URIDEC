import axios from 'axios';
import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getOrderedDocuments } from '../database/documentRepository.js';

dotenv.config();

const ALFRESCO_BASE_URL = 'https://acs.condusef.gob.mx/alfresco/s/mx/com/iikt/download/workspace/SpacesStore';
const DOWNLOADS_PATH = '\\archexpedientes\\download_alfresco';

const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function downloadDocument(doc, expedienteFolder) {
    const docUrl = `${ALFRESCO_BASE_URL}/${doc.id}?alf_ticket=${process.env.ALFRESCO_TICKET}`;
    const filePath = path.join(expedienteFolder, doc.nombre);

    try {
        const response = await axiosInstance({
            url: docUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`Descargado: ${doc.nombre}`);
                resolve();
            });
            writer.on('error', reject);
        });

    } catch (err) {
        console.error(`Error descargando ${doc.nombre}:`, err.message);
    }
}

async function downloadAllDocuments(expedienteId, res) {
    try {
        const documents = await getOrderedDocuments(expedienteId);
        if (!documents || documents.length === 0) {
            return res.status(404).json({ message: "No se encontraron documentos para el expediente" });
        }

        // Obtener año y mes del primer documento
        const fechaPrimera = documents[0].fecha;
        const fecha = new Date(fechaPrimera);
        const anio = fecha.getFullYear().toString();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDay() + 1).padStart(2, '0');

        // Crear ruta final de descarga: año/mes/expedienteId
        const expedienteFolder = path.join(DOWNLOADS_PATH, anio, mes, dia, expedienteId);

        // Validar si la carpeta ya existe y contiene archivos
        if (fs.existsSync(expedienteFolder)) {
            const files = fs.readdirSync(expedienteFolder);
            if (files.length > 0) {
                return res.status(409).json({ message: `La carpeta "${expedienteId}" ya contiene archivos. La descarga fue cancelada.` });
            }
        } else {
            fs.mkdirSync(expedienteFolder, { recursive: true });
        }

        console.log(`Descargando ${documents.length} documentos en orden en: ${expedienteFolder}`);

        for (const doc of documents) {
            await downloadDocument(doc, expedienteFolder);
            await delay(1000); // Puedes ajustar si deseas menor tiempo
        }

        return res.json({ message: `Descarga completada en ${expedienteFolder}` });

    } catch (error) {
        console.error("Error al obtener documentos:", error);
        res.status(500).json({ message: "Error al obtener documentos" });
    }
}

export { downloadAllDocuments };
