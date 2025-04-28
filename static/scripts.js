const steps = document.querySelectorAll(".step");
const content = document.getElementById("content");
let currentIndex = 0;
let maxUnlockedStep = 0;
let routineData = [];

const routine_order = {"cleanser":0, "toner":1, "essence":2, "serum":3, "eye-cream":4, "spot-treatment":5, "moisturizer":6, "sunscreen":7};

function updateContent(index) {
  const { step, description, benefit, image } = routineData[index];
  const prevButton = index > 0 ? `<button id="prevStep" style="margin-top: 40px; float: left; color: #d835a4; background: none; border: none; font-weight: bold; cursor: pointer;">← PREVIOUS STEP</button>` : "";
  const nextButton = index === routineData.length - 1
    ? '<button id="nextStep" style="margin-top: 40px; float: right; color: #d835a4; background: none; border: none; font-weight: bold; cursor: pointer;"><a href="/quiz/1">QUIZ → </a></button>'
    : '<button id="nextStep" style="margin-top: 40px; float: right; color: #d835a4; background: none; border: none; font-weight: bold; cursor: pointer;">NEXT STEP →</button>';

  content.innerHTML = `
    <div class="step-content">
      <div class="step-image">
        <img id="step-img" src="/static/${image}" alt="Step Image" />
      </div>
      <div class="step-text">
        <h2 id="step-title">${step}</h2>
        <p id="step-description">${description}</p>
        <h4>What it does</h4>
        <p id="step-benefit">${benefit}</p>
        ${prevButton}${nextButton}
      </div>
    </div>
  `;

  document.querySelector(".step.active")?.classList.remove("active");
  steps[index].classList.add("active");
  attachNextHandler();
  updateStepStates();
}

function attachNextHandler() {
  const nextBtn = document.getElementById("nextStep");
  const prevBtn = document.getElementById("prevStep");
  
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentIndex < routineData.length - 1) {
        currentIndex++;
        maxUnlockedStep = Math.max(maxUnlockedStep, currentIndex);
        updateContent(currentIndex);
        history.pushState(null, "", `/learn/${Object.keys(routine_order)[currentIndex]}`);
      }
    });
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

fetch("/data")
  .then(res => res.json())
  .then(data => {
    routineData = data.routine_steps;

    // Find the index based on the product name from URL  
    if (initialProduct && routine_order.hasOwnProperty(initialProduct)) {
      currentIndex = routine_order[initialProduct];
      maxUnlockedStep = currentIndex; // 🛟 Important: lock steps after this
    } else {
      currentIndex = 0;
      maxUnlockedStep = 0;
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


// ROUTINE 

// Initial binding for first page load
attachNextHandler();

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

// Quiz 1 functionality
const path = window.location.pathname.replace(/\/$/, ''); // Remove trailing slash if any
const quizId = path.split('/').pop(); // Get last part

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const blanks = [document.getElementById('blank1'), document.getElementById('blank2'), document.getElementById('blank3')];
const resultMsg = document.getElementById('result-msg');
const radioButtons = document.querySelectorAll('input[name="product"]');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const nextBtn = document.getElementById('nextBtn');

// This should be injected from Flask/Jinja in quiz1.html
const quizState = window.quizState || {};

if (quizId === "1") {
  
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
      resultMsg.textContent = quizState.is_correct ? "Answer is right!" : "Answer is wrong!";
      resultMsg.style.display = "block";
      resultMsg.style.color = quizState.is_correct ? "green" : "red";
      resultMsg.classList.add(quizState.is_correct ? "correct-message" : "wrong-message");

      // ✅ Toggle next/try again buttons
      if (quizState.is_correct) {
        nextBtn.style.display = "inline-block";
       tryAgainBtn.style.display = "none";
      } else {
        tryAgainBtn.style.display = "inline-block";
        nextBtn.style.display = "none";
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
        fetch(`/submit-quiz/${quizId}`, {
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

// Quiz 2 Functionality
else if (quizId === "2") {
  const radioButtons = document.querySelectorAll('input[name="product"]');
  const resultMsg = document.getElementById('result-msg');
  const tryAgainBtn = document.getElementById('tryAgainBtn');
  const nextBtn = document.getElementById('nextBtn');

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
        resultMsg.textContent = data.message;
        resultMsg.style.display = "block";
        resultMsg.style.color = data.correct ? "green" : "red";

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

        radioButtons.forEach(r => r.disabled = true);

      });
    });
  });
}

function resetQuiz() {
  if (quizId === "1") {
    selectedWords = [];
    checkboxes.forEach((box) => (box.checked = false, box.disabled = false));
    blanks.forEach((blank) => (blank.textContent = "___"));
    resultMsg.style.display = "none";
    tryAgainBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
  else if(quizId === "2"){    
    radioButtons.forEach(r => {r.checked = false; r.disabled = false;});
    document.querySelectorAll('.image-option').forEach(el => el.classList.remove('selected'));
    resultMsg.textContent = "";
    resultMsg.style.display = "none";
    tryAgainBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
}

function goToNext() {
  // Redirect to next quiz page or logic
  if (quizId === "1") {
    // saveTimestamp("quiz1_complete");
    window.location.href = "/quiz/2";
  }
  else if (quizId === "2") {
    // saveTimestamp("quiz2_complete");
    window.location.href = "/final-quiz";
    // quiz-result
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
        steps[0].classList.add("active");
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
    });
});

//skin type


function handleForm(event) {

  event.preventDefault();
  const form = document.getElementById('skin-type-form');
  const formData = new FormData(form);

  let bare = formData.get('bare');
  let blot = formData.get('blot');

  sessionStorage.setItem('blot', blot);

  if (bare && blot) {

    // save variable 'blot' to userdata.json as 'skin_type'

    window.location.href ='/skin-type/result';
  }
};

$(window).on('load', function() {
  $("#skintyperesult").text(sessionStorage.getItem('blot'));
  alert(blot);
});