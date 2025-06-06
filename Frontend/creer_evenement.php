<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
if (!isset($_SESSION["uti_id"])) {
    header("Location: login.php");
    exit;
}

$host = "localhost";
$dbname = "evenixdb";
$user = "root";
$password = "root";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

// Récupération des lieux
$stmt = $pdo->query("SELECT lieu_id, lieu_nom FROM lieu");
$lieux = $stmt->fetchAll(PDO::FETCH_ASSOC);

$message = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $eve_nom = $_POST["eve_nom"];
    $description = $_POST["eve_description"];
    $date_debut = $_POST["eve_date_debut"];
    $date_fin = $_POST["eve_date_fin"];
    $lieu_id = $_POST["lieu_id"];
    $payant = isset($_POST["eve_payant"]) ? "\x01" : "\x00";  // 1 bit binaire
    $prix = $payant ? floatval($_POST["eve_prix"]) : null;
    $uti_id = $_SESSION["uti_id"];

    $stmt = $pdo->prepare("INSERT INTO evenement 
        (eve_nom, eve_description, eve_date_debut, eve_date_fin, eve_payant, eve_prix, lieu_id, uti_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    $success = $stmt->execute([
        $eve_nom, $description, $date_debut, $date_fin,
        $payant, $prix, $lieu_id, $uti_id
    ]);

    $message = $success ? "✅ Événement créé avec succès !" : "❌ Une erreur est survenue.";
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Créer un événement</title>
    <link rel="stylesheet" href="css/Inscription.css">
</head>
<body>
    <div class="form-container">
        <h2>Formulaire de création d'événement</h2>
        <?php if (!empty($message)) echo "<p>$message</p>"; ?>
        <form method="POST">
            <label for="eve_nom">Nom de l'événement :</label>
            <input type="text" name="eve_nom" required>

            <label for="eve_description">Description :</label>
            <textarea name="eve_description" required></textarea>

            <label for="eve_date_debut">Date de début :</label>
            <input type="datetime-local" name="eve_date_debut" required>

            <label for="eve_date_fin">Date de fin :</label>
            <input type="datetime-local" name="eve_date_fin" required>

            <label for="eve_payant">Payant :</label>
            <input type="checkbox" name="eve_payant">

            <label for="eve_prix">Prix :</label>
            <input type="number" step="0.01" name="eve_prix">

            <label for="lieu_id">Lieu :</label>
            <select name="lieu_id" required>
                <option value="">-- Sélectionner un lieu --</option>
                <?php foreach ($lieux as $lieu): ?>
                    <option value="<?= $lieu['lieu_id'] ?>"><?= htmlspecialchars($lieu['lieu_nom']) ?></option>
                <?php endforeach; ?>
            </select>

            <input type="submit" value="Créer l'événement">
        </form>
        <a href="Accueil.php" class="btn">Retour à l'accueil</a>
    </div>
</body>
</html>
