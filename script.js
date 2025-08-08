// 수익률 계산
function calculateProfit() {
  const buy = parseFloat(document.getElementById('buyPrice').value);
  const sell = parseFloat(document.getElementById('sellPrice').value);
  const amount = parseFloat(document.getElementById('amount').value);
  const result = document.getElementById('resultProfit');

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

// 증감 퍼센트 계산
function calculateChange() {
  const original = parseFloat(document.getElementById('originalValue').value);
  const changed = parseFloat(document.getElementById('changedValue').value);
  const result = document.getElementById('resultChange');

  if (isNaN(original) || isNaN(changed) || original === 0) {
    result.innerHTML = "⚠️ 모든 값을 올바르게 입력해 주세요.";
    return;
  }

  const rate = ((changed - original) / original) * 100;
  const direction = rate > 0 ? '증가' : '감소';

  result.innerHTML = `✔️ ${direction}율: ${rate.toFixed(2)}%`;
}

// 기준 금액 퍼센트 증가/감소 계산
function calculateAdjustedAmount() {
  const base = parseFloat(document.getElementById('baseValue').value);
  const percent = parseFloat(document.getElementById('percentChange').value);
  const result = document.getElementById('resultAdjustedAmount');

  if (isNaN(base) || isNaN(percent)) {
    result.innerHTML = "⚠️ 모든 값을 입력해 주세요.";
    return;
  }

  const increased = base * (1 + percent / 100);
  const decreased = base * (1 - percent / 100);

  result.innerHTML = `
    ✔️ ${percent}% 증가: ${increased.toFixed(2).toLocaleString()}원<br>
    ✔️ ${percent}% 감소: ${decreased.toFixed(2).toLocaleString()}원
  `;
}
