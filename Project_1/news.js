$(() => {
  //USER INPUT BALANCE
  $(".companyNews").on("submit", event => {
    event.preventDefault();
    //grab value from user input box
    const $companyNameSearched = $("#searchCompanyNews").val();

    handleData = data => {
      for (let i = 0; i < 15; i++) {
        const $containerNewsDiv = $("<div>").addClass("containerNewsDiv");

        //URL
        const $childDiv1 = $("<a>")
          .attr("href", data.articles[i].url)
          .text(`${data.articles[i].title}`);
        $childDiv1.addClass("childDiv1");
        $containerNewsDiv.append($childDiv1);

        //SOURCE
        const $childDiv2 = $("<div>").text(
          `source: ${data.articles[i].source.name}`
        );
        $childDiv2.addClass("childDiv2");
        $containerNewsDiv.append($childDiv2);

        //CONTENT
        const $childDiv3 = $("<div>").text(data.articles[i].description);
        $childDiv3.addClass("childDiv3");
        $containerNewsDiv.append($childDiv3);

        $(".returnedNews").append($containerNewsDiv);
      }
    };

    const endpoint = `https://newsapi.org/v2/everything?q=${$companyNameSearched}&apiKey=b010681d8213431d9255306aa8c4d3cf`;

    $.ajax({
      url: endpoint
    }).then(data => {
      handleData(data);
    });

    $(event.currentTarget).trigger("reset");
    $(".companyNews").on("change", "input", function() {
      $(".returnedNews").empty();
    });
  });
});
