import pool from '../database/database.js';
import { downloadAllDocuments } from '../application/documentService.js';

async function procesarDescargaAutomatica() {
    try {
        const result = await pool.query(`
            SELECT DISTINCT expediente
            FROM public.v_his
            WHERE expediente IS NOT NULL
        `);

        const expedientes = result.rows.map(row => row.expediente);
        const total = expedientes.length;
        let procesados = 0;

        console.log(`Iniciando migración de ${total} expedientes...`);

        for (const expedienteId of expedientes) {
            // Simular objeto `res` para evitar errores en `downloadAllDocuments`
            const fakeRes = {
                status: () => ({ json: () => {} }),
                json: () => {}
            };

            await downloadAllDocuments(expedienteId, fakeRes);

            procesados++;

            const porcentaje = ((procesados / total) * 100).toFixed(2);
            console.log(`Descargado expediente ${procesados}/${total} (${porcentaje}%)`);
        }

        console.log('Migración finalizada: 100% completado.');

    } catch (error) {
        console.error("Error en descarga automática:", error.message);
    }
}

export { procesarDescargaAutomatica };