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

  $("#concept-cards").sortable({
    placeholder: "sorting-ui",
    connectWith: "ul",
    cursor: "grabbing",
  });

  $("#progress-cards").sortable({
    placeholder: "sorting-ui",
    connectWith: "ul",
    cursor: "grabbing",
  });

  $("#review-cards").sortable({
    placeholder: "sorting-ui",
    connectWith: "ul",
    cursor: "grabbing",
  });

  $("#completed-cards").sortable({
    placeholder: "sorting-ui",
    connectWith: "ul",
    cursor: "grabbing",
  });

  $(
    "#concept-cards, #progress-cards, #review-cards, #completed-cards"
  ).disableSelection();
});
