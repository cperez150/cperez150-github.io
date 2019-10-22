$(() => {
  let $userBalance = 0;
  let $totalHoldings = 0;
  let $portfolioHoldings = [];

  //USER INPUT BALANCE
  $(".availbalance").on("submit", event => {
    event.preventDefault();
    //grab value from user input box
    const $availableBalance = parseFloat(
      $("#availableBalanceInput").val()
    ).toFixed(2);

    //create div to show balance w/conversion to number
    const $div = $("<div>").text(`$ ${$availableBalance}`);
    $userBalance = parseFloat($availableBalance).toFixed(2);
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
        const $tableRow = $("<tr>");
        const $companiesReturned = $("<td>")
          .text(data.bestMatches[i]["2. name"])
          .addClass("companiesReturned");
        $tableRow.append($companiesReturned);
        // const $companiesTicker = $("<td>");
        const $viewBtn = $("<button>")
          .text(data.bestMatches[i]["1. symbol"])
          .addClass("companiesTicker")
          .css({
            background: "black",
            color: "white",
            "border-radius": "10px",
            "box-shadow": "2px 2px 8px 2px #888888"
          });

        // $companiesTicker.append($viewBtn);
        $tableRow.append($viewBtn);
        $(".stocklookUptable").append($tableRow);
      }
    };
    $.ajax({
      url: endpoint
    }).then(data => {
      handleData(data);
    });
    $(event.currentTarget).trigger("reset");
    $(".companyNameInput").on("change", "input", function() {
      $(".stocklookUptable").empty();
    });
  };

  //FIND STOCK/COMPANY NAME (CLICK EVENT)
  $(".companyNameInput").on("submit", event => {
    event.preventDefault();
    $getCompanyName();
  });

  //SELECT STOCK FROM LIST OF OPTIONS (CLICK EVENT)
  $(".child1").on("click", ".companiesTicker", event => {
    const $selectedTicker = $(event.currentTarget).text();

    const $company = $(event.currentTarget)
      .prev()
      .text()
      .split(" ")[0];

    console.log($company);
    // console.log($getCompanyLogo($company));

    // const $getImgsrc = $('<img src="' + $getCompanyLogo($company) + '" />')

    const handleData = data => {
      const $stockInfo = $("<ul>").addClass("stockInfolist");
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

      //GET COMPANY LOGO AND ADD TO DIV
      const $getCompanyLogo = () => {
        const $val = $company;
        const endpoint = `https://autocomplete.clearbit.com/v1/companies/suggest?query=:${$val}`;

        const handleData = data => {
          const $imageAddress = data[0].logo;

          const $getImgsrc = $('<img src="' + $imageAddress + '" />');
          $(".child2").append($getImgsrc);
        };

        $.ajax({
          url: endpoint
        }).then(data => {
          handleData(data);
        });
      };

      $getCompanyLogo();

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
    let $currentRemaining = parseFloat($userBalance - $totalHoldings).toFixed(
      2
    );
    $(".cashleft").text(`$ ${$currentRemaining}`);
    return $currentRemaining;
  };

  // //ADD SELL TO BALANCE
  // const $sellBack = () => {
  //   let $currentRemaining = $userBalance - $totalHoldings;
  //   $(".cashleft").text(`$ ${$currentRemaining}`);
  //   return $currentRemaining;
  // };

  //NONVISIBLE REMAINING BALANCE COUNT W/RETURN STATEMENT TO GRAB VALUE
  const $buyStockUserRemaining = () => {
    let $currentRemaining = $userBalance - $totalHoldings;
    return $currentRemaining;
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
      if ($buyStockUserRemaining() >= data["Global Quote"]["05. price"]) {
        const $portfolioRow = $("<tr>");
        const $companyName = $("<td>")
          .text(data["Global Quote"]["01. symbol"])
          .addClass("portfolioHolding name");
        $portfolioHoldings.push($companyName);
        $portfolioRow.append($companyName);

        const $quauntity = $("<td>")
          .text(1)
          .addClass("portfolioHolding quantity");
        $portfolioRow.append($quauntity);

        const $amount = $("<td>")
          .text(data["Global Quote"]["05. price"])
          .addClass("portfolioHolding amount");
        $portfolioRow.append($amount);

        const $sell = $("<td>").addClass("portfolioHolding");
        const $sellbtn = $("<button>")
          .text("Sell")
          .addClass("sell");
        const $buyMorebtn = $("<button>")
          .text("Buy")
          .addClass("buyMore");
        $sell.append($sellbtn);
        $sell.append($buyMorebtn);
        $portfolioRow.append($sell);

        $totalHoldings += parseInt($amount.text());
        $portfolio.append($portfolioRow);
        $remaining();
        $portfolioBalance();
      } else {
        alert("You do not have enough funds available to make purchase");
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

  //BUYMORE OF CURRENT STOCK
  $(".portfolio").on("click", ".buyMore", event => {
    console.log($buyStockUserRemaining());

    let $getTickerFromPortfolio = $(event.currentTarget)
      .parent()
      .siblings()
      .eq(0)
      .text();

    const handleData = data => {
      const $stockPrice = data["Global Quote"]["05. price"];
      console.log($stockPrice);

      if ($buyStockUserRemaining() >= $stockPrice) {
        let $currentQuantity = parseInt(
          $(event.currentTarget)
            .parent()
            .siblings()
            .eq(1)
            .text()
        );

        $currentQuantity++;

        $(event.currentTarget)
          .parent()
          .siblings()
          .eq(1)
          .text($currentQuantity);

        let $currentAmount = parseInt(
          $(event.currentTarget)
            .parent()
            .siblings()
            .eq(2)
            .text()
        );
        $(event.currentTarget)
          .parent()
          .siblings()
          .eq(2)
          .text($currentAmount + parseInt($stockPrice));

        $totalHoldings += parseInt($stockPrice);
      } else {
        alert("Insufficent Funds");
      }
      $remaining();
      $portfolioBalance();
    };

    const endpoint = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${$getTickerFromPortfolio}&apikey=JPOQL6NWBOFGUGHF`;

    $.ajax({
      url: endpoint
    }).then(data => {
      handleData(data);
    });
  });

  // };

  //SELL STOCK CURRENT STOCK
  $(".portfolio").on("click", ".sell", event => {
    console.log($buyStockUserRemaining());

    let $getTickerFromPortfolio = $(event.currentTarget)
      .parent()
      .siblings()
      .eq(0)
      .text();

    const handleData = data => {
      const $stockPrice = data["Global Quote"]["05. price"];
      console.log($stockPrice);
      let $currentQuantity = parseInt(
        $(event.currentTarget)
          .parent()
          .siblings()
          .eq(1)
          .text()
      );
      if ($currentQuantity === 0) {
        $(event.currentTarget)
          .parent()
          .parent()
          .empty();
      } else if (
        $buyStockUserRemaining() <= $userBalance &&
        $currentQuantity > 0
      ) {
        $currentQuantity--;

        $(event.currentTarget)
          .parent()
          .siblings()
          .eq(1)
          .text($currentQuantity);

        let $currentAmount = parseInt(
          $(event.currentTarget)
            .parent()
            .siblings()
            .eq(2)
            .text()
        );
        $(event.currentTarget)
          .parent()
          .siblings()
          .eq(2)
          .text($currentAmount - parseInt($stockPrice));

        $totalHoldings -= parseInt($stockPrice);
      } else {
        alert("Nothing to Sell");
      }
      $remaining();
      $portfolioBalance();
    };

    const endpoint = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${$getTickerFromPortfolio}&apikey=JPOQL6NWBOFGUGHF`;

    $.ajax({
      url: endpoint
    }).then(data => {
      handleData(data);
    });
  });
});
