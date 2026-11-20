<?php
/**
 * Signalux Studio PHP API Router Entry Point
 * Handles all /api/v1/* requests
 */

require_once __DIR__ . '/Core/Database.php';
require_once __DIR__ . '/Core/Response.php';
require_once __DIR__ . '/Core/JWT.php';
require_once __DIR__ . '/Core/Auth.php';
require_once __DIR__ . '/Controllers/PublicController.php';
require_once __DIR__ . '/Controllers/AuthController.php';
require_once __DIR__ . '/Controllers/AdminController.php';
require_once __DIR__ . '/Controllers/UserController.php';
require_once __DIR__ . '/Controllers/BlogController.php';
require_once __DIR__ . '/Controllers/SeoController.php';
require_once __DIR__ . '/Controllers/MediaTestimonialsController.php';
require_once __DIR__ . '/Controllers/SecurityController.php';
require_once __DIR__ . '/Controllers/SpeedController.php';

use Signalux\Core\Response;
use Signalux\Core\Database;
use Signalux\Controllers\PublicController;
use Signalux\Controllers\AuthController;
use Signalux\Controllers\AdminController;
use Signalux\Controllers\UserController;
use Signalux\Controllers\BlogController;
use Signalux\Controllers\SeoController;
use Signalux\Controllers\MediaTestimonialsController;
use Signalux\Controllers\SecurityController;
use Signalux\Controllers\SpeedController;

Response::setHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Strip script name or subfolder if nested
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptName !== '/' && strpos($uri, $scriptName) === 0) {
    $uri = substr($uri, strlen($scriptName));
}

// Ensure URI starts with '/'
$uri = '/' . ltrim($uri, '/');

// 1. Health Check
if ($uri === '/api/v1/health' || $uri === '/health') {
    $dbConnected = Database::isConnected();
    Response::json([
        'status'         => 'OK',
        'runtime'        => 'PHP ' . PHP_VERSION,
        'uptimeSeconds'  => (int)(time() - ($_SERVER['REQUEST_TIME'] ?? time())),
        'database'       => [
            'status'   => $dbConnected ? 'CONNECTED' : 'DISCONNECTED',
            'provider' => 'mysql',
            'database' => 'soheils4_signalux'
        ],
        'version'        => '1.0.0'
    ]);
}

// 2. Public Endpoints
if ($method === 'GET' && $uri === '/api/v1/public/settings') {
    PublicController::getSettings();
}
if ($method === 'GET' && $uri === '/api/v1/public/services') {
    PublicController::getServices();
}
if ($method === 'GET' && preg_match('#^/api/v1/public/services/([^/]+)$#', $uri, $m)) {
    // Individual service by slug or id
    PublicController::getServices();
}
if ($method === 'GET' && $uri === '/api/v1/public/projects') {
    PublicController::getProjects();
}
if ($method === 'GET' && preg_match('#^/api/v1/public/projects/([^/]+)$#', $uri, $m)) {
    PublicController::getProjectById($m[1]);
}
if ($method === 'GET' && $uri === '/api/v1/public/testimonials') {
    PublicController::getTestimonials();
}
if ($method === 'GET' && $uri === '/api/v1/public/podcasts') {
    MediaTestimonialsController::getPublicPodcasts();
}
if ($method === 'GET' && $uri === '/api/v1/public/video-testimonials') {
    MediaTestimonialsController::getPublicVideoTestimonials();
}
if ($method === 'GET' && $uri === '/api/v1/public/certificates') {
    PublicController::getCertificates();
}
if ($method === 'GET' && $uri === '/api/v1/public/faqs') {
    PublicController::getFaqs();
}
if ($method === 'POST' && $uri === '/api/v1/public/consultation') {
    PublicController::postConsultation();
}
if ($method === 'POST' && $uri === '/api/v1/public/contact') {
    PublicController::postContact();
}

// 3. Auth Endpoints
if ($method === 'POST' && $uri === '/api/v1/auth/login') {
    AuthController::login();
}
if ($method === 'POST' && $uri === '/api/v1/auth/refresh') {
    AuthController::refresh();
}
if ($method === 'GET' && $uri === '/api/v1/auth/me') {
    AuthController::me();
}
if ($method === 'POST' && $uri === '/api/v1/auth/logout') {
    AuthController::logout();
}
if ($method === 'POST' && $uri === '/api/v1/auth/logout-all') {
    AuthController::logoutAll();
}

// 4. Admin Endpoints
if ($method === 'GET' && $uri === '/api/v1/admin/stats') {
    AdminController::getStats();
}
if ($method === 'GET' && $uri === '/api/v1/admin/leads') {
    AdminController::getLeads();
}
if ($method === 'PATCH' && preg_match('#^/api/v1/admin/leads/([^/]+)/status$#', $uri, $m)) {
    AdminController::updateLeadStatus($m[1]);
}
if ($method === 'DELETE' && preg_match('#^/api/v1/admin/leads/([^/]+)$#', $uri, $m)) {
    AdminController::deleteLead($m[1]);
}

if ($method === 'GET' && $uri === '/api/v1/admin/settings') {
    PublicController::getSettings();
}
if ($method === 'PUT' && $uri === '/api/v1/admin/settings') {
    AdminController::updateSettings();
}

// Services Admin
if ($method === 'POST' && $uri === '/api/v1/admin/services') {
    AdminController::createService();
}
if ($method === 'PUT' && preg_match('#^/api/v1/admin/services/([^/]+)$#', $uri, $m)) {
    AdminController::updateService($m[1]);
}
if ($method === 'DELETE' && preg_match('#^/api/v1/admin/services/([^/]+)$#', $uri, $m)) {
    AdminController::deleteService($m[1]);
}

// Projects Admin
if ($method === 'POST' && $uri === '/api/v1/admin/projects') {
    AdminController::createProject();
}
if ($method === 'PUT' && preg_match('#^/api/v1/admin/projects/([^/]+)$#', $uri, $m)) {
    AdminController::updateProject($m[1]);
}
if ($method === 'DELETE' && preg_match('#^/api/v1/admin/projects/([^/]+)$#', $uri, $m)) {
    AdminController::deleteProject($m[1]);
}

// Testimonials Admin
if ($method === 'POST' && $uri === '/api/v1/admin/testimonials') {
    AdminController::createTestimonial();
}
if ($method === 'PUT' && preg_match('#^/api/v1/admin/testimonials/([^/]+)$#', $uri, $m)) {
    AdminController::updateTestimonial($m[1]);
}
if ($method === 'DELETE' && preg_match('#^/api/v1/admin/testimonials/([^/]+)$#', $uri, $m)) {
    AdminController::deleteTestimonial($m[1]);
}

// Certificates Admin
if ($method === 'POST' && $uri === '/api/v1/admin/certificates') {
    AdminController::createCertificate();
}
if ($method === 'PUT' && preg_match('#^/api/v1/admin/certificates/([^/]+)$#', $uri, $m)) {
    AdminController::updateCertificate($m[1]);
}
if ($method === 'DELETE' && preg_match('#^/api/v1/admin/certificates/([^/]+)$#', $uri, $m)) {
    AdminController::deleteCertificate($m[1]);
}

// FAQs Admin
if ($method === 'POST' && $uri === '/api/v1/admin/faqs') {
    AdminController::createFaq();
}
if ($method === 'PUT' && preg_match('#^/api/v1/admin/faqs/([^/]+)$#', $uri, $m)) {
    AdminController::updateFaq($m[1]);
}
if ($method === 'DELETE' && preg_match('#^/api/v1/admin/faqs/([^/]+)$#', $uri, $m)) {
    AdminController::deleteFaq($m[1]);
}

// 5. Users & Roles (RBAC)
if ($method === 'GET' && ($uri === '/api/v1/users' || $uri === '/api/v1/admin/users')) {
    UserController::getAdminUsers();
}
if ($method === 'POST' && ($uri === '/api/v1/users' || $uri === '/api/v1/admin/users')) {
    UserController::createAdminUser();
}
if ($method === 'PUT' && preg_match('#^/api/v1/admin/users/([^/]+)$#', $uri, $m)) {
    UserController::updateAdminUser($m[1]);
}
if ($method === 'DELETE' && preg_match('#^/api/v1/admin/users/([^/]+)$#', $uri, $m)) {
    UserController::deleteAdminUser($m[1]);
}
if ($method === 'GET' && $uri === '/api/v1/roles') {
    UserController::getRoles();
}

// 6. Blog & Articles (Public & Admin)
if ($method === 'GET' && $uri === '/api/v1/blog') {
    BlogController::getPublishedPosts();
}
if ($method === 'GET' && preg_match('#^/api/v1/blog/([^/]+)$#', $uri, $m)) {
    BlogController::getPostBySlug($m[1]);
}
if ($method === 'GET' && $uri === '/api/v1/admin/blog') {
    BlogController::getAllPosts();
}
if ($method === 'POST' && $uri === '/api/v1/admin/blog') {
    BlogController::createPost();
}
if ($method === 'PUT' && preg_match('#^/api/v1/admin/blog/([^/]+)$#', $uri, $m)) {
    BlogController::updatePost($m[1]);
}
if ($method === 'DELETE' && preg_match('#^/api/v1/admin/blog/([^/]+)$#', $uri, $m)) {
    BlogController::deletePost($m[1]);
}

// 7. SEO Suite, Sitemap & Robots
if ($method === 'GET' && ($uri === '/api/v1/seo' || $uri === '/api/v1/admin/seo')) {
    SeoController::getSeoSettings();
}
if (($method === 'POST' || $method === 'PUT') && $uri === '/api/v1/admin/seo') {
    SeoController::updateSeoSettings();
}
if ($method === 'GET' && ($uri === '/api/v1/sitemap.xml' || $uri === '/sitemap.xml')) {
    SeoController::generateSitemapXml();
}
if ($method === 'GET' && ($uri === '/api/v1/robots.txt' || $uri === '/robots.txt')) {
    SeoController::getRobotsTxt();
}

// 8. AIOS Security Suite
if ($method === 'GET' && $uri === '/api/v1/admin/security/settings') {
    \Signalux\Controllers\SecurityController::getSettings();
}
if (($method === 'POST' || $method === 'PUT') && $uri === '/api/v1/admin/security/settings') {
    \Signalux\Controllers\SecurityController::updateSettings();
}

// 9. Speed, Performance & Cache Suite
if ($method === 'GET' && $uri === '/api/v1/admin/speed/settings') {
    \Signalux\Controllers\SpeedController::getSettings();
}
if (($method === 'POST' || $method === 'PUT') && $uri === '/api/v1/admin/speed/settings') {
    \Signalux\Controllers\SpeedController::updateSettings();
}
if ($method === 'POST' && $uri === '/api/v1/admin/speed/purge-cache') {
    \Signalux\Controllers\SpeedController::purgeCache();
}

// 10. Podcasts & Video Testimonials CRUD
if ($method === 'GET' && $uri === '/api/v1/admin/podcasts') {
    MediaTestimonialsController::getAdminPodcasts();
}
if ($method === 'POST' && ($uri === '/api/v1/admin/podcasts' || $uri === '/api/v1/admin/podcasts/batch')) {
    MediaTestimonialsController::saveBatchPodcasts();
}
if ($method === 'GET' && $uri === '/api/v1/admin/video-testimonials') {
    MediaTestimonialsController::getAdminVideoTestimonials();
}
if ($method === 'POST' && ($uri === '/api/v1/admin/video-testimonials' || $uri === '/api/v1/admin/video-testimonials/batch')) {
    MediaTestimonialsController::saveBatchVideoTestimonials();
}

// 404 Route Not Found
Response::error("مسیر درخواستی '{$uri}' با متد {$method} یافت نشد.", 404, 'ROUTE_NOT_FOUND');
