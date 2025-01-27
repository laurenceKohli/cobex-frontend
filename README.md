# cobex-frontend

## Description du projet

Ce projet est le frontend de l'application COBEX, une plateforme de parcours fixes de course d'orientation. L'application permet aux utilisateurs de s'inscrire, de se connecter, de choisir des parcours dans différentes villes, de suivre les parcours en scannant des QR codes et de consulter leurs résultats.

## Fonctionnalités principales

- **Inscription et connexion** : Les utilisateurs peuvent créer un compte ou se connecter à un compte existant.
- **Choix de parcours** : Les utilisateurs peuvent choisir des parcours dans différentes villes.
- **Suivi de parcours** : Les utilisateurs peuvent suivre les parcours en scannant des QR codes à chaque poste.
- **Consultation des résultats** : Les utilisateurs peuvent consulter leurs résultats pour chaque parcours effectué.

## Installation et démarrage

Pour installer et démarrer le projet, suivez les étapes ci-dessous :

1. Clonez le dépôt :
    ```bash
    git clone git@github.com:laurenceKohli/cobex-frontend.git
    ```

2. Accédez au répertoire du projet :
    ```bash
    cd cobex-frontend
    ```
3. Copier le fichier d'environnement et changer les valeurs si nécessaire

4. Installez les dépendances :
    ```bash
    npm install
    ```

5. Démarrez le serveur de développement :
    ```bash
    npm run dev
    ```

## Fonctionnement du parcours en cours

Lorsqu'un utilisateur démarre un parcours, il doit scanner un QR code de départ pour commencer la course. Voici les étapes principales :

1. **Démarrage du parcours** : L'utilisateur scanne le QR code de départ pour démarrer la course. Le chronomètre commence à ce moment-là.
2. **Suivi des postes** : L'utilisateur doit se rendre à chaque poste du parcours et scanner le QR code correspondant. La position de l'utilisateur est vérifiée pour s'assurer qu'il est à proximité du poste (<10m).
3. **Fin du parcours** : Une fois que tous les postes ont été scannés, l'utilisateur doit scanner le QR code de fin pour terminer la course. Le chronomètre s'arrête et les résultats sont enregistrés.
4. **Sauvegarde des résultats** : Si l'utilisateur est authentifié, les résultats sont automatiquement sauvegardés. Sinon, il est invité à se connecter pour enregistrer ses résultats.

Les utilisateurs peuvent consulter leurs résultats dans leur profil après avoir terminé un parcours.
