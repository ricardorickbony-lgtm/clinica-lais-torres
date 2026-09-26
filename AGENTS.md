# Padrão Oficial de Projetos de Sites — Severino & Ricardo

Este arquivo estabelece a diretriz obrigatória e permanente para todo e qualquer projeto de site criado para o usuário Ricardo:

## 1. Localização e Estrutura de Pastas (Workspace Antigravity)
- Todo novo site deve ser criado dentro de:
  `C:\Users\ricar\OneDrive\Documentos\Projetos\<nome-do-site>`
- Esta pasta é o Workspace oficial para abertura e edição no Antigravity (`File > Open Folder`).

## 2. Acesso Rápido na Área de Trabalho (Desktop)
- Criar sempre um atalho direto (.lnk) na Área de Trabalho do Windows:
  `C:\Users\ricar\OneDrive\Área de Trabalho\<Nome do Site>.lnk`
- Apontando diretamente para a pasta do projeto em Documentos, permitindo ao Ricardo abrir a pasta do site com 1 duplo clique da Área de Trabalho.

## 3. Versionamento e Sincronização em Nuvem no GitHub
- Inicializar repositório Git local (`git init`).
- Conectar ao GitHub oficial do Ricardo (`ricardorickbony-lgtm`).
- Criar `.gitignore` adequado (ignorando temporários, logs e arquivos de sistema).
- Fazer commit e manter todas as versões salvas na nuvem com `git push origin main`.

## 4. Padrões de Design e Conversão
- Design responsivo de alto nível (Mobile First & Desktop).
- Botão inteligente de WhatsApp com status em tempo real (Online / Fora do Expediente) sincronizado com os horários de atendimento do cliente/clínica.
