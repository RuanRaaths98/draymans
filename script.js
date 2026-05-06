const hero = document.querySelector("[data-tilt]");
const frame = document.querySelector(".hero__frame");
const revealSections = [...document.querySelectorAll(".section-reveal")];
const sponsorForm = document.querySelector(".sponsor-form");
const formStatus = document.querySelector(".form-status");

const canUseMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (hero && frame && canUseMotion) {
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    frame.style.setProperty("--tilt-x", `${x * 1.8}deg`);
    frame.style.setProperty("--tilt-y", `${y * -1.4}deg`);
  });

  hero.addEventListener("pointerleave", () => {
    frame.style.setProperty("--tilt-x", "0deg");
    frame.style.setProperty("--tilt-y", "0deg");
  });
}

if (revealSections.length && canUseMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.22 },
  );

  revealSections.forEach((section) => revealObserver.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add("is-visible"));
}

if (sponsorForm && formStatus) {
  sponsorForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!sponsorForm.checkValidity()) {
      sponsorForm.reportValidity();
      formStatus.textContent = "Please complete every field so we can review your entry properly.";
      formStatus.className = "form-status is-error";
      return;
    }

    const formData = new FormData(sponsorForm);

    formStatus.textContent = "Sending your entry...";
    formStatus.className = "form-status";

    try {
      const response = await fetch(sponsorForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      sponsorForm.reset();
      window.location.href = "/thank-you";
    } catch {
      formStatus.textContent = "Sorry, something went wrong while sending your entry. Please try again.";
      formStatus.className = "form-status is-error";
    }
  });
}
