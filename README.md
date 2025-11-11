# Sistema de Gestão de Supermercado - Sonae

Sistema web para gestão interna de supermercados desenvolvido para funcionários e gestores.

## 🎯 Objetivo

Aplicação web otimizada para tablets e dispositivos móveis que permite:
- Monitoramento em tempo real do status de produtos
- Recebimento de conselhos baseados em IA
- Análise de estatísticas de vendas e ocupação de espaço

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── assets/           # Imagens e recursos estáticos
├── components/       # Componentes reutilizáveis
│   ├── ui/          # Componentes shadcn-ui
│   ├── Layout.tsx   # Layout principal com navegação
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   ├── ProductZone.tsx
│   ├── ProductModal.tsx
│   └── ConselhoCard.tsx
├── pages/           # Páginas da aplicação
│   ├── Status.tsx
│   ├── Conselhos.tsx
│   └── Estatisticas.tsx
├── services/        # Lógica de API e mock data
│   ├── api.ts       # Métodos centralizados de API
│   ├── mockStockData.ts
│   ├── mockAdviceData.ts
│   └── mockStatisticsData.ts
└── types/           # Interfaces TypeScript globais
    └── index.ts
```

## 📋 Regras de Programação

### 1. Modularização
- **Máximo 150 linhas por arquivo**
- Cada componente deve ter responsabilidade única
- Funções reutilizáveis devem ser extraídas

### 2. Chamadas API
- Todas as chamadas usam o método `api<T>(endpoint, options)` em `services/api.ts`
- URL base configurada em `API_BASE_URL`
- Cookie de sessão "Autenticacao" incluído automaticamente em todos os requests

### 3. Estados de Carregamento
- Hook `useState` para gerenciar loading states
- Componente `LoadingSpinner` exibe animação durante operações
- Feedback visual obrigatório para todas operações assíncronas

### 4. Interfaces
- **Todas as interfaces em `src/types/index.ts`**
- Exportação global para uso em toda aplicação
- Tipagem forte obrigatória (TypeScript)

### 5. Mock Data
- Cada serviço tem dados mock com mínimo 10 exemplos
- Funções API tentam chamada real primeiro
- Em caso de falha, retornam mock data automaticamente
- Estrutura: `try { chamada_real } catch { return mock_data }`

### 6. Tratamento de Erros
- Nunca ocultar erros do usuário
- Mensagens claras e não-técnicas
- Componente `ErrorMessage` para exibição consistente

### 7. Design System
- Cores definidas em `src/index.css` e `tailwind.config.ts`
- Uso de variáveis CSS (HSL) para temas
- Paleta Sonae: Azul marinho (#001F5C) e Azul (#0066FF)
- Sistema de cores semânticas:
  - `--primary`: Azul marinho Sonae
  - `--secondary`: Azul vibrante Sonae
  - `--success`: Verde para status OK
  - `--warning`: Amarelo para alertas
  - `--danger`: Vermelho para crítico

## 🎨 Design

### Cores Status de Produtos
- **Cinza**: Produto OK (>60%)
- **Amarelo**: Produto baixo (20-60%)
- **Vermelho**: Produto crítico (<20%)

### Responsividade
- Design mobile-first
- Otimizado para tablets (768px+)
- Grid adaptativo para diferentes tamanhos de tela

## 📱 Páginas

### /status
Vista de mapa do supermercado com status em tempo real:
- Grid de produtos com código de cores
- Click abre modal com detalhes
- Opção de adicionar comentários
- Botões "OK" ou "Não se Faz"

### /conselhos
Lista de recomendações geradas por IA:
- Cards com prioridade (alta/média/baixa)
- Tipos: reposição, otimização, alerta, sugestão
- Botões aceitar/rejeitar
- Feedback visual após ação

### /estatisticas
Tabela analítica com:
- Nome do produto e categoria
- % de vendas
- % de espaço ocupado
- Índice de eficiência (vendas/espaço)
- Ordenação clicável por qualquer coluna

## 🔧 Tecnologias

- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Shadcn-ui** para componentes
- **React Router** para navegação
- **Sonner** para notificações toast
- **Lucide React** para ícones

## 🚀 Como Usar

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build produção
npm run build
```

## 🔌 Integração com Backend

Quando conectar ao backend real:
1. Configurar `API_BASE_URL` em `services/api.ts`
2. Substituir lógica mock nas funções `get_*` e `post_*`
3. Manter estrutura de interfaces existente
4. Cookie "Autenticacao" já configurado

## 📝 Idioma

- **Todo o conteúdo em Português** (PT)
- Interface, mensagens e documentação em PT
- Comentários de código em PT quando necessário

## 🎯 Próximos Passos

1. Conectar com backend real
2. Implementar autenticação
3. Adicionar filtros avançados
4. Dashboard com gráficos
5. Notificações push
6. Histórico de ações
