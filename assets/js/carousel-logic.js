/**
 * Reusable Carousel Logic for Quarks IISc Blog
 * Handles auto-scrolling, manual navigation, and seamless looping.
 */

function initCarousel(containerId, trackId, options = {}) {
    const carousel = document.getElementById(containerId);
    const track = document.getElementById(trackId);
    
    if (!carousel || !track) return;

    const {
        autoScroll = true,
        scrollSpeed = 1,
        resumeDelay = 3000,
        scrollAmount = 300
    } = options;

    const originalCount = track.children.length;
    if (originalCount === 0) return;

    // Duplicate content for seamless scrolling
    track.innerHTML += track.innerHTML;

    let isAutoScrolling = autoScroll;
    let animationFrameId;
    let resumeTimeout;

    function autoScrollStep() {
        if (isAutoScrolling && originalCount > 1) {
            carousel.scrollLeft += scrollSpeed;
            if (carousel.scrollLeft >= track.scrollWidth / 2) {
                carousel.scrollLeft = 0;
            }
        }
        animationFrameId = requestAnimationFrame(autoScrollStep);
    }

    if (autoScroll && originalCount > 1) {
        animationFrameId = requestAnimationFrame(autoScrollStep);
    }

    // Manual navigation functions
    const sanitizedId = containerId.replace(/-/g, '_');
    window[`scroll_${sanitizedId}`] = function(direction) {
        if (autoScroll) {
            isAutoScrolling = false;
            clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                isAutoScrolling = true;
            }, resumeDelay);
        }
        
        carousel.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    // Pause on interaction
    const pause = () => { if (autoScroll) isAutoScrolling = false; };
    const resume = () => { if (autoScroll) isAutoScrolling = true; };

    carousel.addEventListener('mouseenter', pause);
    carousel.addEventListener('mouseleave', resume);
    carousel.addEventListener('touchstart', pause);
    carousel.addEventListener('touchend', resume);
}
