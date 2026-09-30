window.PORTFOLIO_DATA = {
    site: {
        title: 'Mahfujur Rahman | Developer Platform',
        description: 'Portfolio, apps, blog, lab, and learning journey by Mahfujur Rahman.',
        baseUrl: 'https://qy-nox.github.io/protfolio',
        contactEndpoint: '',
        lastUpdated: '2026-09-30'
    },
    profile: {
        name: 'Mahfujur Rahman',
        role: 'Computer Technology Student & Developer',
        intro: [
            'I started with curiosity and practical computer tasks, then grew into programming, web development, and app development through consistent self-learning.',
            'Right now I focus on building useful projects, improving technical depth, and documenting my learning so future work is easier to scale.',
            'My long-term direction includes secure software, thoughtful user experiences, and practical digital tools that solve real problems.'
        ],
        whatIDo: [
            { title: 'Web Development', description: 'Building responsive, accessible, and maintainable frontend experiences.' },
            { title: 'App Development', description: 'Designing Android-focused app ideas with practical user workflows.' },
            { title: 'Experiments', description: 'Trying APIs, automation scripts, Linux workflows, and interface ideas.' },
            { title: 'Writing & Learning', description: 'Publishing notes and project stories to reinforce what I build.' }
        ],
        currentlyLearning: ['JavaScript', 'Web Development', 'Android Development', 'Firebase', 'Python', 'Git/GitHub', 'Linux'],
        interests: ['Technology', 'Photography', 'Motorbikes', 'Exploring ideas', 'Practical projects']
    },
    technologies: ['HTML', 'CSS', 'JavaScript', 'Python', 'Firebase', 'Git', 'GitHub', 'Linux'],
    projects: [
        {
            slug: 'study-sprint-planner',
            title: 'Study Sprint Planner',
            description: 'A lightweight planner for daily study blocks, focus sessions, and progress notes.',
            category: 'Tool',
            status: 'In Progress',
            featured: true,
            thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
            technologies: ['JavaScript', 'Local Storage', 'Responsive UI'],
            githubUrl: 'https://github.com/qy-nox',
            liveUrl: null,
            downloadUrl: null,
            content: {
                story: 'This project started to make my own study routine trackable on mobile and desktop.',
                challenges: ['Balancing simple UI with enough structure', 'Persisting data without backend'],
                solutions: ['JSON-based records', 'Modular rendering logic'],
                lessons: ['Prioritize clarity over feature volume in early versions.']
            }
        },
        {
            slug: 'campus-resource-board',
            title: 'Campus Resource Board',
            description: 'A categorized board for study links, notes, and references shared across classmates.',
            category: 'Website',
            status: 'Completed',
            featured: true,
            thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            githubUrl: null,
            liveUrl: null,
            downloadUrl: null,
            content: {
                story: 'I wanted a quick way to organize course resources and update them in one place.',
                challenges: ['Keeping categories understandable', 'Optimizing for mobile reading'],
                solutions: ['Tag-based sections', 'Card layout with concise labels'],
                lessons: ['Small taxonomy decisions heavily impact discoverability.']
            }
        },
        {
            slug: 'expense-note-lite',
            title: 'Expense Note Lite',
            description: 'A simple tracker for student daily spending with category snapshots.',
            category: 'App',
            status: 'Experimental',
            featured: false,
            thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
            technologies: ['JavaScript', 'PWA Basics'],
            githubUrl: null,
            liveUrl: null,
            downloadUrl: null,
            content: {
                story: 'Built to practice state management while solving a real budgeting need.',
                challenges: ['Input validation', 'Offline-first behavior'],
                solutions: ['Client-side constraints', 'Cached static assets'],
                lessons: ['Data integrity matters even in tiny apps.']
            }
        },
        {
            slug: 'portfolio-platform-v2',
            title: 'Portfolio Platform v2',
            description: 'This production-oriented portfolio platform with data-driven pages and admin shell.',
            category: 'Website',
            status: 'In Progress',
            featured: true,
            thumbnail: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=1200&q=80',
            technologies: ['HTML', 'CSS', 'JavaScript', 'Routing'],
            githubUrl: 'https://github.com/qy-nox/protfolio',
            liveUrl: null,
            downloadUrl: null,
            content: {
                story: 'A redesign to consolidate identity, portfolio, app hub, writing, and experiments.',
                challenges: ['Static hosting constraints', 'Scalable architecture for future CMS'],
                solutions: ['Hash routing', 'Dedicated data module', 'Firebase adapter layer'],
                lessons: ['Separation of content and rendering keeps growth manageable.']
            }
        }
    ],
    apps: [
        {
            slug: 'focus-timer-mobile',
            name: 'Focus Timer Mobile',
            icon: '⏱️',
            version: '0.9.0',
            platform: 'Android (planned APK release)',
            status: 'In Progress',
            description: 'A distraction-light focus timer with short/long break cycles.',
            features: ['Custom session lengths', 'Daily streak counter', 'Minimal visual distractions'],
            screenshots: [
                'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80',
                'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&q=80'
            ],
            apkUrl: null,
            playStoreUrl: null,
            githubUrl: null,
            downloadUrl: null
        },
        {
            slug: 'notebook-snap',
            name: 'Notebook Snap',
            icon: '📝',
            version: '1.1.2',
            platform: 'Web App',
            status: 'Completed',
            description: 'Quick note capture app for class highlights and tasks.',
            features: ['Tag notes', 'Pin important notes', 'Offline-friendly'],
            screenshots: [
                'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80'
            ],
            apkUrl: null,
            playStoreUrl: null,
            githubUrl: 'https://github.com/qy-nox',
            downloadUrl: null
        },
        {
            slug: 'device-toolkit',
            name: 'Device Toolkit',
            icon: '🧰',
            version: '0.4.1',
            platform: 'Android',
            status: 'Experimental',
            description: 'A utility concept combining QR, basic conversions, and quick text tools.',
            features: ['QR encode/decode prototype', 'Small productivity shortcuts', 'Modular feature panel'],
            screenshots: [
                'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80'
            ],
            apkUrl: null,
            playStoreUrl: null,
            githubUrl: null,
            downloadUrl: null
        }
    ],
    posts: [
        {
            slug: 'from-curiosity-to-code',
            title: 'From Curiosity to Code: How My Journey Started',
            excerpt: 'How practical computer tasks turned into consistent programming practice.',
            coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80',
            category: 'My Journey',
            tags: ['journey', 'learning', 'motivation'],
            author: 'Mahfujur Rahman',
            publishedAt: '2026-09-01',
            updatedAt: '2026-09-05',
            readingTime: '6 min',
            featured: true,
            content: `
<h2 id="start">Starting point</h2>
<p>I did not begin with a perfect plan. I started by helping with practical computer tasks and became curious about how software actually works.</p>
<h2 id="shift">The shift to development</h2>
<p>After trying small scripts and frontend experiments, I realized I enjoy turning ideas into tools. That shift made learning much more intentional.</p>
<h3 id="lessons">Lessons</h3>
<ul><li>Consistency beats intensity.</li><li>Build small, then refactor.</li><li>Document what you learn.</li></ul>
<pre><code>const rule = 'Learn -> Build -> Experiment -> Improve';</code></pre>
<blockquote>Progress is easier when every project has a clear purpose.</blockquote>
`
        },
        {
            slug: 'building-better-static-sites',
            title: 'Building Better Static Sites Without Overengineering',
            excerpt: 'A practical architecture for scalable static portfolio projects.',
            coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80',
            category: 'Web Development',
            tags: ['architecture', 'frontend', 'performance'],
            author: 'Mahfujur Rahman',
            publishedAt: '2026-08-22',
            updatedAt: '2026-08-24',
            readingTime: '8 min',
            featured: true,
            content: `
<h2 id="why-static">Why static-first</h2>
<p>Static-first architecture keeps deployment simple and fast while still allowing future CMS expansion.</p>
<h2 id="content-layer">Content layer</h2>
<p>Separating content into dedicated data files avoids deeply hardcoded UI.</p>
<h2 id="future">Future backend integration</h2>
<p>A Firebase adapter can be added later without rewriting the whole frontend.</p>
`
        },
        {
            slug: 'learning-javascript-through-projects',
            title: 'Learning JavaScript Through Real Projects',
            excerpt: 'How I turn concepts into practical JavaScript exercises and tools.',
            coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
            category: 'Programming',
            tags: ['javascript', 'projects', 'practice'],
            author: 'Mahfujur Rahman',
            publishedAt: '2026-08-15',
            updatedAt: '2026-08-15',
            readingTime: '7 min',
            featured: false,
            content: `
<h2 id="practice-loop">Practice loop</h2>
<p>Reading docs is important, but implementation reveals real understanding gaps.</p>
<h2 id="patterns">Patterns I revisit</h2>
<ul><li>Array transformations</li><li>UI state rendering</li><li>Form validation</li></ul>
`
        },
        {
            slug: 'first-steps-with-firebase-content-modeling',
            title: 'First Steps With Firebase Content Modeling',
            excerpt: 'Designing collections and rules before writing any CRUD UI.',
            coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
            category: 'Technology',
            tags: ['firebase', 'backend', 'security'],
            author: 'Mahfujur Rahman',
            publishedAt: '2026-07-29',
            updatedAt: '2026-07-31',
            readingTime: '9 min',
            featured: false,
            content: `
<h2 id="model">Model first</h2>
<p>Before building forms, define document schema and access policy boundaries.</p>
<h2 id="rules">Rules templates</h2>
<p>Use explicit read/write checks and file path restrictions from day one.</p>
`
        },
        {
            slug: 'linux-habits-that-improved-my-dev-flow',
            title: 'Linux Habits That Improved My Dev Flow',
            excerpt: 'Small command-line habits that made me faster and more organized.',
            coverImage: 'https://images.unsplash.com/photo-1527443224154-c4c06a24f25d?w=1200&q=80',
            category: 'Tutorials',
            tags: ['linux', 'workflow', 'productivity'],
            author: 'Mahfujur Rahman',
            publishedAt: '2026-07-11',
            updatedAt: '2026-07-13',
            readingTime: '5 min',
            featured: false,
            content: `
<h2 id="cleanup">Repeatable cleanup</h2>
<p>I use simple routines for project discovery, branch checks, and file hygiene.</p>
<h2 id="mindset">Mindset</h2>
<p>Automation matters, but clarity and naming matter more over time.</p>
`
        }
    ],
    lab: [
        { title: 'ESP8266 LED + Web Trigger', status: 'Completed', note: 'Basic Wi-Fi command control prototype.' },
        { title: 'Telegram Utility Bot', status: 'In Progress', note: 'Exploring command routing and message actions.' },
        { title: 'API Rate-Limit Playground', status: 'Experimental', note: 'Testing retry and backoff strategies.' },
        { title: 'Legacy Python GUI Tool', status: 'Abandoned', note: 'Paused due to poor maintainability.' }
    ],
    learning: {
        timeline: [
            { period: '2023', title: 'Started focused computer learning', description: 'Built confidence with practical software tasks and productivity tools.' },
            { period: '2024', title: 'Entered Computer Technology studies', description: 'Began structured coursework and technical foundations.' },
            { period: '2025', title: 'Deepened web and scripting practice', description: 'Built mini projects in HTML, CSS, JavaScript, and Python.' },
            { period: '2026', title: 'Platform and CMS architecture phase', description: 'Reorganized portfolio for long-term content growth.' }
        ],
        goals: [
            'Ship stable app releases with clearer changelogs',
            'Implement production Firebase auth and content workflows',
            'Improve testing discipline for UI and data layers',
            'Contribute to open-source projects with meaningful fixes'
        ]
    },
    resources: [
        { title: 'JavaScript Reference Notes', category: 'Cheat Sheet', description: 'Personal notes on core syntax and array methods.', url: null },
        { title: 'Git Command Flow', category: 'Workflow', description: 'A compact branch/commit checklist for daily work.', url: null },
        { title: 'Responsive Layout Checklist', category: 'Web Development', description: 'Breakpoints, spacing, and interaction checks for mobile-first work.', url: null },
        { title: 'Linux Terminal Starter', category: 'Linux', description: 'Common command examples for project navigation and file ops.', url: null },
        { title: 'Firebase Security Rules Draft', category: 'Backend', description: 'Rules templates for role-based content access.', url: '#/admin' }
    ],
    legal: {
        privacy: [
            'This static site collects no personal data by default unless a contact endpoint is configured.',
            'When a contact endpoint is not configured, messages are not transmitted and users are informed clearly.',
            'If Firebase integration is enabled later, data handling must follow explicit rules and published disclosures.'
        ],
        terms: [
            'This website content is provided for portfolio and educational purposes.',
            'Demo data shown across sections is editable sample content and may not reflect live products.',
            'Admin frontend checks are UX-level only and are not a substitute for backend security enforcement.'
        ]
    },
    social: [
        { label: 'GitHub', url: 'https://github.com/qy-nox' },
        { label: 'Email', url: 'mailto:mahfujur@example.com' },
        { label: 'LinkedIn', url: null },
        { label: 'Facebook', url: null }
    ],
    admin: {
        tabs: ['projects', 'apps', 'posts', 'media', 'categories', 'tags', 'settings'],
        recentActivity: [
            'Updated portfolio route architecture',
            'Added app and project sample records',
            'Prepared Firebase adapter and rules templates'
        ]
    }
};
