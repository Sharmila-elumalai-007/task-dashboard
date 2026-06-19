# 📋 Task Dashboard

Responsive, accessible task management UI built with **Angular 17** and **PrimeNG** featuring AI-powered task assistance, dark mode, local persistence, and full CRUD operations.

🔗 **Live Demo:** [https://task-dashboard-3azg.vercel.app/](https://task-dashboard-3azg.vercel.app/)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm 9+
- Angular CLI: `npm install -g @angular/cli`

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd task-dashboard

# 2. Install dependencies
npm install

# 3. (Optional) Configure AI Chatbot
# Open src/environments/environment.ts
# Replace 'YOUR_API_KEY_HERE' with your actual key

# 4. Start the development server
ng serve

# 5. Open in browser
# http://localhost:4200
```

### Production Build
```bash
ng build --configuration production
# Output: dist/task-dashboard/
```

---

## ✅ Features Implemented

### Core Requirements
| Feature | Status |
|---|---|
| Task list (card layout) | ✅ |
| Title, Status, Priority, Assignee, Due Date display | ✅ |
| Search by title (instant) | ✅ |
| Status filter dropdown (All / Pending / In Progress / Completed) | ✅ |
| **Task stats panel** | Total, Pending, In Progress, Completed, Overdue |
| **Empty state** | Helpful illustration when no tasks match |
| Add Task form with Reactive Forms + validations | ✅ |
| Responsive (Desktop / Tablet / Mobile) | ✅ |
| Accessibility (semantic HTML, ARIA, keyboard nav) | ✅ |
| API integration (jsonplaceholder.typicode.com/todos) | ✅ |

### Extra Features
| Feature | Details |
|---|---|
| **Dark Mode** | Toggle in header, persisted via localStorage |
| **Edit Task** | Inline modal dialog with pre-filled form |
| **Delete Task** | Confirm dialog before deletion |
| **LocalStorage persistence** | Tasks survive page refresh |
| **AI Chatbot** | Natural language task queries via Claude API |
| **Overdue detection** | Visual badge + overdue count stat |
| **Sort tasks** | By due date, priority, or title |
| **Search by assignee** | Search field matches name or title |
| **Toast notifications** | Add / Edit / Delete feedback |
| **Skeleton/loading** | API fetch indicator |

---

## 🤖 AI Chatbot — Setup Note

The AI assistant is built using the **Anthropic Claude API (claude-sonnet-4-6)** and is fully functional when an API key is configured. It supports natural language queries like:

- *"Show me high priority tasks"*
- *"What tasks are overdue?"*
- *"Summarize pending tasks"*
- *"Who has the most tasks?"*

### To enable locally:
Open `src/environments/environment.ts` and replace the placeholder:
```ts
export const environment = {
  production: false,
  anthropicApiKey: 'sk-ant-your-actual-key-here'
};
```

### Why it's disabled on the live demo:
The live Vercel deployment does not have an API key configured, as embedding secret keys in a client-side app is **not safe for production**. In a real-world scenario, this would be routed through a **backend serverless function** (e.g., a Vercel API route or Node.js proxy) to keep the key secure server-side.

> The chatbot UI, message flow, suggestion chips, typing indicator, and error handling are all fully implemented and visible. Only the API response is inactive without a key.

---

## 🏗 Architecture Decisions

### Component Architecture
```
AppComponent (root shell + state coordination)
├── HeaderComponent       — branding, dark mode toggle
├── TaskStatsComponent    — computed stat cards
├── TaskFormComponent     — reactive form (add + edit mode)
├── TaskListComponent     — search, filter, sort, grid
│   └── TaskCardComponent — individual task card
└── AiChatbotComponent    — floating chat panel
```

All components are **standalone** (Angular 17 style) — no `NgModule` needed.

### State Management
A single `TaskService` acts as the state store using `BehaviorSubject<Task[]>`. Components subscribe to the observable stream. No external state library (NgRx/Akita) was needed for this scale.

```
TaskService
  ├── tasks$ BehaviorSubject  → components subscribe
  ├── darkMode$ BehaviorSubject
  └── localStorage sync on every mutation
```

### Data Flow
1. On boot, `TaskService` checks localStorage
2. If empty, fetches 20 todos from JSONPlaceholder and enriches them (random priority, assignee, due date)
3. User-created tasks are stored locally and prepended to the list
4. Every add / update / delete triggers a `localStorage.setItem` sync

### Design System — PrimeNG
**Why PrimeNG?**
- Best-in-class Angular integration (no wrapper hacks)
- Complete component set: Dropdown, Calendar, Dialog, Toast, ConfirmDialog, Tag, Button, InputText — all needed here
- Built-in accessibility (ARIA, keyboard nav)
- Easy theming via CSS variables

**Components used from PrimeNG:**
- `p-dropdown` — status/priority/sort selects
- `p-calendar` — due date picker
- `p-dialog` — edit task modal
- `p-confirmDialog` — delete confirmation
- `p-toast` — success/warning notifications
- `p-tag` — priority and status badges
- `p-button` / `pButton` — all action buttons
- `p-inputtext` / `pInputTextarea` — form inputs

**Custom-built (not from PrimeNG):**
- Task card layout and hover interactions
- Stats panel with gradient icons
- Header with gradient background
- AI chatbot panel and floating FAB
- Dark mode CSS variable system
- Avatar initials generator

---

## ♿ Accessibility

- Semantic HTML: `<main>`, `<header>`, `<aside>`, `<section>`, `<article>`, `<nav>`
- All form inputs have `<label>` with `for` attributes
- Error messages linked via `aria-describedby`
- Dynamic content uses `aria-live="polite"`
- Task stats use `role="img"` with descriptive `aria-label`
- All icon-only buttons have `aria-label`
- `:focus-visible` styles for keyboard navigation
- `prefers-reduced-motion` media query respected

---

## ⏱ Time Spent

| Phase | Time |
|---|---|
| Project setup & architecture planning | 10 min |
| Core components (stats, card, list) | 40 min |
| Task form with validation | 30 min |
| Edit / Delete / Confirm dialog | 20 min |
| Dark mode system | 10 min |
| AI chatbot integration | 30 min |
| Responsive polish + accessibility | 20 min |
| README + final cleanup | 10 min |
| **Total** | **~2.9 hours** |

---

## 🤖 AI Usage Summary

**Claude (claude.ai)** was used to:
- Generate boilerplate component scaffolding
- Suggest SCSS patterns for dark mode CSS variables
- Review accessibility checklist

**Dribble ai** was used to choose the template:
**openrouter.ai** was used to get the api , models:

All architecture decisions, component structure, service design, and feature choices were made by the developer. Code was reviewed and adapted throughout.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/
│   │   ├── task-stats/
│   │   ├── task-form/
│   │   ├── task-card/
│   │   ├── task-list/
│   │   └── ai-chatbot/
│   ├── models/
│   │   └── task.model.ts
│   ├── services/
│   │   ├── task.service.ts
│   │   └── ai.service.ts
│   ├── app.component.ts/html/scss
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
│   └── environment.ts
├── styles.scss
├── index.html
└── main.ts
```
