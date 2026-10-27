# Clair-Contrôle — maquette de gestion documentaire

Prototype responsive de connexion et de navigation pour une application de gestion des factures. Le projet utilise uniquement HTML, CSS et JavaScript natifs.

## Ouvrir dans Chrome

Ouvrez `index.html` dans Chrome. Vous pouvez aussi coller cette adresse dans la barre du navigateur :

```text
file:///D:/Projetsappro-cont-ecart/index.html
```

Aucun serveur ou paquet n'est nécessaire pour afficher la maquette.

## Parcours de démonstration

- Saisissez un identifiant et un mot de passe non vides, puis choisissez **Se connecter**.
- La connexion est simulée : elle ne vérifie aucun compte et ne protège pas l'application.
- Survolez **Menu** pour afficher les rubriques documentaires. Survolez ou sélectionnez **Factures** pour choisir **Bon de commande**, **Lettre de commande**, **Accords** ou **Contrats**. Sur mobile, ouvrez le menu puis touchez **Factures**. Les autres rubriques sont **Bons de commande**, **Bons de réception** et **Bons de livraison**. Chaque espace affiche « En cours de développement... ».
- **Mot de passe oublié** affiche un message de démonstration ; aucun courriel n'est envoyé.
- **Déconnexion** revient à l'écran de connexion.

Ne saisissez pas de vrai mot de passe dans ce prototype. Une authentification réelle, une gestion des utilisateurs et le traitement des documents nécessiteront un service backend avant toute utilisation en production.

## Lancer les tests

Node.js n'est utile que pour exécuter les tests automatisés :

```powershell
node --test tests/test-app.js
```
