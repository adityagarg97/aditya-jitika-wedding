import { useEffect } from "react";

export function useInvitationMotion(paused) {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = () => {};
    const configure = () => {
      cleanup();
      if (preference.matches || paused) return;
      const elements = [...document.querySelectorAll(
        ".hero-content > :not(.ganesh-icon), .intro > h2, .intro-copy, .family > *, .countdown, .section-heading, .event-panel, .event-header, .ceremony-heading, .venue-row, .details > h2, .contact-card, .footer-names",
      )];
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            target.classList.add("motion-visible");
            observer.unobserve(target);
          }
        });
      }, { threshold: 0.08 });
      elements.forEach((element) => {
        element.classList.add("motion-reveal");
        if (element.matches(".event-header, .ceremony-heading")) element.style.setProperty("--reveal-delay", "80ms");
        if (element.matches(".venue-row")) element.style.setProperty("--reveal-delay", "160ms");
        observer.observe(element);
      });
      cleanup = () => {
        observer.disconnect();
        elements.forEach((element) => {
          element.classList.remove("motion-reveal", "motion-visible");
          element.style.removeProperty("--reveal-delay");
        });
      };
    };
    configure();
    preference.addEventListener("change", configure);
    return () => { cleanup(); preference.removeEventListener("change", configure); };
  }, [paused]);
}

