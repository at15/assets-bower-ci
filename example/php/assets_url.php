<?php
/**
 * Created by PhpStorm.
 * User: at15
 * Date: 15-4-9
 * Time: 上午10:22
 */

// Helper function for returning the assets_url.

function base_url($file_name)
{
    return 'http://localhost/' . ltrim($file_name, '/');
}

function assets_url($file_name)
{
    static $base_url = '';

    if (empty($base_url)) {
        $json_path = __DIR__ . '/../../parsed.json';
        $content = file_get_contents($json_path);
        $assets = json_decode($content, TRUE);
        $base_url = $assets['baseUrl'];
    }

    if ($base_url === 'base_url') {
        return base_url($file_name);
    } else {
        return $base_url . '/' . ltrim($file_name, '/');
    }
}

//echo assets_url('a.js');