# Badges para README

Adicione estes badges ao seu README.md principal para mostrar o status do CI/CD:

## Badges Principais

```markdown
[![CI Pipeline](https://github.com/{username}/{repo-name}/workflows/CI%20Pipeline/badge.svg)](https://github.com/{username}/{repo-name}/actions?query=workflow%3A%22CI+Pipeline%22)
[![Code Quality](https://github.com/{username}/{repo-name}/workflows/Code%20Quality%20Analysis/badge.svg)](https://github.com/{username}/{repo-name}/actions?query=workflow%3A%22Code+Quality+Analysis%22)
[![CodeQL](https://github.com/{username}/{repo-name}/workflows/CodeQL/badge.svg)](https://github.com/{username}/{repo-name}/actions?query=workflow%3A%22CodeQL%22)
```

## Badges de Cobertura (após configurar Codecov)

```markdown
[![codecov](https://codecov.io/gh/{username}/{repo-name}/branch/main/graph/badge.svg)](https://codecov.io/gh/{username}/{repo-name})
```

## Badges de Tecnologia

```markdown
![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![Angular](https://img.shields.io/badge/Angular-20.x-red.svg)
![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)
![Docker](https://img.shields.io/badge/Docker-✓-blue.svg)
```

## Exemplo Completo

```markdown
# MobileMed - Desafio Técnico II

[![CI Pipeline](https://github.com/{username}/{repo-name}/workflows/CI%20Pipeline/badge.svg)](https://github.com/{username}/{repo-name}/actions?query=workflow%3A%22CI+Pipeline%22)
[![Code Quality](https://github.com/{username}/{repo-name}/workflows/Code%20Quality%20Analysis/badge.svg)](https://github.com/{username}/{repo-name}/actions?query=workflow%3A%22Code+Quality+Analysis%22)
[![CodeQL](https://github.com/{username}/{repo-name}/workflows/CodeQL/badge.svg)](https://github.com/{username}/{repo-name}/actions?query=workflow%3A%22CodeQL%22)

![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![Angular](https://img.shields.io/badge/Angular-20.x-red.svg)
![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)
![Docker](https://img.shields.io/badge/Docker-✓-blue.svg)

## Descrição do Projeto

Sistema de gerenciamento médico com backend em NestJS e frontend em Angular.

## Como Usar

1. Clone o repositório
2. Execute `docker-compose up`
3. Acesse http://localhost:4200

## CI/CD

Este projeto utiliza GitHub Actions para CI/CD automatizado. Veja mais detalhes em [.github/README.md](.github/README.md).
```

## Instruções

1. Substitua `{username}` pelo seu nome de usuário do GitHub
2. Substitua `{repo-name}` pelo nome do seu repositório
3. Para usar o Codecov, conecte seu repositório em https://codecov.io
4. Os badges serão atualizados automaticamente conforme o status dos workflows
