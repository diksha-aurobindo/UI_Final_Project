const steps = document.querySelectorAll(".step");
const content = document.getElementById("content");
const storedIndex = sessionStorage.getItem("currentIndex");
if (storedIndex !== null) {
  currentIndex = parseInt(storedIndex);
} else {
  currentIndex = 0; // First visit: initialize to 0
  sessionStorage.setItem("currentIndex", currentIndex);
}

let maxUnlockedStep = 0;
let routineData = [];

const routine_order = {
  "cleanser": 0,
  "toner": 1,
  "essence": 2,
  "serum": 3,
  "eye-cream": 4,
  "spot-treatment": 5,
  "moisturizer": 6,
  "sunscreen": 7
};

// line 204
// Fetch data and initialize
fetch("/data")
  .then(res => res.json())
  .then(data => {
    routineData = data.routine_steps;

    if (initialProduct && routine_order.hasOwnProperty(initialProduct)) {
      currentIndex = routine_order[initialProduct];
    } else {
      currentIndex = 0;
    }

    maxUnlockedStep = currentIndex;
    updateContent(currentIndex);

    steps.forEach((step, index) => {
      step.addEventListener("click", () => {
        if (index <= maxUnlockedStep) {
          currentIndex = index;
          updateContent(index);
          history.pushState(null, "", `/learn/${Object.keys(routine_order)[index]}`);
        }
      });
    });
  });

// if (window.location.pathname.startsWith("/learn")) {
function updateContent(index) {
  const { step, description, benefit, image, skin_type_ingredients, key_ingredients } = routineData[index];

  const prevButton = index > 0
  ? '<button id="prevStep" class="prev-step-btn">← PREVIOUS STEP</button>'
  : "";

    const nextButton = index === routineData.length - 1
    ? '<button id="nextStep" class="next-step-btn"><a href="/final-quiz/q1" class="quiz-link">QUIZ →</a></button>'
    : '<button id="nextStep" class="next-step-btn">NEXT STEP →</button>';
  
  const userSkinType = skinType || "Oily";

  // Create a list of product's key ingredient names for matching
  const keyIngredientNames = key_ingredients.map(k => k.name.toLowerCase());

  // Build Ingredients Table
  let ingredientsTable = `
    <h4 style="margin-top: 30px;">Ingredients to Look for Based on Skin Type</h4>
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
      <thead>
        <tr style="background-color: #f5f5f5;">
          <th style="padding: 8px; border: 1px solid #ddd;">Skin Type</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Recommended Ingredients</th>
        </tr>
      </thead>
      <tbody>`;

  for (let skinType in skin_type_ingredients) {
    if (skinType.toLowerCase() === userSkinType.toLowerCase()) { // Only show matching skin type
      const ingredientsList = skin_type_ingredients[skinType].map(ingredient => {
        if (keyIngredientNames.includes(ingredient.toLowerCase())) {
          return `<strong>${ingredient}</strong>`; // Bold if in key ingredients
        } else {
          return ingredient;
        }
      }).join(", ");

      ingredientsTable += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${skinType}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${ingredientsList}</td>
        </tr>`;
    }
  }

  ingredientsTable += `</tbody></table>`;

  // Build Learn More Section
  let learnMoreContent = `
    <h4 style="margin-top: 30px;">Learn About Active Ingredients</h4>`;

  key_ingredients.forEach(ingredient => {
    learnMoreContent += `
      <h5>${ingredient.name} (${ingredient.percentage})</h5>
      <p><strong>Why Needed:</strong> ${ingredient.why_needed}</p>
      <p><strong>Caution:</strong> ${ingredient.caution}</p>`;
  });

  // Set page content
  content.innerHTML = `
    <div class="step-content">
      <div class="step-image">
        <img id="step-img" src="/static/${image}" alt="Step Image" onerror="this.onerror=null;this.src='/static/images/placeholder.jpg';" />
      </div>
      <div class="step-text">
        <h2 id="step-title">${step}</h2>
        <p id="step-description">${description}</p>

        <h4>What it does</h4>
        <p id="step-benefit">${benefit}</p>

        ${ingredientsTable}

        <div style="margin-top: 30px; text-align: center;">
          <button id="toggle-ingredients">
            Learn About Active Ingredients
          </button>
        </div>


        <div id="ingredients-content" style="display: none; margin-top: 20px;">
          ${learnMoreContent}
        </div>

        <div style="margin-top: 40px;">
          ${prevButton}
          ${nextButton}
        </div>
      </div>
    </div>
  `;

  document.querySelector(".step.active")?.classList.remove("active");
  steps[index].classList.add("active");

  attachNextHandler();
  updateStepStates();
  attachToggleHandler();
}

function attachNextHandler() {
  const nextBtn = document.getElementById("nextStep");
  const prevBtn = document.getElementById("prevStep");

  if (nextBtn) {
    nextBtn.addEventListener("click", goToNext);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateContent(currentIndex);
        history.pushState(null, "", `/learn/${Object.keys(routine_order)[currentIndex]}`);
      }
    });
  }
}

function attachToggleHandler() {
  const toggleButton = document.getElementById("toggle-ingredients");
  const ingredientsContent = document.getElementById("ingredients-content");

  if (toggleButton && ingredientsContent) {
    toggleButton.addEventListener("click", function () {
      if (ingredientsContent.style.display === "none" || ingredientsContent.style.display === "") {
        ingredientsContent.style.display = "block";
        toggleButton.textContent = "Hide Active Ingredients";
      } else {
        ingredientsContent.style.display = "none";
        toggleButton.textContent = "Learn About Active Ingredients";
      }
    });
  }
}

function updateStepStates() {
  steps.forEach((step, index) => {
    if (index <= maxUnlockedStep) {
      step.classList.remove("locked");
      step.style.pointerEvents = "auto";
    } else {
      step.classList.add("locked");
      step.style.pointerEvents = "none";
    }
  });
}

// ROUTINE 

// Initial binding for first page load
// attachNextHandler();

// drag and drop

let box1="";
let box2="";
let box3="";

let boxx1="";
let boxx2="";
let boxx3="";
let boxx4="";
let boxx5="";

function drag_drop() {
  $("#cleanser").draggable({
    revert: function(dropped) {
      return !dropped; 
    },
    start: function(event, ui) {
      var previousDrop = $(this).data("droppedOn");
      if (previousDrop) {
          $("#"+previousDrop).droppable('enable');
      }
  }
  });

  $("#toner").draggable({
    revert: function(dropped) {
      return !dropped; 
    },
    start: function(event, ui) {
      var previousDrop = $(this).data("droppedOn");
      if (previousDrop) {
          $("#"+previousDrop).droppable('enable');
      }
  }
  });

  $("#essence").draggable({
    revert: function(dropped) {
      return !dropped; 
    },
    start: function(event, ui) {
      var previousDrop = $(this).data("droppedOn");
      if (previousDrop) {
          $("#"+previousDrop).droppable('enable');
      }
  }
  });

  $("#serum").draggable({
    revert: function(dropped) {
      return !dropped; 
    },
    start: function(event, ui) {
      var previousDrop = $(this).data("droppedOn");
      if (previousDrop) {
          $("#"+previousDrop).droppable('enable');
      }
  }
  });

  $("#eye").draggable({
    revert: function(dropped) {
      return !dropped; 
    },
    start: function(event, ui) {
      var previousDrop = $(this).data("droppedOn");
      if (previousDrop) {
          $("#"+previousDrop).droppable('enable');
      }
  }
  });

  $("#spot").draggable({
    revert: function(dropped) {
      return !dropped; 
    },
    start: function(event, ui) {
      var previousDrop = $(this).data("droppedOn");
      if (previousDrop) {
          $("#"+previousDrop).droppable('enable');
      }
  }
  });

  $("#moisturizer").draggable({
    revert: function(dropped) {
      return !dropped; 
    },
    start: function(event, ui) {
      var previousDrop = $(this).data("droppedOn");
      if (previousDrop) {
          $("#"+previousDrop).droppable('enable');
      }
  }
  });

  $("#sunscreen").draggable({
    revert: function(dropped) {
      return !dropped; 
    },
    start: function(event, ui) {
      var previousDrop = $(this).data("droppedOn");
      if (previousDrop) {
          $("#"+previousDrop).droppable('enable');
      }
  }
  });

  $(".products").droppable({
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
        var previousDrop = ui.helper.data("droppedOn");
        if (previousDrop==='box1') {
          box1='';
        } else if (previousDrop==='box2') {
          box2='';
        } else if (previousDrop==='box3') {
          box3='';
        } else if (previousDrop==='boxx1') {
          boxx1='';
        } else if (previousDrop==='boxx2') {
          boxx2='';
        } else if (previousDrop==='boxx3') {
          boxx3='';
        } else if (previousDrop==='boxx4') {
          boxx4='';
        } else if (previousDrop==='boxx5') {
          boxx5='';
        }
        ui.helper.data("droppedOn", $(this).attr("id"));
        
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

        if (box1===box2) {
          box2='';
          $("#box2").droppable("enable");
        } else if (box1===box3) {
          box3='';
          $("#box3").droppable("enable");
        }

        ui.helper.data("droppedOn", $(this).attr("id"));
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

        if (box1===box2) {
          box1='';
          $("#box1").droppable("enable");
        } else if (box2===box3) {
          box3='';
          $("#box3").droppable("enable");
        }

        ui.helper.data("droppedOn", $(this).attr("id"));  
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

        if (box3===box1) {
          box1='';
          $("#box1").droppable("enable");
        } else if (box2===box3) {
          box2='';
          $("#box2").droppable("enable");
        }
        ui.helper.data("droppedOn", $(this).attr("id")); 
    }
  });

  $("#boxx1").droppable({
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

        boxx1 = ui.draggable.attr("id");

        if (boxx1===boxx2) {
          boxx2='';
          $("#boxx2").droppable("enable");
        } else if (boxx1===boxx3) {
          boxx3='';
          $("#boxx3").droppable("enable");
        } else if (boxx1===boxx4) {
          boxx4='';
          $("#boxx4").droppable("enable");
        } else if (boxx1===boxx5) {
          boxx5='';
          $("#boxx5").droppable("enable");
        }

        ui.helper.data("droppedOn", $(this).attr("id")); 
    }
  });

  $("#boxx2").droppable({
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

        boxx2 = ui.draggable.attr("id");

        if (boxx1===boxx2) {
          boxx1='';
          $("#boxx1").droppable("enable");
        } else if (boxx2===boxx3) {
          boxx3='';
          $("#boxx3").droppable("enable");
        } else if (boxx2===boxx4) {
          boxx4='';
          $("#boxx4").droppable("enable");
        } else if (boxx2===boxx5) {
          boxx5='';
          $("#boxx5").droppable("enable");
        }

        ui.helper.data("droppedOn", $(this).attr("id"));  
    }
  });

  $("#boxx3").droppable({
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

        boxx3 = ui.draggable.attr("id");

        if (boxx1===boxx3) {
          boxx1='';
          $("#boxx1").droppable("enable");
        } else if (boxx2===boxx3) {
          boxx2='';
          $("#boxx2").droppable("enable");
        } else if (boxx3===boxx4) {
          boxx4='';
          $("#boxx4").droppable("enable");
        } else if (boxx3===boxx5) {
          boxx5='';
          $("#boxx5").droppable("enable");
        }
        ui.helper.data("droppedOn", $(this).attr("id")); 
    }
  });

  $("#boxx4").droppable({
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

        boxx4 = ui.draggable.attr("id");

        if (boxx1===boxx4) {
          boxx1='';
          $("#boxx1").droppable("enable");
        } else if (boxx2===boxx4) {
          boxx2='';
          $("#boxx2").droppable("enable");
        } else if (boxx3===boxx4) {
          boxx3='';
          $("#boxx3").droppable("enable");
        } else if (boxx4===boxx5) {
          boxx5='';
          $("#boxx5").droppable("enable");
        }

        ui.helper.data("droppedOn", $(this).attr("id"));  
    }
  });

  $("#boxx5").droppable({
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

        boxx5 = ui.draggable.attr("id");

        if (boxx1===boxx5) {
          boxx1='';
          $("#boxx1").droppable("enable");
        } else if (boxx2===boxx5) {
          boxx2='';
          $("#boxx2").droppable("enable");
        } else if (boxx3===boxx5) {
          boxx3='';
          $("#boxx3").droppable("enable");
        } else if (boxx4===boxx5) {
          boxx4='';
          $("#boxx4").droppable("enable");
        }

        ui.helper.data("droppedOn", $(this).attr("id"));  
    }
  });

}

drag_drop();

function eval() {
  $(".finish").prop("disabled", true);
  $("#routinestatus").text("");
  $("#routinestatus").css("background-color", '#fff9fc');
  if (box1==="" || box2==="" || box3==="") {
    alert("Please fill all the steps!");
  } else {
    if (box1!=='cleanser') {
      $("#routinestatus").text("Try again! \n You might want to use the cleanser first!");
      $("#routinestatus").css("background-color", "red");
      $("#routinestatus").css("color", "white");
    } else {
      if (routine_order[box2]>routine_order[box3]) {
        $("#routinestatus").text("Try again! \n You might want to use "+box3+" before "+box2+"!");
        $("#routinestatus").css("background-color", "red");
        $("#routinestatus").css("color", "white");
      } else {
          $("#routinestatus").text("Good Job! Your routine seems good");
          $("#routinestatus").css("background-color", "lightgreen");
          $("#routinestatus").css("color", "white");
          $(".finish").prop("disabled", false);

          fetch("/save-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          })
          .then(res => res.json())
          .then(data => console.log("Progress saved:", data));
      }
    }
  }
}

function eval2() {
  $(".finish").prop("disabled", true);
  $("#routinestatus").text("");
  $("#routinestatus").css("background-color", '#fff9fc');
  if (boxx1==="" || boxx2==="" || boxx3==="" || boxx4==="" || boxx5==="") {
    alert("Please fill all the steps!");
  } else {
    if (boxx1!=='cleanser') {
      $("#routinestatus").text("Try again! \n You might want to use the cleanser first!");
      $("#routinestatus").css("background-color", "red");
      $("#routinestatus").css("color", "white");
    } else {
      if (routine_order[boxx2]>routine_order[boxx3]) {
        $("#routinestatus").text("Try again! \n You might want to use "+boxx3+" before "+boxx2+"!");
        $("#routinestatus").css("background-color", "red");
        $("#routinestatus").css("color", "white");
      } else {
        if (routine_order[boxx3]>routine_order[boxx4]) {
          $("#routinestatus").text("Try again! \n You might want to use "+boxx4+" before "+boxx3+"!");
          $("#routinestatus").css("background-color", "red");
          $("#routinestatus").css("color", "white");
        } else {
          if (routine_order[boxx4]>routine_order[boxx5]) {
            $("#routinestatus").text("Try again! \n You might want to use "+boxx5+" before "+boxx4+"!");
            $("#routinestatus").css("background-color", "red");
            $("#routinestatus").css("color", "white");
          } else {
          $("#routinestatus").text("Good Job! Your routine seems good");
          $("#routinestatus").css("background-color", "lightgreen");
          $("#routinestatus").css("color", "white");
          $(".finish").prop("disabled", false);

          fetch("/save-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          })
          .then(res => res.json())
          .then(data => console.log("Progress saved:", data));
      }
    }
  }
}
}
}

// QUIZ
const path = window.location.pathname.replace(/\/$/, ''); // Remove trailing slash if any
const quizId = path.split('/').pop(); // Get last part

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const blanks = [document.getElementById('blank1'), document.getElementById('blank2'), document.getElementById('blank3')];
const resultMsg = document.getElementById('result-msg');
const nextBtn = document.getElementById('nextBtn');

// This should be injected from Flask/Jinja in quiz1.html
const quizState = window.quizState || {};

// Quiz 1 ques1 functionality

if (window.location.pathname.includes("/quiz1/q1")) {

  let selectedAnswers = [];

  // 🔁 Restore previous quiz state (if exists)
  if (quizState.answered) {
    selectedAnswers = quizState.user_answer || [];

    // ✅ Re-check the previously selected answers
    checkboxes.forEach(cb => {
      if (selectedAnswers.includes(cb.value)) {
        cb.checked = true;
        cb.disabled = true;
      }
    });

    // ✅ Reset Fill the blanks
    blanks.forEach((b, i) => b.textContent = selectedAnswers[i] || '___');

    // ✅ Show result message
    resultMsg.textContent = quizState.is_correct ? "🎉 Good job!" : "That’s not correct.";
    resultMsg.style.display = "block";
    resultMsg.style.color = quizState.is_correct ? "green" : "red";
    resultMsg.classList.add(quizState.is_correct ? "correct-message" : "wrong-message");

    // ✅ Show next button
    nextBtn.style.display = "inline-block";

    // ✅ Fire confetti if already correct
    if (quizState.is_correct && typeof confetti === "function") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  // 🔁 Add new selection handling
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      selectedAnswers = Array.from(checkboxes)
        .filter(c => c.checked)
        .map(c => c.value);

      blanks.forEach((b, i) => b.textContent = selectedAnswers[i] || '___');

      if (selectedAnswers.length === 3) {
        // Lock checkboxes
        checkboxes.forEach(cb => cb.disabled = true);

        // Send to backend
        fetch(`/submit-quiz/1`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ answer: selectedAnswers })
        })
        .then(res => res.json())
        .then(data => {
          resultMsg.textContent = data.correct ? "🎉 Good job!" : "That’s not correct.";
          resultMsg.style.display = "block";
          resultMsg.style.color = data.correct ? "green" : "red";

          resultMsg.classList.remove("correct-message", "wrong-message");
          resultMsg.classList.add(data.correct ? "correct-message" : "wrong-message");

          // 🎊 Confetti on correct answer
          if (data.correct && typeof confetti === "function") {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 }
            });
          }

          nextBtn.style.display = "inline-block";
          checkboxes.forEach(cb => cb.disabled = true);
        });
      }
    });
  });
}


// Quiz 1 ques 2 Functionality
else if (window.location.pathname.includes("/quiz1/q2")) {
  const radioButtons = document.querySelectorAll('input[name="product"]');

  // 🔁 Restore previous quiz state (if exists)
  if (quizState.answered) {
    const selected = quizState.user_answer?.[0]; // Radio buttons only have one answer
    const selectedRadio = [...radioButtons].find(r => r.value === selected);
    if (selectedRadio) {
      selectedRadio.checked = true;
      selectedRadio.disabled = true;
      selectedRadio.closest('.image-option').classList.add('selected');
    }

    // ✅ Disable all radio buttons if answered
    radioButtons.forEach(r => r.disabled = true);

    resultMsg.textContent = quizState.is_correct ? "Answer is right!" : "Answer is wrong!";
    resultMsg.style.display = "block";
    resultMsg.style.color = quizState.is_correct ? "green" : "red";
    resultMsg.classList.add(quizState.is_correct ? "correct-message" : "wrong-message");

    if (quizState.is_correct) {
      nextBtn.style.display = "inline-block";
    } else {
      tryAgainBtn.style.display = "inline-block";
    }
  }

  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.image-option').forEach(el => el.classList.remove('selected'));
      radio.closest('.image-option').classList.add('selected');
      const selected = radio.value;

      fetch(`/submit-quiz/2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: [selected] })
      })
      .then(res => res.json())
.then(data => {
  resultMsg.textContent = data.correct ? "Good job!" : "That’s not correct.";
  resultMsg.style.display = "block";
  resultMsg.style.color = data.correct ? "green" : "red";

  resultMsg.classList.remove("correct-message", "wrong-message");

  if (data.correct) {
    resultMsg.classList.add("correct-message");

    // 🎉 Trigger confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  } else {
    resultMsg.classList.add("wrong-message");
  }

  // ✅ Always show Next button
  nextBtn.style.display = "inline-block";

  // ✅ Lock all options
  checkboxes.forEach(cb => cb.disabled = true);
});

    });
  });
}

// Quiz 2 ques2 Functionality
else if (window.location.pathname.includes("/quiz1/q2")) {

  const options = document.querySelectorAll('input[name="nourishQuiz"]');

  options.forEach(option => {
    option.addEventListener('change', () => {
      if (option.value === "B") {
        resultMsg.textContent = "✅ Correct! Great choice for dry, winter skin.";
        resultMsg.style.color = "green";
        tryAgainBtn.style.display = "none";
        nextBtn.style.display = "inline-block";
      } else {
        resultMsg.textContent = "❌ Oops! Try again.";
        resultMsg.style.color = "red";
        tryAgainBtn.style.display = "inline-block";
        nextBtn.style.display = "none";
      }
    });
  });

  
  // const radioButtons = document.querySelectorAll('input[name="product"]');

  // // 🔁 Restore previous quiz state (if exists)
  // if (quizState.answered) {
  //   const selected = quizState.user_answer?.[0]; // Radio buttons only have one answer
  //   const selectedRadio = [...radioButtons].find(r => r.value === selected);
  //   if (selectedRadio) {
  //     selectedRadio.checked = true;
  //     selectedRadio.disabled = true;
  //     selectedRadio.closest('.image-option').classList.add('selected');
  //   }

  //   // ✅ Disable all radio buttons if answered
  //   radioButtons.forEach(r => r.disabled = true);

  //   resultMsg.textContent = quizState.is_correct ? "Answer is right!" : "Answer is wrong!";
  //   resultMsg.style.display = "block";
  //   resultMsg.style.color = quizState.is_correct ? "green" : "red";
  //   resultMsg.classList.add(quizState.is_correct ? "correct-message" : "wrong-message");

  //   if (quizState.is_correct) {
  //     nextBtn.style.display = "inline-block";
  //   } else {
  //     tryAgainBtn.style.display = "inline-block";
  //   }
  // }

  // radioButtons.forEach(radio => {
  //   radio.addEventListener('change', () => {
  //     document.querySelectorAll('.image-option').forEach(el => el.classList.remove('selected'));
  //     radio.closest('.image-option').classList.add('selected');
  //     const selected = radio.value;

  //     fetch(`/submit-quiz/2`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ answer: [selected] })
  //     })
  //     .then(res => res.json())
  //     .then(data => {
  //       resultMsg.textContent = data.message;
  //       resultMsg.style.display = "block";
  //       resultMsg.style.color = data.correct ? "green" : "red";

  //       resultMsg.classList.remove("correct-message", "wrong-message");
  //       if (data.correct) {
  //         resultMsg.classList.add("correct-message");
  //         nextBtn.style.display = "inline-block";
  //         tryAgainBtn.style.display = "none";
  //       } else {
  //         resultMsg.classList.add("wrong-message");
  //         tryAgainBtn.style.display = "inline-block";
  //         nextBtn.style.display = "none";
  //       }

  //       radioButtons.forEach(r => r.disabled = true);

  //     });
  //   });
  // });
}



function goToNext() {
  const path = window.location.pathname;

  // If in the LEARN section
  if (path.startsWith("/learn")) {
    const currentStepName = Object.keys(routine_order)[currentIndex];

    // Go to next learn step
    if (currentIndex < routineData.length - 1) {
      currentIndex++;
      maxUnlockedStep = Math.max(maxUnlockedStep, currentIndex);
      updateContent(currentIndex);
      history.pushState(null, "", `/learn/${Object.keys(routine_order)[currentIndex]}`);
    }

    // If it's the last step, mark as complete
    if (currentIndex === routineData.length - 1) {
      sessionStorage.setItem('learnCompleted', true);
    }

    // Move to quiz after 'essence'
    if (currentStepName === "essence") {
      window.location.href = "/quiz1/q1";
      return;
    }
    // Move to quiz after 'moisturizer'
    if (currentStepName === "moisturizer") {
      window.location.href = "/quiz2/q1";
      return;
    }
    // Move to quiz after 'sunscreen'
    if (currentStepName === "sunscreen") {
      window.location.href = "/quiz3/q1";
      return;
    }
  }

  // If in QUIZ section
  else if (path.includes("/quiz1/q1")) {
    window.location.href = "/quiz1/q2";
  } else if (path.includes("/quiz1/q2")) {
    maxUnlockedStep = Math.max(maxUnlockedStep, currentIndex);
    sessionStorage.setItem("currentIndex", 3);
    history.pushState(currentIndex=3, "", "/learn/serum");
    window.location.href = "/learn/serum";
  }
  else if (path.includes("/quiz2/q1")) {
    window.location.href = "/quiz2/q2";
  } else if (path.includes("/quiz2/q2")) {
    maxUnlockedStep = Math.max(maxUnlockedStep, currentIndex);
    sessionStorage.setItem("currentIndex", 7);
    history.pushState(currentIndex=7, "", "/learn/sunscreen");
    window.location.href = "/learn/sunscreen";
  }
  else if (path.includes("/quiz3/q1")) {
    window.location.href = "/final-quiz/q1";
  }
  else if (path.includes("/final-quiz/q1")) {
    window.location.href = "/final-quiz/q2";
  }
}


// Adding images 
document.addEventListener("DOMContentLoaded", () => {
  fetch("/data")
    .then(res => res.json())
    .then(data => {
      const steps = document.querySelectorAll(".step");
      const img = document.getElementById("step-img");
      const title = document.getElementById("step-title");
      const desc = document.getElementById("step-description");
      const benefit = document.getElementById("step-benefit");

      // ✨ Load first step (Cleanser) by default
      const firstProduct = data.routine_steps[0];
      if (firstProduct) {
        img.src = `/static/${firstProduct.image}`;
        title.textContent = firstProduct.step;
        desc.textContent = firstProduct.description;
        benefit.textContent = firstProduct.benefit;
        // steps[0].classList.add("active");
      }

      // 💡 Set up click handler for each sidebar step
      steps.forEach((step, i) => {
        step.addEventListener("click", () => {
          steps.forEach(s => s.classList.remove("active"));
          step.classList.add("active");

          const rawText = step.textContent.trim();
          const stepName = rawText.substring(rawText.indexOf(".") + 1).trim();
          const product = data.routine_steps.find(p => p.step === stepName);
          if (product) {
            img.src = `/static/${product.image}`;
            title.textContent = product.step;
            desc.textContent = product.description;
            benefit.textContent = product.benefit;
          }
        });
      });

      currentIndex=sessionStorage.getItem("currentIndex");
      updateContent(currentIndex);
    });
});

//skin type

function backskin1(event) {
window.location.href = '/skin-type/1';

$("input[type='radio'][name='skintype1'][value='3']").prop("checked", true);

}

function submitskin1(event) {
  event.preventDefault();

  const form = document.getElementById('skin-type-form1');
  const formData = new FormData(form);

  let skintype1 = formData.get('skintype1');
  if (skintype1==null) {
    alert("Please select an option!");
  } else {
    sessionStorage.setItem('skintype1', skintype1);
    window.location.href = '/skin-type/2';
  }
}

function submitskin2(event) {
  event.preventDefault();

  const form = document.getElementById('skin-type-form2');
  const formData = new FormData(form);

  let skintype2 = formData.get('skintype2');

  if (skintype2==null) {
    alert("Please select an option!");
  } else {
  sessionStorage.setItem('skintype2', skintype2);
  window.location.href = '/skin-type/3';
  }
}

function handleForm(event) {
  event.preventDefault();

  const form = document.getElementById('skin-type-form3');
  const formData = new FormData(form);

  let skintype3 = formData.get('skintype3');

  if (skintype3==null) {
    alert("Please select an option!");
  } else {
  let skintype1 = sessionStorage.getItem('skintype1');
  let skintype2 = sessionStorage.getItem('skintype2');

  let skintype = 'normal';

  if (skintype1 === '1') {
      skintype = "oily";
  }

  if (skintype1 === '3') {
    if (skintype3 === '3') {
      skintype = "dry";
    } else if (skintype3 === '2'){
      skintype = "normal";
    }
  }
  if (skintype3 === '3') {
    if (skintype2 === '2') {
      skintype = "combination";
    } else if (skintype2 === '3'){
      skintype = "oily";
    }
  }

  sessionStorage.setItem('skintype', skintype);

  fetch("/save-skintype", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({ skinType: [skintype] })  // Send it along
  })
  .then(response => response.json())
  .then(data => {
    console.log("Progress saved:", data);
    // After successful save, navigate
      window.location.href = '/skin-type/result';  // Move to results page
      sessionStorage.setItem('skinTypeCompleted', true);
  })
  .catch(error => {
    console.error("Error saving progress:", error);
  });
}
}


$(window).on('load', function() {
  const skinType = sessionStorage.getItem('skintype');
  if (skinType) {
    $("#skintyperesult").text(skinType);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  // Home page buttons
  const btnIdentify = document.getElementById('identify-skintype');
  const btnLearn = document.getElementById('start-learning');
  const btnBuild = document.getElementById('build-routine');

  const buildRoutineBtn = document.getElementById('buildroutine');

  if (buildRoutineBtn) {
    buildRoutineBtn.addEventListener('click', function() {
      sessionStorage.setItem('quizCompleted', 'true');
      console.log('quizCompleted set to true');
    });
  }

  function updateNavLocks() {
    navLinks.forEach(link => {
      const linkText = link.textContent.trim();

      if (linkText === 'Learn') {
        const skinTypeCompleted = sessionStorage.getItem('skinTypeCompleted');
        if (!skinTypeCompleted) {
          disableLink(link);
        } else {
          enableLink(link);
        }
      }

      if (linkText === 'Quiz') {
        const learnCompleted = sessionStorage.getItem('learnCompleted');
        if (!learnCompleted) {
          disableLink(link);
        } else {
          enableLink(link);
        }
      }

      if (linkText === 'Routine') {
        const quizCompleted = sessionStorage.getItem('quizCompleted');
        if (!quizCompleted) {
          disableLink(link);
        } else {
          enableLink(link);
        }
      }
    });
    // ------ Update Home Page Buttons ------
    if (btnIdentify) {
      btnIdentify.disabled = false; // Always enabled
    }
    if (btnLearn) {
      const skinTypeCompleted = sessionStorage.getItem('skinTypeCompleted');
      if (!skinTypeCompleted) {
        disableLink(btnLearn);
      } else {
        enableLink(btnLearn);
      }
      // btnLearn.disabled = !skinTypeCompleted;
      // btnLearn.disabled = true;
    }
    if (btnBuild) {
      const quizCompleted = sessionStorage.getItem('quizCompleted');
        if (!quizCompleted) {
          disableLink(btnBuild);
        } else {
          enableLink(btnBuild);
        }
      // btnBuild.disabled = !quizCompleted;
      // btnBuild.disabled = true;
    }
  }

  function disableLink(link) {
    link.classList.add('disabled');
    link.style.pointerEvents = 'none';
    if (link !== btnBuild && link !== btnLearn) {
      link.style.opacity = 0.5;
    }
    else{
      link.style.opacity = 0.3;
      // link.background-color = '#4b464b37';
    }
  }

  function enableLink(link) {
    link.classList.remove('disabled');
    link.style.pointerEvents = 'auto';
    link.style.opacity = 1;
  }

  updateNavLocks();
});