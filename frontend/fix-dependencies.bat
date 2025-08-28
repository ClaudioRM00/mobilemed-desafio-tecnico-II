@echo off
echo Resolvendo problemas de dependencias do Angular...
echo.

echo Limpando cache do npm...
npm cache clean --force

echo.
echo Removendo node_modules e package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo Instalando dependencias...
npm install

echo.
echo Verificando Angular CLI...
npm list -g @angular/cli

echo.
echo Processo concluido!
echo Agora tente executar: npm run dev
pause
