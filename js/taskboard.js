dayjs.extend(window.dayjs_plugin_customParseFormat);
dayjs.extend(dayjs_plugin_relativeTime);

// STRUCTURE OF CARD DATA

$(function () {
  let getAllDates = $(".current-date");
  let allCards = {};
  let addingCard = false;
  $("#datepicker").datepicker();

  // Pulls the info from storage
  function pullFromLocalStorage() {
    let storedCards = localStorage.getItem("userCards");
    if (storedCards) {
      allCards = JSON.parse(storedCards);
      populateCards(allCards);
    }
  }

  // Saves card info to local storage
  function saveToStorage() {
    localStorage.setItem("userCards", JSON.stringify(allCards));
  }

  // Deletes from the Dictionary and then saves new dict to storage
  function deleteFromStorage(dataKey) {
    delete allCards[dataKey];
    saveToStorage();
  }

  function changeTaskLocation(itemKey, newLocation) {
    allCards[itemKey].location = newLocation;
    saveToStorage();
  }

  // Puts the cards on the screen from storage
  function populateCards(cardsToDisplay) {
    // Run through card infor and display all the cards
    if (Object.keys(cardsToDisplay).length == 0) {
      return;
    }

    for (let cardKey in cardsToDisplay) {
      if (allCards[cardKey].location == "concept") {
        $("#concept-cards").append(convertToHTML(allCards[cardKey], cardKey));
      } else if (allCards[cardKey].location == "progress") {
        $("#progress-cards").append(convertToHTML(allCards[cardKey], cardKey));
      } else if (allCards[cardKey].location == "review") {
        $("#review-cards").append(convertToHTML(allCards[cardKey], cardKey));
      } else if (allCards[cardKey].location == "completed") {
        $("#completed-cards").append(convertToHTML(allCards[cardKey], cardKey));
      }
    }

    setCardColors();
    //removeAndSetSelectEvent();
    makeAllCardsDraggable();
  }

  // Makes all card draggable
  function makeAllCardsDraggable() {
    $(".card").draggable({
      zIndex: 100,
      start: function (event, ui) {
        $(".card-active").removeClass("card-active");
        $(this).addClass("card-active");
      },
    });
  }

  // Function for setting all card colors
  function setCardColors() {
    getAllDates = $(".current-date");
    for (let date of getAllDates) {
      const sibling = $(date).siblings().last();
      const dueDate = dayjs($(date).text());
      sibling.text(`(${dueDate.fromNow()})`);
      const dueDateText = dueDate.fromNow();
      const dueDateNumber = parseInt(dueDate.fromNow(true).split(" ")[0]);
      if (dueDateText.includes("ago")) {
        sibling.closest("div.card").addClass("card-past-due");
      } else if (
        (dueDateNumber && dueDateNumber <= 5) ||
        dueDateText.includes("hours") ||
        dueDateText.includes("minutes") ||
        dueDateText.includes("seconds") ||
        dueDateText.includes("in a day")
      ) {
        sibling.closest("div.card").addClass("card-almost-due");
      }

      if (sibling.closest("div.card").hasClass("card-completed")) {
        removeCardDueDates(sibling.closest("div.card"));
      } else {
        sibling.closest("div.card").children().children().last().show();
      }
    }
  }

  // Removes the card due dates and colors for completed work
  function removeCardDueDates(card) {
    card.children().children().last().hide();
    card.removeClass("card-past-due");
    card.removeClass("card-almost-due");
  }

  // Highlight the card that is selected
  function highlightCard(event) {
    event.stopPropagation();
    let cardToHighlight = $(event.target);
    if ($(event.target).is("div.card-body")) {
      cardToHighlight = $(event.target).parent();
    } else if ($(event.target).is("h4, p, h6")) {
      cardToHighlight = $(event.target).parent().parent();
    } else if ($(event.target).is("span")) {
      cardToHighlight = $(event.target).parent().parent().parent();
    } else if ($(event.target).is("div.card")) {
      cardToHighlight = $(event.target);
    }
    $(".card-active").removeClass("card-active");
    cardToHighlight.addClass("card-active");
  }

  // Add card to board
  function addCardToBoard(title, description, datePicked) {
    if (addingCard) {
      return;
    }
    addingCard = true;
    let keyData = Math.floor(Math.random() * 1000000);

    for (let key in allCards) {
      while (key === keyData) {
        keyData = Math.floor(Math.random() * 1000000);
      }
    }

    allCards[keyData] = {
      title: title,
      desc: description,
      dateDue: datePicked,
      location: "concept",
    };

    console.log(allCards);

    saveToStorage();
    const conceptCardEl = $("#concept-cards");

    conceptCardEl.append(
      convertToHTML(
        { title: title, desc: description, dateDue: datePicked },
        keyData
      )
    );
    setCardColors();
    //removeAndSetSelectEvent();
    makeAllCardsDraggable();
  }

  // Convert card info into html
  function convertToHTML(cardInfo, key) {
    let comptletedCard =
      cardInfo.location == "completed" ? "card-completed" : "";
    console.log(cardInfo.location);
    return `<div class="card card-highlight drag-box ${comptletedCard}" data-key="${key}">
                <div class="card-body" style="user-select: none;">
                  <h4>${cardInfo.title}</h4>
                  <p>${cardInfo.desc}</p>
                  <h6>
                    Due Date: <br /><span class="current-date"
                      >${cardInfo.dateDue}</span
                    ><br />
                    <span class="date-till-now"></span>
                  </h6>
                </div>
              </div>`;
  }

  // Calls modal to add card
  function addCardModal() {
    const addModal = $("#add-modal");
    addModal.modal("show");

    $("#add-card-to-board").on("click", function (event) {
      if (
        $("#add-card-title").val() &&
        $("#add-card-description").val() &&
        $("#datepicker").val()
      ) {
        console.log("Add Card");
        addModal.modal("hide");
        $("#add-card-to-board").off("click");
        const titleInput = $("#add-card-title").val();
        const descriptionInput = $("#add-card-description").val();
        const datePicker = dayjs($("#datepicker").val()).format("MMMM D, YYYY");

        addCardToBoard(titleInput, descriptionInput, datePicker);
        $("#add-card-title").val("");
        $("#add-card-description").val("");
        $("#datepicker").val("");
      }
    });

    addingCard = false;
  }

  // Call to edit the currently selected card
  function editCardModal() {
    const cardActive = $(".card-active");

    if (cardActive.length > 0) {
      console.log(cardActive);
    }
  }

  // Calls the delete currently selected card
  // function deleteCardModal() {
  //   const cardActive = $(".card-active");

  //   if (cardActive.length > 0) {
  //     const deleteModal = $("#delete-modal");
  //     deleteModal.modal("show");

  //     $("#delete-card-for-sure").on("click", function (event) {
  //       // remove card from the screen and overall list and save
  //       deleteFromStorage(cardActive.data("key"));
  //       cardActive.remove();
  //       deleteModal.modal("hide");
  //       $("#delete-card-for-sure").off("click");

  //       removeAndSetSelectEvent();
  //     });
  //   }
  // }

  // Removes and resets the card-highlight mousedown event
  // function removeAndSetSelectEvent() {
  //   $(".card-highlight").off("mousedown");
  //   $(".card-highlight").on("mousedown", highlightCard);
  // }

  $("#add-card-button").on("click", addCardModal);
  $("#edit-card-button").on("click", editCardModal);
  $(".delete-card-button").on("click", function (event) {
    console.log(event.target);
  });
  // $("#delete-card-button").on("click", deleteCardModal);

  pullFromLocalStorage();
  setCardColors();

  // Concept column Droppable
  $("#concept-cards").droppable({
    accept: ".ui-draggable",
    drop: function (event, ui) {
      $(this).append(ui.draggable.clone());
      ui.draggable.remove();

      let droppedItem = $(this).children().last();

      droppedItem.css({
        position: "relative",
        left: 0,
        top: 0,
      });

      droppedItem.removeClass(".ui-draggable-dragging");
      droppedItem.removeClass("card-completed");
      makeAllCardsDraggable();
      changeTaskLocation(droppedItem.data("key"), "concept");
      $(this).removeClass("drop-highlight");
      setCardColors();
    },
    over: function (event, ui) {
      $(this).addClass("drop-highlight");
    },
    out: function (event, ui) {
      $(this).removeClass("drop-highlight");
    },
  });

  // Progress column Droppable
  $("#progress-cards").droppable({
    accept: ".ui-draggable",
    drop: function (event, ui) {
      $(this).append(ui.draggable.clone());
      ui.draggable.remove();

      let droppedItem = $(this).children().last();

      droppedItem.css({
        position: "relative",
        left: 0,
        top: 0,
      });

      droppedItem.removeClass(".ui-draggable-dragging");
      droppedItem.removeClass("card-completed");
      makeAllCardsDraggable();
      changeTaskLocation(droppedItem.data("key"), "progress");
      $(this).removeClass("drop-highlight");
      setCardColors();
    },
    over: function (event, ui) {
      $(this).addClass("drop-highlight");
    },
    out: function (event, ui) {
      $(this).removeClass("drop-highlight");
    },
  });

  // Content Review column Droppable
  $("#review-cards").droppable({
    accept: ".ui-draggable",
    drop: function (event, ui) {
      $(this).append(ui.draggable.clone());
      ui.draggable.remove();

      let droppedItem = $(this).children().last();

      droppedItem.css({
        position: "relative",
        left: 0,
        top: 0,
      });

      droppedItem.removeClass("ui-draggable-dragging");
      droppedItem.removeClass("card-completed");
      makeAllCardsDraggable();
      changeTaskLocation(droppedItem.data("key"), "review");
      $(this).removeClass("drop-highlight");
      setCardColors();
    },
    over: function (event, ui) {
      $(this).addClass("drop-highlight");
    },
    out: function (event, ui) {
      $(this).removeClass("drop-highlight");
    },
  });

  // Content Review column Droppable
  $("#completed-cards").droppable({
    accept: ".ui-draggable",
    drop: function (event, ui) {
      $(this).append(ui.draggable.clone());
      ui.draggable.remove();

      let droppedItem = $(this).children().last();

      droppedItem.css({
        position: "relative",
        left: 0,
        top: 0,
      });

      droppedItem.removeClass(".ui-draggable-dragging");
      droppedItem.addClass("card-completed");
      droppedItem.draggable();
      changeTaskLocation(droppedItem.data("key"), "completed");
      $(this).removeClass("drop-highlight");
      setCardColors();
    },
    over: function (event, ui) {
      $(this).addClass("drop-highlight");
    },
    out: function (event, ui) {
      $(this).removeClass("drop-highlight");
    },
  });
  //removeAndSetSelectEvent();
});
