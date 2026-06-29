(function () {
    const fallbackEmployees = [
        { id: 1, name: 'Mara Kessler', role: 'Senior Engineer', team: 'Infrastructure', score: 9.3, activeDays: 120, workload: 'high', availability: 5, initial: 'MK', color: 'bg-blue-600' },
        { id: 2, name: 'Jordan Osei', role: 'Product Designer', team: 'Growth Squad', score: 8.6, activeDays: 95, workload: 'medium', availability: 4, initial: 'JO', color: 'bg-purple-600' },
        { id: 3, name: 'Rafael Souza', role: 'Backend Engineer', team: 'Infrastructure', score: 7.4, activeDays: 210, workload: 'high', availability: 3, initial: 'RS', color: 'bg-teal-500' },
        { id: 4, name: 'Aisha Mensah', role: 'UX Researcher', team: 'Project Horizon', score: 9.0, activeDays: 65, workload: 'low', availability: 6, initial: 'AM', color: 'bg-indigo-500' },
        { id: 5, name: 'Carlos Ruiz', role: 'Frontend Developer', team: 'Project Horizon', score: 8.2, activeDays: 78, workload: 'medium', availability: 5, initial: 'CR', color: 'bg-rose-500' },
        { id: 6, name: 'Elena Torres', role: 'Data Scientist', team: 'Growth Squad', score: 8.8, activeDays: 132, workload: 'low', availability: 7, initial: 'ET', color: 'bg-amber-500' },
        { id: 7, name: 'Liam Chen', role: 'QA Engineer', team: 'Growth Squad', score: 7.8, activeDays: 90, workload: 'medium', availability: 4, initial: 'LC', color: 'bg-slate-600' },
        { id: 8, name: 'Natalie Brooks', role: 'Product Manager', team: 'Project Horizon', score: 8.9, activeDays: 55, workload: 'high', availability: 6, initial: 'NB', color: 'bg-fuchsia-600' },
        { id: 9, name: 'Samuel Park', role: 'DevOps Engineer', team: 'Infrastructure', score: 8.1, activeDays: 145, workload: 'high', availability: 5, initial: 'SP', color: 'bg-cyan-600' },
        { id: 10, name: 'Amina Yusuf', role: 'Data Analyst', team: 'Growth Squad', score: 8.4, activeDays: 82, workload: 'low', availability: 6, initial: 'AY', color: 'bg-emerald-600' },
        { id: 11, name: 'Mei Lin', role: 'Cloud Architect', team: 'Infrastructure', score: 8.7, activeDays: 160, workload: 'high', availability: 4, initial: 'ML', color: 'bg-sky-600' },
        { id: 12, name: 'Henri Salazar', role: 'Technical Writer', team: 'Growth Squad', score: 7.9, activeDays: 48, workload: 'low', availability: 7, initial: 'HS', color: 'bg-lime-600' },
        { id: 13, name: 'Noor Ali', role: 'Frontend Lead', team: 'Project Horizon', score: 9.1, activeDays: 115, workload: 'medium', availability: 5, initial: 'NA', color: 'bg-fuchsia-500' },
        { id: 14, name: 'Diego Morales', role: 'Cybersecurity', team: 'Infrastructure', score: 8.5, activeDays: 143, workload: 'high', availability: 4, initial: 'DM', color: 'bg-indigo-600' },
        { id: 15, name: 'Sara Vogel', role: 'People Ops', team: 'Growth Squad', score: 8.0, activeDays: 80, workload: 'low', availability: 8, initial: 'SV', color: 'bg-emerald-500' },
        { id: 16, name: 'Tomas Ekström', role: 'Mobile Engineer', team: 'Project Horizon', score: 8.3, activeDays: 102, workload: 'medium', availability: 5, initial: 'TE', color: 'bg-violet-600' }
    ];

    function parseNumeric(value, fallback = 0) {
        const num = Number(value);
        return Number.isFinite(num) ? num : fallback;
    }

    function parseDataLine(line, headers) {
        const cols = line.split('\t');
        const item = {};
        headers.forEach((header, index) => {
            item[header] = cols[index] ? cols[index].trim() : '';
        });
        return {
            id: parseNumeric(item.id, 0),
            name: item.name || '',
            role: item.role || '',
            team: item.team || '',
            score: parseNumeric(item.score, 0),
            activeDays: parseNumeric(item.activeDays, 0),
            workload: item.workload || 'medium',
            availability: parseNumeric(item.availability, 0),
            initial: item.initial || item.name.split(' ').map(part => part[0]).slice(0, 2).join(''),
            color: item.color || 'bg-blue-600'
        };
    }

    function sortByWorkload(list, prefer) {
        const order = { low: 0, medium: 1, high: 2 };
        if (prefer === 'lightest') return [...list].sort((a, b) => order[a.workload] - order[b.workload] || b.score - a.score);
        if (prefer === 'heaviest') return [...list].sort((a, b) => order[b.workload] - order[a.workload] || b.score - a.score);
        return [...list].sort((a, b) => order[a.workload] - order[b.workload] || b.score - a.score);
    }

    function shuffle(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    window.fallbackEmployees = fallbackEmployees;

    window.loadEmployeeData = async function () {
        if (window.employeeDataPromise) return window.employeeDataPromise;

        window.employeeDataPromise = (async () => {
            try {
                const res = await fetch('employees.txt');
                if (!res.ok) throw new Error('No se pudo cargar el archivo de datos.');
                const text = await res.text();
                const rows = text.split(/\r?\n/).filter(line => line.trim().length);
                const headers = rows[0].split('\t').map(h => h.trim());
                const parsed = rows.slice(1).map(line => parseDataLine(line, headers));
                if (parsed.length === 0) throw new Error('Archivo vacío');
                return parsed;
            } catch (error) {
                console.warn('Falling back to embedded employees data:', error);
                return fallbackEmployees;
            }
        })();

        return window.employeeDataPromise;
    };

    window.groupEmployeesByTeam = function (employees) {
        return employees.reduce((acc, emp) => {
            if (!acc[emp.team]) {
                acc[emp.team] = { team: emp.team, members: [], totalScore: 0, totalActive: 0, availabilities: [] };
            }
            acc[emp.team].members.push(emp);
            acc[emp.team].totalScore += emp.score;
            acc[emp.team].totalActive += emp.activeDays;
            acc[emp.team].availabilities.push(emp.availability);
            return acc;
        }, {});
    };

    window.generateTeamProposal = function (employees, options) {
        const { priority, workload, availability, size } = options;

        let pool = [...employees];

        if (workload && workload !== 'any') {
            pool = pool.filter(emp => emp.workload === workload);
        }

        if (availability && availability !== 'any') {
            if (availability === 'high') pool = pool.filter(emp => emp.availability >= 6);
            if (availability === 'medium') pool = pool.filter(emp => emp.availability >= 4);
            if (availability === 'low') pool = pool.filter(emp => emp.availability <= 3);
        }

        if (pool.length === 0) {
            pool = [...employees];
        }

        switch (priority) {
            case 'timeActive':
                pool.sort((a, b) => b.activeDays - a.activeDays || b.score - a.score);
                break;
            case 'score':
                pool.sort((a, b) => b.score - a.score || b.availability - a.availability);
                break;
            case 'availability':
                pool.sort((a, b) => b.availability - a.availability || b.score - a.score);
                break;
            case 'workload':
                pool = sortByWorkload(pool, workload === 'high' ? 'heaviest' : 'lightest');
                break;
            default:
                pool = shuffle(pool);
                break;
        }

        const selected = pool.slice(0, Math.min(size, 12));
        const averageScore = selected.length ? (selected.reduce((sum, emp) => sum + emp.score, 0) / selected.length) : 0;

        return {
            team: selected,
            score: averageScore.toFixed(1),
            members: selected.length,
            name: `Proposal ${priority === 'score' ? 'Top Score' : priority === 'timeActive' ? 'Top Active' : priority === 'availability' ? 'Best Availability' : 'Smart Team'}`
        };
    };

    window.computeDashboardMetrics = function (employees) {
        const total = employees.length;
        const active = employees.filter(emp => emp.availability >= 4).length;
        const progress = employees.filter(emp => emp.score >= 8 && emp.score < 9).length;
        const critical = employees.filter(emp => emp.score < 8).length;
        return { total, active, progress, critical };
    };

}());