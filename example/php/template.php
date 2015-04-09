<?php
require_once('./assets_url.php');
?>
<html>
<head>
    <title>Sample title</title>
    <!--sample for one package-->
    <?php foreach ($assets['css'] as $css): ?>
        <link rel="stylesheet" href="<?php echo assets_url($css) ?>"/>
    <?php endforeach ?>
    <!--sample for one file-->
    <link rel="stylesheet" href="<?php echo assets_url('a.css') ?>"/>
</head>
<body>

<h1>I am sample template</h1>

<?php include($view) ?>

<!--sample for one package-->
<?php foreach ($assets['js'] as $js): ?>
    <script src="<?php echo assets_url($js) ?>"></script>
<?php endforeach ?>
<!--sample for one file-->
<script src="<?php echo assets_url('b.js') ?>"></script>
</body>
</html>
