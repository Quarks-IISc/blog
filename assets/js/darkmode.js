document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const html = document.documentElement;
    const currentTheme = localStorage.getItem('theme');

    // The inline script in <head> already applies the class to <html>.
    // We just need to set the initial toggle icon state correctly.
    if (html.classList.contains('dark-mode')) {
        updateToggleButtonIcon('dark-mode');
    }

    // Toggle theme on button click
    if (toggleButton) {
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (html.classList.contains('dark-mode')) {
                html.classList.remove('dark-mode');
                document.body.classList.remove('dark-mode'); // For fallback support
                localStorage.setItem('theme', 'light-mode');
                updateToggleButtonIcon('light-mode');
            } else {
                html.classList.add('dark-mode');
                document.body.classList.add('dark-mode'); // For fallback support
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