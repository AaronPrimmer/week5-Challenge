dayjs.extend(window.dayjs_plugin_customParseFormat);
dayjs.extend(dayjs_plugin_relativeTime);

// STRUCTURE OF CARD DATA

$(function () {
  // TODO: Add saving Functionality
  // TODO: Add loading Functionality
  // TODO: Add Card on click
  // TODO: Edit Card on Click
  // TODO: Delete Card on Click
  // TODO: Change colors of cards based on date until
  // TODO: Change color of completed cards only to green when dropped in list

  // Variables //
  let addingCard = false;

  // All current card info
  let allCards = {};

  // DatePicker set up
  $("#datePicker").datepicker({
    minDate: new Date(2024, 1 - 1, 1),
  });

  // Add Card to the board on create
  function addCardToBoard(allInfo) {
    if (addingCard) {
      return;
    }
    if (allInfo) {
      addingCard = true;
      const listHTML = addHTMLList(allInfo);

      if (allInfo.location == "concept") {
        $("#conceptCards").prepend(listHTML);
      }
    }
  }

  // Gets random number
  function getRandomKey() {
    return Math.floor(Math.random() * 1000000);
  }

  // Add card info when the button is clicked
  function addCardInfo(event) {
    addingCard = true;
    const addModal = $("#add-modal");
    addModal.modal("show");

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
          location: "concept",
        };

        console.log(datePicker);
        addCardToBoard(allInput);
        $("#addCardTitle").val("");
        $("#addCardDescription").val("");
        $("#datePicker").val("");
      }
    });

    addingCard = false;
  }

  // Returns the list item HTML with the data-key set
  function addHTMLList(cardInfo) {
    return `<li class="list-item" data-key="${cardInfo.keyId}">
                  <h4>${cardInfo.title}</h4>
                  <p>${cardInfo.description}</p>
                  <div class="list-date">
                    <h6>Due:Date</h6>
                    <h6>${dayjs(cardInfo.dueDate).format("MMMM d, YYYY")}</h6>
                    <h6>${dayjs(cardInfo.dueDate).fromNow(true)}</h6>
                  </div>
                </li>`;
  }

  // Button Click Event Listeners
  $("#addTaskButton").on("click", addCardInfo);

  $("#conceptCards, #progressCards, #reviewCards, #completedCards").sortable({
    placeholder: "sorting-ui",
    connectWith: "ul",
    cursor: "grabbing",
    appendTo: "main",
    helper: "clone",
  });

  // $("#progressCards").sortable({
  //   placeholder: "sorting-ui",
  //   connectWith: "ul",
  //   cursor: "grabbing",
  //   appendTo: "main",
  //   helper: "clone",
  //   activate: function (event, ui) {
  //     console.log(event);
  //   },
  // });

  // $("#reviewCards").sortable({
  //   placeholder: "sorting-ui",
  //   connectWith: "ul",
  //   cursor: "grabbing",
  //   appendTo: "main",
  //   helper: "clone",
  //   activate: function (event, ui) {
  //     console.log(event);
  //   },
  // });

  // $("#completedCards").sortable({
  //   placeholder: "sorting-ui",
  //   connectWith: "ul",
  //   cursor: "grabbing",
  //   appendTo: "main",
  //   helper: "clone",
  //   activate: function (event, ui) {
  //     console.log(event);
  //   },
  // });

  $(
    "#conceptCards, #progressCards, #reviewCards, #completedCards"
  ).disableSelection();
});
