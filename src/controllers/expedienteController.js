import pool from '../database/database.js';
import { downloadAllDocuments } from '../application/documentService.js';

async function procesarDescargaAutomatica() {
    try {
        const result = await pool.query(`
            SELECT expediente
            FROM public.v_his
            WHERE expediente IS NOT NULL
        `);

        for (const row of result.rows) {
            const expedienteId = row.expediente;
            console.log(`Procesando expediente: ${expedienteId}`);

            // Simular objeto `res` para evitar errores en `downloadAllDocuments`
            const fakeRes = {
                status: (code) => ({
                    json: (data) => console.log(`Status ${code}:`, data),
                }),
                json: (data) => console.log(data),
            };

            await downloadAllDocuments(expedienteId, fakeRes);
        }

    } catch (error) {
        console.error("Error en descarga automática:", error.message);
    }
}

export { procesarDescargaAutomatica };