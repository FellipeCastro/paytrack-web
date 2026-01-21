# 🎨 PayTrack Frontend

**PayTrack Frontend** é a interface web desenvolvida em React para o sistema de controle de assinaturas e gastos recorrentes. Proporciona uma experiência moderna, responsiva e intuitiva para gerenciamento financeiro pessoal.

---

## 🎯 Objetivo do Projeto

O frontend do PayTrack tem como objetivo fornecer uma interface amigável e eficiente para que usuários possam:

- Visualizar de forma clara seus gastos mensais e anuais com assinaturas
- Gerenciar assinaturas de forma intuitiva com operações CRUD completas
- Organizar serviços por categorias personalizáveis
- Receber alertas visuais sobre cobranças próximas
- Acompanhar tendências de gastos através de relatórios gráficos

A interface foi projetada com foco em **usabilidade**, **responsividade** e **performance**, seguindo melhores práticas de desenvolvimento frontend moderno.

---

## ✨ Funcionalidades Implementadas

### 🏠 Dashboard

- **Visão geral financeira** - Cards com resumo de gastos mensais, assinaturas ativas e valor médio
- **Lista de assinaturas ativas** - Tabela interativa com todas as assinaturas
- **Gráfico de gastos por categoria** - Visualização proporcional dos gastos
- **Próximas cobranças** - Lista de cobranças pendentes para os próximos dias
- **Alertas recentes** - Notificações sobre ações necessárias
- **Projeção anual** - Estimativa de gastos para os próximos 12 meses

### 📋 Assinaturas

- **Lista completa** - Visualização tabular com filtros e ordenação
- **CRUD completo** - Criar, ler, editar e excluir (cancelar) assinaturas
- **Filtros avançados** - Por status, categoria e ciclo de cobrança
- **Busca em tempo real** - Filtragem por nome do serviço
- **Estatísticas** - Cards com resumo de assinaturas ativas e valor total

### 📂 Categorias

- **Gestão de categorias** - Criar, editar e excluir categorias
- **Personalização visual** - Seleção de cores para identificação rápida
- **Grid responsivo** - Layout adaptável para diferentes tamanhos de tela
- **Validações** - Prevenção de categorias duplicadas

### 📊 Relatórios

- **Análise mensal** - Gráfico de gastos dos últimos 12 meses
- **Distribuição por categoria** - Visualização de porcentagens de gastos
- **Principais assinaturas** - Tabela com serviços de maior impacto financeiro
- **Tendência de gastos** - Comparação entre valores reais e projetados
- **Filtros por período** - Personalização de intervalos de análise

### 🔔 Alertas

- **Central de notificações** - Lista organizada de alertas
- **Marcação como lido** - Individual ou em massa
- **Filtros inteligentes** - Separar lidos, não lidos ou todos
- **Estatísticas** - Contadores de alertas por status
- **Ícones contextuais** - Identificação visual por tipo de alerta

### 👤 Perfil

- **Informações pessoais** - Nome e configurações
- **Preferências** - Moeda padrão e notificações
- **Informações da conta** - Data de criação e ID do usuário

---

## 🛠 Tecnologias Utilizadas

### **Core Framework & Bibliotecas**

- **React 18** - Biblioteca principal para construção de interfaces
- **React Router DOM v6** - Roteamento declarativo e navegação SPA
- **Axios** - Cliente HTTP para comunicação com a API
- **React Icons** - Conjunto completo de ícones para React

### **Estilização & UI**

- **Tailwind CSS v3** - Framework CSS utilitário-first
- **Autoprefixer & PostCSS** - Processamento e otimização de CSS

### **Gerenciamento de Estado**

- **Context API + useState/useEffect** - Gerenciamento de estado local e global
- **React Router Hooks** - Navegação programática e acesso a parâmetros

### **Validação & Formulários**

- **Validação nativa** - Implementação customizada com useState
- **Formulários controlados** - Gerenciamento completo do ciclo de vida

### **Utilitários**

- **Intl.NumberFormat** - Formatação de moeda e números
- **Date API nativa** - Manipulação e formatação de datas

---

## 🏗 Arquitetura do Projeto

### **Estrutura de Diretórios**

```
paytrack-frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   └── Layout.jsx      # Layout principal com navegação
│   ├── config/             # Configurações da aplicação
│   │   └── api.js          # Configuração do Axios e interceptors
│   ├── pages/              # Páginas principais da aplicação
│   │   ├── Dashboard.jsx   # Dashboard principal
│   │   ├── Subscriptions.jsx # Gestão de assinaturas
│   │   ├── SubscriptionForm.jsx # Formulário de assinatura
│   │   ├── Categories.jsx  # Gestão de categorias
│   │   ├── CategoryForm.jsx # Formulário de categoria
│   │   ├── Reports.jsx     # Relatórios e análises
│   │   ├── Alerts.jsx      # Central de alertas
│   │   ├── Profile.jsx     # Perfil do usuário
│   │   ├── ChargeForm.jsx  # Registro de cobranças
│   │   ├── Login.jsx       # Página de login
│   │   ├── Register.jsx    # Página de registro
│   │   └── LandingPage.jsx # Página inicial
│   ├── App.jsx             # Configuração de rotas principal
│   └── index.jsx           # Ponto de entrada da aplicação
├── public/                 # Arquivos estáticos
├── tailwind.config.js      # Configuração do Tailwind CSS
├── postcss.config.js       # Configuração do PostCSS
├── package.json           # Dependências e scripts
└── README.md              # Documentação do projeto
```

### **Padrões de Design Implementados**

#### 1. **Component Composition**

- Componentes modulares e reutilizáveis
- Props drilling mínimo através de composição

#### 2. **Container/Presentational Pattern**

- Separação clara entre lógica e apresentação
- Páginas como containers, componentes como presentacionais

#### 3. **Layout Component Pattern**

- Layout principal compartilhado entre todas as páginas autenticadas
- Navegação consistente e responsiva

#### 4. **Route Protection**

- Rotas protegidas com verificação de autenticação
- Redirecionamento automático baseado em estado de login

#### 5. **Error Boundary Pattern**

- Tratamento de erros em chamadas de API
- Fallback UI para estados de erro

---

## 🔧 Características Técnicas

### **Responsividade**

- **Mobile-first approach** - Design pensado primeiro para mobile
- **Breakpoints Tailwind** - sm, md, lg, xl, 2xl
- **Layouts adaptativos** - Grids e flexbox responsivos
- **Navegação mobile** - Menu hamburger para dispositivos móveis

### **Performance**

- **Code splitting** - Carregamento lazy de rotas
- **Imagens otimizadas** - Uso de SVG e ícones font-based
- **Minimal bundle size** - Apenas dependências essenciais
- **Caching inteligente** - Reutilização de dados da API quando possível

### **Acessibilidade**

- **Semantic HTML** - Tags apropriadas para conteúdo
- **ARIA labels** - Atributos para leitores de tela
- **Keyboard navigation** - Navegação completa via teclado
- **Contraste adequado** - Cores com boa legibilidade

### **UX/UI Design**

- **Design system consistente** - Cores, tipografia e espaçamento padronizados
- **Feedback visual** - Estados de loading, sucesso e erro
- **Microinterações** - Transições e animações sutis
- **Form validation** - Validação em tempo real com feedback

---

## 📡 Integração com Backend

### **Configuração da API**

```javascript
// config/api.js
const api = axios.create({
    baseURL: process.env.VITE_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

### **Padrões de Comunicação**

- **HTTP Methods apropriados** - GET, POST, PUT, PATCH, DELETE
- **Status code handling** - Tratamento específico por código de resposta
- **Error handling** - Mensagens de erro amigáveis ao usuário
- **Loading states** - Feedback visual durante requisições

### **Autenticação**

- **JWT Token storage** - Armazenamento seguro no localStorage
- **Auto-logout** - Redirecionamento quando token expira
- **Protected routes** - Middleware de autenticação no frontend

---

## 🚀 Scripts Disponíveis

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Build para produção
npm run build

# Rodar tests
npm test

# Ejetar configurações (não recomendado)
npm run eject
```

---

## ⚙️ Configuração de Ambiente

### **Variáveis de Ambiente**

```env
VITE_API_URL=http://localhost:5000
```

---

## 🧪 Testes & Qualidade

### **Estratégia de Testes**

- **Testes manuais** - Verificação de fluxos principais
- **Responsive testing** - Testes em diferentes dispositivos
- **Cross-browser testing** - Compatibilidade com navegadores modernos

### **Ferramentas de Desenvolvimento**

- **React Developer Tools** - Inspeção de componentes e estado
- **Tailwind CSS IntelliSense** - Autocomplete para classes
- **ESLint** - Análise estática de código (configuração recomendada)

---

## 📱 Compatibilidade

### **Navegadores Suportados**

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### **Dispositivos**

- Desktop (Windows, macOS, Linux)
- Tablet (iPad, Android tablets)
- Mobile (iPhone, Android phones)

---

## 🔄 Fluxo de Trabalho

### **Desenvolvimento**

1. Clonar repositório
2. Instalar dependências (`npm install`)
3. Configurar variáveis de ambiente
4. Iniciar servidor de desenvolvimento (`npm start`)
5. Desenvolver com hot reload ativado

### **Build & Deploy**

1. Atualizar variáveis de ambiente para produção
2. Rodar build (`npm run build`)
3. Servir arquivos da pasta `build/`
4. Configurar reverse proxy se necessário

---

## 🎨 Design System

### **Cores Principais**

- **Primary**: `blue-600` → `purple-600` (gradiente)
- **Success**: `green-500`
- **Warning**: `amber-500`
- **Error**: `red-500`
- **Background**: `gray-50` → `white` (gradiente)

### **Tipografia**

- **Font Family**: System UI (Inter recomendada)
- **Headings**: Font-bold com pesos específicos
- **Body**: Text-gray-600 para melhor legibilidade

### **Espaçamento**

- **Base**: 4px (0.25rem)
- **Consistente**: Uso das escalas do Tailwind (p-4, m-6, etc.)

### **Componentes**

- **Cards**: `rounded-2xl`, `shadow-sm`, `border border-gray-200`
- **Buttons**: `rounded-xl`, gradiente primary, estados hover
- **Forms**: `rounded-xl`, `focus:ring-2 focus:ring-blue-500`
- **Tables**: `divide-y divide-gray-100`, hover states

---

## 👨‍💻 Autor

**Fellipe da Silva Castro**  
Desenvolvedor Fullstack  
Projeto desenvolvido para estudo e portfólio

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia o [guia de contribuição](./CONTRIBUTING.md) antes de submeter pull requests.

---

## 🙏 Agradecimentos

- **React Team** - Pelo incrível framework
- **Tailwind CSS** - Pela produtividade no desenvolvimento
- **Comunidade Open Source** - Pelas incontáveis bibliotecas e recursos

---

**✨ Desenvolvido com React, Tailwind CSS e muito café!**
