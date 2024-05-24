
# Norma
L'application [NORMA](https://norma-azure.vercel.app/) simplifie l’inscription à vos événements de danse préférés. Explorez une multitude d’ateliers et de soirées, inscrivez-vous à nos évènements et connectez-vous avec une communauté passionnée. Plongez dans la magie de la danse dès aujourd’hui !

## Prérequis
* Node.js
* npm (Node Package Manager)
* Supabase CLI

## Installation

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

Vous pouvez enssuite vous rendre sur [http://localhost:5173/](http://localhost:5173/) pour voir le projet

## Ressources liées au projet
* **Lien Confluence** : [Lien](https://gaetanmoreau.atlassian.net/wiki/spaces/SD/overview)
* **Lien de l'application en production** : [Norma Azure](https://norma-azure.vercel.app/)

## Tests
 Vous pouvez lancer les tests playwright avec la commande ```npm run test```

## Fonctionnalités

* **Gestion des Inscriptions** : Interface pour visualiser et administrer les inscriptions au festival.
* **Statistiques et Rapports** : Génération de statistiques sur les inscriptions, y compris la répartition par niveau et par rôle (Leader, Suiveur).
* **Notifications par Email** : Envoi d'emails de confirmation et de notification aux inscrits via EmailJS.
* **Authentification** : Gestion de l'authentification et de l'autorisation des utilisateurs via Supabase.

## Support
Pour toute question ou problème, veuillez consulter la page Confluence ou contacter les mainteneurs du projet.

Merci de votre intérêt pour le projet Norma ! Nous espérons que cet outil facilitera la gestion des événements et contribuera au succès du festival Swing Art.

