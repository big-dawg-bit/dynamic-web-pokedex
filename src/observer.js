let observer = null;
export const observeCards = () => {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once revealed, stop watching this card — animation only fires once
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // 10% of the card must be visible to trigger
      rootMargin: '0px 0px -50px 0px', // fire slightly before fully on-screen
    }
  );

  document.querySelectorAll('.pokemon-card').forEach((card) => {
    observer.observe(card);
  });
};