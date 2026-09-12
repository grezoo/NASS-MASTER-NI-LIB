// NassMaster FAT/SAT Validation Wizard App
(function() {
    let matrix = [];
    let session = { metadata: {}, results: {} };
    let currentId = 1;
    let currentFilter = 'all';
    let searchTerm = '';

    // DOM Elements
    const testListEl = document.getElementById('test-list');
    const curSectionEl = document.getElementById('cur-section');
    const curIdTagEl = document.getElementById('cur-id-tag');
    const curStatusEl = document.getElementById('cur-status-indicator');
    const curNameEl = document.getElementById('cur-name');
    const curCriteriaEl = document.getElementById('cur-criteria');
    const curInstructionEl = document.getElementById('cur-instruction');
    const stepCommentEl = document.getElementById('step-comment');
    
    const autoLatencyEl = document.getElementById('auto-latency');
    const autoValEl = document.getElementById('auto-val');
    const autoErrEl = document.getElementById('auto-err');
    const autoDetailsEl = document.getElementById('auto-details');

    const statTotalEl = document.getElementById('stat-total');
    const statPassEl = document.getElementById('stat-pass');
    const statFailEl = document.getElementById('stat-fail');
    const statPendEl = document.getElementById('stat-pend');
    const progressBarEl = document.getElementById('progress-bar');
    const progressTxtEl = document.getElementById('progress-txt');

    // Init
    async function init() {
        try {
            const resp = await fetch('/api/matrix');
            const data = await resp.json();
            matrix = data.matrix || [];
            session = data.session || { metadata: {}, results: {} };

            // Find first pending or current
            currentId = 1;
            for (let item of matrix) {
                const res = session.results[String(item.id)];
                if (res && res.status === 'PENDING') {
                    currentId = item.id;
                    break;
                }
            }

            setupEventHandlers();
            renderSidebar();
            renderCurrentStep();
            updateStats();
        } catch (e) {
            console.error('Init error:', e);
            alert('Hiba a tesztmátrix betöltésekor: ' + e.message);
        }
    }

    function setupEventHandlers() {
        // Decision buttons
        document.getElementById('btn-dec-pass').addEventListener('click', () => recordDecision('PASS'));
        document.getElementById('btn-dec-fail').addEventListener('click', () => recordDecision('FAIL'));

        // Nav buttons
        document.getElementById('btn-prev').addEventListener('click', () => navigate(-1));
        document.getElementById('btn-next').addEventListener('click', () => navigate(1));
        document.getElementById('btn-next-pend').addEventListener('click', jumpToNextPending);

        // Auto Test
        document.getElementById('btn-run-auto').addEventListener('click', runCurrentAutoTest);

        // Startup Boot Benchmark
        document.getElementById('btn-measure-boot').addEventListener('click', measureStartupBenchmark);

        // Filter tabs
        document.querySelectorAll('.ftab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                renderSidebar();
            });
        });

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            renderSidebar();
        });

        // Report Modal
        document.getElementById('btn-open-report').addEventListener('click', openReportModal);
        document.getElementById('btn-close-modal').addEventListener('click', closeReportModal);
        document.getElementById('btn-cancel-report').addEventListener('click', closeReportModal);
        document.getElementById('btn-generate-print').addEventListener('click', generateAndPrintReport);

        // Reset
        document.getElementById('btn-reset-session').addEventListener('click', resetSession);

        // Comment input auto-save on blur
        stepCommentEl.addEventListener('blur', saveCurrentComment);

        // Global Keyboard shortcuts (P = Pass, F = Fail, Left/Right = Nav)
        document.addEventListener('keydown', (e) => {
            if (document.activeElement === stepCommentEl || document.activeElement.tagName === 'INPUT') return;
            if (document.getElementById('report-modal').classList.contains('active')) return;

            if (e.key === 'p' || e.key === 'P') {
                e.preventDefault();
                recordDecision('PASS');
            } else if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                recordDecision('FAIL');
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigate(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigate(1);
            } else if (e.key === ' ') {
                e.preventDefault();
                runCurrentAutoTest();
            }
        });
    }

    function renderSidebar() {
        testListEl.innerHTML = '';
        
        // Group matrix by section
        const sections = {};
        matrix.forEach(item => {
            if (!sections[item.section]) sections[item.section] = [];
            sections[item.section].push(item);
        });

        Object.keys(sections).forEach(secName => {
            const items = sections[secName];
            const filteredItems = items.filter(it => {
                const res = session.results[String(it.id)] || {};
                const st = res.status || 'PENDING';
                
                // Filter status
                if (currentFilter === 'pending' && st !== 'PENDING') return false;
                if (currentFilter === 'pass' && st !== 'PASS') return false;
                if (currentFilter === 'fail' && st !== 'FAIL') return false;

                // Filter search
                if (searchTerm) {
                    const matchText = `${it.id} ${it.name} ${it.section} ${it.criteria}`.toLowerCase();
                    if (!matchText.includes(searchTerm)) return false;
                }
                return true;
            });

            if (filteredItems.length === 0) return;

            const secGroup = document.createElement('div');
            secGroup.className = 'test-sec-group';

            const secHeader = document.createElement('div');
            secHeader.className = 'sec-header';
            secHeader.textContent = secName;
            secGroup.appendChild(secHeader);

            filteredItems.forEach(it => {
                const res = session.results[String(it.id)] || {};
                const st = res.status || 'PENDING';

                const row = document.createElement('div');
                row.className = `test-row ${it.id === currentId ? 'active' : ''} ${st === 'PASS' ? 'is-pass' : (st === 'FAIL' ? 'is-fail' : '')}`;
                row.innerHTML = `
                    <span class="id-badge">#${it.id}</span>
                    <span class="row-name" title="${it.name}">${it.name}</span>
                    <span class="status-dot"></span>
                `;
                row.addEventListener('click', () => {
                    saveCurrentComment();
                    currentId = it.id;
                    renderSidebar();
                    renderCurrentStep();
                });
                secGroup.appendChild(row);
            });

            testListEl.appendChild(secGroup);
        });
    }

    function renderCurrentStep() {
        const item = matrix.find(m => m.id === currentId);
        if (!item) return;

        const res = session.results[String(item.id)] || { status: 'PENDING', comment: '' };

        curSectionEl.textContent = item.section;
        curIdTagEl.textContent = `ID #${item.id}`;
        curNameEl.textContent = item.name;
        curCriteriaEl.textContent = item.criteria;
        curInstructionEl.textContent = item.instruction || 'Ellenőrizd a funkció megfelelő működését.';
        stepCommentEl.value = res.comment || '';

        // Status badge
        curStatusEl.className = 'status-indicator';
        if (res.status === 'PASS') {
            curStatusEl.classList.add('pass');
            curStatusEl.textContent = '🟢 PASS (ELFOGADVA)';
        } else if (res.status === 'FAIL') {
            curStatusEl.classList.add('fail');
            curStatusEl.textContent = '🔴 FAIL (HIBA / ELTÉRÉS)';
        } else {
            curStatusEl.textContent = '⚪ FÜGGŐBEN';
        }

        // Telemetry display
        if (res.measured_value) {
            autoValEl.textContent = res.measured_value;
            autoLatencyEl.textContent = res.latency_ms ? `${res.latency_ms} ms` : '-- ms';
            autoErrEl.textContent = res.error_code || 'ERR_NONE';
            autoDetailsEl.textContent = 'Korábbi mérés eredménye betöltve.';
            formatLatencyColor(res.latency_ms);
        } else {
            autoValEl.textContent = 'Mérésre vár...';
            autoLatencyEl.textContent = '-- ms';
            autoLatencyEl.style.color = '#e2e8f0';
            autoErrEl.textContent = 'ERR_NONE';
            autoDetailsEl.textContent = 'Kattints a "Mérés Futtatása" gombra a telemetria lekéréséhez.';
        }

        // Auto-run test on first arrival if pending
        if (res.status === 'PENDING' && !res.measured_value) {
            runCurrentAutoTest();
        }
    }

    function formatLatencyColor(latency) {
        if (!latency) return;
        if (latency < 30) {
            autoLatencyEl.style.color = '#22c55e'; // Green
        } else if (latency < 100) {
            autoLatencyEl.style.color = '#eab308'; // Yellow
        } else {
            autoLatencyEl.style.color = '#ef4444'; // Red
        }
    }

    async function runCurrentAutoTest() {
        const item = matrix.find(m => m.id === currentId);
        if (!item) return;

        autoValEl.textContent = 'Mérés folyamatban...';
        autoLatencyEl.textContent = '...';
        autoDetailsEl.textContent = 'Kommunikáció a Masterrel / Node-RED telemetriával...';

        try {
            const resp = await fetch('/api/run_auto_test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: item.id,
                    auto_type: item.auto_type,
                    master_ip: session.metadata.master_ip || '192.168.23.100'
                })
            });
            const data = await resp.json();

            autoLatencyEl.textContent = `${data.latency_ms} ms`;
            formatLatencyColor(data.latency_ms);
            autoValEl.textContent = data.measured_value || 'N/A';
            autoErrEl.textContent = data.error_code || 'ERR_NONE';
            autoDetailsEl.textContent = data.details || 'Mérés sikeresen befejeződött.';

            // Store measurement in session
            const res = session.results[String(item.id)];
            if (res) {
                res.latency_ms = data.latency_ms;
                res.measured_value = data.measured_value;
                res.error_code = data.error_code;
            }
        } catch (e) {
            console.error('Auto test error:', e);
            autoValEl.textContent = 'Hiba a mérés során';
            autoErrEl.textContent = 'ERR_NET_UNREACHABLE_001';
            autoDetailsEl.textContent = 'Kivétel: ' + e.message;
        }
    }

    async function measureStartupBenchmark() {
        const bootDisp = document.getElementById('boot-time-display');
        bootDisp.textContent = 'Mérés...';
        try {
            const resp = await fetch('/api/measure_startup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodered_url: session.metadata.nodered_url || 'http://127.0.0.1:1880' })
            });
            const data = await resp.json();
            bootDisp.textContent = `${data.startup_seconds}s`;
            if (data.startup_seconds < 3.0) {
                bootDisp.style.color = '#86efac';
            } else if (data.startup_seconds < 6.0) {
                bootDisp.style.color = '#fde047';
            } else {
                bootDisp.style.color = '#fca5a5';
            }
            alert(`⏱️ NassMaster Indulási Idő Benchmark:\n\n• Mért indulási idő: ${data.startup_seconds} másodperc\n• Minősítés: [${data.status}]\n• Elvárt SLA: ${data.target_sla}\n\n${data.details}`);
        } catch (e) {
            bootDisp.textContent = 'Hiba';
            alert('Hiba az indulási idő mérésekor: ' + e.message);
        }
    }

    async function recordDecision(status) {
        const item = matrix.find(m => m.id === currentId);
        if (!item) return;

        const comment = stepCommentEl.value.trim();
        const res = session.results[String(item.id)];
        
        res.status = status;
        res.comment = comment;

        // Save to backend
        try {
            await fetch('/api/save_step', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: item.id,
                    status: status,
                    comment: comment,
                    latency_ms: res.latency_ms,
                    measured_value: res.measured_value,
                    error_code: res.error_code
                })
            });
        } catch (e) {
            console.error('Save error:', e);
        }

        updateStats();
        renderSidebar();

        // Advance to next pending step automatically
        jumpToNextPending();
    }

    function saveCurrentComment() {
        const item = matrix.find(m => m.id === currentId);
        if (!item) return;
        const res = session.results[String(item.id)];
        if (res && res.comment !== stepCommentEl.value.trim()) {
            res.comment = stepCommentEl.value.trim();
            fetch('/api/save_step', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: item.id,
                    status: res.status,
                    comment: res.comment,
                    latency_ms: res.latency_ms,
                    measured_value: res.measured_value,
                    error_code: res.error_code
                })
            }).catch(console.error);
        }
    }

    function navigate(direction) {
        saveCurrentComment();
        const newId = currentId + direction;
        if (newId >= 1 && newId <= matrix.length) {
            currentId = newId;
            renderSidebar();
            renderCurrentStep();
        }
    }

    function jumpToNextPending() {
        saveCurrentComment();
        // Look ahead
        for (let i = currentId + 1; i <= matrix.length; i++) {
            if (session.results[String(i)]?.status === 'PENDING') {
                currentId = i;
                renderSidebar();
                renderCurrentStep();
                return;
            }
        }
        // Look from beginning
        for (let i = 1; i <= currentId; i++) {
            if (session.results[String(i)]?.status === 'PENDING') {
                currentId = i;
                renderSidebar();
                renderCurrentStep();
                return;
            }
        }
        // If none pending, advance normally
        navigate(1);
    }

    function updateStats() {
        const total = matrix.length;
        let passCount = 0;
        let failCount = 0;
        let pendCount = 0;

        Object.values(session.results).forEach(r => {
            if (r.status === 'PASS') passCount++;
            else if (r.status === 'FAIL') failCount++;
            else pendCount++;
        });

        statTotalEl.textContent = total;
        statPassEl.textContent = passCount;
        statFailEl.textContent = failCount;
        statPendEl.textContent = pendCount;

        const completed = passCount + failCount;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        progressBarEl.style.width = `${pct}%`;
        progressTxtEl.textContent = `${pct}%`;
    }

    // Modal & Reports
    function openReportModal() {
        saveCurrentComment();
        const meta = session.metadata || {};
        document.getElementById('rep-version').value = meta.version || 'v2.2.0-global';
        document.getElementById('rep-date').value = meta.date || new Date().toISOString().split('T')[0];
        document.getElementById('rep-tester').value = meta.tester || 'Minőségbiztosítási Mérnök';
        document.getElementById('rep-master-ip').value = meta.master_ip || '192.168.23.100';
        document.getElementById('rep-decision').value = meta.decision || 'KIADHATÓ';

        const previewEl = document.getElementById('report-preview');
        const passCount = parseInt(statPassEl.textContent);
        const failCount = parseInt(statFailEl.textContent);
        const pendCount = parseInt(statPendEl.textContent);

        previewEl.innerHTML = `
            <div style="padding: 20px; color:#e2e8f0; font-family:var(--font-sans);">
                <h3 style="color:#f472b6; margin-bottom:10px;">📊 Jegyzőkönyv Összesítés</h3>
                <p>• Összes tesztpont: <b>81 db</b></p>
                <p>• Sikeres (PASS): <b style="color:#22c55e;">${passCount} db</b> (${Math.round(passCount/81*100)}%)</p>
                <p>• Sikertelen (FAIL): <b style="color:#ef4444;">${failCount} db</b></p>
                <p>• Függőben (PENDING): <b style="color:#eab308;">${pendCount} db</b></p>
                <hr style="border-color:#333; margin:15px 0;">
                <p style="font-size:12px; color:#94a3b8;">A 'Nyomtatás / PDF Mentés' gombra kattintva a rendszer létrehozza a hivatalos FAT/SAT nyomtatható HTML dokumentumot és megnyitja új lapon.</p>
            </div>
        `;

        document.getElementById('report-modal').classList.add('active');
    }

    function closeReportModal() {
        document.getElementById('report-modal').classList.remove('active');
    }

    async function generateAndPrintReport() {
        const meta = {
            version: document.getElementById('rep-version').value,
            date: document.getElementById('rep-date').value,
            tester: document.getElementById('rep-tester').value,
            master_ip: document.getElementById('rep-master-ip').value,
            decision: document.getElementById('rep-decision').value
        };

        try {
            const resp = await fetch('/api/generate_report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ metadata: meta })
            });
            const data = await resp.json();
            if (data.url) {
                window.open(data.url, '_blank');
                closeReportModal();
            }
        } catch (e) {
            alert('Hiba a jegyzőkönyv generálásakor: ' + e.message);
        }
    }

    async function resetSession() {
        if (confirm('Biztosan újra szeretnéd indítani a teljes FAT/SAT tesztelést? (Minden eddigi eredmény törlődik!)')) {
            try {
                const resp = await fetch('/api/reset_session', { method: 'POST' });
                const data = await resp.json();
                session = data.session;
                currentId = 1;
                renderSidebar();
                renderCurrentStep();
                updateStats();
            } catch (e) {
                alert('Hiba a reset során: ' + e.message);
            }
        }
    }

    // Launch
    window.addEventListener('DOMContentLoaded', init);
})();
