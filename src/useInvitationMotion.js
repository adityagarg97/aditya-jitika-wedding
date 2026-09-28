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
      // Extra image coverage prevents exposed edges during the small parallax shift.
      const videos = [...document.querySelectorAll(".hero > .film, .event > .film")];
      videos.forEach((video) => video.classList.add("motion-film"));
      let frame = 0;
      const update = () => {
        frame = 0;
        videos.forEach((video) => {
          const bounds = video.parentElement.getBoundingClientRect();
          if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
          const offset = Math.max(-18, Math.min(18,
            (window.innerHeight / 2 - bounds.top - bounds.height / 2) * 0.045));
          video.style.setProperty("--parallax-offset", `${offset}px`);
        });
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      schedule();
      cleanup = () => {
        observer.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        elements.forEach((element) => {
          element.classList.remove("motion-reveal", "motion-visible");
          element.style.removeProperty("--reveal-delay");
        });
        videos.forEach((video) => {
          video.classList.remove("motion-film");
          video.style.removeProperty("--parallax-offset");
        });
      };
    };
    configure();
    preference.addEventListener("change", configure);
    return () => { cleanup(); preference.removeEventListener("change", configure); };
  }, [paused]);
}
