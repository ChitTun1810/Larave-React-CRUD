<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

echo "--- POST Request ---\n";
$response1 = $kernel->handle(
    Illuminate\Http\Request::create('/api/products', 'POST', ['name' => 'Test Product', 'price' => 19.99])
);
echo $response1->getContent() . "\n\n";

echo "--- GET Request ---\n";
$response2 = $kernel->handle(
    Illuminate\Http\Request::create('/api/products', 'GET')
);
echo $response2->getContent() . "\n";
