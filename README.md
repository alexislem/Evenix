# Evenix 🚀

> **Lien du site :** [evenix.fr](https://evenix.fr)

**Evenix** est une plateforme complète de gestion d'événements. Elle permet de mettre en relation des utilisateurs, des organisateurs et des administrateurs pour une gestion simplifiée des événements gratuits ou payants.

---

## 📝 Description

Le projet propose trois types de profils avec des fonctionnalités spécifiques :

* **Utilisateurs :** Création de compte, consultation des événements (avec intégration Google Maps pour la proximité) et inscription.
* **Organisateurs :** Création, modification et suppression d'événements.
* **Administrateurs :** Gestion complète des profils (utilisateurs/organisateurs) et modération des événements.

## 🛠️ Technologies utilisées

### Backend
* **Langage :** Java 17
* **Framework :** Spring Boot (API REST)
* **Sécurité :** Spring Security & JWT (JSON Web Token)
* **Persistance :** JPA / Hibernate
* **Base de données :** MySQL (Relationnel)

### Frontend
* **Framework :** React + Vite
* **Langage :** TypeScript

---

## 🖼️ Visuels disponibles
### Page d'accueil
<img width="1351" height="600" alt="homePage" src="https://github.com/user-attachments/assets/944a0268-c5ff-40b8-8a1e-ceadea6e1398" />

### Page d’évènement
<img width="1353" height="586" alt="evenementPage" src="https://github.com/user-attachments/assets/47599069-447e-497d-b906-9eece68682ef" />

### Page de connexion / inscription
<img width="1344" height="599" alt="connexionPage" src="https://github.com/user-attachments/assets/92ebe998-8d76-4bad-802d-7feeb102baa2" />
<img width="1350" height="598" alt="InscriptionPage" src="https://github.com/user-attachments/assets/eba142a9-7903-4bb7-8d88-fcac983b372a" />



---

## ⚙️ Installation et Lancement

### 🖥️ Backend (Spring Boot)
1.  Lancer votre serveur local (ex: **MAMP**).
2.  Ouvrir le projet dans **Spring Tools Suite 4**.
3.  Naviguer vers : `src/main/java/com.evenix`.
4.  Faire un clic droit sur `EvenixApplication.java` > **Run as** > **Spring Boot App**.

### 🌐 Frontend (React)
1.  Ouvrir le dossier `Frontend` dans **Visual Studio Code**.
2.  Ouvrir un terminal.
3.  Installer les dépendances (si ce n'est pas fait) : `npm install`.
4.  Lancer le projet : `npm run dev`.

---

## 🔑 Identifiants de test
| Rôle | Email | Mot de passe |
| :--- | :--- | :--- |
| **Admin** | `admin@evenix.com` | `admin123` |
| **Organisateur** | `orga@evenix.com` | `orga123` |
| **Utilisateur** | `user1@gmail.com` | `password` |

---

## 👥 Contributeurs
* **LEMAIRE Alexis**
* **MAIRE Benjamin**
* **POIGNANT Bastien**
