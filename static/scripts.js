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

// Quiz 1 functionality
const path = window.location.pathname.replace(/\/$/, ''); // Remove trailing slash if any
const questionNumber = path.split('/').pop(); // Get last part

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const blanks = [document.getElementById('blank1'), document.getElementById('blank2'), document.getElementById('blank3')];
const resultMsg = document.getElementById('result-msg');
const radioButtons = document.querySelectorAll('input[name="product"]');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const nextBtn = document.getElementById('nextBtn');

if (questionNumber === "1") {
  // const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  // const blanks = [document.getElementById('blank1'), document.getElementById('blank2'), document.getElementById('blank3')];
  // const resultMsg = document.getElementById('result-msg');

  let selectedAnswers = [];

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      selectedAnswers = Array.from(checkboxes)
        .filter(c => c.checked)
        .map(c => c.value);

      // Reset blanks first
      blanks.forEach((b, i) => b.textContent = selectedAnswers[i] || '___');

      if (selectedAnswers.length === 3) {
        // Lock checkboxes
        checkboxes.forEach(cb => cb.disabled = true);

        // Send to backend
        fetch("/submit-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ answer: selectedAnswers })
        })
        .then(res => res.json())
        .then(data => {
          resultMsg.textContent = data.message;
          resultMsg.style.display = "block";
          resultMsg.style.color = data.correct ? "green" : "red";

          // Apply styles
          resultMsg.classList.remove("correct-message", "wrong-message");

          if (data.correct) {
            resultMsg.classList.add("correct-message");
            nextBtn.style.display = "inline-block";
            tryAgainBtn.style.display = "none";
          } else {
            resultMsg.classList.add("wrong-message");
            tryAgainBtn.style.display = "inline-block";
            nextBtn.style.display = "none";
          }

        });
      }
    });
  });
}

  // Quiz 2 functionality starts here
else if (questionNumber === "2") {
// const radioButtons = document.querySelectorAll('input[name="product"]');
// const result2Msg = document.getElementById('result-msg');
// const tryAgainBtn = document.getElementById('tryAgainBtn');
// const nextBtn = document.getElementById('nextBtn');

radioButtons.forEach(radio => {
  radio.addEventListener('change', () => {
    // Visually show tick
    document.querySelectorAll('.image-option').forEach(el => el.classList.remove('selected'));
    radio.closest('.image-option').classList.add('selected');

    console.log(radio.value);

    const selected = radio.value;
    const quizId = questionNumber;

    // fetch("/submit-quiz/2", {
    fetch(`/submit-quiz/${quizId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: [selected] })
    })
    .then(res => res.json())
    .then(data => {
      resultMsg.textContent = data.message;
      resultMsg.style.display = "block";
      resultMsg.style.color = data.correct ? "green" : "red";

      // Apply styles
      resultMsg.classList.remove("correct-message", "wrong-message");

      if (data.correct) {
        resultMsg.classList.add("correct-message");
        nextBtn.style.display = "inline-block";
        tryAgainBtn.style.display = "none";
      } else {
        resultMsg.classList.add("wrong-message");
        tryAgainBtn.style.display = "inline-block";
        nextBtn.style.display = "none";
      }
    });
  });
});
}

function resetQuiz() {
  if (questionNumber === "1") {
    selectedWords = [];
    checkboxes.forEach((box) => (box.checked = false, box.disabled = false));
    blanks.forEach((blank) => (blank.textContent = "___"));
    resultMsg.style.display = "none";
    tryAgainBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
  else if(questionNumber === "2"){
    radioButtons.forEach(r => r.checked = false);
    document.querySelectorAll('.image-option').forEach(el => el.classList.remove('selected'));
    resultMsg.textContent = "";
    resultMsg.style.display = "none";
    tryAgainBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
}

function goToNext() {
  // Redirect to next quiz page or logic
  window.location.href = "/quiz/2"; // adjust as needed
}