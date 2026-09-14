# Portfolio carousel — RIO reference

Updated 14 September 2026 from https://www.rioproperty.co.za/.

Five ADURE cards, retaining the original three and adding two visual studies:
Urban Architecture and Contemporary Terraces. New captions describe supplied
images and do not assert new property names or locations. All card links use
the existing external portfolio destination.

Reference behavior was inspected in the rendered DOM and public script at
https://rio-property.pages.dev/main.js. Its featured-projects carousel uses
Smooothy (the served package was 0.0.35), with infinite=false, snap=true,
scrollInput=false, bounceLimit=0, and a wrapper-width offset. Default drag
sensitivity is .005, damping factor .3, and snap strength .1. The same engine
is vendored locally and updated through requestAnimationFrame.

For normalized card-center distance d clamped to [-1,1], the vertical card
translation is 20*abs(d)-10 percent; image translation is -10*d percent.
Images are 120% wide, offset -10%, within clipped media frames. Horizontal
wheel delta adjusts target by -.005*deltaX; vertical wheel input retains page
scrolling. Left/right keys advance the finite carousel. Short clicks activate
links, while gestures over 5px or 200ms suppress activation.

Responsive item widths follow the reference: 33%, 50% below 992px, 66% below
768px, 95% below 480px. Card aspect ratio is 4:5. Hover/focus reveals the
caption, gradient, arrow, and ADURE-blue metadata strip with the reference's
.75–1s cubic-bezier(.625,.05,0,1) transitions.

Accessibility additions: focus-driven card visibility, Home/End on the rail,
reduced-motion handling, form-safe keyboard shortcuts, and resize clamping.
Animation pauses offscreen and in background tabs. No autoplay or looping.

Validation: existing homepage copy/assets/filter checks passed with only the
two requested new card headings excluded from the historical copy comparison.
Browser checks covered five loaded images, initialization without console
errors, desktop drag without navigation, changing arc/parallax transforms,
right end stop, keyboard access, 390px layout, and narrow-screen dragging.
No page horizontal overflow was observed. Touch hardware was not tested.
