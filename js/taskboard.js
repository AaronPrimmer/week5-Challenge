dayjs.extend(window.dayjs_plugin_customParseFormat);
dayjs.extend(dayjs_plugin_relativeTime);

$(function () {
  const getAllDates = $(".current-date");

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

  $(".card-highlight").on("mousedown", highlightCard);
});
