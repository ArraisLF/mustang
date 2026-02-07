# Projeto Mustang

Plataforma web para estudantes que se preparam para concursos públicos no Brasil.

## Stack

### Frontend (`mustang-frontend/`)
- React 19 + Vite 7
- Tailwind CSS (cores: primary #003366, secondary #009c3b, accent #ffcc00)
- React Router 7
- Axios para HTTP
- JWT para autenticação (localStorage)

### Backend (`mustang-backend/`)
- Spring Boot 3.5 (Java 21)
- Spring Security + JWT (JJWT)
- JPA/Hibernate
- PostgreSQL 16
- Lombok

### Infraestrutura
- Deploy: Railway
- Banco local: Docker Compose
- Git: Repositórios separados em `mustang-backend/` e `mustang-frontend/`

## Comandos

### Frontend
```bash
cd mustang-frontend
npm run dev      # Dev server (porta 5173)
npm run build    # Build produção
npm run lint     # ESLint
```

### Backend
```bash
cd mustang-backend
./mvnw spring-boot:run    # Rodar aplicação
./mvnw clean install      # Build
./mvnw test               # Testes
```

### Banco de dados
```bash
docker-compose up         # Subir PostgreSQL local
```

## Convenções

### Geral
- **UI sempre em português brasileiro** - todos os textos, labels, mensagens e placeholders devem estar em pt-BR
- Código e comentários em inglês
- Variáveis de ambiente para configuração
- **Para cada plano implementado**: criar uma nova branch e abrir um pull request contra main

### Frontend
- Componentes funcionais com hooks
- Arquivos `.jsx` em PascalCase
- Tailwind para estilos (sem CSS modules)
- Context API para estado global (AuthContext)
- API base URL via `VITE_API_URL`

### Backend
- Pacotes por feature: `com.mustang.backend.<feature>` (auth, user, feed, common)
- Lombok para reduzir boilerplate (@Data, @RequiredArgsConstructor)
- Injeção de dependência por construtor
- Endpoints REST em `/api/*`
- **Nunca retornar entidades JPA diretamente na API** - sempre usar DTOs (Response classes)
- DTOs usam padrão `<Feature>Response` com método estático `from(Entity)` para conversão

### Git Flow
- Branch prefixes: `feature/` para novas funcionalidades, `hotfix/` para correções urgentes
- Criar branch a partir de `main`
- Commits seguem boas práticas do Git (mensagens claras e descritivas)
- Não fazer squash de commits
- **Antes de abrir um PR**, rodar o build completo com testes (`./mvnw verify` no backend, `npm run build` no frontend) e garantir que tudo passa
- Ao finalizar, abrir Pull Request para `main`

### Submodules
- `mustang-frontend/` e `mustang-backend/` são git submodules do repositório raiz
- **Antes de iniciar qualquer trabalho**, rodar `git submodule update --remote` no repositório raiz para garantir que os submodules estão atualizados com o remote
- Commits e branches devem ser feitos **dentro de cada submodule** (cd para o diretório do submodule)
- Após commitar dentro de um submodule, **sempre voltar ao repositório raiz** e commitar a referência atualizada do submodule (`git add mustang-backend && git commit` ou `git add mustang-frontend && git commit`)
- Ao criar branches para uma feature que afeta ambos os projetos, criar a branch em cada submodule individualmente
- **Após um PR ser mergeado**, executar o procedimento de sync dos submodules:
  1. Dentro de cada submodule afetado: `git checkout main && git pull`
  2. Voltar ao repositório raiz: `git add mustang-frontend mustang-backend && git commit -m "Update submodule refs to latest main"`

## Estrutura de Pastas

```
projeto-mustang/
├── mustang-frontend/
│   └── src/
│       ├── components/    # Componentes reutilizáveis (Header, BottomNav, Feed)
│       ├── pages/         # Páginas (LoginPage)
│       ├── context/       # Context API (AuthContext)
│       └── assets/        # Imagens e SVGs
├── mustang-backend/
│   └── src/main/java/com/mustang/backend/
│       ├── auth/          # Autenticação (AuthController, AuthService, DTOs)
│       ├── user/          # Usuários (User entity, UserRepository)
│       ├── feed/          # Feed (FeedItem, FeedItemResponse, FeedService, FeedController)
│       └── common/        # Código compartilhado
│           ├── config/    # Configurações Spring (CORS, etc)
│           └── security/  # JWT e filtros de segurança
└── docker-compose.yml
```

## Variáveis de Ambiente

### Frontend
- `VITE_API_URL` - URL base da API

### Backend
- `DATABASE_URL` - URL do PostgreSQL
- `DATABASE_USERNAME` - Usuário do banco
- `DATABASE_PASSWORD` - Senha do banco
- `FRONTEND_URL` - URL do frontend (CORS)
- `JWT_SECRET` - Chave secreta para tokens JWT

## Notas

- Design mobile-first
- Autenticação stateless via JWT
- Feed items têm tipos: TIP, NEWS, RESULT, POST
- Usuário padrão criado no startup para desenvolvimento
- DTOs computam campos derivados (ex: `authorName` vem do User entity para posts de usuários)
