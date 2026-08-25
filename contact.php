<?php
$name = '';
$email = '';
$message = '';
$submittedName = '';
$errors = [];
$sent = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if ($name === '') {
        $errors[] = 'Please enter your name.';
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please enter a valid email address.';
    }

    if ($message === '') {
        $errors[] = 'Please write a message.';
    }

    if (!$errors) {
        $submittedName = $name;
        $sent = true;
        $name = '';
        $email = '';
        $message = '';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact | Danjuma's WebPage</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="site-header">
        <div class="container nav-wrap">
            <a href="index.html" class="brand">Danjuma's WebPage</a>
            <nav class="main-nav" aria-label="Main navigation">
                <a href="index.html">Home</a>
                <a href="about.html">About</a>
                <a href="Destinations.html">Gallery</a>
                <a href="contact.php" aria-current="page">Contact</a>
            </nav>
        </div>
    </header>

    <main class="page-main">
        <section class="page-hero">
            <div class="container narrow">
                <p class="eyebrow">Say hello</p>
                <h1>Tell us about a place that inspires you.</h1>
                <p class="lead">Send a message and share your favourite destination or travel story.</p>
            </div>
        </section>

        <section class="contact-content">
            <div class="container contact-layout">
                <div class="contact-intro">
                    <h2>Start a conversation</h2>
                    <p>Have a question about a destination or want to share a travel idea? Send a message and we will get back to you.</p>

                    <div class="contact-details">
                        <div class="contact-detail">
                            <span class="contact-detail-label">Email</span>
                            <a href="mailto:bapinimundanjuma@gmail.com">bapinimundanjuma@gmail.com</a>
                        </div>
                        <div class="contact-detail">
                            <span class="contact-detail-label">Reply time</span>
                            <p>Usually within 1-2 business days.</p>
                        </div>
                        <div class="contact-detail">
                            <span class="contact-detail-label">You can write about</span>
                            <p>Travel ideas, destination suggestions, or website feedback.</p>
                        </div>
                    </div>
                </div>

                <form class="contact-form" method="post" action="contact.php">
                    <?php if ($sent): ?>
                        <p class="form-message success" role="status">Thanks, <?= htmlspecialchars($submittedName, ENT_QUOTES, 'UTF-8') ?>. Your message was received.</p>
                    <?php endif; ?>

                    <?php if ($errors): ?>
                        <div class="form-message error" role="alert">
                            <?php foreach ($errors as $error): ?>
                                <p><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>

                    <label for="name">Name</label>
                    <input id="name" name="name" type="text" value="<?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?>" required>

                    <label for="email">Email</label>
                    <input id="email" name="email" type="email" value="<?= htmlspecialchars($email, ENT_QUOTES, 'UTF-8') ?>" required>

                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="6" required><?= htmlspecialchars($message, ENT_QUOTES, 'UTF-8') ?></textarea>

                    <button class="button primary" type="submit">Send message</button>
                </form>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="container footer-content">
            <p>Danjuma's WebPage</p>
            <p>Made with creativity and a love for places that inspire wonder.</p>
        </div>
    </footer>
    <script src="script.js"></script>
</body>
</html>
