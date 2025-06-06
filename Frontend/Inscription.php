<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Connexion à la base de données
$host = "localhost";
$dbname = "evenixdb";
$user = "root";
$password = "root";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

// Traitement du formulaire
$message = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nom = $_POST["nom"];
    $prenom = $_POST["prenom"];
    $email = $_POST["email"];
    $date_naissance = $_POST["date_naissance"];
    $mot_de_passe = $_POST["mot_de_passe"];

    $hashed_password = password_hash($mot_de_passe, PASSWORD_DEFAULT);

    // ID du rôle utilisateur par défaut (à adapter si nécessaire)
    $rol_id = 1;
    $ent_id = null;

    $stmt = $pdo->prepare("INSERT INTO utilisateur (uti_nom, uti_prenom, uti_email, uti_date_de_naissance, uti_mdp, rol_id, ent_id) 
                           VALUES (?, ?, ?, ?, ?, ?, ?)");
    $success = $stmt->execute([$nom, $prenom, $email, $date_naissance, $hashed_password, $rol_id, $ent_id]);

    if ($success) {
        $message = " Inscription réussie !";
    } else {
        $message = "Une erreur est survenue. L'email est peut-être déjà utilisé.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Inscription</title>
    <link rel="stylesheet" href="css/Inscription.css">
</head>
<body>
    <div class="form-container">
        <h2>Formulaire d'inscription</h2>
        <?php if (!empty($message)) echo "<p>$message</p>"; ?>
        <form method="POST">
    <label for="nom">Nom :</label>
    <input type="text" name="nom" required>

    <label for="prenom">Prénom :</label>
    <input type="text" name="prenom" required>

    <label for="email">Email :</label>
    <input type="email" name="email" required>

    <label for="date_naissance">Date de naissance :</label>
    <input type="date" name="date_naissance" required>

    <label for="mot_de_passe">Mot de passe :</label>
    <input type="password" name="mot_de_passe" required>

    <input type="submit" value="S'inscrire">
</form>

    </div>
</body>
</html>
