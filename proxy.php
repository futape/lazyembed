<?php
if (!isset($_GET['uri'])) {
    throw new \Exception('No URI given', 1527067951);
}

$allowedHosts = [
    '*.ytimg.com',
    '*.googleapis.com'
];
$uri = $_GET['uri'];
$host = parse_url($uri, PHP_URL_HOST);
$hostAllowed = false;

if ($host !== false) {
    foreach ($allowedHosts as $allowedHost) {
        if ($allowedHost === '*') {
            $hostPattern = '/.+/';
        } else {
            $hostParts = explode('.', $allowedHost);

            if (count($hostParts) < 2) {
                continue;
            }

            $firstPart = array_shift($hostParts);
            $lastPart = array_pop($hostParts);

            array_walk($hostParts, function(&$val) {
                $val = preg_quote($val, '/');
            });

            if ($lastPart === '*') {
                $hostParts[] = '[^\.]+';
            } else {
                $hostParts[] = preg_quote($lastPart, '/');
            }

            if (count($hostParts) >= 2 && $firstPart === '*') {
                $hostParts[0] = '(?:[^\.]+\.)*' . $hostParts[0];
            } else {
                array_unshift($hostParts, preg_quote($firstPart, '/'));
            }

            $hostPattern = '/' . implode('\.', $hostParts) . '/i';
        }

        if (preg_match($hostPattern, $host) === 1) {
            $hostAllowed = true;
            break;
        }
    }
}

if (!$hostAllowed) {
    throw new \Exception('Disallowed host', 1527666194);
}

header('Pragma: public');
header('Cache-Control: max-age=86400');
header('Expires: '. gmdate('D, d M Y H:i:s \G\M\T', time() + 86400));

$ch = curl_init($uri);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$body = curl_exec($ch);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

if ($contentType !== false && $contentType !== null) {
    header('Content-Type: ' . $contentType);
}

curl_close($ch);

echo $body;
