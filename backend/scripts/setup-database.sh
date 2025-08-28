#!/bin/bash

echo "🚀 Configurando banco de dados PostgreSQL..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker compose down

# Remover volumes existentes (opcional - descomente se quiser limpar tudo)
# echo "🧹 Removendo volumes existentes..."
# docker compose down -v

# Iniciar PostgreSQL
echo "🐘 Iniciando PostgreSQL..."
docker compose up -d postgres

# Aguardar PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
until docker compose exec -T postgres pg_isready -U postgres -d mobilemed_db; do
    echo "Aguardando PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL está pronto!"

# Executar migrações
echo "📦 Executando migrações..."
npm run db:migrate

# Executar seed
echo "🌱 Executando seed..."
npm run db:seed

echo "🎉 Setup do banco de dados concluído!"
echo ""
echo "📊 Informações de conexão:"
echo "   Host: localhost"
echo "   Porta: 5432"
echo "   Database: mobilemed_db"
echo "   Usuário: postgres"
echo "   Senha: password"
echo ""
echo "🌐 pgAdmin disponível em: http://localhost:8080"
echo "   Email: admin@mobilemed.com"
echo "   Senha: admin123"
