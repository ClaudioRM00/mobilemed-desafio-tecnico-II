# Script para limpar arquivos gerados automaticamente
Write-Host "🧹 Limpando arquivos gerados automaticamente..." -ForegroundColor Yellow

# Remover arquivos .js.map
Write-Host "Removendo arquivos .js.map..." -ForegroundColor Cyan
Get-ChildItem -Path . -Recurse -Filter "*.js.map" | Remove-Item -Force

# Remover arquivos .d.ts (exceto os que estão em src)
Write-Host "Removendo arquivos .d.ts..." -ForegroundColor Cyan
Get-ChildItem -Path . -Recurse -Filter "*.d.ts" | Where-Object { $_.FullName -notlike "*\src\*" } | Remove-Item -Force

# Remover arquivos .js (exceto os que estão em src)
Write-Host "Removendo arquivos .js..." -ForegroundColor Cyan
Get-ChildItem -Path . -Recurse -Filter "*.js" | Where-Object { $_.FullName -notlike "*\src\*" } | Remove-Item -Force

# Remover diretórios dist
Write-Host "Removendo diretórios dist..." -ForegroundColor Cyan
Get-ChildItem -Path . -Recurse -Directory -Name "dist" | ForEach-Object { Remove-Item -Path $_ -Recurse -Force }

Write-Host "✅ Limpeza concluída!" -ForegroundColor Green
Write-Host "💡 Agora você pode commitar as mudanças e os arquivos gerados não serão mais rastreados." -ForegroundColor Yellow
