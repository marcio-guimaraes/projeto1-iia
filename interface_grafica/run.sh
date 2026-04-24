#!/bin/bash
echo "Iniciando backend FastAPI..."
cd backend
# Assume .venv is in UnB/teste/.venv
source ../../.venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

echo "Iniciando frontend React (Vite)..."
cd ../frontend
npm run dev -- --host &
FRONTEND_PID=$!

echo ""
echo "============================================================"
echo "✨ SISTEMA DE RECOMENDAÇÃO EM EXECUÇÃO ✨"
echo "👉 Frontend em: http://localhost:5173"
echo "👉 Backend API em: http://localhost:8000"
echo "👉 Docs da API em: http://localhost:8000/docs"
echo "============================================================"
echo "Pressione Ctrl+C para encerrar tudo."
echo "============================================================"

# Handlers para matar ambos processos ao finalizar
trap "kill -9 $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM
wait
