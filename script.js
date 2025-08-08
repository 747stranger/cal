    function calculate() {
      const buy = parseFloat(document.getElementById('buyPrice').value);
      const sell = parseFloat(document.getElementById('sellPrice').value);
      const amount = parseFloat(document.getElementById('amount').value);
      const result = document.getElementById('resultArea');

      if (isNaN(buy) || isNaN(sell) || isNaN(amount)) {
        result.innerHTML = "⚠️ 모든 값을 입력해 주세요.";
        return;
      }

      const profitPerUnit = sell - buy;
      const totalProfit = profitPerUnit * amount;
      const returnRate = ((sell - buy) / buy) * 100;

      result.innerHTML = `
        ✔️ 단위당 수익: ${profitPerUnit.toLocaleString()}원<br>
        ✔️ 총 수익: ${totalProfit.toLocaleString()}원<br>
        ✔️ 수익률: ${returnRate.toFixed(2)}%
      `;
    }