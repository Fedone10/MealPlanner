# Contribuire a MealPlanner

Guida rapida per lavorare sul progetto e **pubblicare le modifiche** (push) da
Claude Code o da terminale. Pensata per essere passata direttamente a Claude.

---

## 0. Struttura del progetto (importante)

Il codice dell'app React + Vite sta nella **root del repository** (`package.json`,
`src/`, `index.html`, `vite.config.js`). Esegui i comandi `npm` e `git` da dentro
la cartella del repo clonato.

```
src/
  components/   # componenti riutilizzabili (UI)
  pages/        # Onboarding, PianoPasti, ListaSpesa
  data/         # ricette.js, supermercati.js (dati mock)
  utils/        # generaPiano.js (logica pura)
  App.jsx       # navigazione tra le pagine
```

Tutto è in **italiano** (label, testi, commenti). CSS classico in `App.css` /
`index.css`, niente framework CSS.

---

## 1. Requisiti

- **Node.js 20+** e **npm** (verifica: `node -v`, `npm -v`)
- **Git** (`git --version`)
- **GitHub CLI** consigliata per l'autenticazione: https://cli.github.com

---

## 2. Accesso al repository (una volta sola)

Per pushare serve essere **collaboratore con permesso Write** sul repo. Se ricevi
`403 ... Resource not accessible by integration` o `403` sul push, **non sei
ancora autorizzata**: chiedi all'owner (Fedone10) di aggiungerti come
collaboratrice con ruolo **Write** e accetta l'invito che ti arriva via email.

---

## 3. Autenticazione git (se il push dà 403)

Il push deve usare **le tue credenziali GitHub** (il tuo account con accesso
Write), non un token in sola lettura. Modo più semplice, con la GitHub CLI:

```bash
gh auth login
#   → GitHub.com → HTTPS → "Login with a web browser" → autorizza col TUO account
gh auth status            # verifica

# assicurati che il remote sia in HTTPS pulito
git remote set-url origin https://github.com/Fedone10/MealPlanner.git
```

In alternativa, un **Personal Access Token fine-grained** (GitHub → Settings →
Developer settings → Fine-grained tokens → repo *MealPlanner* → permesso
**Contents: Read and write**), da usare come password quando git la chiede.

> ℹ️ Se stai usando **Claude Code nel cloud** (non sul tuo PC), `gh auth login`
> non basta: il push passa dall'app GitHub "Claude", che va autorizzata sul repo
> con permesso di scrittura dalle impostazioni del connettore GitHub.

---

## 4. Setup locale

```bash
git clone https://github.com/Fedone10/MealPlanner.git
cd MealPlanner
npm install
npm run dev        # avvia il dev server su http://localhost:5173
```

---

## 5. Flusso di lavoro consigliato (branch + Pull Request)

Lavorando in più persone, evita di pushare direttamente su `main`:

```bash
git checkout -b feat/descrizione-breve
# ... modifiche ...
npm run build      # controlla che la build passi senza errori
git add .
git commit -m "feat: descrizione della modifica"
git push -u origin feat/descrizione-breve
```

Poi apri una **Pull Request** verso `main` (dalla pagina del repo su GitHub, o con
`gh pr create`). Una volta unita, parte il deploy automatico (vedi sotto).

Se invece volete tenere le cose semplici, potete committare direttamente su `main`.

---

## 6. Deploy automatico

Ad ogni push/merge su **`main`**, una GitHub Action
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) builda il
progetto e lo pubblica su **GitHub Pages**:

### 🌐 https://fedone10.github.io/MealPlanner/

Non serve fare nulla a mano: in 1–2 minuti il sito è aggiornato. Puoi seguire lo
stato nella tab **Actions** del repository.

> Nota tecnica: in `vite.config.js` il `base` è `/MealPlanner/` solo in build
> (in sviluppo resta `/`), perché il sito è servito da una sottocartella su Pages.

---

## 7. Convenzioni veloci

- Messaggi di commit in stile `tipo: descrizione` (`feat:`, `fix:`, `style:`, `ci:`…).
- Aggiungere un supermercato: una riga in [`src/data/supermercati.js`](src/data/supermercati.js)
  (`{ id, nome, colore, testo }`) — appare da solo nello step 7 dell'onboarding.
- Aggiungere una ricetta: un oggetto in [`src/data/ricette.js`](src/data/ricette.js),
  rispettando i campi esistenti (`tipo`, `categorie`, `esigenze`,
  `elettrodomestici`, `ingredienti` con `categoria`).
