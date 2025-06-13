# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Frontend development (SvelteKit on port 5173)
npm run dev

# Backend development (FastAPI on port 8080)
cd backend && ./dev.sh

# Full stack with Docker
docker compose up -d

# Run specific service
docker compose up -d ollama  # Local LLM service
```

### Testing
```bash
# Frontend tests
npm run test
npm run test:e2e  # End-to-end tests with Cypress

# Backend tests
cd backend && pytest
cd backend && pytest tests/test_models.py  # Run specific test file
cd backend && pytest -k "test_user"  # Run tests matching pattern
```

### Code Quality
```bash
# Frontend
npm run lint
npm run format
npm run check  # Type checking

# Backend
cd backend && black .
cd backend && pylint **/*.py
```

### Build & Production
```bash
# Build frontend
npm run build

# Docker production build
docker build -t open-webui .

# Database migrations
cd backend && alembic upgrade head
```

## Architecture Overview

### Frontend Structure (SvelteKit)
- **`src/routes/`**: Page components following SvelteKit routing
  - `/c/[id]` - Chat interface
  - `/admin` - Admin dashboard
  - `/workspace` - User workspace
- **`src/lib/components/`**: Reusable Svelte components
  - `/chat/` - Chat-specific components (Messages, Input, etc.)
  - `/common/` - Shared UI components
- **`src/lib/stores/`**: Svelte stores for global state
- **`src/lib/apis/`**: API client functions
- **`src/lib/utils/`**: Utility functions

### Backend Structure (FastAPI)
- **`backend/apps/`**: Core application modules
  - `/ollama/` - Ollama integration
  - `/openai/` - OpenAI API compatibility layer
  - `/rag/` - RAG implementation
  - `/webui/` - Main web UI backend
- **`backend/apps/webui/routers/`**: API endpoints
- **`backend/apps/webui/models/`**: Database models (SQLAlchemy)
- **`backend/apps/webui/internal/`**: Business logic

### Key Architectural Patterns

1. **API Proxy Pattern**: Backend proxies requests to various LLM providers
   - Unified interface for Ollama, OpenAI, Anthropic, etc.
   - Request transformation and response streaming

2. **Plugin System (Pipelines)**:
   - Python functions that extend model capabilities
   - Located in `backend/apps/webui/models/functions.py`
   - Can intercept and modify requests/responses

3. **Real-time Communication**:
   - WebSocket for streaming responses
   - Socket.IO for collaborative features
   - Event-driven architecture for chat updates

4. **State Management**:
   - Frontend: Svelte stores + localStorage
   - Backend: SQLAlchemy ORM with PostgreSQL/SQLite
   - Session management via JWT tokens

## Critical Conventions

### API Endpoints
- RESTful design: `/api/v1/{resource}`
- Authentication: Bearer token in Authorization header
- Streaming responses use Server-Sent Events (SSE)

### Database Models
- All models inherit from `Base` in `backend/apps/webui/internal/db.py`
- Use UUID for primary keys
- Timestamp fields: `created_at`, `updated_at`

### Error Handling
```python
# Backend pattern
from fastapi import HTTPException
raise HTTPException(status_code=400, detail="Error message")

# Frontend pattern
try {
    const res = await api.call();
    if (!res.ok) throw await res.json();
} catch (err) {
    toast.error(err.detail || 'An error occurred');
}
```

### Component Communication
- Props down, events up in Svelte components
- Use stores for cross-component state
- Dispatch custom events for parent communication

## Multi-Agent Support
Recent addition supporting multiple AI agents responding to a single prompt:
- Backend returns JSON array: `[{"role": "Agent1", "content": "..."}, ...]`
- Frontend detects and renders as separate chat bubbles
- See `MULTI_AGENT_PATCH.md` for implementation details

## Environment Variables
Key variables (see `.env.example`):
- `WEBUI_AUTH`: Enable/disable authentication
- `DEFAULT_MODELS`: Comma-separated list of default models
- `ENABLE_RAG_WEB_SEARCH`: Enable web search in RAG
- `DATABASE_URL`: PostgreSQL connection string

## Common Tasks

### Adding a New API Endpoint
1. Create router in `backend/apps/webui/routers/`
2. Add to `backend/main.py` router includes
3. Create corresponding API client in `src/lib/apis/`
4. Add TypeScript types in `src/lib/types/`

### Adding a New Chat Feature
1. Modify `src/lib/components/chat/Messages/` components
2. Update message handling in `src/routes/c/[id]/+page.svelte`
3. Add backend support if needed in `backend/apps/webui/routers/chats.py`

### Modifying LLM Integration
1. Check `backend/apps/ollama/` or `backend/apps/openai/`
2. Update proxy logic in respective `main.py`
3. Ensure streaming compatibility
4. Test with different model providers

## Debugging Tips

### Frontend Debugging
- Use Svelte DevTools browser extension
- Check browser console for API errors
- Enable `DEBUG=true` in `.env` for verbose logging

### Backend Debugging
- Use `--reload` flag with uvicorn for hot reload
- Check `backend/logs/` for application logs
- Use `import pdb; pdb.set_trace()` for breakpoints
- FastAPI auto-generates docs at `/docs`

### Common Issues
1. **CORS errors**: Check `CORS_ALLOW_ORIGINS` in backend settings
2. **WebSocket disconnects**: Verify nginx/proxy WebSocket settings
3. **Model not loading**: Check Ollama service status and model availability
4. **Database errors**: Run migrations with `alembic upgrade head`