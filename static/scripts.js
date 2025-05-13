const steps = document.querySelectorAll(".step");
const content = document.getElementById("content");
const storedIndex = sessionStorage.getItem("currentIndex");
if (storedIndex !== null) {
  currentIndex = parseInt(storedIndex);
} else {
  currentIndex = 0; // First visit: initialize to 0
  sessionStorage.setItem("currentIndex", currentIndex);
}

const storedMaxStep = sessionStorage.getItem("maxUnlockedStep");
if (storedMaxStep !== null) {
  maxUnlockedStep = parseInt(storedMaxStep);
} else {
  maxUnlockedStep = 0; // First visit: initialize to 0
  sessionStorage.setItem("maxUnlockedStep", maxUnlockedStep);
}
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

    const urlParams = new URLSearchParams(window.location.search);
    const initialProduct = urlParams.get('start');

if (initialProduct && routine_order.hasOwnProperty(initialProduct)) {
  currentIndex = routine_order[initialProduct];
} else {
  currentIndex = 0;
}


    maxUnlockedStep = Math.max(maxUnlockedStep, currentIndex);;
    sessionStorage.setItem("maxUnlockedStep", maxUnlockedStep);
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
    if (ingredient.good_for.map(s => s.toLowerCase()).includes(userSkinType.toLowerCase())) {
      learnMoreContent += `
        <h5>${ingredient.name} (${ingredient.percentage})</h5>
        <p><strong>Why Needed:</strong> ${ingredient.why_needed}</p>
        <p><strong>Caution:</strong> ${ingredient.caution}</p>`;
    }
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

  function makeDraggable($el) {
    $el.draggable({
      revert: "invalid",
      containment: "body",
      stack: ".product-images",
      start: function () {
        var previousDrop = $(this).data("droppedOn");
        if (previousDrop) {
            $("#"+previousDrop).droppable('enable');
            $("#"+previousDrop).removeClass("ondrop");
            sessionStorage.setItem(previousDrop,'');

        }
        // Remove transform to avoid jump on next drag
        $(this).css("transform", "");
      }
    });
  }
  for (let element in routine_order) {
    
    $("#"+element).draggable({
      revert: function(dropped) {
        return !dropped; 
      },
      start: function(event, ui) {
        var previousDrop = $(this).data("droppedOn");
        if (previousDrop) {
            $("#"+previousDrop).droppable('enable');
            $("#"+previousDrop).removeClass("ondrop");
            sessionStorage.setItem(previousDrop,'');

        }
        $(this).css("transform", "");
    }
    });
  }


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

        if (previousDrop) {
          if (previousDrop.startsWith('product')) {
            console.log(previousDrop+"inside product");
            $("#"+previousDrop).droppable("enable");
          }
        }

        if (previousDrop==='box1') {
          box1='';
          sessionStorage.setItem('box1','');
          $("#box1").removeClass("ondrop")
          $("#box1").droppable("enable");
        } else if (previousDrop==='box2') {
          box2='';
          sessionStorage.setItem('box2','');
          $("#box2").removeClass("ondrop")
          $("#box2").droppable("enable");
        } else if (previousDrop==='box3') {
          box3='';
          sessionStorage.setItem('box3','');
          $("#box3").removeClass("ondrop")
          $("#box3").droppable("enable");
        } else if (previousDrop==='boxx1') {
          boxx1='';
          sessionStorage.setItem('boxx1','');
          $("#boxx1").removeClass("ondrop")
          $("#boxx1").droppable("enable");
        } else if (previousDrop==='boxx2') {
          boxx2='';
          sessionStorage.setItem('boxx2','');
          $("#boxx2").removeClass("ondrop")
          $("#boxx2").droppable("enable");
        } else if (previousDrop==='boxx3') {
          boxx3='';
          sessionStorage.setItem('boxx3','');
          $("#boxx3").removeClass("ondrop")
          $("#boxx3").droppable("enable");
        } else if (previousDrop==='boxx4') {
          boxx4='';
          sessionStorage.setItem('boxx4','');
          $("#boxx4").removeClass("ondrop")
          $("#boxx4").droppable("enable");
        } else if (previousDrop==='boxx5') {
          boxx5='';
          sessionStorage.setItem('boxx5','');
          $("#boxx5").removeClass("ondrop")
          $("#boxx5").droppable("enable");
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
        .addClass("ondrop")
        .droppable("disable")

        box1 = ui.draggable.attr("id");
        var previousDrop = ui.helper.data("droppedOn");

        if (previousDrop) {
          if (previousDrop.startsWith('product')) {
            $("#"+previousDrop).droppable("enable");
          }
        }


        if (box1===box2) {
          box2='';
          sessionStorage.setItem('box2','');
          $("#box2").droppable("enable");
          $("#box2").removeClass("ondrop")
        } else if (box1===box3) {
          box3='';
          sessionStorage.setItem('box3','');
          $("#box3").droppable("enable");
          $("#box3").removeClass("ondrop")
        } 

        ui.helper.data("droppedOn", $(this).attr("id"));

        const $box = $(this);
      const $item = ui.draggable;

      // Move into the box
      $item.appendTo($box);

      // Center inside the box
      const boxWidth = $box.width();
      const boxHeight = $box.height();
      const itemWidth = $item.outerWidth();
      const itemHeight = $item.outerHeight();

      $item.css({
        position: "absolute",
        left: (boxWidth - itemWidth) / 2 + "px",
        top: (boxHeight - itemHeight) / 2 + "px"
      });

      // Reinitialize draggable after drop
      makeDraggable($item);

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
        .addClass("ondrop")

        box2 = ui.draggable.attr("id");
        var previousDrop = ui.helper.data("droppedOn");

        if (previousDrop) {
          if (previousDrop.startsWith('product')) {
            $("#"+previousDrop).droppable("enable");
          }
        }

        if (box1===box2) {
          box1='';
          sessionStorage.setItem('box1','');
          $("#box1").droppable("enable");
          $("#box1").removeClass("ondrop")
        } else if (box2===box3) {
          box3='';
          sessionStorage.setItem('box3','');
          $("#box3").droppable("enable");
          $("#box3").removeClass("ondrop")
        }

        ui.helper.data("droppedOn", $(this).attr("id"));  

        const $box = $(this);
        const $item = ui.draggable;
  
        // Move into the box
        $item.appendTo($box);
  
        // Center inside the box
        const boxWidth = $box.width();
        const boxHeight = $box.height();
        const itemWidth = $item.outerWidth();
        const itemHeight = $item.outerHeight();
  
        $item.css({
          position: "absolute",
          left: (boxWidth - itemWidth) / 2 + "px",
          top: (boxHeight - itemHeight) / 2 + "px"
        });
  
        // Reinitialize draggable after drop
        makeDraggable($item);
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
        .addClass("ondrop")

        box3 = ui.draggable.attr("id");
        var previousDrop = ui.helper.data("droppedOn");

        if (previousDrop) {
          if (previousDrop.startsWith('product')) {
            $("#"+previousDrop).droppable("enable");
          }
        }

        if (box3===box1) {
          box1='';
          sessionStorage.setItem('box1','');
          $("#box1").droppable("enable");
          $("#box1").removeClass("ondrop")
        } else if (box2===box3) {
          box2='';
          sessionStorage.setItem('box2','');
          $("#box2").droppable("enable");
          $("#box2").removeClass("ondrop")
        }
        ui.helper.data("droppedOn", $(this).attr("id")); 

        const $box = $(this);
        const $item = ui.draggable;
  
        // Move into the box
        $item.appendTo($box);
  
        // Center inside the box
        const boxWidth = $box.width();
        const boxHeight = $box.height();
        const itemWidth = $item.outerWidth();
        const itemHeight = $item.outerHeight();
  
        $item.css({
          position: "absolute",
          left: (boxWidth - itemWidth) / 2 + "px",
          top: (boxHeight - itemHeight) / 2 + "px"
        });
  
        // Reinitialize draggable after drop
        makeDraggable($item);
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
        .addClass("ondrop")
        .droppable("disable")

        boxx1 = ui.draggable.attr("id");
        var previousDrop = ui.helper.data("droppedOn");

        if (previousDrop) {
          if (previousDrop.startsWith('product')) {
            $("#"+previousDrop).droppable("enable");
          }
        }

        if (boxx1===boxx2) {
          boxx2='';
          sessionStorage.setItem('boxx2','');
          $("#boxx2").droppable("enable");
          $("#boxx2").removeClass("ondrop")
        } else if (boxx1===boxx3) {
          boxx3='';
          sessionStorage.setItem('boxx3','');
          $("#boxx3").droppable("enable");
          $("#boxx3").removeClass("ondrop")
        } else if (boxx1===boxx4) {
          boxx4='';
          sessionStorage.setItem('boxx4','');
          $("#boxx4").droppable("enable");
          $("#boxx4").removeClass("ondrop")
        } else if (boxx1===boxx5) {
          boxx5='';
          sessionStorage.setItem('boxx5','');
          $("#boxx5").droppable("enable");
          $("#boxx5").removeClass("ondrop")
        }

        ui.helper.data("droppedOn", $(this).attr("id")); 

        const $box = $(this);
        const $item = ui.draggable;
  
        // Move into the box
        $item.appendTo($box);
  
        // Center inside the box
        const boxWidth = $box.width();
        const boxHeight = $box.height();
        const itemWidth = $item.outerWidth();
        const itemHeight = $item.outerHeight();
  
        $item.css({
          position: "absolute",
          left: (boxWidth - itemWidth) / 2 + "px",
          top: (boxHeight - itemHeight) / 2 + "px"
        });
  
        // Reinitialize draggable after drop
        makeDraggable($item);
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
        .addClass("ondrop")
        .droppable("disable")

        boxx2 = ui.draggable.attr("id");
        var previousDrop = ui.helper.data("droppedOn");

        if (previousDrop) {
          if (previousDrop.startsWith('product')) {
            $("#"+previousDrop).droppable("enable");
          }
        }

        if (boxx1===boxx2) {
          boxx1='';
          sessionStorage.setItem('boxx1','');
          $("#boxx1").droppable("enable");
          $("#boxx1").removeClass("ondrop")
        } else if (boxx2===boxx3) {
          boxx3='';
          sessionStorage.setItem('boxx3','');
          $("#boxx3").droppable("enable");
          $("#boxx3").removeClass("ondrop")
        } else if (boxx2===boxx4) {
          boxx4='';
          sessionStorage.setItem('boxx4','');
          $("#boxx4").droppable("enable");
          $("#boxx4").removeClass("ondrop")
        } else if (boxx2===boxx5) {
          boxx5='';
          sessionStorage.setItem('boxx5','');
          $("#boxx5").droppable("enable");
          $("#boxx5").removeClass("ondrop")
        }

        ui.helper.data("droppedOn", $(this).attr("id"));  

        const $box = $(this);
        const $item = ui.draggable;
  
        // Move into the box
        $item.appendTo($box);
  
        // Center inside the box
        const boxWidth = $box.width();
        const boxHeight = $box.height();
        const itemWidth = $item.outerWidth();
        const itemHeight = $item.outerHeight();
  
        $item.css({
          position: "absolute",
          left: (boxWidth - itemWidth) / 2 + "px",
          top: (boxHeight - itemHeight) / 2 + "px"
        });
  
        // Reinitialize draggable after drop
        makeDraggable($item);
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
        .addClass("ondrop")
        .droppable("disable")

        boxx3 = ui.draggable.attr("id");
        var previousDrop = ui.helper.data("droppedOn");

        if (previousDrop) {
          if (previousDrop.startsWith('product')) {
            $("#"+previousDrop).droppable("enable");
          }
        }

        if (boxx1===boxx3) {
          boxx1='';
          sessionStorage.setItem('boxx1','');
          $("#boxx1").droppable("enable");
          $("#boxx1").removeClass("ondrop")
        } else if (boxx2===boxx3) {
          boxx2='';
          sessionStorage.setItem('boxx2','');
          $("#boxx2").droppable("enable");
          $("#boxx2").removeClass("ondrop")
        } else if (boxx3===boxx4) {
          boxx4='';
          sessionStorage.setItem('boxx4','');
          $("#boxx4").droppable("enable");
          $("#boxx4").removeClass("ondrop")
        } else if (boxx3===boxx5) {
          boxx5='';
          sessionStorage.setItem('boxx5','');
          $("#boxx5").droppable("enable");
          $("#boxx5").removeClass("ondrop")
        }
        ui.helper.data("droppedOn", $(this).attr("id")); 

        const $box = $(this);
        const $item = ui.draggable;
  
        // Move into the box
        $item.appendTo($box);
  
        // Center inside the box
        const boxWidth = $box.width();
        const boxHeight = $box.height();
        const itemWidth = $item.outerWidth();
        const itemHeight = $item.outerHeight();
  
        $item.css({
          position: "absolute",
          left: (boxWidth - itemWidth) / 2 + "px",
          top: (boxHeight - itemHeight) / 2 + "px"
        });
  
        // Reinitialize draggable after drop
        makeDraggable($item);
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
        .addClass("ondrop")
        .droppable("disable")

        boxx4 = ui.draggable.attr("id");
        var previousDrop = ui.helper.data("droppedOn");

        if (previousDrop) {
          if (previousDrop.startsWith('product')) {
            $("#"+previousDrop).droppable("enable");
          }
        }

        if (boxx1===boxx4) {
          boxx1='';
          sessionStorage.setItem('boxx1','');
          $("#boxx1").droppable("enable");
          $("#boxx1").removeClass("ondrop")
        } else if (boxx2===boxx4) {
          boxx2='';
          sessionStorage.setItem('boxx2','');
          $("#boxx2").droppable("enable");
          $("#boxx2").removeClass("ondrop")
        } else if (boxx3===boxx4) {
          boxx3='';
          sessionStorage.setItem('boxx3','');
          $("#boxx3").droppable("enable");
          $("#boxx3").removeClass("ondrop")
        } else if (boxx4===boxx5) {
          boxx5='';
          sessionStorage.setItem('boxx5','');
          $("#boxx5").droppable("enable");
          $("#boxx5").removeClass("ondrop")
        }

        ui.helper.data("droppedOn", $(this).attr("id"));  

        const $box = $(this);
        const $item = ui.draggable;
  
        // Move into the box
        $item.appendTo($box);
  
        // Center inside the box
        const boxWidth = $box.width();
        const boxHeight = $box.height();
        const itemWidth = $item.outerWidth();
        const itemHeight = $item.outerHeight();
  
        $item.css({
          position: "absolute",
          left: (boxWidth - itemWidth) / 2 + "px",
          top: (boxHeight - itemHeight) / 2 + "px"
        });
  
        // Reinitialize draggable after drop
        makeDraggable($item);
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
        .addClass("ondrop")
        .droppable("disable")

        boxx5 = ui.draggable.attr("id");
        var previousDrop = ui.helper.data("droppedOn");

        if (previousDrop) {
          if (previousDrop.startsWith('product')) {
            $("#"+previousDrop).droppable("enable");
          }
        }

        if (boxx1===boxx5) {
          boxx1='';
          sessionStorage.setItem('boxx1','');
          $("#boxx1").droppable("enable");
          $("#boxx1").removeClass("ondrop")
        } else if (boxx2===boxx5) {
          boxx2='';
          sessionStorage.setItem('boxx2','');
          $("#boxx2").droppable("enable");
          $("#boxx2").removeClass("ondrop")
        } else if (boxx3===boxx5) {
          boxx3='';
          sessionStorage.setItem('boxx3','');
          $("#boxx3").droppable("enable");
          $("#boxx3").removeClass("ondrop")
        } else if (boxx4===boxx5) {
          boxx4='';
          sessionStorage.setItem('boxx4','');
          $("#boxx4").droppable("enable");
          $("#boxx4").removeClass("ondrop")
        }

        ui.helper.data("droppedOn", $(this).attr("id"));  

        const $box = $(this);
        const $item = ui.draggable;
  
        // Move into the box
        $item.appendTo($box);
  
        // Center inside the box
        const boxWidth = $box.width();
        const boxHeight = $box.height();
        const itemWidth = $item.outerWidth();
        const itemHeight = $item.outerHeight();
  
        $item.css({
          position: "absolute",
          left: (boxWidth - itemWidth) / 2 + "px",
          top: (boxHeight - itemHeight) / 2 + "px"
        });
  
        // Reinitialize draggable after drop
        makeDraggable($item);
    }
  });

}
/*
sessionStorage.setItem('box1', '');
sessionStorage.setItem('box2', '');
sessionStorage.setItem('box3', '');
sessionStorage.setItem('boxx1', '');
sessionStorage.setItem('boxx2', '');
sessionStorage.setItem('boxx3', '');
sessionStorage.setItem('boxx4', '');
sessionStorage.setItem('boxx5', '');
*/
drag_drop();


function saveroutine() {
  box1 = sessionStorage.getItem('box1');
  box2 = sessionStorage.getItem('box2');
  box3 = sessionStorage.getItem('box3');
  
  if (box1 && box2 && box3) {
  
  if (box1!=='') {

    $box = "#box1";
    $item = "#"+box1;
    var fakeEvent = jQuery.Event("drop");
    var fakeUI = {
      draggable: $($item),
      helper: $($item),
      offset: $($item).offset(),
      position: $($item).position()
    };
    $($box).droppable("option", "drop").call($($box)[0], fakeEvent, fakeUI);
  }

  if (box2!=='') {
    $box = "#box2";
    $item = "#"+box2;
    var fakeEvent = jQuery.Event("drop");
    var fakeUI = {
      draggable: $($item),
      helper: $($item),
      offset: $($item).offset(),
      position: $($item).position()
    };
    $($box).droppable("option", "drop").call($($box)[0], fakeEvent, fakeUI);

  }
  if (box3!=='') {
    $box = "#box3";
    $item = "#"+box3;
    var fakeEvent = jQuery.Event("drop");
    var fakeUI = {
      draggable: $($item),
      helper: $($item),
      offset: $($item).offset(),
      position: $($item).position()
    };
    $($box).droppable("option", "drop").call($($box)[0], fakeEvent, fakeUI);

  }
  }
}

function saveroutine2() {
boxx1 = sessionStorage.getItem('boxx1');
  boxx2 = sessionStorage.getItem('boxx2');
  boxx3 = sessionStorage.getItem('boxx3');
  boxx4 = sessionStorage.getItem('boxx4');
  boxx5 = sessionStorage.getItem('boxx5');
  if (boxx1 && boxx2 && boxx3 && boxx4 && boxx5) {

  if (boxx1!=='') {
    $box = "#boxx1";
    $item = "#"+boxx1;
    var fakeEvent = jQuery.Event("drop");
    var fakeUI = {
      draggable: $($item),
      helper: $($item),
      offset: $($item).offset(),
      position: $($item).position()
    };
    $($box).droppable("option", "drop").call($($box)[0], fakeEvent, fakeUI);

  }
  if (boxx2!=='') {
    $box = "#boxx2";
    $item = "#"+boxx2;
    var fakeEvent = jQuery.Event("drop");
    var fakeUI = {
      draggable: $($item),
      helper: $($item),
      offset: $($item).offset(),
      position: $($item).position()
    };
    $($box).droppable("option", "drop").call($($box)[0], fakeEvent, fakeUI);

  }
  if (boxx3!=='') {
    $box = "#boxx3";
   $item = "#"+boxx3;
   var fakeEvent = jQuery.Event("drop");
   var fakeUI = {
     draggable: $($item),
     helper: $($item),
     offset: $($item).offset(),
     position: $($item).position()
   };
   $($box).droppable("option", "drop").call($($box)[0], fakeEvent, fakeUI);


  }
  if (boxx4!=='') {
    $box = "#boxx4";
    $item = "#"+boxx4;
    var fakeEvent = jQuery.Event("drop");
    var fakeUI = {
      draggable: $($item),
      helper: $($item),
      offset: $($item).offset(),
      position: $($item).position()
    };
    $($box).droppable("option", "drop").call($($box)[0], fakeEvent, fakeUI);


  }
  if (boxx5!=='') {
    $box = "#boxx5";
     $item = "#"+boxx5;
     var fakeEvent = jQuery.Event("drop");
     var fakeUI = {
       draggable: $($item),
       helper: $($item),
       offset: $($item).offset(),
       position: $($item).position()
     };
     $($box).droppable("option", "drop").call($($box)[0], fakeEvent, fakeUI);
  }
 }

}
saveroutine2();
saveroutine();

function reset3 () {
  sessionStorage.setItem('box1','');
  sessionStorage.setItem('box2','');
  sessionStorage.setItem('box3','');
  window.location.reload();
}

function reset5 () {
  sessionStorage.setItem('boxx1','');
  sessionStorage.setItem('boxx2','');
  sessionStorage.setItem('boxx3','');
  sessionStorage.setItem('boxx4','');
  sessionStorage.setItem('boxx5','');
  window.location.reload();
}

function eval() {
  $(".finish").prop("disabled", true);
  $("#routinestatus").text("");

  if (box1==='' && sessionStorage.getItem('box1')) {
      box1 = sessionStorage.getItem('box1');
      box2 = sessionStorage.getItem('box2');
      box3 = sessionStorage.getItem('box3');
  }
  if (!box1 || !box2 || !box3 || box1==="" || box2==="" || box3==="" ) {
    alert("Please fill all the steps!");
  } else {
    if (box1!=='cleanser') {
      $("#routinestatus").text("Try again! \n You might want to use the cleanser first!");
      $("#routinestatus").css("font-weight", "bold");
      $("#routinestatus").css("color", "red");
    } else {
      if (routine_order[box2]>routine_order[box3]) {
        $("#routinestatus").text("Try again! \n You might want to use "+box3+" before "+box2+"!");
        $("#routinestatus").css("font-weight", "bold");
      $("#routinestatus").css("color", "red");
      } else {
          $("#routinestatus").text("Good Job! Your routine seems good");
          $("#routinestatus").css("font-weight", "bold");
      $("#routinestatus").css("color", "green");
          $(".finish").prop("disabled", false);
          sessionStorage.setItem('box1', box1);
          sessionStorage.setItem('box2', box2);
          sessionStorage.setItem('box3', box3);

          fetch("/save-build-routine", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ routine_step: [box1, box2, box3] })  // Send it along
          })
          .then(response => response.json())
          .then(data => {
            console.log("3-step saved:", data);
          })
          .catch(error => {
            console.error("Error saving 3-step:", error);
          });

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

  if (boxx1==='' && sessionStorage.getItem('boxx1')) {
      boxx1 = sessionStorage.getItem('boxx1');
      boxx2 = sessionStorage.getItem('boxx2');
      boxx3 = sessionStorage.getItem('boxx3');
      boxx4 = sessionStorage.getItem('boxx4');
      boxx5 = sessionStorage.getItem('boxx5');
  }
  if (boxx1==="" || boxx2==="" || boxx3==="" || boxx4==="" || boxx5==="" || !boxx1 || !boxx2 || !boxx3 || !boxx4 || !boxx5) {
    alert("Please fill all the steps!");
  } else {
    if (boxx1!=='cleanser') {
      $("#routinestatus").text("Try again! \n You might want to use the cleanser first!");
      $("#routinestatus").css("font-weight", "bold");
      $("#routinestatus").css("color", "red");
    } else {
      if (routine_order[boxx2]>routine_order[boxx3]) {
        $("#routinestatus").text("Try again! \n You might want to use "+boxx3+" before "+boxx2+"!");
        $("#routinestatus").css("font-weight", "bold");
      $("#routinestatus").css("color", "red");
      } else {
        if (routine_order[boxx3]>routine_order[boxx4]) {
          $("#routinestatus").text("Try again! \n You might want to use "+boxx4+" before "+boxx3+"!");
          $("#routinestatus").css("font-weight", "bold");
      $("#routinestatus").css("color", "red");
        } else {
          if (routine_order[boxx4]>routine_order[boxx5]) {
            $("#routinestatus").text("Try again! \n You might want to use "+boxx5+" before "+boxx4+"!");
            $("#routinestatus").css("font-weight", "bold");
      $("#routinestatus").css("color", "red");
          } else {
          $("#routinestatus").text("Good Job! Your routine seems good");
          $("#routinestatus").css("font-weight", "bold");
      $("#routinestatus").css("color", "green");
          $(".finish").prop("disabled", false);

          sessionStorage.setItem('boxx1', boxx1);
          sessionStorage.setItem('boxx2', boxx2);
          sessionStorage.setItem('boxx3', boxx3);
          sessionStorage.setItem('boxx4', boxx4);
          sessionStorage.setItem('boxx5', boxx5);

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

  const submitBtn = document.getElementById('submitBtn');

  if (quizState.answered) {
    selectedAnswers = quizState.user_answer || [];
  
    // ✅ Restore and disable ALL checkboxes
    checkboxes.forEach(cb => {
      cb.checked = selectedAnswers.includes(cb.value);
      cb.disabled = true; // 🔒 Disable all checkboxes
    });
  
    // ✅ Restore the blanks
    blanks.forEach((b, i) => b.textContent = selectedAnswers[i] || '___');
  
    // ✅ Show result message
    resultMsg.textContent = quizState.is_correct ? "🎉 Good job!" : "That’s not correct.";
    resultMsg.style.display = "block";
    resultMsg.style.color = quizState.is_correct ? "green" : "red";
    resultMsg.classList.add(quizState.is_correct ? "correct-message" : "wrong-message");
  
    // ✅ Show next button
    nextBtn.style.display = "inline-block";
  
    // ✅ Confetti on correct
    if (quizState.is_correct && typeof confetti === "function") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  
    // ✅ Also disable the Submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.disabled = true;
  }
  

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      selectedAnswers = Array.from(checkboxes)
        .filter(c => c.checked)
        .map(c => c.value);

      blanks.forEach((b, i) => b.textContent = selectedAnswers[i] || '___');

      // Limit selection to 3
      if (selectedAnswers.length >= 3) {
        checkboxes.forEach(c => {
          if (!c.checked) c.disabled = true;
        });
      } else {
        checkboxes.forEach(c => c.disabled = false);
      }
    });
  });

  // ✅ Submission only on button click
  submitBtn.addEventListener('click', () => {
    if (selectedAnswers.length !== 3) {
      resultMsg.textContent = "Please select exactly 3 options.";
      resultMsg.style.display = "block";
      resultMsg.style.color = "orange";
      return;
    }

    fetch(`/submit-quiz/1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: selectedAnswers })
    })
    .then(res => res.json())
    .then(data => {
      resultMsg.textContent = data.correct ? "🎉 Good job!" : "That’s not correct.";
      resultMsg.style.display = "block";
      resultMsg.style.color = data.correct ? "green" : "red";

      resultMsg.classList.remove("correct-message", "wrong-message");
      resultMsg.classList.add(data.correct ? "correct-message" : "wrong-message");

      if (data.correct && typeof confetti === "function") {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      checkboxes.forEach(cb => cb.disabled = true);
      nextBtn.style.display = "inline-block";
    });
  });
}


// Quiz 1 ques 2 Functionality
else if (window.location.pathname.includes("/quiz1/q2")) {
  const radioButtons = document.querySelectorAll('input[name="product"]');
  const submitBtn = document.getElementById('submitBtn');
  let selected = null;

  // 🔁 Restore previous quiz state (if exists)
  if (quizState.answered) {
    selected = quizState.user_answer?.[0];

    const selectedRadio = [...radioButtons].find(r => r.value[0] === selected);
    if (selectedRadio) {
      selectedRadio.checked = true;
      selectedRadio.disabled = true;

      // ✅ Clear old selections first (defensive)
      document.querySelectorAll('.image-option').forEach(el => el.classList.remove('selected'));

      // ✅ Add 'selected' class to the right label
      const imageOption = selectedRadio.closest('.image-option');
      if (imageOption) imageOption.classList.add('selected');
    }

    radioButtons.forEach(r => r.disabled = true);

    resultMsg.textContent = quizState.is_correct ? "Answer is right!" : "Answer is wrong!";
    resultMsg.style.display = "block";
    resultMsg.style.color = quizState.is_correct ? "green" : "red";
    resultMsg.classList.add(quizState.is_correct ? "correct-message" : "wrong-message");

    nextBtn.style.display = "inline-block";
    submitBtn.disabled = true;
  }

  // 🔁 Visual selection only, no submission
  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.image-option').forEach(el => el.classList.remove('selected'));
      radio.closest('.image-option').classList.add('selected');
      selected = radio.value;
    });
  });

  // ✅ Handle submit action
  submitBtn.addEventListener('click', () => {
    if (!selected) {
      resultMsg.textContent = "Please select an option.";
      resultMsg.style.display = "block";
      resultMsg.style.color = "orange";
      return;
    }

    fetch(`/submit-quiz/2`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: [selected] })
    })
    .then(res => res.json())
    .then(data => {
      resultMsg.textContent = data.correct ? "Good job!" : "That’s not correct, essence helps with hydration!";
      resultMsg.style.display = "block";
      resultMsg.style.color = data.correct ? "green" : "red";

      resultMsg.classList.remove("correct-message", "wrong-message");
      resultMsg.classList.add(data.correct ? "correct-message" : "wrong-message");

      if (data.correct && typeof confetti === "function") {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      radioButtons.forEach(r => r.disabled = true);
      submitBtn.disabled = true;
      nextBtn.style.display = "inline-block";
    });
  });
}

// ...existing code before

window.goToNext = function() {
  const path = window.location.pathname;

  // If in the LEARN section
  if (path.startsWith("/learn")) {
    const currentStepName = Object.keys(routine_order)[currentIndex];

    // Go to next learn step
    if (currentIndex < routineData.length - 1 && currentStepName !== "essence" && currentStepName !== "moisturizer" && currentStepName !== "sunscreen") {
      currentIndex++;
      maxUnlockedStep = Math.max(maxUnlockedStep, currentIndex);
      sessionStorage.setItem("maxUnlockedStep", maxUnlockedStep);
      updateContent(currentIndex);
      history.pushState(null, "", `/learn/${Object.keys(routine_order)[currentIndex]}`);
    }

    // If it's the last step, mark as complete
    // if (currentIndex === routineData.length - 1) {
    //   sessionStorage.setItem('learnCompleted', true);
    // }

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
  } else if (path.includes("/quiz1/q2") || path.includes("/quiz1/ques2")) {
    currentIndex = 3;
    sessionStorage.setItem("currentIndex", 3);
    // updateContent(currentIndex);
    maxUnlockedStep = Math.max(maxUnlockedStep, currentIndex);
    sessionStorage.setItem("maxUnlockedStep", maxUnlockedStep);
    history.pushState({ index: 3 }, "", "/learn/serum");
    window.location.href = "/learn/serum";
  }
  else if (path.includes("/quiz2/q1")) {
    window.location.href = "/quiz2/q2";
  } 
  else if (path.includes("/quiz2/q2")) {
    currentIndex = 7;
    sessionStorage.setItem("currentIndex", 7);
    maxUnlockedStep = Math.max(maxUnlockedStep, currentIndex);
    sessionStorage.setItem("maxUnlockedStep", maxUnlockedStep);
    history.pushState({ index: 7 }, "", "/learn/sunscreen");
    window.location.href = "/learn/sunscreen";  
  }
  else if (path.includes("/quiz3/q1")) {
    window.location.href = "/final-quiz/q1";
  }
  else if (path.includes("/final-quiz/q1")) {
    window.location.href = "/final-quiz/q2";
  }
}

// ...rest of your JS code


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
  sessionStorage.setItem('skintype3', skintype3);

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

// routine summary

routine_summary();

function routine_summary() {
  let box1 = sessionStorage.getItem('box1');
  let box2 = sessionStorage.getItem('box2');
  let box3 = sessionStorage.getItem('box3');
  let boxx1 = sessionStorage.getItem('boxx1');
  let boxx2 = sessionStorage.getItem('boxx2');
  let boxx3 = sessionStorage.getItem('boxx3');
  let boxx4 = sessionStorage.getItem('boxx4');
  let boxx5 = sessionStorage.getItem('boxx5');

  skintype = sessionStorage.getItem("skintype");
  skintype = skintype.charAt(0).toUpperCase() + skintype.slice(1);

  let routine_data = [];
  fetch("/data")
  .then(res => res.json())
  .then(data => {
    routine_data = data.routine_steps;
    if (box1 && box2 && box3) {
      document.getElementById("3step").innerHTML=`<br><br><center><h3 style="color: #770fdb;">3-step</h3></center>`;

      document.getElementById("3step").innerHTML+=`<div id='step-container' class="step-container">`;
      updateSummary ("step-container", box1, routine_data, skintype);
      updateSummary ("step-container", box2, routine_data, skintype);
      updateSummary ("step-container", box3, routine_data, skintype);
      document.getElementById("3step").innerHTML+=`</div>`;
    } 
  
    if (boxx1 && boxx2 && boxx3 && boxx4 && boxx5) {

      document.getElementById("5step").innerHTML=`<br><br><center><h3 style="color: #770fdb;">5-step</h3></center>`;

      document.getElementById("5step").innerHTML+=`<div id='step-container2' class="step-container2">`;

      updateSummary ("step-container2", boxx1, routine_data, skintype);
      updateSummary ("step-container2", boxx2, routine_data, skintype);
      updateSummary ("step-container2", boxx3, routine_data, skintype);
      updateSummary ("step-container2", boxx4, routine_data, skintype);
      updateSummary ("step-container2", boxx5, routine_data, skintype);
      document.getElementById("5step").innerHTML+=`</div>`;

    }

    if (!box1 && !boxx1) {
      document.getElementById("routine-status").text = "Want to build a routine?";
      document.getElementById("routine-status").href = "/build-routine";
    } else if (box1 && !boxx1) {
      document.getElementById("routine-status").text = "Want to build a 5-step routine?";
      document.getElementById("routine-status").href = "/build-routine/5";
    } else if (!box1 && boxx1) {
      document.getElementById("routine-status").text = "Want to a 3-step routine?";
      document.getElementById("routine-status").href = "/build-routine/3";
    } 
  });

}

function updateSummary (idx, box, routine_data, skintype) {
  let ind = routine_order[box];
  let { step, description, benefit, image, skin_type_ingredients, key_ingredients } = routine_data[ind];
  box = box.charAt(0).toUpperCase() + box.slice(1);
  document.getElementById(idx).innerHTML+=`<div class="box-wrapper">
      <div class="products-summary"><img class='img-routine' title=${box} src='/static/${image}' alt=${box}></div>
      <label class="box-label" style="font-weight:bold; font-size:16px">${box}</label>
      <label class="box-label">Look for - <span style="color: purple;">${skin_type_ingredients[skintype]}</span></label>
    </div>`;
}

function updateSkintyperesult() {
  s=sessionStorage.getItem("skintype");
  if (s=='oily') {
    document.getElementById('skinresultdetail').innerHTML+=`<span style="color:#770fdb; font-weight:bold;">Oily skin</span> is caused by an overproduction of sebum, 
    the natural oil that lubricates and protects the skin. This excess oil can lead to a shiny appearance, clogged pores, 
    and acne.`;

    document.getElementById('skinresultimg').innerHTML+=`<img style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);" src='/static/images/oily_skin.png'width="160px" height="150px">`;
  } else if (s=='normal') {
    document.getElementById('skinresultdetail').innerHTML+=`<span style="color:#770fdb; font-weight:bold;">Normal skin</span> does not feel oily or dry, but is perceived 
    as well-balanced and supple. The skin is perceived as smooth and soft and the pores are neither enlarged nor reduced. 
    A normal skin type has a balanced sebum production and a normal moisture balance and has no problems with visible 
    rashes or sensitivity.`;

    document.getElementById('skinresultimg').innerHTML+=`<img style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);" src='/static/images/normal_skin.png'width="160px" height="150px">`;
  } else if (s=='dry') {
    document.getElementById('skinresultdetail').innerHTML+=`<span style="color:#770fdb; font-weight:bold;">Dry skin</span>, also known as xerosis, is a common condition 
    where the skin lacks moisture, leading to a rough, flaky, or itchy feeling. It can be caused by various factors, 
    including aging, cold weather, certain medical conditions, or harsh products.`;

    document.getElementById('skinresultimg').innerHTML+=`<img style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);" src='/static/images/dry_skin.png'width="160px" height="150px">`;
  } else if (s=='combination') {
    document.getElementById('skinresultdetail').innerHTML+=`<span style="color:#770fdb; font-weight:bold;">Combination skin</span> means that there are some areas of your 
    face that are dry and other areas of your face that are more oily. The T-zone (forehead, nose, and chin) is commonly oily, 
    and the cheeks are often drier.`;

    document.getElementById('skinresultimg').innerHTML+=`<img style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);" src='/static/images/combination_skin.png'width="200px" height="150px">`;
  }
}

updateSkintyperesult();
