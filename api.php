<?php
/**
 * RESTful JSON API for the 30-Day IT Business Plan Application
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

$action = isset($_GET['action']) ? trim($_GET['action']) : '';

// Helper function to respond with JSON
function sendResponse($success, $data = [], $message = '', $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => time()
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

// Get raw JSON input for POST requests
$rawInput = file_get_contents('php://input');
$postData = json_decode($rawInput, true);
if (!is_array($postData)) {
    $postData = $_POST;
}

try {
    switch ($action) {
        case 'health':
            sendResponse(true, [
                'status' => 'operational',
                'php_version' => PHP_VERSION,
                'data_file_writable' => is_writable(DATA_DIR),
                'storage_type' => 'JSON Flat-File / Native Store',
                'server_time' => date('Y-m-d H:i:s'),
                'data_file' => DATA_FILE
            ], 'API health check passed.');
            break;

        case 'get_data':
            $data = BusinessPlanStorage::load();

            // Calculate live summary analytics
            $totalDays = count($data['days']);
            $completedDays = 0;
            $totalChecklistItems = 0;
            $completedChecklistItems = 0;

            foreach ($data['days'] as $d) {
                if (!empty($d['completed'])) {
                    $completedDays++;
                }
                if (!empty($d['checklist']) && is_array($d['checklist'])) {
                    foreach ($d['checklist'] as $item) {
                        $totalChecklistItems++;
                        if (!empty($item['done'])) {
                            $completedChecklistItems++;
                        }
                    }
                }
            }

            $pipelineValue = 0;
            $weightedPipelineValue = 0;
            if (!empty($data['leads']) && is_array($data['leads'])) {
                foreach ($data['leads'] as $l) {
                    $val = floatval($l['value'] ?? 0);
                    $prob = floatval($l['probability'] ?? 50);
                    $pipelineValue += $val;
                    $weightedPipelineValue += ($val * ($prob / 100));
                }
            }

            $stats = [
                'total_days' => $totalDays,
                'completed_days' => $completedDays,
                'day_completion_percentage' => $totalDays > 0 ? round(($completedDays / $totalDays) * 100, 1) : 0,
                'total_tasks' => $totalChecklistItems,
                'completed_tasks' => $completedChecklistItems,
                'task_completion_percentage' => $totalChecklistItems > 0 ? round(($completedChecklistItems / $totalChecklistItems) * 100, 1) : 0,
                'total_leads' => count($data['leads'] ?? []),
                'total_pipeline_value' => $pipelineValue,
                'weighted_pipeline_value' => round($weightedPipelineValue, 2)
            ];

            sendResponse(true, [
                'plan' => $data,
                'stats' => $stats
            ], 'Data loaded successfully.');
            break;

        case 'toggle_checklist':
            $dayNum = intval($postData['day'] ?? 0);
            $itemId = trim($postData['item_id'] ?? '');

            if ($dayNum < 1 || $dayNum > 30 || empty($itemId)) {
                sendResponse(false, null, 'Invalid day or item ID provided.', 400);
            }

            $data = BusinessPlanStorage::load();
            $found = false;

            foreach ($data['days'] as &$day) {
                if ($day['day'] === $dayNum) {
                    $allDone = true;
                    if (!empty($day['checklist'])) {
                        foreach ($day['checklist'] as &$item) {
                            if ($item['id'] === $itemId) {
                                $item['done'] = !empty($postData['done']);
                                $found = true;
                            }
                            if (empty($item['done'])) {
                                $allDone = false;
                            }
                        }
                    }
                    $day['completed'] = $allDone;
                    break;
                }
            }

            if (!$found) {
                sendResponse(false, null, 'Checklist item not found.', 404);
            }

            BusinessPlanStorage::save($data);
            sendResponse(true, $data, 'Checklist item updated successfully.');
            break;

        case 'toggle_day_complete':
            $dayNum = intval($postData['day'] ?? 0);
            $completed = !empty($postData['completed']);

            if ($dayNum < 1 || $dayNum > 30) {
                sendResponse(false, null, 'Invalid day number.', 400);
            }

            $data = BusinessPlanStorage::load();
            foreach ($data['days'] as &$day) {
                if ($day['day'] === $dayNum) {
                    $day['completed'] = $completed;
                    if (!empty($day['checklist'])) {
                        foreach ($day['checklist'] as &$item) {
                            $item['done'] = $completed;
                        }
                    }
                    break;
                }
            }

            BusinessPlanStorage::save($data);
            sendResponse(true, $data, 'Day status updated.');
            break;

        case 'save_day_notes':
            $dayNum = intval($postData['day'] ?? 0);
            $notes = trim($postData['notes'] ?? '');

            if ($dayNum < 1 || $dayNum > 30) {
                sendResponse(false, null, 'Invalid day number.', 400);
            }

            $data = BusinessPlanStorage::load();
            foreach ($data['days'] as &$day) {
                if ($day['day'] === $dayNum) {
                    $day['notes'] = $notes;
                    break;
                }
            }

            BusinessPlanStorage::save($data);
            sendResponse(true, $data, 'Day notes saved successfully.');
            break;

        case 'save_financials':
            $data = BusinessPlanStorage::load();
            $financials = $data['financials'] ?? [];

            if (isset($postData['initial_capital'])) {
                $financials['initial_capital'] = floatval($postData['initial_capital']);
            }
            if (isset($postData['monthly_burn_rate'])) {
                $financials['monthly_burn_rate'] = floatval($postData['monthly_burn_rate']);
            }
            if (isset($postData['hourly_rate'])) {
                $financials['hourly_rate'] = floatval($postData['hourly_rate']);
            }
            if (isset($postData['avg_project_size'])) {
                $financials['avg_project_size'] = floatval($postData['avg_project_size']);
            }
            if (isset($postData['target_mrr'])) {
                $financials['target_mrr'] = floatval($postData['target_mrr']);
            }
            if (isset($postData['target_deals_m1'])) {
                $financials['target_deals_m1'] = intval($postData['target_deals_m1']);
            }

            // Recalculate runway
            if ($financials['monthly_burn_rate'] > 0) {
                $financials['months_runway'] = round($financials['initial_capital'] / $financials['monthly_burn_rate'], 1);
            } else {
                $financials['months_runway'] = 99;
            }

            $data['financials'] = $financials;
            BusinessPlanStorage::save($data);
            sendResponse(true, $financials, 'Financial projections updated.');
            break;

        case 'add_lead':
            $company = trim($postData['company'] ?? '');
            if (empty($company)) {
                sendResponse(false, null, 'Company name is required.', 400);
            }

            $newLead = [
                'id' => 'lead_' . time() . '_' . rand(100, 999),
                'company' => $company,
                'contact_name' => trim($postData['contact_name'] ?? 'Primary Contact'),
                'email' => trim($postData['email'] ?? ''),
                'service' => trim($postData['service'] ?? 'IT Consulting'),
                'value' => floatval($postData['value'] ?? 5000),
                'stage' => trim($postData['stage'] ?? 'New Lead'),
                'probability' => intval($postData['probability'] ?? 25),
                'expected_close' => trim($postData['expected_close'] ?? date('Y-m-d', strtotime('+14 days'))),
                'notes' => trim($postData['notes'] ?? '')
            ];

            $data = BusinessPlanStorage::load();
            if (!isset($data['leads']) || !is_array($data['leads'])) {
                $data['leads'] = [];
            }
            array_unshift($data['leads'], $newLead);
            BusinessPlanStorage::save($data);

            sendResponse(true, $newLead, 'New prospect lead added successfully.');
            break;

        case 'update_lead':
            $leadId = trim($postData['id'] ?? '');
            if (empty($leadId)) {
                sendResponse(false, null, 'Lead ID is required.', 400);
            }

            $data = BusinessPlanStorage::load();
            $found = false;
            foreach ($data['leads'] as &$lead) {
                if ($lead['id'] === $leadId) {
                    if (isset($postData['company'])) $lead['company'] = trim($postData['company']);
                    if (isset($postData['contact_name'])) $lead['contact_name'] = trim($postData['contact_name']);
                    if (isset($postData['email'])) $lead['email'] = trim($postData['email']);
                    if (isset($postData['service'])) $lead['service'] = trim($postData['service']);
                    if (isset($postData['value'])) $lead['value'] = floatval($postData['value']);
                    if (isset($postData['stage'])) $lead['stage'] = trim($postData['stage']);
                    if (isset($postData['probability'])) $lead['probability'] = intval($postData['probability']);
                    if (isset($postData['expected_close'])) $lead['expected_close'] = trim($postData['expected_close']);
                    if (isset($postData['notes'])) $lead['notes'] = trim($postData['notes']);
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                sendResponse(false, null, 'Lead not found.', 404);
            }

            BusinessPlanStorage::save($data);
            sendResponse(true, $data['leads'], 'Lead updated successfully.');
            break;

        case 'delete_lead':
            $leadId = trim($postData['id'] ?? '');
            if (empty($leadId)) {
                sendResponse(false, null, 'Lead ID is required.', 400);
            }

            $data = BusinessPlanStorage::load();
            $initialCount = count($data['leads'] ?? []);
            $data['leads'] = array_values(array_filter($data['leads'] ?? [], function ($item) use ($leadId) {
                return $item['id'] !== $leadId;
            }));

            if (count($data['leads']) === $initialCount) {
                sendResponse(false, null, 'Lead not found.', 404);
            }

            BusinessPlanStorage::save($data);
            sendResponse(true, $data['leads'], 'Lead deleted successfully.');
            break;

        case 'save_swot':
            $type = trim($postData['type'] ?? '');
            $items = $postData['items'] ?? [];

            if (!in_array($type, ['strengths', 'weaknesses', 'opportunities', 'threats'])) {
                sendResponse(false, null, 'Invalid SWOT category.', 400);
            }

            $data = BusinessPlanStorage::load();
            if (!isset($data['swot'])) {
                $data['swot'] = [];
            }
            $data['swot'][$type] = is_array($items) ? array_values(array_filter(array_map('trim', $items))) : [];

            BusinessPlanStorage::save($data);
            sendResponse(true, $data['swot'], 'SWOT category updated.');
            break;

        case 'reset_data':
            $freshData = BusinessPlanStorage::reset();
            sendResponse(true, $freshData, 'Data reset to default 30-day template state.');
            break;

        case 'export_json':
            $data = BusinessPlanStorage::load();
            header('Content-Disposition: attachment; filename="IT_Business_Plan_30_Days_' . date('Y-m-d') . '.json"');
            echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            exit;

        default:
            sendResponse(false, null, 'Unknown or missing action parameter.', 400);
    }
} catch (Exception $e) {
    sendResponse(false, null, 'Server error: ' . $e->getMessage(), 500);
}
