<?php

/**
 * Created by PhpStorm.
 * User: at15
 * Date: 15-4-9
 * Time: 上午10:33
 */
class BaseController
{
    protected $assets;

    public function requireAssets($pageName)
    {
        $json_path = __DIR__ . '/../../parsed.json';
        $content = file_get_contents($json_path);
        $assets = json_decode($content, TRUE);
        $pages = $assets['pages'];
        $this->assets = $pages[$pageName];
    }

    protected function renderView($viewName, $data)
    {
        $data['assets'] = $this->assets;
        $data['view'] = $viewName . '.php';
        extract($data);
        include('./template.php');
    }
}

final class DoubiController extends BaseController
{
    public function index()
    {
        $this->requireAssets('home');
        $this->renderView('home', array('foo' => 'bar'));
    }
}