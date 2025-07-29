import gsap from 'gsap';
let mm = gsap.matchMedia();
mm.add("(prefers-color-scheme: dark)", () => {
  gsap.fromTo(".background", {
    filter: "grayscale(0%) brightness(100%)",
    duration: 2,
  },{
    filter: "grayscale(20%) brightness(60%)",
    duration: 2,
  })
});

[...document.getElementsByClassName("toggle-guide")].forEach(element => {
  element.addEventListener('click', () => {
    const targetId = element.dataset.toggleTarget;
    const targetElement = document.querySelector(`.guide_content[data-toggle-id="${targetId}"]`);
    if (targetElement) {
      targetElement.classList.toggle('toggled_visable');
    }
  });
});