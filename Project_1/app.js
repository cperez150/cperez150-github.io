$(() => {
  let $userBalance = 0;
  let $totalHoldings = 0;

  //USER INPUT BALANCE
  $(".availbalance").on("submit", event => {
    event.preventDefault();
    //grab value from user input box
    const $availableBalance = $("#availableBalanceInput").val();

    //create div to show balance w/conversion to number
    const $div = $("<div>").text(`$ ${$availableBalance}`);
    $userBalance = parseInt($availableBalance);
    $div.addClass("balance");
    $(".balance").append($div);

    //REMOVE INPUT BOX AFTER AMOUNT IS CAPTURED AND LOGGED
    $("#availableBalanceInput").after(function() {
      $(".availbalance").toggleClass("hide");
    });

    $(event.currentTarget).trigger("reset");
  });

  //FIND STOCK TICKER INPUT VALUE
  const findStockTicker = () => {
    const $companyInput = $("#companyGrab");
    const $text = $companyInput.val();
    return $text;
  };

  //DATAHANDLER STOCK TICKER SEARCH
  const $getCompanyName = () => {
    const $value = findStockTicker();
    const endpoint = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${$value}&apikey=JPOQL6NWBOFGUGHF`;

    const handleData = data => {
      for (let i = 0; i < data.bestMatches.length; i++) {
        const $tableRow = $("<tr>").css("border", "2px solid black");
        const $companiesReturned = $("<td>")
          .text(data.bestMatches[i]["2. name"])
          .addClass("companiesReturned");
        $tableRow.append($companiesReturned);
        const $companiesTicker = $("<td>")
          .text(data.bestMatches[i]["1. symbol"])
          .addClass("companiesTicker");
        $tableRow.append($companiesTicker);
        $(".stocklookUptable").append($tableRow);
      }
    };
    $.ajax({
      url: endpoint
    }).then(data => {
      handleData(data);
    });
  };

  //FIND STOCK/COMPANY NAME (CLICK EVENT)
  $(".companyNameInput").on("submit", event => {
    event.preventDefault();
    $getCompanyName();
  });

  ///NEWS ON THAT STOCK
  const $getNews = () => {
    const endpoint =
      "https://newsapi.org/v2/top-headlines?country=us&apiKey=b010681d8213431d9255306aa8c4d3cf";

    const handleData = data => {
      //   const $news = $("<div>").text(data.articles[0][author]);
      //   $("child2").appened($news);
      console.log(data);
    };

    $.ajax({
      url: endpoint
    }).then(data => {
      handleData(data);
    });
  };

  $getNews();

  //SELECT STOCK FROM LIST OF OPTIONS (CLICK EVENT)
  $(".child1").on("click", ".companiesTicker", event => {
    const $selectedTicker = $(event.currentTarget).text();

    const handleData = data => {
      const $stockInfo = $("<ul>");

      console.log(data);
      const $symbol = $("<li>").text(data["Global Quote"]["01. symbol"]);
      $stockInfo.append($symbol);

      const $open = $("<li>").text(
        ` Opening Price: ${data["Global Quote"]["02. open"]}`
      );
      $stockInfo.append($open);

      const $high = $("<li>").text(
        `High For Today: ${data["Global Quote"]["03. high"]}`
      );
      $stockInfo.append($high);

      const $low = $("<li>").text(
        `Low For Today: ${data["Global Quote"]["04. low"]}`
      );
      $stockInfo.append($low);

      const $price = $("<li>")
        .text(`Current Price: ${data["Global Quote"]["05. price"]}`)
        .css({ "font-weight": "700", "font-style": "italic", color: "red" });
      $stockInfo.append($price);

      const $buy = $("<button>").text("BUY");
      $buy.addClass("buyButton");
      $stockInfo.append($buy);

      $(".child2").append($stockInfo);
    };

    const endpoint = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${$selectedTicker}&apikey=JPOQL6NWBOFGUGHF`;

    $.ajax({
      url: endpoint
    }).then(data => {
      handleData(data);
    });
  });

  //BUY STOCK (PUSH TICKER TO GET INFO)
  const $buyStock = () => {
    const $getTicker = $(event.currentTarget)
      .parent()
      .find("li")
      .eq(0)
      .text();
    return $getTicker;
  };

  //SUBTRACT PURCHASE FROM BALANCE
  const $remaining = () => {
    let $currentRemaining = $userBalance - $totalHoldings;
    $(".cashleft").text(`$ ${$currentRemaining}`);
  };

  //TOTAL HOLDINGS
  const $portfolioBalance = () => {
    $(".portfolioBlanace").text(`$ ${$totalHoldings}`);
  };

  //BUY STOCK (CLICK EVENT)
  $(".child2").on("click", ".buyButton", event => {
    const $buyTicker = $buyStock();
    const $portfolio = $(".portfolio");

    const handleData = data => {
      console.log(data);
      if ($userBalance > 0) {
        const $portfolioRow = $("<tr>");
        const $companyName = $("<td>")
          .text(data["Global Quote"]["01. symbol"])
          .addClass("portfolioHolding");
        $portfolioRow.append($companyName);

        const $quauntity = $("<td>")
          .text("1")
          .addClass("portfolioHolding");
        $portfolioRow.append($quauntity);

        const $amount = $("<td>")
          .text(data["Global Quote"]["05. price"])
          .addClass("portfolioHolding");
        $portfolioRow.append($amount);

        $totalHoldings += parseInt($amount.text());
        $portfolio.append($portfolioRow);
        $remaining();
        $portfolioBalance();
      } else {
        alert("You do not have enough funds to purchse");
      }
    };

    $(".child2").empty();
    $(".companyNameInput").trigger("reset");
    $(".stocklookUptable td").remove();

    const endpoint = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${$buyTicker}&apikey=JPOQL6NWBOFGUGHF`;

    $.ajax({
      url: endpoint
    }).then(data => {
      handleData(data);
    });
  });
});
