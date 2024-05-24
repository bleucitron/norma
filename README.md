# Swingtime - Gestion des Inscriptions

## Présentation du Projet

L’association "Swingtime", créée en 2006 par des passionnés de musique, jazz et blues, a pour vocation de faire connaître l’histoire du swing, son lien avec l’histoire de l’esclavage, ainsi que l’histoire du jazz et du blues. En parallèle de cette vocation, l’association organise tous les ans un festival intitulé "Swing Art". Ce festival réunit artistes musiciens, danseurs professionnels, danseurs amateurs et dessinateurs autour de cette danse.

Avec le développement du festival et l’augmentation du nombre de nouveaux inscrits, l’équipe de Swingtime a ressenti le besoin d’un outil dédié à la gestion des inscriptions pour le festival, afin de pouvoir visualiser et administrer plus facilement les informations reçues. Ce projet vise à répondre à ce besoin.

## Liens Utiles

- **Lien Confluence** : [Lien](https://gaetanmoreau.atlassian.net/wiki/spaces/SD/overview)
- **Lien de l'application** : [Norma Azure](https://norma-azure.vercel.app/)

## Lancement du Projet

### Prérequis

- Node.js
- npm (Node Package Manager)
- Supabase CLI

### Étapes d'Installation

1. **Cloner le dépôt du projet :**
   ```sh
   git clone https://github.com/your-repo/swingtime-gestion-inscriptions.git
   cd swingtime-gestion-inscriptions
   ```
2.  **Installation des dépendances :**
     ```
     npm install
     ```
3.  **Installation du package de login Supabase :**
     ```
     npx supabase login
     ```
4.  **Configuration des variables d'environnement :**
Créez un fichier .env à la racine du projet et ajoutez les clés nécessaires (Supabase, EmailJS, etc.).

5.  **Lancement de l'application :**
     ```
     npm run dev
     ```

## Fonctionnalités

- **Gestion des Inscriptions** : Interface pour visualiser et administrer les inscriptions au festival.
- **Statistiques et Rapports** : Génération de statistiques sur les inscriptions, y compris la répartition par niveau et par rôle (Leader, Suiveur).
- **Notifications par Email** : Envoi d'emails de confirmation et de notification aux inscrits via EmailJS.
- **Authentification** : Gestion de l'authentification et de l'autorisation des utilisateurs via Supabase.

## Support
Pour toute question ou problème, veuillez consulter la page Confluence ou contacter les mainteneurs du projet.

Merci de votre intérêt pour le projet Swingtime - Gestion des Inscriptions ! Nous espérons que cet outil facilitera la gestion des événements et contribuera au succès du festival Swing Art.