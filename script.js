// 입력값에 천단위 쉼표 적용
function formatNumberInput(el) {
  const raw = el.value.replace(/,/g, '');
  if (raw === '' || isNaN(raw)) {
    el.value = '';
    return;
  }
  el.value = Number(raw).toLocaleString();
}

// 쉼표 제거 후 숫자로 파싱
function parseNumber(val) {
  if (val == null) return NaN;
  const raw = String(val).replace(/,/g, '');
  return parseFloat(raw);
}

/* === 수익률 계산 === */
function calculateProfit() {
  const buy = parseNumber(document.getElementById('buyPrice').value);
  const sell = parseNumber(document.getElementById('sellPrice').value);
  const amount = parseNumber(document.getElementById('amount').value);
  const result = document.getElementById('resultProfit');

  if (isNaN(buy) || isNaN(sell) || isNaN(amount)) {
    result.innerHTML = "⚠️ 모든 값을 입력해 주세요.";
    return;
  }

  const profitPerUnit = sell - buy;
  const totalProfit = profitPerUnit * amount;
  const returnRate = ((sell - buy) / buy) * 100;

  result.innerHTML =
    `✔️ 단위당 수익: ${profitPerUnit.toLocaleString()}<br>` +
    `✔️ 총 수익: ${totalProfit.toLocaleString()}<br>` +
    `✔️ 수익률: ${returnRate.toFixed(2)}%`;
}

/* === 퍼센트 변화 계산 (증감율 + 차이값) === */
function calculateChange() {
  const original = parseNumber(document.getElementById('originalValue').value);
  const changed  = parseNumber(document.getElementById('changedValue').value);
  const result = document.getElementById('resultChange');

  if (isNaN(original) || isNaN(changed) || original === 0) {
    result.innerHTML = "⚠️ 모든 값을 올바르게 입력해 주세요.";
    return;
  }

  const diff = changed - original;
  const rate = (diff / original) * 100;
  const direction = rate > 0 ? '증가' : (rate < 0 ? '감소' : '변화 없음');

  if (direction === '변화 없음') {
    result.innerHTML = `✔️ 변화 없음 (0.00%)`;
    return;
  }

  result.innerHTML =
    `✔️ ${direction}율: ${rate.toFixed(2)}%<br>` +
    `(${direction}된 금액: <strong>${Math.abs(diff).toLocaleString()}</strong>)`;
}

/* === 퍼센트 증감 결과 === */
function calculateAdjustedAmount() {
  const base = parseNumber(document.getElementById('baseValue').value);
  const percent = parseNumber(document.getElementById('percentChange').value);
  const changeType = document.getElementById('changeType').value;
  const result = document.getElementById('resultAdjustedAmount');

  if (isNaN(base) || isNaN(percent)) {
    result.innerHTML = "⚠️ 모든 값을 입력해 주세요.";
    return;
  }

  let changedAmount, difference, label;
  if (changeType === 'increase') {
    changedAmount = base * (1 + percent / 100);
    difference = changedAmount - base;
    label = '증가';
  } else {
    changedAmount = base * (1 - percent / 100);
    difference = base - changedAmount;
    label = '감소';
  }

  result.innerHTML =
    `✔️ ${percent}% ${label}한 값: <strong>${changedAmount.toLocaleString()}</strong><br>` +
    `(${label}된 금액: <strong>${difference.toLocaleString()}</strong>)`;
}
