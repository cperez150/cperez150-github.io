const endpoint = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=Micro&apikey=JPOQL6NWBOFGUGHF`;

const callAPI = (endpoint, handleData) => {
  $.ajax({
    url: endpoint
  }).then(data => {
    handleData(data); // get data asynchronously, when the data gets back, handle it
  });
};

const findCompany = (companyName, data) => {
  for (let i = 0; i < data.length; i++) {
    if (data.bestMatches[i]["2. name"] === companyName) {
      return data.bestMatches[i];
    }
  }
};

$(() => {
  callAPI(endpoint, data => {
    console.log(findCompany("Microsoft Corporation", data));
  });

  //  const text = $companyInput.val();
  //  const endpoint = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${text}&apikey=JPOQL6NWBOFGUGHF`;
  //  const handleData = data => {
  //     console.log("before the loop");
  //     for (let i = 0; i < data.length; i++) {
  //       console.log("in the loop");
  //       console.log(data.bestMatches[0]["2. name"]);
  //       // const $div = $("<div>").text(data.bestMatches[i]["2. name"]);
  //       // $(".companyNameInput").append($div);
  //     }
  //   };
  //   $.ajax({
  //     url: endpoint
  //   }).then(data => {
  //     handleData(data); // get data asynchronously, when the data gets back, handle it
  //   });
  // });
  //user input balance
  //   const $availableBalance = $("#availableBalanceInput");
  //   $(".availbalance").on("submit", event => {
  //     event.preventDefault();
  //     const $inputAmount = $availableBalance.val();
  //     console.log($inputAmount);
  //     $(event.currentTarget).trigger("reset");
  //   });
  //   //Find Stock Ticker
  //   const $companyInput = $("#companyGrab");
  //   $(".companyNameInput").on("submit", event => {
  //     event.preventDefault();
  //   }
  //based on stock selection subtract available balance
  //list holdings
  //total holdings
});
