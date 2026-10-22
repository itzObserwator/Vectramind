# Reference analysis and implementation map

Analyzed October 16, 2026 using public HTML, stylesheet rules, inline animation logic, and rendered Chrome screenshots at 1440 × 1000.

Sources: [Medusmo](https://www.medusmo.com/) and [Vectramind](https://www.vectramind.com/). Vectramind loads product content dynamically from `/pages/home.html`, `/pages/firstpass.html`, `/pages/synapse.html`, `/pages/capabilities.html`, and `/pages/aboutus.html`.

## Medusmo's visual system

- A full-viewport photographic video hero with a compact top-left heading and top-right pill controls. The desktop source uses a fixed hero and scrolling spacer.
- Approximately 40px desktop page gutters, broad negative space, thin ruled dividers, small uppercase section labels, center divider ticks, 12px corner radii, and 16px card gaps.
- Condensed uppercase Doumbar display headings with tight spacing; Inter body copy. The hero heading measured 60px at the inspected viewport, with much larger display headings in later sections.
- Off-white and light-gray introductory sections, dark charcoal platform and editorial sections, and a lime consultation accent.
- Rounded channel tiles, a centered sphere, large laptop presentation, huge client-name marquees, a six-cell statistics grid, stacked split-screen editorial panels, a horizontally scrolling team gallery and a prominent final consultation CTA.

## Observed motion

The reference includes GSAP ScrollTrigger, SplitText, CustomEase, Lenis, Swiper and Webflow interactions. Its custom scripts define masked line reveals with 1.2-second durations, 0.2-second line staggers and strong cubic easing. Content cards translate and fade while scroll-triggered indexes update. Image panels reveal vertically and scale from 1.2 to 1 with a -15% outgoing parallax. Process headings shift in 100% vertical increments; a sphere moves through the following section. Mobile layouts disable desktop pinning and use direct controls.

## Section mapping

| Reference section                               | Vectramind adaptation                                                                              |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Full-screen human-service hero                  | Original Vectramind hero video, human-experience message, Adapt & Evolve headline                  |
| Customer logos                                  | Existing Vectramind client logos                                                                   |
| Rotating target audience                        | Healthcare, Enterprises, People, Your future                                                       |
| Pinned Control / Empathy / Optimization         | Intelligence / Experience / Integration                                                            |
| Genesys introduction and nine channels          | Synapse / Firstpass introduction and nine engagement capabilities                                  |
| Consultation / Solution / Implementation sphere | Discover / Design / Evolve with procedural WebGL sphere                                            |
| Dark partner/platform benefits                  | Light-mode Vectramind platform benefits                                                            |
| Laptop product animation                        | Scroll-perspective device with interactive Synapse / Firstpass views                               |
| Circular scrolling badges                       | Two opposing circular rows with all 27 original Vectramind client logos in full color              |
| Service values                                  | Adaptability, integration, business goals and responsible innovation                               |
| Testimonial carousel                            | Actual published anonymized Synapse case outcomes                                                  |
| Six headline metrics                            | Vectramind's published client, notification, patient, team, partner and location figures           |
| Stacked dark split-screen stories               | Light-mode product, engagement and company image panels                                            |
| Expert team slider                              | Actual founder and Vectramind event/team imagery                                                   |
| Consultation/footer                             | Consultation dialog, official product/support links, office links, social links and large wordmark |

## Deliberate differences and limits

This implementation preserves the reference's broad layout vocabulary and interaction patterns; it is not a pixel-identical reproduction. Vectramind copy changes line breaks and section heights. All sections use light backgrounds. Barlow Condensed and Space Grotesk substitute for the reference's custom Doumbar font; Inter provides body text. The SIL Open Font Licenses are included with local font files.

Medusmo's hero video, proprietary 3D renders, dashboard video, employee portraits, customer endorsements and brand artwork are not reused. Vectramind's original 12-second Slide_1.mp4 is hosted locally as the hero video, with muted looping playback and a static poster for reduced-motion users. Hero copy and controls are omitted so the video’s own branding stands alone. Procedural original Three.js forms recreate the role of abstract motion. Platform displays are labeled illustrations rather than representations of current product UI. The local implementation now includes product, company, careers, contact, support, blog/article and legal pages using the same theme. Enquiry forms prepare email drafts for visitors to review and send; they do not submit data to an unconfigured endpoint.

## Editing motion

`motion-provider.tsx` owns global effects and cleanup. Each pinned section owns its own ScrollTrigger state and breakpoint lifecycle. Both remove their listeners and animations on unmount. The Three.js component uses viewport observation to stop continuous frames off-screen. Reduced-motion and mobile experiences retain readable content and direct controls.
