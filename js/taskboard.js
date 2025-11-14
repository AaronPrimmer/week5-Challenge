dayjs.extend(window.dayjs_plugin_customParseFormat);
dayjs.extend(dayjs_plugin_relativeTime);

// STRUCTURE OF CARD DATA

$(function () {
  // TODO: Add saving Functionality
  // TODO: Add loading Functionality
  // TODO: Add Card on click ✅
  // TODO: Edit Card on Click
  // TODO: Delete Card on Click
  // TODO: Change colors of cards based on date until
  // TODO: Change color of completed cards only to green when dropped in list

  // Constant Variables //
  const STORAGE_KEY = "taskBoardCards";

  // Variables //
  let addingCard = false;

  // All current card info
  let allCards = {};

  // DatePicker set up
  $("#datePicker").datepicker({
    minDate: new Date(2024, 1 - 1, 1),
  });

  // Save info to local storage
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allCards));
  }

  // Retrieves the items from local storage
  function retrieveFromStorage() {
    let storedCards = localStorage.getItem(STORAGE_KEY);
    if (storedCards) {
      allCards = JSON.parse(storedCards);
      for (let card in allCards) {
        addCardToBoard(allCards[card]);
      }
    }

    allButtonEvents();
  }

  // Add Card to the board on create
  function addCardToBoard(allInfo) {
    if (addingCard) {
      return;
    }
    if (allInfo) {
      const listHTML = addHTMLList(allInfo);

      $(`#${allInfo.location}`).prepend(listHTML);
    }
  }

  // Gets random number for the key
  function getRandomKey() {
    return Math.floor(Math.random() * 1000000);
  }

  // Add card info when the button is clicked
  function addCardInfo(event) {
    addingCard = true;
    const addModal = $("#add-modal");
    addModal.modal("show");

    // Event listener for the add task modal button
    $("#addCardToboard").on("click", function (event) {
      if (
        $("#addCardTitle").val() &&
        $("#addCardDescription").val() &&
        $("#datePicker").val()
      ) {
        addModal.modal("hide");
        $("#addCardToboard").off("click");
        let currentKey = getRandomKey();
        for (let cardKey in allCards) {
          while (currentKey == cardKey) {
            currentKey = getRandomKey();
          }
        }
        const allInput = {
          title: $("#addCardTitle").val(),
          description: $("#addCardDescription").val(),
          dueDate: dayjs($("#datePicker").val()).format(
            "MMMM D, YYYY 17:00:00"
          ),
          keyId: currentKey,
          location: "toDoCards",
        };

        allCards[currentKey] = allInput;
        saveToStorage();
        addCardToBoard(allInput);
        $("#addCardTitle").val("");
        $("#addCardDescription").val("");
        $("#datePicker").val("");
      }
    });

    allButtonEvents();
    addingCard = false;
  }

  // Returns the list item HTML with the data-key set
  function addHTMLList(cardInfo) {
    return `<li class="list-item" data-key="${cardInfo.keyId}">
                  <h4>${cardInfo.title}</h4>
                  <p>${cardInfo.description}</p>
                  <div class="list-date">
                    <h6>Due Date:</h6>
                    <h6>${dayjs(cardInfo.dueDate).format("MMMM d, YYYY")}</h6>
                    <h6>${dayjs(cardInfo.dueDate).fromNow(true)}</h6>
                  </div>
                  <div class="cardButtons">
                    <button type="button" class="editButton">✏️</button>
                    <button type="button" class="deleteButton">❌</button>
                  </div>
                </li>`;
  }

  // Edit Button click function
  function editButtonClick(event) {
    console.log(`Edit: ${event.target}`);
  }

  // Deletes Button click function
  function deleteButtonClick(event) {
    console.log(`Delete: ${event.target}`);
  }

  // Button Click Event Listeners
  $("#addTaskButton").on("click", addCardInfo);

  // Function to add event listeners for all buttons
  function allButtonEvents() {
    $("button").on("click", ".editButton", editButtonClick);
    $("button").on("click", ".deleteButton", deleteButtonClick);
  }

  // Sets the sortable method for card movement
  $("#progressCards, #toDoCards, #completedCards")
    .sortable({
      placeholder: "sorting-ui",
      connectWith: "ul",
      cursor: "grabbing",
      appendTo: "main",
      helper: "clone",
      scroll: false,
      stop: function (event, ui) {
        // When item is placed, change location of item in storage
        let stortedItem = ui.item;
        let parentList = stortedItem.parent();
        let itemKey = stortedItem.data("key");

        allCards[itemKey].location = parentList.attr("id");
        saveToStorage();
      },
    })
    .disableSelection();

  retrieveFromStorage();
});
