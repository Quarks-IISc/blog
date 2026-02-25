document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    // Apply saved theme on load
    if (currentTheme) {
        body.classList.add(currentTheme);
        updateToggleButtonIcon(currentTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Apply system preference if no theme saved
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
        updateToggleButtonIcon('dark-mode');
    }

    // Toggle theme on button click
    if (toggleButton) {
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light-mode');
                updateToggleButtonIcon('light-mode');
            } else {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
                updateToggleButtonIcon('dark-mode');
            }
        });
    }

    function updateToggleButtonIcon(theme) {
        if (toggleButton) {
            const icon = toggleButton.querySelector('i');
            if (icon) {
                if (theme === 'dark-mode') {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        }
    }
});