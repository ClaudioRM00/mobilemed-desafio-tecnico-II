# Script para resolver problemas de dependências do Angular
Write-Host "Resolvendo problemas de dependências do Angular..." -ForegroundColor Green

# Limpar cache do npm
Write-Host "Limpando cache do npm..." -ForegroundColor Yellow
npm cache clean --force

# Remover node_modules e package-lock.json
Write-Host "Removendo node_modules e package-lock.json..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json"
}

# Instalar dependências
Write-Host "Instalando dependências..." -ForegroundColor Yellow
npm install

# Verificar se o Angular CLI está instalado globalmente
Write-Host "Verificando Angular CLI..." -ForegroundColor Yellow
npm list -g @angular/cli

Write-Host "Processo concluído!" -ForegroundColor Green
Write-Host "Agora tente executar: ng serve --proxy-config proxy.conf.json" -ForegroundColor Cyan
