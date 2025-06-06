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
    $email = $_POST["email"];
    $mot_de_passe = $_POST["mot_de_passe"];

    $stmt = $pdo->prepare("SELECT * FROM utilisateur WHERE uti_email = ?");
    $stmt->execute([$email]);
    $utilisateur = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($utilisateur && password_verify($mot_de_passe, $utilisateur["uti_mdp"])) {
    header("Location: accueil.php");
    exit;
    } else {
        $message = "❌ Email ou mot de passe incorrect.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Connexion</title>
    <link rel="stylesheet" href="css/Connexion.css">
</head>
<body>
    <div class="form-container">
        <h2>Connexion</h2>
        <?php if (!empty($message)) echo "<p>$message</p>"; ?>
        <form method="POST">
            <label for="email">Email :</label>
            <input type="email" name="email" required>

            <label for="mot_de_passe">Mot de passe :</label>
            <input type="password" name="mot_de_passe" required>

            <input type="submit" value="Se connecter">
        </form>
    </div>
</body>
</html>
