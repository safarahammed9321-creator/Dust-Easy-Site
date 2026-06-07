const root = document.documentElement;
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const stickyStory = document.querySelector(".sticky-story");
let counted = false;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  setTimeout(() => window.scrollTo(0, 0), 0);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
  revealObserver.observe(item);
});

function animateCounters() {
  if (counted) return;
  counted = true;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    const suffix = counter.dataset.suffix || "+";
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

const trustObserver = new IntersectionObserver((entries) => {
  if (entries.some((entry) => entry.isIntersecting)) animateCounters();
}, { threshold: 0.35 });

const trust = document.querySelector(".trust");
if (trust) trustObserver.observe(trust);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateScrollEffects() {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  root.style.setProperty("--scroll-progress", progress.toFixed(4));

  if (stickyStory) {
    const rect = stickyStory.getBoundingClientRect();
    const storyProgress = clamp((window.innerHeight - rect.top) / (rect.height + window.innerHeight * 0.2), 0, 1);
    root.style.setProperty("--story-progress", storyProgress.toFixed(4));
  }
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollEffects();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

window.addEventListener("resize", updateScrollEffects);
updateScrollEffects();

document.querySelector(".quote-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  const original = button.textContent;
  button.textContent = "Quote Requested";
  button.disabled = true;
  setTimeout(() => {
    button.textContent = original;
    button.disabled = false;
  }, 1800);
});
