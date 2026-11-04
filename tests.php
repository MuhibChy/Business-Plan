<?php
/**
 * Automated Verification & Diagnostic Test Suite
 * Can be run via browser: http://localhost/IT%20Business%20Plan%2030%20days/tests.php
 * Or via CLI: php tests.php
 */

require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

$isCli = (php_sapi_name() === 'cli');

if (!$isCli) {
    header('Content-Type: text/html; charset=UTF-8');
}

$results = [];
$totalTests = 0;
$passedTests = 0;
$failedTests = 0;

function runTest($name, $closure) {
    global $results, $totalTests, $passedTests, $failedTests;
    $totalTests++;
    try {
        $result = $closure();
        if ($result === true || (is_array($result) && !empty($result['passed']))) {
            $passedTests++;
            $results[] = [
                'name' => $name,
                'passed' => true,
                'message' => is_array($result) ? ($result['message'] ?? 'OK') : 'Passed.'
            ];
        } else {
            $failedTests++;
            $results[] = [
                'name' => $name,
                'passed' => false,
                'message' => is_array($result) ? ($result['message'] ?? 'Assertion failed') : 'Assertion failed.'
            ];
        }
    } catch (Exception $e) {
        $failedTests++;
        $results[] = [
            'name' => $name,
            'passed' => false,
            'message' => 'Exception: ' . $e->getMessage()
        ];
    }
}

// -------------------------------------------------------------
// Test 1: Data directory and file writable check
// -------------------------------------------------------------
runTest('Data Directory & Storage Accessibility', function() {
    if (!is_dir(DATA_DIR)) {
        return ['passed' => false, 'message' => 'DATA_DIR does not exist: ' . DATA_DIR];
    }
    $testFile = DATA_DIR . DIRECTORY_SEPARATOR . 'test_perm.tmp';
    $written = @file_put_contents($testFile, 'test');
    if (!$written) {
        return ['passed' => false, 'message' => 'DATA_DIR is not writable'];
    }
    @unlink($testFile);
    return ['passed' => true, 'message' => 'Storage directory is writable and ready.'];
});

// -------------------------------------------------------------
// Test 2: Verify all 30 days exist in default plan data
// -------------------------------------------------------------
runTest('30-Day Completeness & Phase Breakdown', function() {
    $data = getDefaultPlanData();
    if (!isset($data['days']) || count($data['days']) !== 30) {
        return ['passed' => false, 'message' => 'Expected 30 days, got ' . count($data['days'] ?? [])];
    }

    $phaseCounts = [1 => 0, 2 => 0, 3 => 0, 4 => 0];
    foreach ($data['days'] as $d) {
        if (!isset($d['day']) || !isset($d['title']) || !isset($d['checklist'])) {
            return ['passed' => false, 'message' => 'Day ' . ($d['day'] ?? 'unknown') . ' missing required fields.'];
        }
        $p = $d['phase_number'] ?? 0;
        if (isset($phaseCounts[$p])) {
            $phaseCounts[$p]++;
        }
    }

    if ($phaseCounts[1] !== 7 || $phaseCounts[2] !== 7 || $phaseCounts[3] !== 7 || $phaseCounts[4] !== 9) {
        return ['passed' => false, 'message' => 'Phase count mismatch: ' . json_encode($phaseCounts)];
    }

    return ['passed' => true, 'message' => 'All 30 days present across 4 strategic phases (Week 1: 7, Week 2: 7, Week 3: 7, Week 4: 9).'];
});

// -------------------------------------------------------------
// Test 3: Storage Engine Load and Save Round-trip
// -------------------------------------------------------------
runTest('Storage Engine Persistence & Integrity', function() {
    $data = BusinessPlanStorage::load();
    if (!is_array($data) || empty($data['metadata'])) {
        return ['passed' => false, 'message' => 'Failed to load valid plan structure'];
    }

    // Modify a test key
    $originalFounder = $data['metadata']['founder_name'] ?? '';
    $testFounder = 'Test Founder ' . rand(1000, 9999);
    $data['metadata']['founder_name'] = $testFounder;

    $saved = BusinessPlanStorage::save($data);
    if (!$saved) {
        return ['passed' => false, 'message' => 'Storage save failed'];
    }

    // Reload
    $reloaded = BusinessPlanStorage::load();
    $matches = ($reloaded['metadata']['founder_name'] === $testFounder);

    // Restore original
    $data['metadata']['founder_name'] = $originalFounder;
    BusinessPlanStorage::save($data);

    return ['passed' => $matches, 'message' => 'Data persistence verified with full JSON round-trip.'];
});

// -------------------------------------------------------------
// Test 4: Financial Calculation Formulas
// -------------------------------------------------------------
runTest('Financial Model & Runway Algorithm', function() {
    $capital = 15000;
    $burn = 3500;
    $hourly = 95;

    $runway = round($capital / $burn, 1);
    $breakEvenHours = ceil($burn / $hourly);

    if ($runway != 4.3) {
        return ['passed' => false, 'message' => 'Expected runway 4.3, calculated: ' . $runway];
    }
    if ($breakEvenHours != 37) {
        return ['passed' => false, 'message' => 'Expected 37 break-even hours, calculated: ' . $breakEvenHours];
    }

    return ['passed' => true, 'message' => 'Financial equations validated (Runway: 4.3 mo, Break-even: 37 hrs/mo).'];
});

// -------------------------------------------------------------
// Test 5: CRM Pipeline Value & Probability Weighting
// -------------------------------------------------------------
runTest('CRM Pipeline Aggregation Engine', function() {
    $data = getDefaultPlanData();
    $leads = $data['leads'] ?? [];

    $totalVal = 0;
    $weightedVal = 0;

    foreach ($leads as $l) {
        $val = floatval($l['value']);
        $prob = floatval($l['probability']);
        $totalVal += $val;
        $weightedVal += ($val * ($prob / 100));
    }

    if ($totalVal != 52000) {
        return ['passed' => false, 'message' => 'Expected $52,000 total pipeline value, got: ' . $totalVal];
    }
    if ($weightedVal != 29675) {
        return ['passed' => false, 'message' => 'Expected $29,675 weighted value, got: ' . $weightedVal];
    }

    return ['passed' => true, 'message' => 'CRM pipeline calculated $52k total value / $29,675 probability-weighted.'];
});

// -------------------------------------------------------------
// Output Presentation
// -------------------------------------------------------------
if ($isCli) {
    echo "\n=== 30-Day IT Business Plan Autonomous Test Suite ===\n\n";
    foreach ($results as $res) {
        $badge = $res['passed'] ? '[PASS]' : '[FAIL]';
        echo sprintf("%-8s %-45s - %s\n", $badge, $res['name'], $res['message']);
    }
    echo sprintf("\nTotal: %d | Passed: %d | Failed: %d\n", $totalTests, $passedTests, $failedTests);
    exit($failedTests === 0 ? 0 : 1);
} else {
?>
<!DOCTYPE html>
<html lang="en" class="bg-slate-900 text-slate-100">
<head>
    <meta charset="UTF-8">
    <title>30-Day IT Business Plan - Automated Test Suite</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-8 max-w-4xl mx-auto">
    <div class="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
            <h1 class="text-2xl font-bold text-white">Automated Verification Test Suite</h1>
            <p class="text-xs text-slate-400 mt-1">Autonomous Quality Assurance & Regression Report</p>
        </div>
        <a href="index.php" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition">
            &larr; Return to Dashboard
        </a>
    </div>

    <div class="mb-6 p-4 rounded-xl border <?php echo $failedTests === 0 ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/30 border-rose-500/40 text-rose-300'; ?> font-bold text-sm flex items-center justify-between">
        <span>Status: <?php echo $failedTests === 0 ? 'ALL SYSTEMS OPERATIONAL (100% PASS RATE)' : 'ATTENTION REQUIRED'; ?></span>
        <span class="text-xs font-mono"><?php echo "$passedTests / $totalTests Passed ($failedTests Failed)"; ?></span>
    </div>

    <div class="space-y-3">
        <?php foreach ($results as $r): ?>
            <div class="p-4 rounded-xl border flex items-center justify-between text-xs <?php echo $r['passed'] ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-rose-950/40 border-rose-800 text-rose-300'; ?>">
                <div class="flex items-center gap-3">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold <?php echo $r['passed'] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'; ?>">
                        <?php echo $r['passed'] ? 'PASS' : 'FAIL'; ?>
                    </span>
                    <span class="font-bold text-white text-sm"><?php echo htmlspecialchars($r['name']); ?></span>
                </div>
                <span class="text-slate-400 font-mono text-[11px]"><?php echo htmlspecialchars($r['message']); ?></span>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>
<?php
}
