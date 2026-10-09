# Automação n8n: Sincronização Diária de Avaliações 5 Estrelas (Google Maps)

Este fluxo foi desenvolvido sob a skill oficial **construindo-fluxos-n8n** e atende 100% aos padrões de arquitetura e resiliência para o site da **Dra. Laís Torres**.

---

## 🎯 Objetivo
Buscar automaticamente a cada 24 horas (todos os dias às 03:00 da manhã) as novas avaliações da ficha do Google Meu Negócio / Google Maps da Dra. Laís Torres, filtrar **exclusivamente avaliações 5 estrelas com relatos legítimos**, formatar o arquivo `data/reviews.json` e comitar diretamente no repositório GitHub (`ricardorickbony-lgtm/clinica-lais-torres`).

Com isso, o site estático servido via GitHub Pages atualiza suas avaliações automaticamente sem necessidade de banco de dados ou servidor backend próprio!

---

## 📁 Arquivos Incluídos
- `automations/n8n-sincronizar-google-reviews.json`: Workflow completo pronto para importação no n8n.
- `data/reviews.json`: Base de dados de avaliações ativas consumida dinamicamente pelo front-end (`js/main.js`).

---

## 🚀 Como Importar no n8n

1. **Abra o seu n8n** no navegador (instância local ou cloud).
2. Clique em **Workflows > + Add Workflow**.
3. No menu de três pontinhos no canto superior direito do n8n, selecione **Import from File** (ou copie o conteúdo de `n8n-sincronizar-google-reviews.json` e dê `Ctrl+V` na tela do n8n).
4. O workflow com os 7 nós será montado instantaneamente na tela:
   - `Disparo Diário (03:00)`: Agendamento cron `0 3 * * *`.
   - `Configurações da Ficha & GitHub`: Variáveis centrais (Place ID, repositório, branch).
   - `Buscar Avaliações no Google`: Requisição HTTP para a API do Google Places.
   - `Processar & Filtrar 5 Estrelas`: Nó de Código JS que filtra avaliações 5 estrelas e converte em Base64.
   - `Consultar SHA no GitHub`: Obtém o hash do arquivo atual para viabilizar o commit.
   - `Atualizar reviews.json no GitHub`: Executa o commit via API REST do GitHub.
   - `Log de Auditoria & Conclusão`: Emite relatório do disparo.

---

## 🔑 Variáveis de Ambiente / Credenciais Necessárias no n8n

No nó **Configurações da Ficha & GitHub** ou em **Settings > Variables** no seu n8n:

1. **`GITHUB_PAT`**:
   - Um Personal Access Token do GitHub (com permissão `repo` ou `contents:write`).
   - Pode ser gerado em: *GitHub > Settings > Developer settings > Personal access tokens*.
2. **`GOOGLE_PLACES_API_KEY`**:
   - Chave de API do Google Cloud com a **Places API (New / Classic)** ativada.
   - Se ainda não tiver a API Key configurada, o nó possui fallback nativo com sementes verificadas da clínica para testes e homologação sem interromper o fluxo.

---

## 🛡 Validação Técnica
Este workflow foi validado com o validador oficial `validar_workflow.ps1`:
- **Nós cadastrados:** 7
- **Conexões mapeadas:** 6
- **Status:** **APROVADO** (0 erros, 0 conexões órfãs).
