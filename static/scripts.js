const steps = document.querySelectorAll(".step");
const content = document.getElementById("content");
let currentIndex = 0;

const data = [
  {
    title: "Makeup Remover & Oil Cleanser",
    desc: "Oil cleansers are the base of the learn and the first step of the double cleanse. They are relaxing to use; as you gently massage your skin, they also remove makeup and oil-based impurities, such as sebum.",
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

function updateContent(index) {
  const { title, desc, what } = data[index];
  content.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <h4>What it does</h4>
    <p>${what}</p>
    <button id="nextStep" style="margin-top: 40px; float: right; color: #d835a4; background: none; border: none; font-weight: bold; cursor: pointer;">
      NEXT STEP →
    </button>
  `;
  document.querySelector(".step.active")?.classList.remove("active");
  steps[index].classList.add("active");
  attachNextHandler(); // re-bind the new button
}

steps.forEach((step, index) => {
  step.addEventListener("click", () => {
    currentIndex = index;
    updateContent(currentIndex);
  });
});

function attachNextHandler() {
  const nextBtn = document.getElementById("nextStep");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentIndex < data.length - 1) {
        currentIndex++;
        updateContent(currentIndex);
      }
    });
  }
}

// Initial binding for first page load
attachNextHandler();

// drag and drop

let box1="";
let box2="";
let box3="";

function drag_drop() {
  $("#cleanser").draggable({
    revert: function(dropped) {
      return !dropped; 
    }
  });

  $("#toner").draggable({
    revert: function(dropped) {
      return !dropped; 
    }
  });

  $("#essence").draggable({
    revert: function(dropped) {
      return !dropped; 
    }
  });

  $("#eye").draggable({
    revert: function(dropped) {
      return !dropped; 
    }
  });

  $("#moisturizer").draggable({
    revert: function(dropped) {
      return !dropped; 
    }
  });

  $("#sunscreen").draggable({
    revert: function(dropped) {
      return !dropped; 
    }
  });

  $("#box1").droppable({
    over: function(event, ui) {
      $(this).addClass("hover");
    },
    out: function(event, ui) {
      $(this).removeClass("hover");
    },
    drop: function(event, ui) {
      $(this)
        .removeClass("hover")
        .droppable("disable")

        box1 = ui.draggable.attr("id");
    }
  });

  $("#box2").droppable({
    over: function(event, ui) {
      $(this).addClass("hover");
    },
    out: function(event, ui) {
      $(this).removeClass("hover");
    },
    drop: function(event, ui) {
      $(this)
        .removeClass("hover")
        .droppable("disable")

        box2 = ui.draggable.attr("id");
    }
  });

  $("#box3").droppable({
    over: function(event, ui) {
      $(this).addClass("hover");
    },
    out: function(event, ui) {
      $(this).removeClass("hover");
    },
    drop: function(event, ui) {
      $(this)
        .removeClass("hover")
        .droppable("disable")

        box3 = ui.draggable.attr("id");
        
    }
  });
}

drag_drop();

function eval() {
  if (box1==="" || box2==="" || box3==="") {
    alert("Please fill all the steps!");
  } else {
    if (box1!=='cleanser') {
      $("#routinestatus").text("Try again! \n You might want to use the cleanser first!");
      $("#routinestatus").addClass("bad");
    } else {
      if (box2==='sunscreen') {
        $("#routinestatus").text("Try again! \n You might want to use the sunscreen at the end!");
        $("#routinestatus").addClass("bad");
      } else {
        if (box3!=='sunscreen') {
          $("#routinestatus").text("Try again! \n You might want to end the routine with sunscreen for protection!");
          $("#routinestatus").addClass("bad");
        } else {
          $("#routinestatus").text("Good Job! Your routine seems good");
          $("#routinestatus").addClass("good");
          $(".finish").prop("disabled", false);
        }
      }
    }
  }
}
