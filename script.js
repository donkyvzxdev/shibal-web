document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav-overlay');
    const closeMobileBtn = document.getElementById('close-mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileBtn && mobileNav) {
        mobileBtn.addEventListener('click', () => {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        const closeMenu = () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeMobileBtn) {
            closeMobileBtn.addEventListener('click', closeMenu);
        }

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mouse Parallax for Hero Visual
    const heroVisual = document.querySelector('.shibalys-ui');
    const heroSection = document.querySelector('.hero');

    if (heroVisual && heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;

            heroVisual.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroVisual.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
        });
    }

    // Shibalys UI Interactivity
    const shibalSwitches = document.querySelectorAll('.shibal-switch');
    shibalSwitches.forEach(sw => {
        sw.addEventListener('click', () => {
            sw.classList.toggle('active');
        });
    });

    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // In a real app, we'd swap the content body here
            const tabName = item.getAttribute('data-tab');
            console.log(`Switched to tab: ${tabName}`);
        });
    });

    const sliders = document.querySelectorAll('.shibal-range');
    sliders.forEach(slider => {
        slider.addEventListener('input', () => {
            const valueSpan = slider.parentElement.querySelector('.slider-value');
            if (valueSpan) {
                // Formatting for different slider types
                if (valueSpan.textContent.includes('x')) {
                    valueSpan.textContent = (slider.value / 10).toFixed(1) + 'x';
                } else if (valueSpan.textContent.includes('.')) {
                    valueSpan.textContent = slider.value + '.00';
                } else {
                    valueSpan.textContent = slider.value;
                }
            }
        });
    });

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    const animationDuration = 2000; // 2 seconds

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let startTime = null;

            const updateCount = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;

                // smooth easeOut easing
                const easeOut = 1 - Math.pow(1 - progress / animationDuration, 4);
                let current = target * easeOut;

                if (progress < animationDuration) {
                    // Format with dots for thousands as requested 
                    counter.innerText = Math.ceil(current).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                }
            };
            requestAnimationFrame(updateCount);
        });
    }

    // macOS Dock Hover Effect (Vertical)
    const macDock = document.getElementById('mac-dock');
    if (macDock) {
        const dockItems = macDock.querySelectorAll('.dock-item');
        const defaultScale = 1;
        const maxScale = 1.4; // Reduced to prevent aggressive overlap
        const radius = 100; // Activation distance (px)

        macDock.addEventListener('mousemove', (e) => {
            dockItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                const itemCenterY = itemRect.top + itemRect.height / 2;
                const distance = Math.abs(e.clientY - itemCenterY);

                if (distance < radius) {
                    // Calculate non-linear scale based on distance
                    const scale = defaultScale + (maxScale - defaultScale) * (1 - distance / radius);
                    item.style.setProperty('--scale', scale);
                } else {
                    item.style.setProperty('--scale', defaultScale);
                }
            });
        });

        macDock.addEventListener('mouseleave', () => {
            dockItems.forEach(item => {
                // Smoothly revert to default
                item.style.setProperty('--scale', defaultScale);
            });
        });
    }

    // Intersection Observer to trigger counter animation when in view
    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // Dynamic Tabs with Droplet Animation
    const dockLinks = document.querySelectorAll('.dock-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const viewport = document.querySelector('.docs-viewport');

    dockLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (!targetId) return;

            const targetPane = document.getElementById(targetId);
            const activePane = document.querySelector('.tab-pane.active');

            if (activePane === targetPane) return;

            dockLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            if (activePane) {
                // Trigger Slide Out Left
                activePane.classList.add('slide-out-left');
                activePane.classList.remove('droplet-expand');

                // Keep visually hidden but ready for next toggle
                setTimeout(() => {
                    activePane.classList.remove('active', 'slide-out-left');
                }, 600);
            }

            if (targetPane && viewport) {
                // Mathematical Expansion Coordinates Calculation
                const iconRect = link.getBoundingClientRect();
                const viewportRect = viewport.getBoundingClientRect();

                const originX = iconRect.left - viewportRect.left + (iconRect.width / 2);
                const originY = iconRect.top - viewportRect.top + (iconRect.height / 2);

                targetPane.style.setProperty('--ox', `${originX}px`);
                targetPane.style.setProperty('--oy', `${originY}px`);

                // Execute Droplet Morph
                targetPane.classList.add('active');
                targetPane.classList.remove('slide-out-left');
                void targetPane.offsetWidth; // Force Reflow
                targetPane.classList.add('droplet-expand');

                // Save state memory
                localStorage.setItem('shibal_active_tab', targetId);
            }
        });
    });

    // Ambient Cursor Glow Effect
    const mainBody = document.querySelector('body');
    mainBody.addEventListener('mousemove', (e) => {
        const glow1 = document.querySelector('.glow-1');
        const glow2 = document.querySelector('.glow-2');

        if (glow1 && glow2) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            glow1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
            glow2.style.transform = `translate(${-(x * 40)}px, ${-(y * 40)}px)`;
        }
    });

    // === Media Volume & Tab Memory ===
    // Universal 40% Volume for all media
    const initializeMedia = () => {
        const mediaElements = document.querySelectorAll('video, audio');
        mediaElements.forEach(media => {
            media.volume = 0.4;
            // Re-apply on load to ensure the setting sticks
            media.addEventListener('loadedmetadata', () => {
                media.volume = 0.4;
            });
        });
    };
    initializeMedia();

    // Check for saved tab on load
    const savedTab = localStorage.getItem('shibal_active_tab');
    if (savedTab) {
        const targetLink = document.querySelector(`.dock-item[data-target="${savedTab}"]`);
        if (targetLink) {
            const targetPane = document.getElementById(savedTab);
            const activePane = document.querySelector('.tab-pane.active');

            if (targetPane && targetPane !== activePane) {
                // Instantly switch tabs without animation on first load
                document.querySelectorAll('.dock-item').forEach(l => l.classList.remove('active'));
                targetLink.classList.add('active');

                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active', 'droplet-expand'));
                targetPane.classList.add('active');
            }
        }
    }

    // === Feature Info Modal Logic ===
    const featuresData = {
        // Player
        "god_mode": "Prevents your character from taking damage, including fall damage. This lets you explore dangerous areas without dying.",
        "no_clip": "Allows you to walk through walls and fly through the air. You can move relative to your camera for easy exploration.",
        "multi_hit": "Multiplies your attacks, allowing you to hit enemies multiple times with a single swing. Also includes always-crit options.",
        "energy_mod": "Gives you maximum elemental energy instantly and provides infinite stamina for running and climbing.",
        "cooldown_mod": "Removes the wait time for skills, sprinting, and bow charges, letting you use abilities as much as you want.",
        "stats_changer": "Allows you to modify your character's visible stats (Attack, Defense, etc.) for testing or screenshots.",
        "ekstra_movement": "Adds extra movement physics to your character, making jumps more dynamic and responsive.",
        "bunny_hop": "Enables continuous jumping while moving, significantly increasing your travel speed across the terrain.",
        "global_speed": "Speeds up the entire game world, including animations and movement, making everything happen faster.",
        "player_speed": "Increases only your character's movement speed while leaving the rest of the world at normal speed.",

        // World
        "auto_loot": "Automatically picks up nearby items and opens treasure chests without needing to press the pickup key.",
        "dumb_enemies": "Makes enemies ignore you or stand still, allowing you to move through combat zones safely.",
        "skip_dialogue": "Automatically skips through NPC conversations and choice menus to speed up your questing.",
        "kill_aura": "Automatically attacks nearby enemies within a specific range, handling combat for you while you move.",
        "open_team": "Lets you open the 'Party Setup' menu instantly at any time, even while in combat or moving.",
        "auto_puzzle": "Detects and solves nearby environmental puzzles (like torches or pressure plates) automatically.",
        "quest_tp": "Instantly teleports you to the current active quest objective to save time on travel.",
        "custom_tp": "Lets you set custom map markers and teleport to them instantly from anywhere.",
        "auto_destroy": "Automatically breaks nearby ores, boxes, and shields, including environmental objects.",
        "unlock_waypoints": "Unlocks all teleport waypoints and Statues of the Seven on the map so you can travel anywhere.",
        "chest_tp": "Teleports you directly to the nearest unopened treasure chest in your current region.",
        "oculi_tp": "Teleports you directly to the nearest Oculi (Anemoculus, Geoculus, etc.) for easy collection.",
        "remote_utility": "Gives you access to features like cooking, crafting, and shops from anywhere in the world.",
        "auto_treefarm": "Automatically hits trees to gather wood for teapot crafting as you walk near them.",
        "mob_vacuum": "Pulls nearby enemies into a single point for easy looting or disposal.",
        "loot_vacuum": "Pulls all dropped items on the ground directly to your character's position.",
        "elemental_aura": "Applies a constant elemental status to your character or enemies for reaction testing.",

        // Visuals
        "fov_changer": "Changes your Field of View, allowing you to see more of the landscape or zoom in for close-ups.",
        "fps_changer": "Unlocks your frame rate, allowing the game to run at 120+ FPS for a smoother visual experience.",
        "const_changer": "Visually unlocks all constellations for your characters so you can see their full power.",
        "hide_uid": "Removes your UID from the bottom right of the screen for cleaner screenshots and privacy.",
        "costume_changer": "Lets you visually equip any character skin or outfit, even if you don't own it in-game.",
        "flycloak_changer": "Allows you to visually change your wings (gliders) to any style available in the game.",
        "hud_manager": "Lets you turn off and on specific parts of the screen overlay, like the map or health bars.",
        "esp": "Shows information like health, names, and distance for enemies or items through walls.",

        // Misc
        "fps_overlay": "Displays a floating counter showing your current FPS. You can move it anywhere on the screen.",
        "theme_presets": "Lets you quickly swap between different visual styles for the Shibal menu interface.",
        "config_profiles": "Allows you to save and load your favorite settings so you don't have to re-configure every time.",
        "active_overlay": "Shows a list of every feature you currently have turned on so you can keep track of your setup."
    };

    const modal = document.getElementById('feature-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const closeBtn = document.querySelector('.close-circle');

    // Click on feature tag
    document.addEventListener('click', (e) => {
        const tag = e.target.closest('.feature-tag');
        if (tag) {
            const featureKey = tag.getAttribute('data-feature');
            const description = featuresData[featureKey];

            if (description) {
                modalTitle.textContent = tag.textContent;
                modalDesc.textContent = description;
                modal.classList.add('active');
            }
        }
    });

    // Close Modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close on background click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    // === Troubleshooting Logic ===
    const troubleData = {
        "crashing": {
            title: "Software Crashing",
            desc: "If Shibal crashes upon startup, ensure that your Anti-Virus and Windows Defender are completely disabled. Often, security software mistakenly flags project files. Check the video guide below for a step-by-step fix."
        },
        "license": {
            title: "License Key Error",
            desc: "An 'Invalid Key' error usually means the key was entered with a typo or has already been activated on another HWID. Remember that keys are locked to the PC they are first used on. If you've changed your hardware, contact support."
        },
        "menu": {
            title: "Menu Not Opening",
            desc: "If the menu doesn't appear after pressing INSERT, ensure you have successfully injected the library. Some overlays (like Discord or Steam) can interfere with our UI. Try disabling other overlays and restarting the game."
        },
        "visuals": {
            title: "Visuals Flickering",
            desc: "Flickering ESP is often caused by V-Sync or triple buffering settings in-game. Try disabling V-Sync and setting the game to 'Borderless Windowed' mode for the most stable visual experience."
        },
        "performance": {
            title: "Performance / FPS Drops",
            desc: "If you experience lag, try lowering the 'ESP Refresh Rate' in the Visuals tab. Using too many concurrent world features like 'Mob Vacuum' and 'Loot Vacuum' can also impact CPU performance."
        },
        "anticheat": {
            title: "Anti-Cheat Errors",
            desc: "If you receive an 'Incompatible' or 'Detection' warning, immediately stop using the software and check the Discord server for status updates. We recommend using a secondary account for testing after game patches."
        }
    };

    const troubleList = document.getElementById('trouble-list-view');
    const troubleDetail = document.getElementById('trouble-detail-view');
    const troubleTitle = document.getElementById('trouble-title');
    const troubleDesc = document.getElementById('trouble-desc');
    const backBtn = document.querySelector('.back-to-list');

    // Click on trouble card
    document.querySelectorAll('.trouble-card').forEach(card => {
        card.addEventListener('click', () => {
            const issueKey = card.getAttribute('data-issue');
            const data = troubleData[issueKey];

            if (data) {
                // Smooth fade transition
                troubleList.style.opacity = '0';
                setTimeout(() => {
                    troubleList.style.display = 'none';
                    troubleDetail.style.display = 'block';
                    troubleDetail.style.opacity = '0';

                    troubleTitle.textContent = data.title;
                    troubleDesc.textContent = data.desc;

                    // Trigger reflow for animation
                    void troubleDetail.offsetWidth;
                    troubleDetail.style.opacity = '1';
                    troubleDetail.style.transition = 'opacity 0.3s ease';
                }, 300);
            }
        });
    });

    // Back to list
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            troubleDetail.style.opacity = '0';
            setTimeout(() => {
                troubleDetail.style.display = 'none';
                troubleList.style.display = 'block';
                troubleList.style.opacity = '0';

                // Trigger reflow for animation
                void troubleList.offsetWidth;
                troubleList.style.opacity = '1';
                troubleList.style.transition = 'opacity 0.3s ease';
            }, 300);
        });
    }
});
