const steps = document.querySelectorAll(".step");
const content = document.getElementById("content");

const data = [
  {
    title: "Makeup Remover & Oil Cleanser",
    desc: "Oil cleansers are the base of the routine and the first step of the double cleanse. They are relaxing to use; as you gently massage your skin, they also remove makeup and oil-based impurities, such as sebum.",
    what: "Breaks down oil-based debris such as makeup and sunscreen."
  },
  {
    title: "Water Based Cleanser",
    desc: "Water-based cleansers remove sweat and water-based dirt. Use it after the oil cleanser to complete the double cleanse.",
    what: "Cleanses leftover residue after oil cleansing."
  },
  {
    title: "Exfoliator",
    desc: "Exfoliators slough away dead skin cells, helping to brighten the complexion and prevent clogged pores.",
    what: "Improves skin texture and clarity."
  },
  {
    title: "Toner",
    desc: "Toners help to reset your skin's pH balance and prep it to better absorb the next steps.",
    what: "Balances skin and boosts absorption."
  },
  {
    title: "Essence",
    desc: "Essences hydrate the skin and enhance the effects of treatments that follow.",
    what: "Deep hydration and preparation for serums."
  },
  {
    title: "Treatments",
    desc: "This includes serums, ampoules, or spot treatments tailored to your specific skin concerns.",
    what: "Targets specific skin concerns like acne or pigmentation."
  },
  {
    title: "Sheet Masks",
    desc: "Sheet masks offer concentrated ingredients and intense hydration in just a few minutes.",
    what: "Instant glow and moisture boost."
  },
  {
    title: "Eye Cream",
    desc: "Formulated for the delicate under-eye area, these creams help reduce puffiness and dark circles.",
    what: "Protects and hydrates under-eye skin."
  },
  {
    title: "Moisturizer",
    desc: "Locks in all previous layers and keeps your skin hydrated throughout the day or night.",
    what: "Seals in moisture and strengthens skin barrier."
  }
];

steps.forEach((step, index) => {
  step.addEventListener("click", () => {
    document.querySelector(".step.active")?.classList.remove("active");
    step.classList.add("active");

    const { title, desc, what } = data[index];
    content.innerHTML = `
      <h2>${title}</h2>
      <p>${desc}</p>
      <h4>What it does</h4>
      <p>${what}</p>
    `;
  });
});
