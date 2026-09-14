# RCU transition carousel reference

Reference inspected: https://www.rcu.gov.sa/en, “RCU at a Glance”. Applied only to ADURE’s 30-day transition section; existing copy, CTA, brand and local imagery remain.

Observed public implementation: two synchronized Slick carousels. Image track uses a 500 ms CSS `ease` translation, looping with cloned slides and click-to-select. Text slides crossfade over 500 ms while their inner panel translates from 100% to zero over 1000 ms `ease-in-out`. No autoplay configured. Adjacent images have a white 50% overlay and bottom titles; the selected image loses both and joins the text panel with square left corners.

Desktop reference dimensions: 485 px text panel, 485 px image step including 20 px right gap, and 530 px height. Mobile stacks a 192 px image above the text and disables the horizontal text-panel transform while retaining the crossfade.

Source evidence: https://www.rcu.gov.sa/assets/js/scripts.min.js (`imageCarousel`, `imageCarousel2`) and https://www.rcu.gov.sa/assets/css/style.min.css (`.sec-royal-commission`). Timing was also checked in the live DOM immediately after clicking Next.

Local implementation: `dist/transition-carousel.js` enhances the original timeline and `dist/transition-carousel.css` scopes its presentation. Native CSS transitions reproduce the measured timing without adding jQuery or Slick. Includes next/previous, image selection, arrow keys, swipe, infinite wrap, and reduced-motion behavior. The original timeline remains the no-JavaScript fallback.
