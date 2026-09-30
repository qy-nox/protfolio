(() => {
    const data = window.PORTFOLIO_DATA || {};
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    const state = {
        projectCategory: 'All',
        blogQuery: '',
        blogCategory: 'All',
        blogVisibleCount: 3,
        resourceQuery: '',
        resourceCategory: 'All',
        adminLoggedIn: localStorage.getItem('admin-demo-auth') === 'true',
        activeAdminTab: 'projects',
        modalOpener: null
    };

    const routePatterns = [
        { key: 'home', pattern: /^\/$/, sectionId: 'route-home', title: 'Home' },
        { key: 'about', pattern: /^\/about$/, sectionId: 'route-about', title: 'About' },
        { key: 'projects', pattern: /^\/projects$/, sectionId: 'route-projects', title: 'Projects' },
        { key: 'projectDetail', pattern: /^\/projects\/([a-z0-9-]+)$/, sectionId: 'route-project-detail', title: 'Project' },
        { key: 'apps', pattern: /^\/apps$/, sectionId: 'route-apps', title: 'Apps' },
        { key: 'appDetail', pattern: /^\/apps\/([a-z0-9-]+)$/, sectionId: 'route-app-detail', title: 'App' },
        { key: 'blog', pattern: /^\/blog$/, sectionId: 'route-blog', title: 'Blog' },
        { key: 'blogDetail', pattern: /^\/blog\/([a-z0-9-]+)$/, sectionId: 'route-blog-detail', title: 'Blog Post' },
        { key: 'lab', pattern: /^\/lab$/, sectionId: 'route-lab', title: 'Digital Lab' },
        { key: 'learning', pattern: /^\/learning$/, sectionId: 'route-learning', title: 'Learning' },
        { key: 'resources', pattern: /^\/resources$/, sectionId: 'route-resources', title: 'Resources' },
        { key: 'contact', pattern: /^\/contact$/, sectionId: 'route-contact', title: 'Contact' },
        { key: 'privacy', pattern: /^\/privacy$/, sectionId: 'route-privacy', title: 'Privacy' },
        { key: 'terms', pattern: /^\/terms$/, sectionId: 'route-terms', title: 'Terms' },
        { key: 'admin', pattern: /^\/admin$/, sectionId: 'route-admin', title: 'Admin' }
    ];

    function $(id) {
        return document.getElementById(id);
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return Number.isNaN(date.getTime()) ? dateString : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function slugPath() {
        if (!location.hash || location.hash === '#') return '/';
        const clean = location.hash.slice(1);
        return clean.startsWith('/') ? clean : `/${clean}`;
    }

    function absolutePath(path) {
        return `${location.origin}${location.pathname}#${path}`;
    }

    function updateMetaForRoute(path, routeTitle, description) {
        const title = `${routeTitle} | Mahfujur Rahman`;
        document.title = title;
        const desc = description || data.site?.description || '';
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) descMeta.setAttribute('content', desc);
        const canonical = $('canonical-link');
        if (canonical) canonical.setAttribute('href', absolutePath(path === '/' ? '' : path));
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        const twDesc = document.querySelector('meta[name="twitter:description"]');
        if (ogTitle) ogTitle.setAttribute('content', title);
        if (ogDesc) ogDesc.setAttribute('content', desc);
        if (ogUrl) ogUrl.setAttribute('content', absolutePath(path === '/' ? '' : path));
        if (twTitle) twTitle.setAttribute('content', title);
        if (twDesc) twDesc.setAttribute('content', desc);
    }

    function routeMatch(path) {
        for (const item of routePatterns) {
            const match = path.match(item.pattern);
            if (match) return { ...item, params: match.slice(1) };
        }
        return { key: 'notFound', sectionId: 'route-not-found', title: 'Not Found', params: [] };
    }

    function setActiveNav(path) {
        const navLinks = document.querySelectorAll('[data-nav]');
        navLinks.forEach(link => {
            const navPath = link.getAttribute('data-nav');
            const active = path === navPath || (navPath !== '/' && path.startsWith(navPath + '/'));
            link.classList.toggle('active', active);
            link.setAttribute('aria-current', active ? 'page' : 'false');
        });
    }

    function renderStatus(status) {
        const normalized = String(status).toLowerCase().replaceAll(' ', '-');
        return `<span class="status status-${escapeHtml(normalized)}">${escapeHtml(status)}</span>`;
    }

    function actionButton(label, url, { primary = false, allowDownload = false } = {}) {
        if (!url) {
            return `<button class="btn ${primary ? 'primary' : 'ghost'} is-disabled" type="button" aria-disabled="true" title="Unavailable">${escapeHtml(label)} (Unavailable)</button>`;
        }
        const rel = url.startsWith('http') ? 'noopener noreferrer' : '';
        const target = url.startsWith('http') ? '_blank' : '_self';
        const downloadAttr = allowDownload ? 'download' : '';
        return `<a class="btn ${primary ? 'primary' : 'ghost'}" href="${escapeHtml(url)}" target="${target}" rel="${rel}" ${downloadAttr}>${escapeHtml(label)}</a>`;
    }

    function renderProjectCard(project) {
        return `
        <article class="card" data-reveal="up">
            <img class="media-thumb" src="${escapeHtml(project.thumbnail)}" alt="${escapeHtml(project.title)} thumbnail" loading="lazy" onerror="this.alt='Image unavailable';this.style.display='none';">
            <div class="card-meta">${renderStatus(project.status)}<span class="pill">${escapeHtml(project.category)}</span></div>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.description)}</p>
            <div class="card-meta">${project.technologies.map((tech) => `<span class="pill">${escapeHtml(tech)}</span>`).join('')}</div>
            <div class="actions">
                ${actionButton('GitHub', project.githubUrl)}
                ${actionButton('Live', project.liveUrl)}
                <a class="btn primary" href="#/projects/${escapeHtml(project.slug)}">Details</a>
            </div>
        </article>`;
    }

    function renderAppCard(app) {
        return `
        <article class="card" data-reveal="up">
            <div class="card-meta">${renderStatus(app.status)}<span class="pill">${escapeHtml(app.platform)}</span></div>
            <h3>${escapeHtml(app.icon)} ${escapeHtml(app.name)}</h3>
            <p>${escapeHtml(app.description)}</p>
            <div class="card-meta"><span class="pill">Version ${escapeHtml(app.version)}</span></div>
            <div class="actions">
                ${actionButton('APK', app.apkUrl, { primary: true, allowDownload: true })}
                ${actionButton('GitHub', app.githubUrl)}
                <a class="btn ghost" href="#/apps/${escapeHtml(app.slug)}">Details</a>
            </div>
        </article>`;
    }

    function renderPostCard(post) {
        return `
        <article class="card" data-reveal="up">
            <img class="media-thumb" src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.title)} cover image" loading="lazy" onerror="this.alt='Cover unavailable';this.style.display='none';">
            <div class="card-meta"><span class="pill">${escapeHtml(post.category)}</span><span class="pill">${escapeHtml(post.readingTime)}</span></div>
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.excerpt)}</p>
            <div class="card-meta">${post.tags.map((tag) => `<span class="pill">#${escapeHtml(tag)}</span>`).join('')}</div>
            <div class="actions">
                <a class="btn primary" href="#/blog/${escapeHtml(post.slug)}">Read post</a>
            </div>
        </article>`;
    }

    function renderStats() {
        const stats = [
            { label: 'Projects', value: data.projects?.length || 0 },
            { label: 'Apps', value: data.apps?.length || 0 },
            { label: 'Articles', value: data.posts?.length || 0 },
            { label: 'Technologies', value: data.technologies?.length || 0 }
        ];
        const grid = $('stats-grid');
        if (!grid) return;
        grid.innerHTML = stats.map((s) => `<article class="card"><h3 data-count="${s.value}">0</h3><p>${escapeHtml(s.label)}</p></article>`).join('');
        animateCounters(grid.querySelectorAll('[data-count]'));
    }

    function renderHeroTech() {
        const wrap = $('hero-tech-pills');
        if (!wrap) return;
        wrap.innerHTML = (data.technologies || []).slice(0, 6).map((tech) => `<span>${escapeHtml(tech)}</span>`).join('');
    }

    function renderFeatured() {
        const featuredProjects = (data.projects || []).filter((p) => p.featured).slice(0, 3);
        const featuredApps = (data.apps || []).slice(0, 3);
        const featuredPosts = (data.posts || []).filter((p) => p.featured).slice(0, 3);

        if ($('featured-projects')) $('featured-projects').innerHTML = featuredProjects.map(renderProjectCard).join('');
        if ($('featured-apps')) $('featured-apps').innerHTML = featuredApps.map(renderAppCard).join('');
        if ($('featured-posts')) $('featured-posts').innerHTML = featuredPosts.map(renderPostCard).join('');
        decorateCardsWithDetails();
    }

    function renderAbout() {
        $('about-story').innerHTML = (data.profile?.intro || []).map((line) => `<p>${escapeHtml(line)}</p>`).join('');
        $('about-what-i-do').innerHTML = (data.profile?.whatIDo || []).map((item) => `
            <article class="card">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.description)}</p>
            </article>
        `).join('');
        $('about-learning').innerHTML = (data.profile?.currentlyLearning || []).map((i) => `<span>${escapeHtml(i)}</span>`).join('');
        $('about-interests').innerHTML = (data.profile?.interests || []).map((i) => `<span>${escapeHtml(i)}</span>`).join('');
    }

    function renderProjectFilters() {
        const row = $('project-filter-row');
        if (!row) return;
        const categories = ['All', ...new Set((data.projects || []).map((p) => p.category))];
        row.innerHTML = categories.map((category) => {
            const active = category === state.projectCategory;
            return `<button class="btn ${active ? 'primary' : 'ghost'} project-filter" data-category="${escapeHtml(category)}" type="button">${escapeHtml(category)}</button>`;
        }).join('');

        row.querySelectorAll('.project-filter').forEach((btn) => {
            btn.addEventListener('click', () => {
                state.projectCategory = btn.dataset.category || 'All';
                renderProjectFilters();
                renderProjects();
            });
        });
    }

    function renderProjects() {
        const list = $('projects-list');
        const empty = $('projects-empty');
        if (!list || !empty) return;
        const filtered = (data.projects || []).filter((p) => state.projectCategory === 'All' || p.category === state.projectCategory);
        list.innerHTML = filtered.map(renderProjectCard).join('');
        empty.hidden = filtered.length !== 0;
        decorateCardsWithDetails();
        initRevealObserver();
    }

    function renderProjectDetail(slug) {
        const detailEl = $('project-detail');
        if (!detailEl) return;
        const project = (data.projects || []).find((p) => p.slug === slug);
        if (!project) {
            detailEl.innerHTML = `<div class="empty-state">Project not found. <a href="#/projects">Return to projects</a>.</div>`;
            return;
        }

        detailEl.innerHTML = `
            <article>
                <img class="media-thumb" src="${escapeHtml(project.thumbnail)}" alt="${escapeHtml(project.title)} thumbnail" loading="lazy" onerror="this.alt='Image unavailable';this.style.display='none';">
                <h1 class="section-title">${escapeHtml(project.title)}</h1>
                <div class="card-meta">${renderStatus(project.status)}<span class="pill">${escapeHtml(project.category)}</span></div>
                <p>${escapeHtml(project.description)}</p>
                <h3>Technologies</h3>
                <div class="tag-list">${project.technologies.map((tech) => `<span>${escapeHtml(tech)}</span>`).join('')}</div>
                <h3>Development story</h3>
                <p>${escapeHtml(project.content.story)}</p>
                <h3>Challenges</h3>
                <ul>${project.content.challenges.map((c) => `<li>${escapeHtml(c)}</li>`).join('')}</ul>
                <h3>Solutions</h3>
                <ul>${project.content.solutions.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
                <h3>Lessons learned</h3>
                <ul>${project.content.lessons.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul>
                <div class="actions">
                    ${actionButton('GitHub', project.githubUrl)}
                    ${actionButton('Live Demo', project.liveUrl)}
                    ${actionButton('Download', project.downloadUrl, { allowDownload: true })}
                </div>
                <p class="muted">Unavailable actions are intentionally disabled because no real URL is configured.</p>
            </article>
        `;
    }

    function renderApps() {
        const list = $('apps-list');
        const empty = $('apps-empty');
        if (!list || !empty) return;
        const apps = data.apps || [];
        list.innerHTML = apps.map(renderAppCard).join('');
        empty.hidden = apps.length !== 0;
        decorateCardsWithDetails();
        initRevealObserver();
    }

    function renderAppDetail(slug) {
        const detail = $('app-detail');
        if (!detail) return;
        const app = (data.apps || []).find((a) => a.slug === slug);
        if (!app) {
            detail.innerHTML = `<div class="empty-state">App not found. <a href="#/apps">Return to apps</a>.</div>`;
            return;
        }

        detail.innerHTML = `
            <article>
                <h1 class="section-title">${escapeHtml(app.icon)} ${escapeHtml(app.name)}</h1>
                <div class="card-meta">${renderStatus(app.status)}<span class="pill">Version ${escapeHtml(app.version)}</span><span class="pill">${escapeHtml(app.platform)}</span></div>
                <p>${escapeHtml(app.description)}</p>
                <h3>Features</h3>
                <ul>${app.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>
                <h3>Screenshots</h3>
                <div class="card-grid">${app.screenshots.map((shot, index) => `<img class="media-thumb" src="${escapeHtml(shot)}" alt="${escapeHtml(app.name)} screenshot ${index + 1}" loading="lazy" onerror="this.alt='Screenshot unavailable';this.style.display='none';">`).join('')}</div>
                <div class="actions">
                    ${actionButton('APK Download', app.apkUrl, { primary: true, allowDownload: true })}
                    ${actionButton('Play Store', app.playStoreUrl)}
                    ${actionButton('GitHub', app.githubUrl)}
                </div>
                <p class="muted">Download links appear only when real URLs are provided in <code>data.js</code>.</p>
            </article>
        `;
    }

    function postMatches(post) {
        const query = state.blogQuery.trim().toLowerCase();
        const byCategory = state.blogCategory === 'All' || post.category === state.blogCategory;
        if (!query) return byCategory;
        const haystack = `${post.title} ${post.excerpt} ${post.tags.join(' ')} ${post.category}`.toLowerCase();
        return byCategory && haystack.includes(query);
    }

    function renderBlogFilters() {
        const categorySelect = $('blog-category');
        if (!categorySelect) return;
        const categories = ['All', ...new Set((data.posts || []).map((post) => post.category))];
        categorySelect.innerHTML = categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
        categorySelect.value = state.blogCategory;
    }

    function renderBlogList() {
        const list = $('blog-list');
        const empty = $('blog-empty');
        const loadMoreBtn = $('blog-load-more');
        if (!list || !empty || !loadMoreBtn) return;

        const filtered = (data.posts || []).filter(postMatches);
        const visible = filtered.slice(0, state.blogVisibleCount);
        list.innerHTML = visible.map(renderPostCard).join('');
        empty.hidden = filtered.length !== 0;
        loadMoreBtn.hidden = visible.length >= filtered.length;
        initRevealObserver();
    }

    function renderBlogDetail(slug) {
        const detail = $('blog-detail');
        const toc = $('blog-toc');
        const related = $('related-posts');
        if (!detail || !toc || !related) return;

        const post = (data.posts || []).find((item) => item.slug === slug);
        if (!post) {
            detail.innerHTML = `<div class="empty-state">Oops! This article could not be found. <a href="#/blog">Return to blog</a>.</div>`;
            toc.innerHTML = '';
            related.innerHTML = '';
            return;
        }

        detail.innerHTML = `
            <img class="media-thumb" src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.title)} cover image" loading="lazy" onerror="this.alt='Cover unavailable';this.style.display='none';">
            <h1>${escapeHtml(post.title)}</h1>
            <p class="muted">${escapeHtml(post.author)} · ${formatDate(post.publishedAt)} · ${escapeHtml(post.readingTime)} · Updated ${formatDate(post.updatedAt)}</p>
            <div class="tag-list">${post.tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join('')}</div>
            <p>${escapeHtml(post.excerpt)}</p>
            ${post.content}
        `;

        const headings = [...detail.querySelectorAll('h2, h3')];
        toc.innerHTML = headings.length ? headings.map((heading) => {
            if (!heading.id) heading.id = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return `<li><button class="btn ghost toc-link" type="button" data-scroll-id="${escapeHtml(heading.id)}">${escapeHtml(heading.textContent)}</button></li>`;
        }).join('') : '<li>No table of contents for this post.</li>';

        toc.querySelectorAll('[data-scroll-id]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const target = detail.querySelector(`#${CSS.escape(btn.getAttribute('data-scroll-id') || '')}`);
                target?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
            });
        });

        const relatedPosts = (data.posts || []).filter((item) => item.slug !== post.slug && item.tags.some((tag) => post.tags.includes(tag))).slice(0, 3);
        related.innerHTML = relatedPosts.length ? relatedPosts.map((item) => `<p><a href="#/blog/${escapeHtml(item.slug)}">${escapeHtml(item.title)}</a></p>`).join('') : '<p class="muted">No related posts available.</p>';

        const shareBtn = $('share-post');
        const shareStatus = $('share-status');
        if (shareBtn && shareStatus) {
            shareBtn.onclick = async () => {
                const shareData = { title: post.title, text: post.excerpt, url: absolutePath(`/blog/${post.slug}`) };
                try {
                    if (navigator.share) {
                        await navigator.share(shareData);
                        shareStatus.textContent = 'Shared successfully.';
                    } else {
                        await navigator.clipboard.writeText(shareData.url);
                        shareStatus.textContent = 'Link copied to clipboard.';
                    }
                } catch {
                    shareStatus.textContent = 'Share cancelled or unavailable.';
                }
            };
        }
    }

    function renderLab() {
        const list = $('lab-list');
        if (!list) return;
        list.innerHTML = (data.lab || []).map((exp) => `
            <article class="card" data-reveal="up">
                <div class="card-meta">${renderStatus(exp.status)}</div>
                <h3>${escapeHtml(exp.title)}</h3>
                <p>${escapeHtml(exp.note)}</p>
            </article>
        `).join('');
        initRevealObserver();
    }

    function renderLearning() {
        $('learning-current').innerHTML = (data.profile?.currentlyLearning || []).map((item) => `<span>${escapeHtml(item)}</span>`).join('');
        $('learning-timeline').innerHTML = (data.learning?.timeline || []).map((entry) => `
            <div class="timeline-item" data-reveal="up">
                <span class="pill">${escapeHtml(entry.period)}</span>
                <h4>${escapeHtml(entry.title)}</h4>
                <p>${escapeHtml(entry.description)}</p>
            </div>
        `).join('');
        $('learning-goals').innerHTML = (data.learning?.goals || []).map((goal) => `<li>${escapeHtml(goal)}</li>`).join('');
        initRevealObserver();
    }

    function resourceMatches(resource) {
        const query = state.resourceQuery.trim().toLowerCase();
        const categoryOk = state.resourceCategory === 'All' || resource.category === state.resourceCategory;
        if (!query) return categoryOk;
        const haystack = `${resource.title} ${resource.description} ${resource.category}`.toLowerCase();
        return categoryOk && haystack.includes(query);
    }

    function renderResourcesFilters() {
        const categorySelect = $('resource-category');
        if (!categorySelect) return;
        const categories = ['All', ...new Set((data.resources || []).map((resource) => resource.category))];
        categorySelect.innerHTML = categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
        categorySelect.value = state.resourceCategory;
    }

    function renderResources() {
        const list = $('resources-list');
        const empty = $('resources-empty');
        if (!list || !empty) return;
        const filtered = (data.resources || []).filter(resourceMatches);
        list.innerHTML = filtered.map((resource) => `
            <article class="card" data-reveal="up">
                <div class="card-meta"><span class="pill">${escapeHtml(resource.category)}</span></div>
                <h3>${escapeHtml(resource.title)}</h3>
                <p>${escapeHtml(resource.description)}</p>
                <div class="actions">${actionButton('Open', resource.url, { primary: true })}</div>
            </article>
        `).join('');
        empty.hidden = filtered.length !== 0;
        initRevealObserver();
    }

    function renderContactAndFooter() {
        const socialContainer = $('social-links');
        const footerSocial = $('footer-social');
        const socialLinks = (data.social || []).map((item) => {
            if (!item.url) return `<span class="pill">${escapeHtml(item.label)} (Unavailable)</span>`;
            return `<a href="${escapeHtml(item.url)}" target="${item.url.startsWith('http') ? '_blank' : '_self'}" rel="${item.url.startsWith('http') ? 'noopener noreferrer' : ''}">${escapeHtml(item.label)}</a>`;
        }).join('');

        if (socialContainer) socialContainer.innerHTML = socialLinks;
        if (footerSocial) footerSocial.innerHTML = socialLinks;

        const note = $('contact-endpoint-note');
        if (note) {
            if (data.site?.contactEndpoint) {
                note.textContent = 'Contact endpoint is configured for submissions.';
            } else {
                note.textContent = 'Contact submission endpoint is not configured yet. Form validation works locally, but messages are not sent.';
            }
        }
    }

    function renderLegal() {
        const privacy = $('privacy-content');
        const terms = $('terms-content');
        if (privacy) {
            privacy.innerHTML = `<ul>${(data.legal?.privacy || []).map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`;
        }
        if (terms) {
            terms.innerHTML = `<ul>${(data.legal?.terms || []).map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`;
        }
    }

    function modalOpen({ title, description, tags = [], actions = [] }, opener) {
        const modal = $('detail-modal');
        if (!modal) return;
        $('detail-modal-title').textContent = title;
        $('detail-modal-description').textContent = description;
        $('detail-modal-tags').innerHTML = tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join('');
        $('detail-modal-actions').innerHTML = actions.join('');
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        state.modalOpener = opener || null;
        $('modal-close-btn')?.focus();
    }

    function modalClose() {
        const modal = $('detail-modal');
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (state.modalOpener) {
            state.modalOpener.focus();
            state.modalOpener = null;
        }
    }

    function renderAdmin() {
        const lock = $('admin-locked');
        const dashboard = $('admin-dashboard');
        if (!lock || !dashboard) return;

        lock.hidden = state.adminLoggedIn;
        dashboard.hidden = !state.adminLoggedIn;

        if (!state.adminLoggedIn) return;

        const posts = data.posts || [];
        const publishedPosts = posts.length;
        const drafts = 0;
        const adminStats = [
            { label: 'Projects', value: data.projects?.length || 0 },
            { label: 'Apps', value: data.apps?.length || 0 },
            { label: 'Posts', value: posts.length },
            { label: 'Published', value: publishedPosts },
            { label: 'Drafts', value: drafts }
        ];
        $('admin-stats').innerHTML = adminStats.map((s) => `<article class="card"><h3>${s.value}</h3><p>${escapeHtml(s.label)}</p></article>`).join('');

        const tabsEl = $('admin-tabs');
        tabsEl.innerHTML = (data.admin?.tabs || []).map((tab) => {
            const active = tab === state.activeAdminTab;
            return `<button type="button" class="admin-tab ${active ? 'active' : ''}" data-admin-tab="${escapeHtml(tab)}">${escapeHtml(tab)}</button>`;
        }).join('');

        tabsEl.querySelectorAll('[data-admin-tab]').forEach((btn) => {
            btn.addEventListener('click', () => {
                state.activeAdminTab = btn.dataset.adminTab || 'projects';
                renderAdmin();
            });
        });

        const firebaseState = window.FirebaseAdapter?.getState ? window.FirebaseAdapter.getState() : { configured: false, mode: 'unknown' };
        const map = {
            projects: data.projects || [],
            apps: data.apps || [],
            posts: data.posts || [],
            media: [],
            categories: [...new Set([...(data.projects || []).map((p) => p.category), ...(data.posts || []).map((p) => p.category)])],
            tags: [...new Set((data.posts || []).flatMap((p) => p.tags || []))],
            settings: [data.site || {}]
        };

        const records = map[state.activeAdminTab] || [];
        const loadingState = '<p class="muted">Loading state: data source adapter initializing...</p>';
        const emptyState = '<p class="muted">Empty state: no records yet.</p>';
        const errorState = !firebaseState.configured
            ? '<p class="muted">Error state: Firebase is not configured. CRUD is unavailable until setup is completed.</p>'
            : '';

        const listItems = records.length
            ? `<ul class="admin-list">${records.slice(0, 10).map((record) => `<li>${escapeHtml(record.title || record.name || record.slug || record.category || record.tag || JSON.stringify(record))}</li>`).join('')}</ul>`
            : emptyState;

        $('admin-panel').innerHTML = `
            <div class="admin-block">
                <h3>${escapeHtml(state.activeAdminTab)} management</h3>
                ${loadingState}
                ${errorState}
                ${listItems}
            </div>
            <div class="admin-block">
                <h3>Recent activity</h3>
                <ul class="admin-list">${(data.admin?.recentActivity || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
            </div>
            <div class="admin-block">
                <h3>Adapter mode</h3>
                <p class="muted">${escapeHtml(firebaseState.mode || 'static-demo')}</p>
            </div>
        `;
    }

    function renderFooterYear() {
        const year = $('year');
        if (year) year.textContent = String(new Date().getFullYear());
    }

    function renderRoute(path) {
        const match = routeMatch(path);

        document.querySelectorAll('.route-section').forEach((section) => {
            section.hidden = section.id !== match.sectionId;
        });

        if (match.key === 'projectDetail') renderProjectDetail(match.params[0]);
        if (match.key === 'appDetail') renderAppDetail(match.params[0]);
        if (match.key === 'blogDetail') renderBlogDetail(match.params[0]);

        if (match.key === 'admin') renderAdmin();

        const sectionDescription = {
            home: data.site?.description,
            projects: 'Portfolio projects with practical build notes and availability-aware actions.',
            apps: 'Application listings with versions, platform details, and download availability.',
            blog: 'Developer writing with categories, search, and detail pages.',
            admin: 'Admin dashboard shell with protected-state UX and Firebase integration guidance.'
        };

        updateMetaForRoute(path, match.title, sectionDescription[match.key] || data.site?.description);
        setActiveNav(path);
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }

    function initRouter() {
        function onRouteChange() {
            renderRoute(slugPath());
        }
        window.addEventListener('hashchange', onRouteChange);
        if (!location.hash || location.hash === '#') {
            location.hash = '#/';
        } else {
            onRouteChange();
        }
    }

    function initNavbar() {
        const menuToggle = $('menu-toggle');
        const nav = $('primary-nav');
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                const isOpen = nav.classList.toggle('open');
                menuToggle.setAttribute('aria-expanded', String(isOpen));
            });

            nav.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => {
                    nav.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }

        window.addEventListener('scroll', () => {
            const navBar = $('top-nav');
            if (!navBar) return;
            navBar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    function initTheme() {
        const button = $('theme-toggle');
        const icon = $('theme-icon');

        function apply(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            if (icon) icon.textContent = theme === 'dark' ? '☀' : '☾';
            const themeMeta = document.querySelector('meta[name="theme-color"]');
            if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0E0E11' : '#F7F3EE');
        }

        const current = document.documentElement.getAttribute('data-theme') || 'light';
        apply(current);

        button?.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            apply(next);
        });
    }

    function initLoader() {
        const loader = document.querySelector('.loader');
        if (!loader) return;
        window.addEventListener('load', () => {
            setTimeout(() => loader.classList.add('hidden'), 700);
        });
    }

    function initHeroSlideshow() {
        const slides = [...document.querySelectorAll('.hero-slideshow .slide')];
        if (slides.length < 2 || prefersReducedMotion) return;
        let index = 0;
        setInterval(() => {
            slides[index].classList.remove('active');
            index = (index + 1) % slides.length;
            slides[index].classList.add('active');
        }, 5500);
    }

    function initTyping() {
        const el = $('typing-text');
        if (!el || prefersReducedMotion) return;
        const text = el.textContent || '';
        let cursor = 0;
        el.textContent = '';

        function step() {
            if (cursor >= text.length) return;
            el.textContent += text[cursor];
            cursor += 1;
            setTimeout(step, 20 + Math.random() * 28);
        }

        setTimeout(step, 900);
    }

    function initCursor() {
        if (isTouch || prefersReducedMotion) return;
        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');
        const aura = document.querySelector('.aura-cursor');
        if (!dot || !ring || !aura) return;

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        });

        function animate() {
            ringX += (mouseX - ringX) * 0.16;
            ringY += (mouseY - ringY) * 0.16;
            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;
            aura.style.left = `${mouseX}px`;
            aura.style.top = `${mouseY}px`;
            requestAnimationFrame(animate);
        }
        animate();

        const hoverables = document.querySelectorAll('a, button, input, textarea, select, summary, .card');
        hoverables.forEach((element) => {
            element.addEventListener('mouseenter', () => ring.classList.add('hovering'));
            element.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
        });
    }

    function initRevealObserver() {
        const nodes = [...document.querySelectorAll('[data-reveal]:not([data-reveal-bound])')];
        if (!nodes.length) return;
        if (prefersReducedMotion) {
            nodes.forEach((node) => node.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        nodes.forEach((node) => {
            node.setAttribute('data-reveal-bound', 'true');
            observer.observe(node);
        });
    }

    function animateCounters(counters) {
        counters.forEach((counter) => {
            const target = Number(counter.getAttribute('data-count')) || 0;
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 24));
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = String(target);
                    clearInterval(interval);
                } else {
                    counter.textContent = String(current);
                }
            }, 28);
        });
    }

    function initFlowCanvas() {
        const canvas = $('flow-canvas');
        if (!canvas || prefersReducedMotion) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let visible = true;
        let frameId;
        const particles = [];

        function resize() {
            const parent = canvas.parentElement;
            if (!parent) return;
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: 0,
                vy: 0,
                life: 120 + Math.random() * 90
            };
        }

        function setupParticles() {
            particles.length = 0;
            const count = Math.max(18, Math.floor((canvas.width * canvas.height) / 26000));
            for (let i = 0; i < count; i += 1) particles.push(createParticle());
        }

        function tick() {
            if (!visible || document.hidden) {
                frameId = requestAnimationFrame(tick);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((particle) => {
                const angle = Math.sin(particle.x * 0.008) + Math.cos(particle.y * 0.008);
                particle.vx += Math.cos(angle) * 0.06;
                particle.vy += Math.sin(angle) * 0.06;
                particle.vx *= 0.97;
                particle.vy *= 0.97;
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life -= 1;

                if (particle.life <= 0 || particle.x < 0 || particle.y < 0 || particle.x > canvas.width || particle.y > canvas.height) {
                    Object.assign(particle, createParticle());
                }

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 1.6, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(199,91,57,.35)';
                ctx.fill();
            });

            frameId = requestAnimationFrame(tick);
        }

        resize();
        setupParticles();
        tick();
        window.addEventListener('resize', () => {
            resize();
            setupParticles();
        });

        const observer = new IntersectionObserver((entries) => {
            visible = entries[0]?.isIntersecting ?? true;
        });
        observer.observe(canvas);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden && frameId) cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(tick);
        });
    }

    function initMatrixCanvas() {
        const canvas = $('matrix-canvas');
        if (!canvas || prefersReducedMotion) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        const chars = '01アイウエオカキクケコサシスセソタチツテト';
        const fontSize = 14;
        let visible = false;
        let columns = 0;
        let drops = [];

        function setup() {
            const parent = canvas.parentElement;
            if (!parent) return;
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
            columns = Math.floor(canvas.width / fontSize);
            drops = Array.from({ length: columns }, () => Math.random() * -20);
        }

        function draw() {
            if (!visible || document.hidden) {
                requestAnimationFrame(draw);
                return;
            }

            context.fillStyle = 'rgba(0,0,0,.06)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'rgba(199,91,57,.7)';
            context.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i += 1) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                context.fillText(char, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) drops[i] = 0;
                drops[i] += 1;
            }

            requestAnimationFrame(draw);
        }

        setup();
        draw();
        window.addEventListener('resize', setup);

        const observer = new IntersectionObserver((entries) => {
            visible = entries[0]?.isIntersecting ?? false;
        });
        observer.observe(canvas);
    }

    function initTerminal() {
        const textNode = $('terminal-text');
        const outputNode = $('terminal-output');
        if (!textNode || !outputNode || prefersReducedMotion) return;

        const commands = [
            { cmd: 'whoami', out: 'mahfujur — computer technology student & developer' },
            { cmd: 'cat focus.txt', out: 'web development | android | firebase | python' },
            { cmd: 'ls ~/approach', out: 'learn  build  experiment  improve' },
            { cmd: 'status --admin', out: 'frontend shell ready, awaiting firebase setup' }
        ];

        let index = 0;

        function run() {
            const command = commands[index];
            let cursor = 0;
            textNode.textContent = '';
            outputNode.textContent = '';

            const type = () => {
                if (cursor < command.cmd.length) {
                    textNode.textContent += command.cmd[cursor];
                    cursor += 1;
                    setTimeout(type, 42);
                } else {
                    outputNode.textContent = command.out;
                    index = (index + 1) % commands.length;
                    setTimeout(run, 2400);
                }
            };

            type();
        }

        const observer = new IntersectionObserver((entries, obs) => {
            if (entries[0].isIntersecting) {
                run();
                obs.disconnect();
            }
        }, { threshold: 0.2 });

        observer.observe(textNode.closest('.terminal-window'));
    }

    function initContactForm() {
        const form = $('contact-form');
        const status = $('contact-form-status');
        if (!form || !status) return;

        const validators = {
            name: (value) => value.trim().length >= 2 || 'Name must be at least 2 characters.',
            email: (value) => /^\S+@\S+\.\S+$/.test(value) || 'Enter a valid email address.',
            subject: (value) => value.trim().length >= 3 || 'Subject must be at least 3 characters.',
            message: (value) => value.trim().length >= 20 || 'Message must be at least 20 characters.'
        };

        function setError(name, message) {
            const errorEl = form.querySelector(`[data-error-for="${name}"]`);
            if (errorEl) errorEl.textContent = message || '';
        }

        function validate() {
            let ok = true;
            for (const [field, test] of Object.entries(validators)) {
                const input = form.elements[field];
                const result = test(input.value);
                if (result !== true) {
                    ok = false;
                    setError(field, result);
                } else {
                    setError(field, '');
                }
            }
            return ok;
        }

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            status.textContent = '';
            if (!validate()) {
                status.textContent = 'Please fix the highlighted fields.';
                return;
            }

            status.textContent = 'Validating submission...';
            const endpoint = data.site?.contactEndpoint;

            if (!endpoint) {
                status.textContent = 'Submission unavailable: configure a contact endpoint first (see README).';
                return;
            }

            try {
                status.textContent = 'Sending...';
                const payload = Object.fromEntries(new FormData(form).entries());
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error('Network error');
                }

                form.reset();
                status.textContent = 'Message sent successfully.';
            } catch {
                status.textContent = 'Message failed to send. Verify endpoint configuration and CORS policy.';
            }
        });
    }

    function initBlogControls() {
        const search = $('blog-search');
        const category = $('blog-category');
        const loadMore = $('blog-load-more');

        search?.addEventListener('input', () => {
            state.blogQuery = search.value;
            state.blogVisibleCount = 3;
            renderBlogList();
        });

        category?.addEventListener('change', () => {
            state.blogCategory = category.value;
            state.blogVisibleCount = 3;
            renderBlogList();
        });

        loadMore?.addEventListener('click', () => {
            state.blogVisibleCount += 3;
            renderBlogList();
        });
    }

    function initResourceControls() {
        const search = $('resource-search');
        const category = $('resource-category');

        search?.addEventListener('input', () => {
            state.resourceQuery = search.value;
            renderResources();
        });

        category?.addEventListener('change', () => {
            state.resourceCategory = category.value;
            renderResources();
        });
    }

    function initAdminControls() {
        const loginForm = $('admin-login-form');
        const loginStatus = $('admin-login-status');
        const logoutBtn = $('admin-logout');

        loginForm?.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = $('admin-email')?.value?.trim() || '';
            const password = $('admin-password')?.value || '';

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                loginStatus.textContent = 'Enter a valid email.';
                return;
            }
            if (password.length < 8) {
                loginStatus.textContent = 'Password must be at least 8 characters.';
                return;
            }

            loginStatus.textContent = 'Authenticating...';
            setTimeout(() => {
                state.adminLoggedIn = true;
                localStorage.setItem('admin-demo-auth', 'true');
                loginStatus.textContent = 'Logged in to protected demo mode.';
                renderAdmin();
            }, 450);
        });

        logoutBtn?.addEventListener('click', () => {
            state.adminLoggedIn = false;
            localStorage.removeItem('admin-demo-auth');
            renderAdmin();
        });
    }

    function initModal() {
        const closeBtn = $('modal-close-btn');
        const modal = $('detail-modal');

        closeBtn?.addEventListener('click', modalClose);
        modal?.addEventListener('click', (event) => {
            if (event.target === modal) modalClose();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') modalClose();
        });

        document.addEventListener('click', (event) => {
            const btn = event.target.closest('[data-modal-project], [data-modal-app]');
            if (!btn) return;
            const id = btn.getAttribute('data-modal-project');
            const appId = btn.getAttribute('data-modal-app');
            if (id) {
                const project = (data.projects || []).find((p) => p.slug === id);
                if (!project) return;
                modalOpen({
                    title: project.title,
                    description: project.description,
                    tags: project.technologies,
                    actions: [actionButton('Open details', `#/projects/${project.slug}`, { primary: true })]
                }, btn);
            } else if (appId) {
                const app = (data.apps || []).find((a) => a.slug === appId);
                if (!app) return;
                modalOpen({
                    title: app.name,
                    description: app.description,
                    tags: app.features,
                    actions: [actionButton('Open details', `#/apps/${app.slug}`, { primary: true })]
                }, btn);
            }
        });
    }

    function initClock() {
        const timeEl = $('real-time');
        const dateEl = $('real-date');
        if (!timeEl || !dateEl) return;

        const update = () => {
            const now = new Date();
            timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            dateEl.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        };

        update();
        setInterval(update, 1000);
    }

    function initAnimationsForPath() {
        initRevealObserver();
    }

    function initGlobalSearchHandlers() {
        document.addEventListener('click', (event) => {
            const anchor = event.target.closest('a[href^="#"]');
            if (!anchor) return;
            const href = anchor.getAttribute('href') || '';
            if (!href.startsWith('#/')) return;
            const nav = $('primary-nav');
            const menuToggle = $('menu-toggle');
            nav?.classList.remove('open');
            menuToggle?.setAttribute('aria-expanded', 'false');
        });
    }

    function bindDynamicButtons() {
        document.addEventListener('click', (event) => {
            const detailBtn = event.target.closest('[data-open-project-modal]');
            if (detailBtn) {
                const slug = detailBtn.getAttribute('data-open-project-modal');
                const project = (data.projects || []).find((p) => p.slug === slug);
                if (!project) return;
                modalOpen({
                    title: project.title,
                    description: project.description,
                    tags: project.technologies,
                    actions: [
                        actionButton('Open detail route', `#/projects/${project.slug}`, { primary: true }),
                        actionButton('GitHub', project.githubUrl)
                    ]
                }, detailBtn);
            }
        });
    }

    function decorateCardsWithDetails() {
        const containers = ['projects-list', 'featured-projects'];
        containers.forEach((id) => {
            const list = $(id);
            if (!list) return;
            list.querySelectorAll('.card').forEach((card) => {
                const detailsLink = card.querySelector('a[href^="#/projects/"]');
                if (!detailsLink) return;
                if (card.querySelector('[data-open-project-modal]')) return;
                const slug = detailsLink.getAttribute('href')?.replace('#/projects/', '') || '';
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'btn ghost';
                button.textContent = 'Quick View';
                button.setAttribute('data-open-project-modal', slug);
                detailsLink.parentElement?.appendChild(button);
            });
        });

        const appContainers = ['apps-list', 'featured-apps'];
        appContainers.forEach((id) => {
            const list = $(id);
            if (!list) return;
            list.querySelectorAll('.card').forEach((card) => {
                const detailsLink = card.querySelector('a[href^="#/apps/"]');
                if (!detailsLink) return;
                if (card.querySelector('[data-modal-app]')) return;
                const slug = detailsLink.getAttribute('href')?.replace('#/apps/', '') || '';
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'btn ghost';
                button.textContent = 'Quick View';
                button.setAttribute('data-modal-app', slug);
                detailsLink.parentElement?.appendChild(button);
            });
        });
    }

    function bootstrapStaticContent() {
        renderHeroTech();
        renderStats();
        renderFeatured();
        renderAbout();
        renderProjectFilters();
        renderProjects();
        renderApps();
        renderBlogFilters();
        renderBlogList();
        renderLab();
        renderLearning();
        renderResourcesFilters();
        renderResources();
        renderContactAndFooter();
        renderLegal();
        renderFooterYear();
        renderAdmin();
        initAnimationsForPath();
    }

    function initInteractions() {
        initLoader();
        initNavbar();
        initTheme();
        initHeroSlideshow();
        initTyping();
        initCursor();
        initFlowCanvas();
        initMatrixCanvas();
        initTerminal();
        initContactForm();
        initBlogControls();
        initResourceControls();
        initAdminControls();
        initModal();
        initClock();
        initGlobalSearchHandlers();
        bindDynamicButtons();
        initRouter();
    }

    document.addEventListener('DOMContentLoaded', () => {
        bootstrapStaticContent();
        initInteractions();
    });
})();
