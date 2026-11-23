
//TODO:NAVBAR
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.addEventListener('click', (e) => {
    if (e.target.matches('.nav-link')) mobileMenu.classList.remove('open');
});

//TODO: Highlight the nav link of the section currently in view
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
    let current = '';
    sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

window.addEventListener('scroll', setActiveLink);
setActiveLink();

//TODO: Switch tabs (About Me / Education, Skills / Certificates)
document.querySelectorAll('.tab-group').forEach((group) => {
    const buttons = group.querySelectorAll('.tab-btn');
    const panels = group.querySelectorAll('.tab-panel');

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            buttons.forEach((b) => b.classList.toggle('active', b === btn));
            panels.forEach((p) => p.classList.toggle('hidden', p.id !== btn.dataset.tab));
        });
    });
});

//TODO: Skills marquee: duplicate logos so the loop never has a gap
document.querySelectorAll('.marquee-track').forEach((track) => {
    const items = Array.from(track.children);
    // repeat the set enough times to be wider than the screen, then double once for the loop
    const copies = Math.max(1, Math.ceil(window.innerWidth / (items.length * 130)));
    const set = [];
    for (let i = 0; i < copies; i++) items.forEach((el) => set.push(el));
    track.innerHTML = '';
    set.forEach((el, i) => track.appendChild(i < items.length ? el : el.cloneNode(true)));
    Array.from(track.children).forEach((el) => track.appendChild(el.cloneNode(true)));
    Array.from(track.children).slice(set.length).forEach((el) => el.setAttribute('aria-hidden', 'true'));
});

//TODO: Scroll reveal (staggered)
//TODO: big blocks and titles also slide in when you reach them
document.querySelectorAll('.tab-group, #project h2, #contact h2').forEach((el) => el.classList.add('fade-in'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // cards in the same row come in one after another
        const index = Array.from(el.parentElement.children).filter((n) => n.classList.contains('fade-in')).indexOf(el);
        const delay = Math.max(index, 0) * 120;
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('visible');
        setTimeout(() => { el.style.transitionDelay = ''; }, delay + 800);
        revealObserver.unobserve(el);
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach((el) => revealObserver.observe(el));

//TODO: Contact form
const form = document.getElementById('contactForm');
const toast = document.getElementById('toastMsg');
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const message = form.querySelector('textarea').value.trim();

    if (!name || !email || !message) {
        return showToast('Please fill in all fields.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return showToast('Please enter a valid email address.');
    }

    //TODO: open Gmail with the message already written, sent to my email
    const url = 'https://mail.google.com/mail/?view=cm&fo=1&to=ricojhongardose@gmail.com'
        + '&su=' + encodeURIComponent('Portfolio message from ' + name)
        + '&body=' + encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
    window.open(url, '_blank', 'noopener');
    showToast('Opening Gmail to send your message...');
    form.reset();
});

//TODO: Stars (Home only): falling stars + twinkling stars 
const starsBox = document.getElementById('stars');
const STAR_COUNT = 28;      
const TWINKLE_COUNT = 70;  
const STAR_COLORS = ['#e9d5ff', '#c4b5fd', '#93c5fd', '#67e8f9', '#ffffff'];

for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.setProperty('--c', STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]);
    star.style.left = Math.random() * 110 + '%';
    star.style.height = 40 + Math.random() * 80 + 'px';
    star.style.animationDuration = 2.2 + Math.random() * 3.5 + 's';
    star.style.animationDelay = Math.random() * 7 + 's';
    starsBox.appendChild(star);
}

for (let i = 0; i < TWINKLE_COUNT; i++) {
    const dot = document.createElement('div');
    dot.className = 'twinkle';
    dot.style.left = Math.random() * 100 + '%';
    dot.style.top = Math.random() * 100 + '%';
    dot.style.setProperty('--s', 1 + Math.random() * 2.5 + 'px');
    dot.style.animationDuration = 2 + Math.random() * 4 + 's';
    dot.style.animationDelay = Math.random() * 5 + 's';
    starsBox.appendChild(dot);
}

//TODO: Light / dark mode
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const themeIcon = themeBtn.querySelector('i');

function applyTheme(light) {
    root.classList.toggle('light', light);
    themeIcon.className = light ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

applyTheme(root.classList.contains('light'));

themeBtn.addEventListener('click', () => {
    const light = !root.classList.contains('light');
    applyTheme(light);
    try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {}
});


//TODO: Star cursor (simple): a glowing star follows the mouse and leaves sparkles
(function () {
    const canUse = window.matchMedia('(pointer: fine)').matches &&
                   !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canUse) return;

    root.classList.add('star-cursor');

    const cursor = document.createElement('div');
    cursor.className = 'cursor-star';
    cursor.innerHTML = '<i class="fa-solid fa-star"></i>';
    document.body.appendChild(cursor);

    let x = -100, y = -100, cx = -100, cy = -100, lastSpark = 0, angle = 0;
    const starIcon = cursor.firstElementChild;

    document.addEventListener('mousemove', (e) => {
        x = e.clientX;
        y = e.clientY;
        cursor.style.opacity = 1;

        const now = performance.now();
        if (now - lastSpark > 45) {
            lastSpark = now;
            const s = document.createElement('i');
            s.className = 'spark fa-solid fa-star';
            s.style.left = x + 'px';
            s.style.top = y + 'px';
            s.style.setProperty('--dx', (Math.random() * 30 - 15) + 'px');
            s.style.setProperty('--dy', (Math.random() * 30 + 6) + 'px');
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 700);
        }

        cursor.classList.toggle('hot', !!e.target.closest('a, button, .tab-btn, .skill-tile, .project-card, .contact-card, .cert-card, .cert-full'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('down'));
    document.addEventListener('mouseup', () => cursor.classList.remove('down'));
    document.addEventListener('mouseleave', () => { cursor.style.opacity = 0; });

    (function follow() {
        const dx = (x - cx) * 0.35;
        const dy = (y - cy) * 0.35;
        cx += dx;
        cy += dy;
        angle += Math.hypot(dx, dy) * 4;  
        cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        starIcon.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        requestAnimationFrame(follow);
    })();
})();


//TODO: Scroll effects: navbar shadow, home parallax 
(function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const heroText = document.querySelector('#home .fade-in');
    const heroInner = document.createElement('div');
    heroInner.id = 'heroInner';
    while (heroText.firstChild) heroInner.appendChild(heroText.firstChild);
    heroText.appendChild(heroInner);

    const nav = document.querySelector('nav');
    const aurora = document.getElementById('aurora');
    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        nav.classList.toggle('scrolled', y > 20);

        if (!reduce && y < window.innerHeight * 1.2) {
            const p = Math.min(y / window.innerHeight, 1);
            heroInner.style.transform = `translateY(${p * 90}px) scale(${1 - p * 0.08})`;
            heroInner.style.opacity = 1 - p * 1.3;
            if (aurora) aurora.style.transform = `translateY(${p * 140}px)`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();
})();


//TODO: Certificates: preview (4) + "View All" popup + image viewer
(function () {
    const CERTS = [
        { title: 'Computer Science Fundamentals',                     issuer: 'Science of Apps', date: 'November 22, 2026',  img: 'cert-csf.png.png' },
        { title: 'NIST CSF 2.0 (With Distinction)',                   issuer: 'Science of Apps', date: 'November 22, 2026',  img: 'cert-nist.png.png' },
        { title: 'IT Support and Troubleshooting (With Distinction)', issuer: 'Science of Apps', date: 'November 22, 2026', img: 'cert-itsupport.png.png' },
        { title: 'Certified AI Product Designer (With Distinction)',  issuer: 'Science of Apps', date: 'November 22, 2026', img: 'cert-aiproduct.png.png' },
        { title: 'LFCS Exam Readiness (With Distinction)',            issuer: 'Science of Apps', date: 'November 22, 2026', img: 'cert-lfcs.png.png' }
    ];
    const PREVIEW_COUNT = 4;

    const preview = document.getElementById('certPreview');
    const all = document.getElementById('certAll');
    const modal = document.getElementById('certModal');
    const box = document.getElementById('lightbox');
    const boxImg = document.getElementById('lightboxImg');
    const boxCap = document.getElementById('lightboxCap');

    //TODO: build the cards
    preview.innerHTML = CERTS.slice(0, PREVIEW_COUNT).map((c, i) => `
        <button type="button" class="cert-card" data-i="${i}">
            <img src="${c.img}" alt="${c.title}" loading="lazy">
            <span class="cert-title">${c.title}</span>
        </button>`).join('');

    all.innerHTML = CERTS.map((c, i) => `
        <div class="cert-full">
            <button type="button" class="cert-thumb" data-i="${i}" aria-label="View ${c.title}">
                <img src="${c.img}" alt="${c.title}" loading="lazy">
            </button>
            <h4 class="cert-full-title">${c.title}</h4>
            <p class="cert-meta"><b>Issued by:</b> ${c.issuer}</p>
            <p class="cert-meta"><b>Date:</b> ${c.date}</p>
            <button type="button" class="btn-primary text-xs mt-3" data-i="${i}"><i class="fa-solid fa-eye mr-2"></i>View Certificate</button>
        </div>`).join('');

    function lockScroll() {
        document.body.style.overflow = (modal.classList.contains('hidden') && box.classList.contains('hidden')) ? '' : 'hidden';
    }
    function openModal()  { modal.classList.remove('hidden'); lockScroll(); }
    function closeModal() { modal.classList.add('hidden'); lockScroll(); }
    function openImage(i) {
        boxImg.src = CERTS[i].img;
        boxImg.alt = CERTS[i].title;
        boxCap.textContent = CERTS[i].title;
        box.classList.remove('hidden');
        box.setAttribute('aria-hidden', 'false');
        lockScroll();
    }
    function closeImage() {
        box.classList.add('hidden');
        box.setAttribute('aria-hidden', 'true');
        boxImg.src = '';
        lockScroll();
    }

    //TODO: click a picture / "View Certificate" -> big image
    [preview, all].forEach((area) => {
        area.addEventListener('click', (e) => {
            const item = e.target.closest('[data-i]');
            if (item) openImage(Number(item.dataset.i));
        });
    });

    document.getElementById('certViewAll').addEventListener('click', openModal);
    document.getElementById('certModalClose').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.getElementById('lightboxClose').addEventListener('click', closeImage);
    box.addEventListener('click', (e) => { if (e.target === box) closeImage(); });

    //TODO: Esc closes the top-most layer first
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (!box.classList.contains('hidden')) closeImage();
        else if (!modal.classList.contains('hidden')) closeModal();
    });
})();