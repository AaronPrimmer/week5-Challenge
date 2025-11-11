dayjs.extend(window.dayjs_plugin_customParseFormat);
dayjs.extend(dayjs_plugin_relativeTime);

$(function () {
  const getAllDates = $(".current-date");
  const allCards = {};

  // Pulls the info from storage
  function pullFromLocalStorage() {
    let storedCards = localStorage.getItem("userCards");
    if (storedCards) {
      let parsedCards = JSON.parse(storedCards);
      populateCards(parsedCards);
    }
  }

  // Saves card info to local storage
  function saveToStorage() {
    localStorage.setItem("userCards", JSON.stringify(allCards));
  }

  // Puts the cards on the screen from storage
  function populateCards(cardsToDisplay) {
    // Run through card infor and display all the cards
  }

  // Function for setting all card colors
  function setCardColors() {
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
        dueDateText.includes("seconds")
      ) {
        sibling.closest("div.card").addClass("card-almost-due");
      }

      if (sibling.closest("div.card").hasClass("card-completed")) {
        removeCardDueDates(sibling.closest("div.card"));
      }
    }
  }

  // Removes the card due dates and colors for them
  function removeCardDueDates(card) {
    card.children().children().last().text("");
    card.removeClass("card-past-due");
    card.removeClass("card-almost-due");
  }

  // Highlight the card that is selected
  function highlightCard(event) {
    event.stopPropagation();
    let cardToHighlight;
    if ($(event.target).is("div.card-body")) {
      cardToHighlight = $(event.target).parent();
    } else if ($(event.target).is("h4, p, h6")) {
      cardToHighlight = $(event.target).parent().parent();
    } else if ($(event.target).is("span")) {
      cardToHighlight = $(event.target).parent().parent().parent();
    }
    $(".card-active").removeClass("card-active");
    cardToHighlight.addClass("card-active");
  }

  // Add card to board
  function addCardToBoard(title, description, datePicked) {
    console.log(`Title: ${title}`);
    console.log(`Description: ${description}`);
    console.log(`Date: ${datePicked}`);
  }

  // Calls modal to add card
  function addCardModal() {
    const addModal = $("#add-modal");
    addModal.modal("show");

    $("#add-card-to-board").on("click", function (event) {
      console.log("Add Card");
      addModal.modal("hide");
      $("#add-card-to-board").off("click");
      const titleInput = $("#add-card-title").val();
      const descriptionInput = $("#add-card-description").val();
      const datePicker = "date";

      addCardToBoard(titleInput, descriptionInput, datePicker);
    });
  }

  // Call to edit the currently selected card
  function editCardModal() {
    const cardActive = $(".card-active");

    if (cardActive.length > 0) {
      console.log(cardActive);
    }
  }

  // Calls the delete currently selected card
  function deleteCardModal() {
    const cardActive = $(".card-active");

    if (cardActive.length > 0) {
      const deleteModal = $("#delete-modal");
      deleteModal.modal("show");

      $("#delete-card-for-sure").on("click", function (event) {
        // remove card from the screen and overall list and save
        cardActive.remove();
        deleteModal.modal("hide");
        $("#delete-card-for-sure").off("click");
      });
    }
  }

  $(".card-highlight").on("mousedown", highlightCard);
  $("#add-card-button").on("click", addCardModal);
  $("#edit-card-button").on("click", editCardModal);
  $("#delete-card-button").on("click", deleteCardModal);
  pullFromLocalStorage();
  setCardColors();
});
