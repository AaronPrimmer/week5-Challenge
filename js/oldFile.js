dayjs.extend(window.dayjs_plugin_customParseFormat);
dayjs.extend(dayjs_plugin_relativeTime);

// STRUCTURE OF CARD DATA

$(function () {
  let getAllDates = $(".current-date");
  let allCards = {};
  let addingCard = false;
  const STRINGS_TO_CHECK = [
    "hours",
    "minutes",
    "seconds",
    "in a day",
    "in an hour",
    "minute",
    "second",
  ];
  $("#datepicker").datepicker({
    minDate: new Date(2024, 1 - 1, 1),
  });

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
      let category;
      if (allCards[cardKey].location == "concept") {
        category = $("#concept-cards");
      } else if (allCards[cardKey].location == "progress") {
        category = $("#progress-cards");
      } else if (allCards[cardKey].location == "review") {
        category = $("#review-cards");
      } else if (allCards[cardKey].location == "completed") {
        category = $("#completed-cards");
      }

      if (category) {
        category.append(convertToHTML(allCards[cardKey], cardKey));
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
      cursor: "grabbing",
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
      let keyId = $(date).closest("div.card").data("key");

      const sibling = $(date).siblings().last();
      const dueDate = dayjs(allCards[keyId].dateDue);
      sibling.text(`(${dueDate.fromNow()})`);
      const dueDateText = dueDate.fromNow();
      const dueDateNumber = parseInt(dueDate.fromNow(true).split(" ")[0]);
      let stringCheck = STRINGS_TO_CHECK.some((check) =>
        dueDateText.includes(check)
      );

      if (dueDateText.includes("ago")) {
        sibling.closest("div.card").addClass("card-past-due");
      } else if ((dueDateNumber && dueDateNumber <= 5) || stringCheck) {
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

    saveToStorage();

    $("#concept-cards").append(
      convertToHTML(
        { title: title, desc: description, dateDue: datePicked },
        keyData
      )
    );
    setCardColors();
    removeAndSetSelectEvent();
    makeAllCardsDraggable();
  }

  // Convert card info into html
  function convertToHTML(cardInfo, key) {
    let comptletedCard =
      cardInfo.location == "completed" ? "card-completed" : "";
    return `<div class="card card-highlight drag-box ${comptletedCard}" data-key="${key}">
                <div class="card-body" style="user-select: none;">
                  <h4>${cardInfo.title}</h4>
                  <p>${cardInfo.desc}</p>
                  <h6>
                    Due Date: <br /><span class="current-date"
                      >${dayjs(cardInfo.dateDue).format("MMMM D, YYYY")}</span
                    ><br />
                    <span class="date-till-now"></span>
                  </h6>
                </div>
              </div>`;
  }

  // Calls modal to add card
  function addCardModal(event) {
    event.preventDefault();
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
        const datePicker = dayjs($("#datepicker").val()).format(
          "MMMM D, YYYY 17:00:00"
        );

        console.log(datePicker);
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
  function deleteCardModal(event) {
    event.preventDefault();
    const cardActive = $(".card-active");

    if (cardActive.length > 0) {
      const deleteModal = $("#delete-modal");
      deleteModal.modal("show");

      $("#delete-card-for-sure").on("click", function (event) {
        // remove card from the screen and overall list and save
        deleteFromStorage(cardActive.data("key"));
        cardActive.remove();
        deleteModal.modal("hide");
        $("#delete-card-for-sure").off("click");

        removeAndSetSelectEvent();
      });
    }
  }

  // Removes and resets the card-highlight mousedown event
  function removeAndSetSelectEvent() {
    $(".card-highlight").off("click");
    $(".card-highlight").on("click", highlightCard);
  }

  $("#add-card-button").on("click", addCardModal);
  $("#edit-card-button").on("click", editCardModal);
  $("#delete-card-button").on("click", deleteCardModal);
  $("main").on("click", function (event) {
    $(".card-active").removeClass("card-active");
  });

  // default running functions
  pullFromLocalStorage();
  removeAndSetSelectEvent();

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
      removeAndSetSelectEvent();
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
      removeAndSetSelectEvent();
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
      removeAndSetSelectEvent();
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

  // Completed column Droppable
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
      makeAllCardsDraggable();
      removeAndSetSelectEvent();
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
});
