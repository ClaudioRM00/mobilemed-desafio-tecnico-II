# Guia de Solução de Problemas - Frontend Angular

## Problemas Comuns e Soluções

### 1. Erros de Dependências do Angular

Se você encontrar erros como:
- `Cannot find module '@angular/core'`
- `Cannot find module '@angular/common'`
- `No suitable injection token`

**Solução:**
```bash
# Limpar cache e reinstalar dependências
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. Erros de Tipos TypeScript

Se você encontrar erros como:
- `Cannot find name 'console'`
- `Cannot find name 'document'`
- `Cannot find name 'Date'`

**Solução:**
Os arquivos de configuração já foram atualizados para incluir as bibliotecas DOM necessárias.

### 3. Erros de Compilação

Se você encontrar erros de compilação relacionados a:
- `tslib`
- `rxjs/operators`
- Tipos implícitos

**Solução:**
Os arquivos de configuração foram ajustados para resolver esses problemas.

## Comandos para Executar

### Desenvolvimento Local
```bash
# Usando npm
npm run dev

# Ou usando ng diretamente
ng serve --proxy-config proxy.conf.json
```

### Build de Produção
```bash
npm run build
```

### Testes
```bash
npm test
```

## Estrutura de Arquivos Importante

- `tsconfig.json` - Configuração principal do TypeScript
- `tsconfig.app.json` - Configuração específica para a aplicação
- `angular.json` - Configuração do Angular CLI
- `src/types.d.ts` - Declarações de tipos globais

## Verificações

1. Certifique-se de que o Node.js está na versão 18+ ou 20+
2. Verifique se o Angular CLI está instalado: `ng version`
3. Confirme que todas as dependências estão instaladas: `npm list`

## Se os Problemas Persistirem

1. Execute o script PowerShell: `.\fix-dependencies.ps1`
2. Verifique se há conflitos de versão no `package.json`
3. Considere usar uma versão específica do Angular CLI: `npm install -g @angular/cli@20.2.0`
