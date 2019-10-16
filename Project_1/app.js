$(() => {
  //   const endpoint = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${$text}&apikey=JPOQL6NWBOFGUGHF`;

  //   const handleData = data => {
  //     for (let i = 0; i < data.length; i++) {}
  //   };

  //   $.ajax({
  //     url: endpoint
  //   }).then(handleData); // get data asynchronously, when the data gets back, handle it

  //reference
  //   const handledata = data => {
  //     for (let i = 0; i < data.length; i++) {
  //       const obj = {
  //         City: data[i].borough,
  //         Descriptor: data[i].descriptor,
  //         Resolution: data[i].resolution_description
  //       };
  //       $boroughObjects.push(obj);
  //     }
  //   };

  //user input balance
  const $availableBalance = $("#availableBalanceInput");

  $(".availbalance").on("submit", event => {
    event.preventDefault();
    const $inputAmount = $availableBalance.val();
    console.log($inputAmount);
    $(event.currentTarget).trigger("reset");
  });

  const $companyInput = $("#companyGrab");

  //Find Stock Ticker
  const findStockTicker = () => {
    const $text = $companyInput.val();
    return $text;
  };

  $(".companyNameInput").on("submit", event => {
    event.preventDefault();

    const $value = findStockTicker();

    const endpoint = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${$value}&apikey=JPOQL6NWBOFGUGHF`;

    const handleData = data => {
      for (let i = 0; i < data.bestMatches.length; i++) {
        console.log(data.bestMatches[i]["2. name"]);
        // const $div = $("<div>").text(data.bestMatches[i]["2. name"]);
        // $(".companyNameInput").append($div);
      }
    };

    $.ajax({
      url: endpoint
    }).then(data => {
      handleData(data); // get data asynchronously, when the data gets back, handle it
    });
  });

  //based on stock selection subtract available balance
  //list holdings
  //total holdings
});
