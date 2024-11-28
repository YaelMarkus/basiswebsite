// JavaScript Document
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const dotsContainer = document.querySelector('.carousel-dots');

let currentIndex = 0;
let startX = 0;
let moveX = 0;
let isDragging = false;

// Clone first and last slides for infinite scrolling
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

track.appendChild(firstClone); // Add cloned first slide to the end
track.insertBefore(lastClone, slides[0]); // Add cloned last slide to the start

// Update slides array and initial position
const allSlides = Array.from(track.children);
const slideWidth = slides[0].getBoundingClientRect().width;
track.style.transform = `translateX(-${slideWidth}px)`; // Start at the "real" first slide
currentIndex = 1; // Reflect that we're at the cloned "first" slide

// Create dots dynamically (only for original slides)
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active'); // First dot is active initially
    dotsContainer.appendChild(dot);
});

const allDots = Array.from(dotsContainer.children);

// Function to update active dot
const updateActiveDot = () => {
    allDots.forEach(dot => dot.classList.remove('active'));
    const dotIndex = currentIndex - 1; // Adjust for cloned slides
    if (dotIndex >= 0 && dotIndex < slides.length) {
        allDots[dotIndex].classList.add('active');
    }
};

// Function to update slide position
const updateSlidePosition = () => {
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
};

// Reset to real first or last slide instantly after reaching clones
const handleInfiniteScroll = () => {
    if (allSlides[currentIndex] === firstClone) {
        track.style.transition = 'none'; // Instantly jump
        currentIndex = 1; // Move to the real first slide
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    } else if (allSlides[currentIndex] === lastClone) {
        track.style.transition = 'none'; // Instantly jump
        currentIndex = slides.length; // Move to the real last slide
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
    updateActiveDot(); // Sync dots after resetting
};

// Touch event listeners for swipe functionality
track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = 'none'; // Disable smooth transition while dragging
});

track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    moveX = e.touches[0].clientX;
    const distance = moveX - startX;
    track.style.transform = `translateX(-${currentIndex * slideWidth - distance}px)`;
});

track.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;

    const distance = moveX - startX;

    // Determine swipe direction
    if (distance > 50) {
        // Swipe right
        currentIndex--;
    } else if (distance < -50) {
        // Swipe left
        currentIndex++;
    }

    updateSlidePosition();

    // Check for infinite scrolling wrap-around
    track.addEventListener('transitionend', handleInfiniteScroll, { once: true });
});

// Dots navigation logic
dotsContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('carousel-dot')) return;

    const dotIndex = allDots.indexOf(e.target);
    currentIndex = dotIndex + 1; // Adjust for cloned slides

    updateSlidePosition();
    updateActiveDot();
});

// Adjust position on window resize
window.addEventListener('resize', () => {
    track.style.transition = 'none';
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
});
