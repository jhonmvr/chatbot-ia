# RAG Hybrid MVP (Next.js + Vercel AI + Qdrant + Postgres)

Este MVP implementa un esquema **híbrido**: Postgres (metadatos y trazabilidad) + Qdrant (búsqueda vectorial de alto rendimiento).
Incluye endpoints de **ingesta** y **chat** (streaming) y un **webhook** para WhatsApp Business.

## Puesta en marcha
1. `docker compose -f docker/docker-compose.yml up -d`
2. Crea tablas: `npm i && npx prisma migrate dev` (o `prisma db push`)
3. Copia `.env.example` a `.env` y completa las variables.
4. `npm run dev` y prueba:
   - `POST /api/ingest` con `{ sourceUri, title, lang, collection, text }`
   - `POST /api/chat` con `{ query, filters }` (stream)

## Backlog
                     tarea  subtareas
        Analítica & Costos          1
  Arquitectura & Seguridad          1
Base de conocimiento (RAG)          1
      Calidad & Despliegue          1
               Contexto IA          1
  Conversaciones & Handoff          1
              Cumplimiento          1
                    Flujos          1
       Gestión de clientes          1
     Gestión de plantillas          1
           Infraestructura          1
             Integraciones          1
      Integración WhatsApp          1
   Mensajería automatizada          1
                 Operación          1
                     Panel          1
                       RAG          1

> Se incluye `BACKLOG.csv` generado desde tu Excel (si se pudo procesar).
