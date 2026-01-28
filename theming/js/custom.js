document.addEventListener('DOMContentLoaded', () => {


    if (typeof Swiper === 'undefined') {
        console.error('Swiper not loaded');
        return;
    }

    /* ---------------- PRODUCT SLIDER ---------------- */
    let productSwiper = null;
    const mobileBreakpoint = 768;

    function toggleProductSwiper() {
        const sliderEl = document.querySelector('.product-slider');
        if (!sliderEl) return;

        if (window.innerWidth > mobileBreakpoint) {
            if (!productSwiper) {
                productSwiper = new Swiper(sliderEl, {
                    slidesPerView: 3,
                    spaceBetween: 20,
                    loop: true,
                    navigation: {
                        nextEl: '.slider-arrow.next',
                        prevEl: '.slider-arrow.prev',
                    },
                    breakpoints: {
                        1240: { slidesPerView: 3 },
                        1024: { slidesPerView: 2 },
                        900: { slidesPerView: 2 },
                        769: { slidesPerView: 1 }
                    }
                });
            } else {
                productSwiper.update();
            }
        } else if (productSwiper) {
            productSwiper.destroy(true, true);
            productSwiper = null;
        }
    }

    toggleProductSwiper();

    /* ---------------- JOURNEY SLIDER ---------------- */
    let journeySwiper = null;

    function toggleJourneySwiper() {
        const journeyEl = document.querySelector('.journey-product');
        if (!journeyEl) return;

        if (window.innerWidth > mobileBreakpoint) {
            if (!journeySwiper) {
                journeySwiper = new Swiper(journeyEl, {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    loop: true,
                    speed: 600,
                });
            }
        } else if (journeySwiper) {
            journeySwiper.destroy(true, true);
            journeySwiper = null;
        }
    }

    toggleJourneySwiper();

    /* ---------------- RESIZE (SINGLE LISTENER) ---------------- */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            toggleProductSwiper();
            toggleJourneySwiper();
        }, 250);
    });

    /* ---------------- PRODUCT CARD VIDEO ---------------- */
    document.querySelectorAll('.product-card').forEach(card => {
        const video = card.querySelector('video');
        if (!video) return;

        card.addEventListener('mouseenter', () => {
            video.currentTime = 0;
            video.play();
        });

        card.addEventListener('mouseleave', () => {
            video.pause();
        });
    });

    /* ---------------- JOURNEY NEXT ARROW ---------------- */
    const nextArrow = document.querySelector('.journey-next-arrow');
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            if (journeySwiper) journeySwiper.slideNext();
        });
    }

    /* ---------------- PURCHASE OPTIONS ---------------- */
    document.querySelectorAll('.purchase-option').forEach(option => {
        option.addEventListener('click', () => {
            document
                .querySelectorAll('.purchase-option')
                .forEach(o => o.classList.remove('active'));

            option.classList.add('active');
            const input = option.querySelector('input');
            if (input) input.checked = true;
        });
    });

    /* ---------------- ACCORDION ---------------- */
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('active');
        });
    });

    /* ---------------- QTY BUTTONS ---------------- */
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', () => {
            // remove active from all buttons
            document.querySelectorAll('.quantity-btn')
                .forEach(btn => btn.classList.remove('active'));

            // add active to clicked button
            button.classList.add('active');
        });
    });


    /* ---------------- PRODUCT GALLERY (THUMBS FIXED) ---------------- */
    const thumbsEl = document.querySelector('.product-thumb');
    const imagesEl = document.querySelector('.product-images');

    let gallerySwiper = null;
    let thumbsSwiper = null;

    if (thumbsEl && imagesEl) {
        thumbsSwiper = new Swiper(thumbsEl, {
            spaceBetween: 10,
            slidesPerView: 3,
            freeMode: true,
            watchSlidesProgress: true,
            slideToClickedSlide: true,
        });

        gallerySwiper = new Swiper(imagesEl, {
            spaceBetween: 10,
            thumbs: {
                swiper: thumbsSwiper,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }

    /* ---------------- VARIANT → IMAGE SYNC ---------------- */
    document.addEventListener('click', (e) => {
        const flavor = e.target.closest('.flavor-img');
        if (!flavor || !gallerySwiper) return;

        e.preventDefault();

        // Active state
        document
            .querySelectorAll('.flavor-img')
            .forEach(el => el.classList.remove('active'));
        flavor.classList.add('active');

        // Slide to matching image
        gallerySwiper.slides.forEach((slide, index) => {
            if (slide.querySelector('img')?.alt === flavor.dataset.flavor) {
                gallerySwiper.slideTo(index);
            }
        });
    });
});


document.querySelectorAll('.product-card').forEach(card => {
    const hasVideo = card.dataset.hasVideo === 'true';
    const video = card.querySelector('.hover-video');
    const bg = card.querySelector('.product-bg');

    card.addEventListener('mouseenter', () => {
        if (hasVideo && video) {
            video.play();
            video.style.opacity = '1';
        } else if (bg) {
            bg.style.opacity = '1';
        }
    });

    card.addEventListener('mouseleave', () => {
        if (hasVideo && video) {
            video.pause();
            video.currentTime = 0;
            video.style.opacity = '0';
        } else if (bg) {
            bg.style.opacity = '0';
        }
    });
});

