# AI‑Powered To‑Do List

A full‑stack web app that lets you add and prioritize tasks with ML, plus AI‑driven smart suggestions.

---

## 🚀 Features

- **Add & persist tasks** in the browser (LocalStorage)  
- **Priority classification** (High/Medium/Low) via a custom-trained scikit‑learn model  
- **Smart suggestions** powered by the Cohere API  
- **Frosted‑glass UI** (box‑1 / box‑2 layout) with rounded corners, blur effect, and scrollable task list  
- **Lightweight, vanilla JS** + Flask backend  

---

## 🏗️ Tech Stack

- **Frontend:** HTML, CSS (glassmorphism), JavaScript  
- **Backend:** Python, Flask, Flask‑CORS  
- **ML:** scikit‑learn (Logistic Regression + TF‑IDF), custom dataset of 500+ labeled tasks  
- **AI Suggestions:** Cohere API (command‑light)  

##📝 Usage
**Add a task** → It’s saved locally and classified by priority.

**Type in the input** → Cohere suggests 3 subtasks; click to autofill.

**Complete tasks** → Check them off to remove with a smooth fade‑out.
