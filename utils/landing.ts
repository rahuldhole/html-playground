export const LANDING_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Playground</title>
    <meta name="color-scheme" content="dark">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;500;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #000000;
            --surface: #070708;
            --primary: #c084fc;
            --secondary: #22d3ee;
            --accent: #f472b6;
            --text: #ffffff;
            --text-dim: #71717a;
            --border: rgba(255, 255, 255, 0.08);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            width: 100%;
            height: 100%;
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg);
            color: var(--text);
            overflow: hidden;
        }

        .ambient-orb {
            position: absolute;
            border-radius: 50%;
            opacity: 0.3;
            animation: float-orb 20s infinite alternate ease-in-out;
            z-index: 1;
            pointer-events: none;
            will-change: transform;
        }

        .orb-1 { width: 50vw; height: 50vw; background: radial-gradient(circle, var(--primary) 0%, transparent 60%); top: -15%; left: -15%; }
        .orb-2 { width: 45vw; height: 45vw; background: radial-gradient(circle, var(--secondary) 0%, transparent 60%); bottom: -15%; right: -15%; animation-duration: 25s; }
        .orb-3 { width: 40vw; height: 40vw; background: radial-gradient(circle, var(--accent) 0%, transparent 60%); top: 30%; left: 30%; animation-duration: 22s; animation-delay: -5s; }

        #particles-bg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 5;
            pointer-events: none;
        }

        @keyframes float-orb {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(15vw, 10vh) scale(1.2); }
        }

        .main-card {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(7, 7, 8, 0.7) 0%, rgba(7, 7, 8, 0.4) 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            position: relative;
            overflow: hidden;
            z-index: 2;
        }

        .glow-line {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, transparent, var(--primary), var(--secondary), var(--accent), transparent);
            opacity: 0.8;
            animation: glow-flow 6s ease-in-out infinite;
            box-shadow: 0 0 30px var(--primary), 0 0 60px var(--secondary);
            z-index: 10;
        }

        @keyframes glow-flow {
            0% { 
                opacity: 0.5; 
                box-shadow: 0 0 20px var(--primary), 0 0 40px var(--secondary);
                transform: translateX(-100%);
            }
            50% { 
                opacity: 1; 
                box-shadow: 0 0 40px var(--primary), 0 0 80px var(--secondary);
                transform: translateX(100%);
            }
            100% { 
                opacity: 0.5; 
                box-shadow: 0 0 20px var(--primary), 0 0 40px var(--secondary);
                transform: translateX(-100%);
            }
        }

        .content {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            max-width: 1100px;
            width: 100%;
            height: 100%;
        }

        header {
            text-align: center;
            margin-bottom: 2rem;
            animation: header-orbit 8s ease-in-out infinite;
        }

        @keyframes header-orbit {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-8px) translateX(6px); }
            50% { transform: translateY(4px) translateX(-8px); }
            75% { transform: translateY(-5px) translateX(5px); }
        }

        h1 {
            font-size: clamp(2.5rem, 8vw, 4rem);
            font-weight: 800;
            letter-spacing: -0.04em;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #fff 0%, #c084fc 50%, #22d3ee 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: title-morphing 5s ease-in-out infinite;
            text-shadow: 0 0 40px rgba(192, 132, 252, 0.4);
            filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.2));
        }

        @keyframes title-morphing {
            0% { 
                transform: scaleY(1) scaleX(1);
                letter-spacing: -0.04em;
            }
            25% { 
                transform: scaleY(1.08) scaleX(0.98);
                letter-spacing: -0.02em;
            }
            50% { 
                transform: scaleY(0.95) scaleX(1.05);
                letter-spacing: -0.05em;
            }
            75% { 
                transform: scaleY(1.05) scaleX(0.99);
                letter-spacing: -0.03em;
            }
            100% { 
                transform: scaleY(1) scaleX(1);
                letter-spacing: -0.04em;
            }
        }

        .subtitle {
            color: var(--text-dim);
            font-size: clamp(0.85rem, 2vw, 1.1rem);
            max-width: 600px;
            animation: subtitle-breathe 4s ease-in-out infinite;
        }

        @keyframes subtitle-breathe {
            0%, 100% { opacity: 0.6; transform: scale(1); letter-spacing: 0.01em; }
            50% { opacity: 1; transform: scale(1.03); letter-spacing: 0.02em; }
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.2rem;
            width: 100%;
            flex: 1;
            align-content: center;
            margin: 1.5rem 0;
            perspective: 1200px;
        }

        .feature-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
            border: 2px solid var(--border);
            border-radius: 24px;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
            animation: card-elegant-chaos 6s ease-in-out infinite;
            transform-style: preserve-3d;
            will-change: transform;
        }

        .feature-card::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 24px;
            background: radial-gradient(circle, rgba(192, 132, 252, 0.3) 0%, transparent 70%);
            opacity: 0;
            animation: card-aura 3s ease-in-out infinite;
            pointer-events: none;
        }

        .feature-card:nth-child(1) { animation-delay: 0s; }
        .feature-card:nth-child(2) { animation-delay: -1s; }
        .feature-card:nth-child(3) { animation-delay: -2s; }
        .feature-card:nth-child(4) { animation-delay: -3s; }
        .feature-card:nth-child(5) { animation-delay: -4s; }
        .feature-card:nth-child(6) { animation-delay: -5s; }

        @keyframes card-elegant-chaos {
            0% { 
                transform: translateY(0) rotateX(0) rotateY(0) rotateZ(0) scale(1);
            }
            16% { 
                transform: translateY(-20px) rotateX(8deg) rotateY(-5deg) rotateZ(2deg) scale(1.04);
            }
            33% { 
                transform: translateY(12px) rotateX(-6deg) rotateY(8deg) rotateZ(-3deg) scale(0.98);
            }
            50% { 
                transform: translateY(-15px) rotateX(5deg) rotateY(-6deg) rotateZ(1deg) scale(1.03);
            }
            66% { 
                transform: translateY(8px) rotateX(-7deg) rotateY(7deg) rotateZ(-2deg) scale(0.99);
            }
            83% { 
                transform: translateY(-10px) rotateX(4deg) rotateY(-4deg) rotateZ(2deg) scale(1.02);
            }
            100% { 
                transform: translateY(0) rotateX(0) rotateY(0) rotateZ(0) scale(1);
            }
        }

        @keyframes card-aura {
            0%, 100% { opacity: 0; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.15); }
        }

        .feature-card:hover {
            animation-play-state: paused;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
            border-color: rgba(192, 132, 252, 0.8);
            box-shadow: 
                0 0 50px rgba(192, 132, 252, 0.4),
                inset 0 0 40px rgba(192, 132, 252, 0.1),
                0 0 100px rgba(34, 211, 238, 0.2);
        }

        .feature-card:hover::after {
            animation-play-state: paused;
        }

        .icon-box {
            width: 60px;
            height: 60px;
            background: rgba(192, 132, 252, 0.2);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            margin-bottom: 1rem;
            border: 2px solid rgba(192, 132, 252, 0.3);
            animation: icon-elegant-spin 5s ease-in-out infinite;
            position: relative;
            box-shadow: 0 0 15px rgba(192, 132, 252, 0.2);
            will-change: transform;
        }

        .feature-card:nth-child(1) .icon-box { animation-delay: 0s; }
        .feature-card:nth-child(2) .icon-box { animation-delay: -0.8s; }
        .feature-card:nth-child(3) .icon-box { animation-delay: -1.6s; }
        .feature-card:nth-child(4) .icon-box { animation-delay: -2.4s; }
        .feature-card:nth-child(5) .icon-box { animation-delay: -3.2s; }
        .feature-card:nth-child(6) .icon-box { animation-delay: -4s; }

        @keyframes icon-elegant-spin {
            0% { 
                transform: rotateZ(0) rotateX(0) rotateY(0) scale(1);
                filter: drop-shadow(0 0 10px rgba(192, 132, 252, 0.3));
            }
            25% { 
                transform: rotateZ(25deg) rotateX(12deg) rotateY(-8deg) scale(1.15);
                filter: drop-shadow(0 0 25px rgba(192, 132, 252, 0.6));
            }
            50% { 
                transform: rotateZ(180deg) rotateX(-10deg) rotateY(15deg) scale(0.95);
                filter: drop-shadow(0 0 15px rgba(34, 211, 238, 0.4));
            }
            75% { 
                transform: rotateZ(280deg) rotateX(8deg) rotateY(-12deg) scale(1.1);
                filter: drop-shadow(0 0 20px rgba(192, 132, 252, 0.5));
            }
            100% { 
                transform: rotateZ(360deg) rotateX(0) rotateY(0) scale(1);
                filter: drop-shadow(0 0 10px rgba(192, 132, 252, 0.3));
            }
        }

        .feature-card:hover .icon-box { animation-play-state: paused; }

        .icon-box::before {
            content: '';
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(192, 132, 252, 0.4) 0%, transparent 70%);
            animation: icon-aura-pulse 2.5s ease-in-out infinite;
            z-index: -1;
        }

        @keyframes icon-aura-pulse {
            0%, 100% { transform: scale(0.8); opacity: 0.2; }
            50% { transform: scale(1.6); opacity: 0; }
        }

        .feature-card h3 {
            font-size: clamp(0.9rem, 1.5vw, 1.1rem);
            font-weight: 700;
            margin-bottom: 0.4rem;
            color: #fff;
            position: relative;
            z-index: 2;
        }

        .feature-card p {
            font-size: clamp(0.75rem, 1vw, 0.85rem);
            color: var(--text-dim);
            line-height: 1.4;
            position: relative;
            z-index: 2;
        }

        .frictionless-bar {
            display: flex;
            justify-content: center;
            gap: 2rem;
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
            border-bottom: 2px solid var(--border);
            width: 100%;
            animation: bar-elegant-sway 6s ease-in-out infinite;
        }

        @keyframes bar-elegant-sway {
            0%, 100% { transform: translateY(0) rotateZ(0deg); }
            25% { transform: translateY(-6px) rotateZ(1deg); }
            50% { transform: translateY(4px) rotateZ(-1deg); }
            75% { transform: translateY(-3px) rotateZ(0.5deg); }
        }

        .friction-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--secondary);
            font-weight: 700;
            font-size: clamp(0.7rem, 1.2vw, 0.9rem);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            animation: item-elegant-bounce 3.5s ease-in-out infinite;
        }

        .friction-item:nth-child(1) { animation-delay: 0s; }
        .friction-item:nth-child(2) { animation-delay: 0.4s; }
        .friction-item:nth-child(3) { animation-delay: 0.8s; }

        @keyframes item-elegant-bounce {
            0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 0px var(--secondary)); }
            50% { transform: translateY(-12px) scale(1.08); filter: drop-shadow(0 0 15px var(--secondary)); }
        }

        .dot {
            width: 8px;
            height: 8px;
            background: var(--secondary);
            border-radius: 50%;
            animation: dot-elegant-pulse 2.5s ease-in-out infinite;
            will-change: transform, opacity;
        }

        @keyframes dot-elegant-pulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.5); opacity: 1; }
        }

        @media (max-width: 1024px) {
            .features-grid { grid-template-columns: repeat(2, 1fr); }
            .main-card { padding: 2rem; }
        }

        @media (max-width: 640px) {
            .features-grid { grid-template-columns: 1fr; }
            .frictionless-bar { flex-direction: column; gap: 1rem; align-items: center; }
            .main-card { padding: 1.5rem; }
        }
    </style>
</head>
<body>
    <canvas id="particles-bg"></canvas>
    <div class="ambient-orb orb-1"></div>
    <div class="ambient-orb orb-2"></div>
    <div class="ambient-orb orb-3"></div>
    
    <div class="main-card">
        <div class="glow-line"></div>
        <div class="content">
            <div class="frictionless-bar">
                <div class="friction-item"><div class="dot"></div> NO SIGN UP</div>
                <div class="friction-item"><div class="dot"></div> NO CREDIT CARD</div>
                <div class="friction-item"><div class="dot"></div> 100% FREE</div>
            </div>

            <div class="features-grid">
                <div class="feature-card">
                    <div class="icon-box">🤖</div>
                    <h3>AI Generator</h3>
                    <p>Describe your vision and watch the AI synthesize production-ready code instantly.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-box">🧩</div>
                    <h3>Templates</h3>
                    <p>Jumpstart with pre-configured boilerplates for React, Vue, Tailwind, and more.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-box">🔗</div>
                    <h3>Quick Share</h3>
                    <p>Generate editable links to collaborate or share code snippets with anyone.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-box">🚀</div>
                    <h3>Quick Publish</h3>
                    <p>Host your creations as live, read-only apps with a single click—forever free.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-box">🚫</div>
                    <h3>No Sign Up</h3>
                    <p>Start building immediately. We value your flow—no accounts, no interruptions.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-box">💳</div>
                    <h3>Zero Friction</h3>
                    <p>No credit cards, no hidden fees. Just pure, unadulterated web creativity.</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Highly optimized particle system that won't block the JS thread
        const canvas = document.getElementById('particles-bg');
        const ctx = canvas.getContext('2d', { alpha: true });
        
        let width, height;
        const particles = [];
        const shootingStars = [];
        const spaceships = [];
        const particleCount = 80; // Kept low for maximum performance
        const shootingStarCount = 4; // Subtle number of shooting stars
        const spaceshipCount = 2; // A couple of spaceships
        
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        
        window.addEventListener('resize', resize);
        resize();

        // Initialize particles with theme colors
        const colors = ['#c084fc', '#22d3ee', '#f472b6'];
        const neonColorsRGB = ['192, 132, 252', '34, 211, 238', '244, 114, 182']; // RGB format for gradients
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5, // Horizontal drift
                vy: Math.random() * 1.5 + 0.5,   // Falling speed (gravity)
                size: Math.random() * 2 + 1.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.7 + 0.3,
                angle: Math.random() * Math.PI * 2 // For swaying effect
            });
        }

        // Initialize shooting stars (left to right)
        for (let i = 0; i < shootingStarCount; i++) {
            shootingStars.push({
                x: Math.random() * width,
                y: Math.random() * height * 0.7,
                length: Math.random() * 150 + 80, // Bigger
                speed: Math.random() * 10 + 8,
                thickness: Math.random() * 2.5 + 1.5, // Thicker
                opacity: Math.random() * 0.5 + 0.5, // More visible
                colorRGB: neonColorsRGB[Math.floor(Math.random() * neonColorsRGB.length)] // Random multicolor
            });
        }

        // Initialize spaceships (right to left)
        for (let i = 0; i < spaceshipCount; i++) {
            spaceships.push({
                x: width + Math.random() * 500,
                y: Math.random() * height * 0.8 + height * 0.1,
                speed: Math.random() * 1.5 + 1,
                size: Math.random() * 8 + 8,
                colorRGB: neonColorsRGB[Math.floor(Math.random() * neonColorsRGB.length)],
                lasers: [],
                framesSinceLastShot: Math.floor(Math.random() * 60)
            });
        }

        function render() {
            ctx.clearRect(0, 0, width, height);
            
            // Render shooting stars
            for (let i = 0; i < shootingStarCount; i++) {
                let star = shootingStars[i];
                
                // Move right and slightly down
                star.x += star.speed;
                star.y += star.speed * 0.2;

                // Wrap around to the left side
                if (star.x > width + star.length) {
                    star.x = -star.length;
                    star.y = Math.random() * height * 0.8;
                    star.speed = Math.random() * 10 + 8;
                    star.length = Math.random() * 150 + 80;
                    star.thickness = Math.random() * 2.5 + 1.5;
                    star.colorRGB = neonColorsRGB[Math.floor(Math.random() * neonColorsRGB.length)];
                }

                // Draw shooting star tail (gradient)
                const tailX = star.x - star.length;
                const tailY = star.y - (star.length * 0.2);
                
                const grad = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
                grad.addColorStop(0, \`rgba(\${star.colorRGB}, \${star.opacity})\`);
                grad.addColorStop(1, \`rgba(\${star.colorRGB}, 0)\`);

                ctx.beginPath();
                ctx.strokeStyle = grad;
                ctx.lineWidth = star.thickness;
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();
            }

            // Render spaceships and lasers
            for (let i = 0; i < spaceshipCount; i++) {
                let ship = spaceships[i];
                
                // Move spaceship left
                ship.x -= ship.speed;

                // Reset if off-screen
                if (ship.x < -100) {
                    ship.x = width + Math.random() * 300;
                    ship.y = Math.random() * height * 0.8 + height * 0.1;
                    ship.lasers = [];
                    ship.colorRGB = neonColorsRGB[Math.floor(Math.random() * neonColorsRGB.length)];
                }

                // Shoot laser occasionally
                ship.framesSinceLastShot++;
                if (ship.framesSinceLastShot > 60 && Math.random() < 0.03) {
                    ship.lasers.push({ x: ship.x - ship.size, y: ship.y });
                    ship.framesSinceLastShot = 0;
                }

                // Draw and move lasers
                ctx.lineWidth = 2;
                ctx.strokeStyle = \`rgba(\${ship.colorRGB}, 0.9)\`;
                ctx.beginPath();
                for (let j = ship.lasers.length - 1; j >= 0; j--) {
                    let laser = ship.lasers[j];
                    laser.x -= ship.speed * 4; // Lasers travel much faster
                    ctx.moveTo(laser.x, laser.y);
                    ctx.lineTo(laser.x + 15, laser.y);
                    if (laser.x < -50) ship.lasers.splice(j, 1);
                }
                ctx.stroke();

                // Draw spaceship (Geometric left-facing stealth shape)
                ctx.fillStyle = \`rgba(\${ship.colorRGB}, 0.8)\`;
                ctx.beginPath();
                ctx.moveTo(ship.x - ship.size, ship.y); // tip
                ctx.lineTo(ship.x + ship.size, ship.y - ship.size * 0.7); // top back wing
                ctx.lineTo(ship.x + ship.size * 0.4, ship.y); // center back indent
                ctx.lineTo(ship.x + ship.size, ship.y + ship.size * 0.7); // bottom back wing
                ctx.closePath();
                ctx.fill();
            }

            // Render 10 elegant dancers
            const t = Date.now() * 0.0015;
            
            function drawElegantDancer(x, y, timeOffset, scale, color) {
                ctx.save();
                ctx.translate(x, y);
                ctx.scale(scale, scale);

                // Smooth, flowing time multiplier
                const phase = (t * 2 + timeOffset);

                // Gentle bounce
                const bounce = Math.abs(Math.sin(phase * 2)) * 5;
                ctx.translate(0, -bounce);

                // Graceful sway
                const sway = Math.sin(phase) * 0.15;
                ctx.rotate(sway);

                // Flowing arms
                const arm1X = Math.cos(phase) * 20;
                const arm1Y = Math.sin(phase * 1.5) * 15 - 10;
                const arm2X = -Math.cos(phase * 1.2) * 20;
                const arm2Y = Math.sin(phase * 1.3) * 15 - 10;

                // Elegant steps
                const leg1X = Math.sin(phase * 2) * 15;
                const leg1Y = Math.abs(Math.cos(phase * 2)) * 5 + 20;
                const leg2X = -Math.sin(phase * 2) * 15;
                const leg2Y = Math.abs(Math.sin(phase * 2)) * 5 + 20;

                ctx.strokeStyle = color;
                ctx.lineWidth = 3; // Increased thickness for visibility
                ctx.shadowBlur = 15; // Added shiny glow
                ctx.shadowColor = color;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();

                // Head
                ctx.arc(0, -30, 7, 0, Math.PI * 2);

                // Body
                ctx.moveTo(0, -23); ctx.lineTo(0, 0);
                
                // Arms
                ctx.moveTo(0, -15); ctx.lineTo(arm1X, arm1Y);
                ctx.moveTo(0, -15); ctx.lineTo(arm2X, arm2Y);
                
                // Legs
                ctx.moveTo(0, 0); ctx.lineTo(leg1X, leg1Y);
                ctx.moveTo(0, 0); ctx.lineTo(leg2X, leg2Y);

                ctx.stroke();
                ctx.restore();
            }

            // Distribute 10 dancers across the bottom
            const spacing = width / 11;
            for (let k = 0; k < 10; k++) {
                const xPos = spacing * (k + 1) + (Math.sin(t + k) * 10); // Gentle lateral sway
                const yPos = height - 15;
                const timeOff = k * 0.8; // Smoother phase difference
                const scale = 0.7 + (k % 3) * 0.15; // Varied sizes
                const color = \`rgba(\${neonColorsRGB[k % neonColorsRGB.length]}, 1)\`; // Full opacity for shine
                
                drawElegantDancer(xPos, yPos, timeOff, scale, color);
            }

            // Render snowfall
            // Important: Reset shadow before drawing other particles to prevent performance hit
            ctx.shadowBlur = 0;
            
            for (let i = 0; i < particleCount; i++) {
                let p = particles[i];
                
                // Swaying motion
                p.angle += 0.02;
                p.x += Math.sin(p.angle) * 0.5 + p.vx;
                p.y += p.vy;

                // Snowfall wrap-around
                if (p.x < -p.size) p.x = width;
                if (p.x > width + p.size) p.x = 0;
                if (p.y > height) {
                    p.y = -p.size; // Reset to top
                    p.x = Math.random() * width; // Randomize horizontal position
                }

                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                // fillRect is significantly faster than drawing arcs/circles
                ctx.fillRect(p.x, p.y, p.size, p.size);
            }
            
            requestAnimationFrame(render);
        }
        
        render();
    </script>
</body>
</html>`;
