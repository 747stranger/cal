// 입력값에 천단위 쉼표 적용 (소수점 허용)
function formatNumberInput(el) {
  let value = el.value.replace(/,/g, ''); // 기존 쉼표 제거
  // 숫자와 소수점만 허용 (소수점은 하나만)
  value = value.replace(/[^0-9.]/g, '');
  const parts = value.split('.');
  if (parts.length > 2) {
    // 소수점이 2개 이상이면 뒤쪽 소수점 제거
    value = parts[0] + '.' + parts.slice(1).join('');
  }

  if (value.includes('.')) {
    // 정수 부분만 쉼표 처리
    const intPart = parts[0] ? Number(parts[0]).toLocaleString() : '';
    const decimalPart = parts[1] ?? '';
    el.value = intPart + '.' + decimalPart;
  } else {
    el.value = value ? Number(value).toLocaleString() : '';
  }
}

// 쉼표 제거 후 숫자로 변환
function parseNumber(val) {
  if (!val) return NaN;
  return parseFloat(val.replace(/,/g, ''));
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

/* === 물타기(평단 조정) 계산 ===
유의:
   - 평단 낮추기: 목표평단 < 현재평단 이어야 하며, 현재가 < 목표평단이어야 함.
   - 평단 올리기: 목표평단 > 현재평단 이어야 하며, 현재가 > 목표평단이어야 함.
   - 현재가 == 목표평단 이면 이론상 무한대로 필요 (불가능).
*/
function calculateDCA() {
  const P = parseNumber(document.getElementById('dcaCurrentPrice').value); // 현재가
  const A = parseNumber(document.getElementById('dcaAvgPrice').value);     // 현재 평단
  const Q = parseNumber(document.getElementById('dcaQty').value);          // 보유 수량
  const T = parseNumber(document.getElementById('dcaTargetAvg').value);    // 목표 평단
  const out = document.getElementById('dcaResult');

  if ([P, A, Q, T].some(v => isNaN(v)) || Q <= 0) {
    out.innerHTML = "⚠️ 값을 올바르게 입력해 주세요. (수량은 0보다 커야 합니다)";
    return;
  }

  if (P === T) {
    out.innerHTML = "⚠️ 현재가와 목표 평단이 같으면 이론상 무한대 수량이 필요합니다. 목표를 조정해 주세요.";
    return;
  }

  // 목표가 현재평단과 같은 경우: 추가 매수 없이 이미 달성
  if (T === A) {
    out.innerHTML = "✔️ 목표 평단이 현재 평단과 같습니다. 추가 매수 필요 없음 (0개 / $0).";
    return;
  }

  // 달성 가능성 체크
  // 평단 낮추기
  if (T < A && P >= T) {
    out.innerHTML = "⚠️ 평단을 낮추려면 현재가가 목표 평단보다 낮아야 합니다. (현재가 < 목표평단)";
    return;
  }
  // 평단 올리기
  if (T > A && P <= T) {
    out.innerHTML = "⚠️ 평단을 올리려면 현재가가 목표 평단보다 높아야 합니다. (현재가 > 목표평단)";
    return;
  }

  // 필요 추가 수량(정확값)
  const x = (Q * (T - A)) / (P - T);

  if (!isFinite(x) || x <= 0) {
    out.innerHTML = "⚠️ 현재 입력으로는 목표 평단을 해당 가격에서 달성할 수 없습니다.";
    return;
  }

  // 금액 계산
  const dollarsExact = P * x;

  // 정수 주(개)만 살 수 있는 자산의 경우(예: 주식) 올림 기준
  const xWhole = Math.ceil(x);
  const dollarsWhole = P * xWhole;

  // 검증용: 정수주 매수 시 실제 평단
  const newAvgWithWhole = (A * Q + P * xWhole) / (Q + xWhole);

  out.innerHTML =
    `✔️ 필요한 추가 수량(정확): <strong>${x.toLocaleString(undefined, { maximumFractionDigits: 4 })}</strong> 개<br>` +
    `✔️ 필요 금액(정확): <strong>${dollarsExact.toLocaleString(undefined, { maximumFractionDigits: 4 })}</strong> 달러<br><br>` +
    `✔️ 정수 주로 매수 시: <strong>${xWhole.toLocaleString()}</strong> 개 (약 <strong>${dollarsWhole.toLocaleString(undefined, { maximumFractionDigits: 4 })}</strong> 달러)<br>` +
    `↳ 정수 주 기준 예상 평단: <strong>${newAvgWithWhole.toLocaleString(undefined, { maximumFractionDigits: 4 })}</strong>`;
}
