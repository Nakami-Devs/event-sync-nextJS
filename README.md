# EventSync

## Description

EventSync est une plateforme de gestion d'événements développée avec Next.js. Elle permet aux utilisateurs de consulter les événements disponibles, de découvrir les intervenants (speakers), de consulter les sessions et de s'inscrire aux événements. Une interface d'administration permet également de gérer les événements, les utilisateurs, les speakers, les sessions et les inscriptions.

---

## Technologies utilisées

### Front-end
- Next.js
- React
- TypeScript
- Tailwind CSS

### Back-end
- Node.js
- TypeScript
- API REST

### Base de données
- PostgreSQL

### Outils
- Git
- GitHub

---

## Fonctionnalités

### Espace utilisateur
- Consulter la liste des événements
- Voir les détails d'un événement
- Consulter les speakers
- Voir les sessions d'un événement
- S'inscrire à un événement
- Authentification des utilisateurs

### Espace administrateur
- Gestion des événements
- Gestion des speakers
- Gestion des sessions
- Gestion des utilisateurs
- Gestion des inscriptions

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-organisation/eventsync.git
```

### 2. Accéder au dossier du projet

```bash
cd eventsync
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet.

Exemple :

```env
DATABASE_URL=postgresql://username:password@localhost:5432/eventsync

JWT_SECRET=your_secret

NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 5. Démarrer PostgreSQL

Assurez-vous que PostgreSQL est installé, lancé et que la base de données est créée.

### 6. Lancer le projet

```bash
npm run dev
```

Le projet sera accessible à l'adresse :

```
http://localhost:3000
```

---

## Structure du projet

```text
eventsync/
├── app/
├── components/
├── public/
├── lib/
├── types/
├── pages/
├── styles/
└── ...
```

---

## Contributeurs

| Nom | Contribution |
|------|--------------|
| Nelio | Développement Front-end et Back-end |
| Fanamby | Développement Front-end et Back-end |
| Finoana | Développement Front-end et Back-end |
| Koloina | Développement Front-end et Back-end |

Chaque membre de l'équipe a participé au développement de la partie utilisateur ainsi qu'à certaines fonctionnalités de l'interface d'administration.

---

## Stack technique

- Next.js
- React
- TypeScript
- Node.js
- PostgreSQL
- Tailwind CSS
- Git
- GitHub

---

## Commandes utiles

Installer les dépendances :

```bash
npm install
```

Lancer le projet en mode développement :

```bash
npm run dev
```

Construire le projet :

```bash
npm run build
```

Lancer la version de production :

```bash
npm start
```

---

## Licence

Projet réalisé dans le cadre d'un projet académique.