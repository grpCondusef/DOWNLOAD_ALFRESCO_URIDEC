import axios from 'axios';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const ALFRESCO_ORDERED_URL = 'https://alfresco.condusef.gob.mx/alfresco/s/mx/com/iikt/expediente/documentos';
const ALFRESCO_TICKET = process.env.ALFRESCO_TICKET;  // Usa variable de entorno

const axiosInstance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Evita problemas de certificado
});

async function getOrderedDocuments(claveExpediente) {
    try {
        const url = `${ALFRESCO_ORDERED_URL}?clave=${claveExpediente}&alf_ticket=${ALFRESCO_TICKET}&ordenamiento=2`;
        console.log(`Obteniendo documentos en orden desde: ${url}`);

        const response = await axiosInstance.get(url);

        if (!Array.isArray(response.data)) {
            console.error("Error: La respuesta de Alfresco no es un array de documentos:", response.data);
            return [];
        }

        return response.data; // Devuelve la lista de documentos en orden correcto
    } catch (error) {
        console.error("Error obteniendo documentos ordenados:", error.response?.data || error.message);
        throw error;
    }
}

export { getOrderedDocuments };
