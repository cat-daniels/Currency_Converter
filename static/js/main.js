$( document ).ready(function() {
    user_name = $('.user-name').text().slice(1,2);
    $('.user-letter').text(user_name.toUpperCase());
  
  
    fetch('https://api.frankfurter.app/currencies')
      .then((data) => data.json())
      .then((data) => {
        displayData(data);
      });
  
    function displayData(data) {
        $.each(data, function(index, value) {
            var datavalue = JSON.stringify(value.value);
            var datacode = JSON.stringify(value.code);
            $("#currency-selector-1").append("<option class='test' value='"+ index + "'><span id='currency-1'>" + value + "</span></option>");
            $("#currency-selector-2").append("<option class='test' value='"+ index + "'><span id='currency-2'>" + value + "</span></option>");
            $('#currency-selector-1 option[value="USD"]').attr("selected",true);
            $('#currency-selector-2 option[value="NZD"]').attr("selected",true);
        });
        loaded();
    }
  
    // Restricts input for the given textbox to the given inputFilter function.
    function setInputFilter(textbox, inputFilter) {
      ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function() {
          if (inputFilter(this.value)) {
            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
          } else if (this.hasOwnProperty("oldValue")) {
            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
          } else {
            this.value = "";
          }
        });
      });
    }
  
    setInputFilter(document.getElementById("input-amount-1"), function(value) {
      return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
    });
  
    setInputFilter(document.getElementById("input-amount-2"), function(value) {
      return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
    });
  
  });
  
      $(".currency-input").on('input', function (){
        let currency1 = $('#currency-selector-1 option:selected').attr("value");
        let currency2 = $('#currency-selector-2 option:selected').attr("value");
  
        let value = document.getElementById("input-amount-1").value;
  
        if(value == "") {
          document.getElementById("input-amount-2").value = "";
        } else {
            if (currency1 != currency2) {
              convert(currency1, currency2, value);
            } else {
              alert("Choose Different Currency");
            }
        }
      })
  
  function updatevalue() {
    let currency1 = $('#currency-selector-1 option:selected').attr("value");
    let currency2 = $('#currency-selector-2 option:selected').attr("value");
  
    let value = document.getElementById("input-amount-1").value;
  
  
    if (currency1 != currency2) {
      convert(currency1, currency2, value);
    } 
  }
  
  function convert(currency1, currency2, value) {
    const host = "api.frankfurter.app";
  
    fetch(`https://${host}/latest?amount=${value}&from=${currency1}&to=${currency2}`)
      .then((val) => val.json())
      .then((val) => {
        document.getElementById("input-amount-2").value = Object.values(val.rates)[0];
      });
  
    // Gets Current Conversion rate
    fetch(`https://${host}/latest?amount=1&from=${currency1}&to=${currency2}`)
    .then((val) => val.json())
    .then((val) => {
      console.log(val);
      document.getElementById("conversion-rate-container").style.opacity = "1";
      document.getElementById("conversion-rate").textContent = "1 "+ currency2 + " = " + Object.values(val.rates)[0] + " " + val.base;
    });
  }
  
  function switchCurrency(){
    var currency1 = $('#currency-selector-1 option:selected').attr("value");
    var currency2 = $('#currency-selector-2 option:selected').attr("value");
  
    $('#currency-selector-1').val(currency2).change();
    $('#currency-selector-2').val(currency1).change();
  
  }