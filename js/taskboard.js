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
  let editingCard = false;
  const addModal = $("#addModal");
  const editModal = $("#editModal");

  // All current card info
  let allCards = {};

  // DatePicker set up
  $("#datePicker").datepicker({
    minDate: new Date(2024, 1 - 1, 1),
  });
  $("#editDatePicker").datepicker({
    minDate: new Date(2024, 1 - 1, 1),
  });

  // Sets todays date element
  $("#todaysDate").text(dayjs().format("dddd MMMM D, YYYY"));

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
  }

  // Add Card to the board on create
  function addCardToBoard(allInfo) {
    if (addingCard) {
      return;
    }
    if (allInfo) {
      let hoursUntilDate = dayjs(allInfo.dueDate).diff(dayjs(), "hour");
      allInfo.card = returnDueDateClass(hoursUntilDate, allInfo.location);

      const listHTML = addHTMLList(allInfo);

      $(`#${allInfo.location}`).prepend(listHTML);
    }
  }

  // Checks the due date by hour and returns what class should be attached
  function returnDueDateClass(hoursUntilDate, itemLocation) {
    if (hoursUntilDate <= 0) {
      return "card-past-due";
    } else if (hoursUntilDate > 0 && hoursUntilDate <= 120) {
      return "card-almost-due";
    }

    if (itemLocation == "completedCards") {
      return "card-completed";
    }

    return "";
  }

  // Gets random number for the key
  function getRandomKey() {
    return Math.floor(Math.random() * 1000000);
  }

  // Add card info when the button is clicked
  function addCardInfo(event) {
    addingCard = true;
    addModal.modal("show");

    // Event listener for the add task modal button
    $("#addCardToboard").on("click", addItemButtonClick);

    addingCard = false;
  }

  // Returns the list item HTML with the data-key set
  function addHTMLList(cardInfo) {
    return `<li class="list-item ${cardInfo.card}" data-key="${cardInfo.keyId}">
                  <h4>${cardInfo.title}</h4>
                  <p>${cardInfo.description}</p>
                  <div class="list-date">
                    <h6>Due Date:</h6>
                    <h6>${dayjs(cardInfo.dueDate).format("MMMM D, YYYY")}</h6>
                    <h6>${dayjs(cardInfo.dueDate).fromNow(false)}</h6>
                  </div>
                  <div class="card-buttons">
                    <button type="button" class="editButton">✏️</button>
                    <button type="button" class="deleteButton">❌</button>
                  </div>
                </li>`;
  }

  // Edit card info on edit button click, load all item values
  function editCardInfo(editInfo) {
    editingCard = true;
    $("#editCardTitle").val(editInfo.title);
    $("#editCardDescription").val(editInfo.description);
    $("#editDatePicker").val(editInfo.dueDate);
    editModal.modal("show");

    $("#editCardToboard").on("click", (event) =>
      editItemButtonClick(event, editInfo.keyId)
    );

    editingCard = false;
  }

  // Modal Button Clicks //
  // Add button on modal clicked, add card to board
  function addItemButtonClick(event) {
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
        dueDate: dayjs($("#datePicker").val()).format("MMMM D, YYYY 17:00:00"),
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
  }

  //Edit button on modal clicked, edit info on card
  function editItemButtonClick(event, infoKey) {
    allCards[infoKey].title = $("#editCardTitle").val();
    allCards[infoKey].description = $("#editCardDescription").val();
    allCards[infoKey].dueDate = $("#editDatePicker").val();

    saveToStorage();
    editModal.modal("hide");

    let editedItem = $(`li[data-key="${infoKey}"]`);
    editedItem.children("h4").text(allCards[infoKey].title);
    editedItem.children("p").text(allCards[infoKey].description);
    editedItem
      .children(".list-date")
      .children("h6:nth-of-type(2)")
      .text(dayjs(allCards[infoKey].dueDate).format("MMMM D, YYYY"));
    editedItem
      .children(".list-date")
      .children("h6:nth-of-type(3)")
      .text(dayjs(allCards[infoKey].dueDate).fromNow(false));
  }

  // Edit Button click function
  function editButtonClick(event) {
    if (editingCard) {
      return;
    }
    let targetListItem = $(event.target).parent().parent();
    let targetData = allCards[targetListItem.data("key")];

    editCardInfo(targetData);
  }

  // Deletes Button click function
  function deleteButtonClick(event) {
    let targetListItem = $(event.target).parent().parent();
    let targetId = targetListItem.data("key");
    allCards[targetId] = "";
    saveToStorage();
    targetListItem.remove();
  }

  // Button Click Event Listeners
  $("#addTaskButton").on("click", addCardInfo);
  $("#toDoCards").on("click", ".editButton", editButtonClick);
  $("#toDoCards").on("click", ".deleteButton", deleteButtonClick);
  $("#progressCards").on("click", ".editButton", editButtonClick);
  $("#progressCards").on("click", ".deleteButton", deleteButtonClick);
  $("#completedCards").on("click", ".editButton", editButtonClick);
  $("#completedCards").on("click", ".deleteButton", deleteButtonClick);

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
        let sortedItem = ui.item;
        let parentList = sortedItem.parent();
        let itemKey = sortedItem.data("key");

        allCards[itemKey].location = parentList.attr("id");
        if (allCards[itemKey].location == "completedCards") {
          $(sortedItem).children("div.list-date").hide();
          $(sortedItem).children("div.card-buttons").hide();
          $(sortedItem).removeClass("card-past-due");
          $(sortedItem).removeClass("card-almost-due");
          $(sortedItem).addClass("card-completed");
        } else {
          $(sortedItem).children("div.list-date").show();
          $(sortedItem).children("div.card-buttons").show();
          $(sortedItem).removeClass("card-completed");
          let classToAdd = returnDueDateClass(
            dayjs(allCards[itemKey].dueDate).diff(dayjs(), "hour"),
            allCards[itemKey].location
          );
          $(sortedItem).addClass(classToAdd);
        }
        saveToStorage();
      },
    })
    .disableSelection();

  retrieveFromStorage();
});
