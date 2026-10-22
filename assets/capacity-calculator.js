(() => {
  'use strict';
  const number = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 6 });
  const maxInput = 1000000;
  function positiveDecimal(id, label) {
    const raw = document.getElementById(id).value.trim();
    if (!/^(?:\d+(?:\.\d{0,3})?|\.\d{1,3})$/.test(raw)) {
      throw new Error(label + '을(를) 소수점 셋째 자리까지의 양수로 입력해 주세요.');
    }
    const value = Number(raw);
    if (!Number.isFinite(value) || value <= 0 || value > maxInput) {
      throw new Error(label + '은(는) 0보다 크고 1,000,000 이하인 값으로 입력해 주세요.');
    }
    return Math.round(value * 1000);
  }
  function positiveCount(id) {
    const raw = document.getElementById(id).value.trim();
    const value = Number(raw);
    if (!/^\d+$/.test(raw) || !Number.isSafeInteger(value) || value < 1 || value > maxInput) {
      throw new Error('모듈 수량은 1~1,000,000 사이의 정수로 입력해 주세요.');
    }
    return value;
  }
  function connect(formId, errorId, resultId, calculate) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const error = document.getElementById(errorId);
      const result = document.getElementById(resultId);
      error.textContent = '';
      result.textContent = '';
      try { result.textContent = calculate(); }
      catch (e) { error.textContent = e.message; }
    });
    form.addEventListener('input', () => {
      document.getElementById(errorId).textContent = '';
      document.getElementById(resultId).textContent = '입력값을 변경했습니다. 계산 버튼을 눌러 다시 확인하세요.';
    });
  }
  connect('capacity-form', 'capacity-error', 'capacity-result', () => {
    const milliWatts = positiveDecimal('module-watts', '모듈 정격출력');
    const count = positiveCount('module-count');
    const capacity = milliWatts * count / 1000000;
    return '모듈 측 DC 정격용량: ' + number.format(capacity) + ' kW (' + number.format(milliWatts / 1000) + ' W × ' + number.format(count) + '장 ÷ 1,000)';
  });
  connect('count-form', 'count-error', 'count-result', () => {
    const targetMilliKw = positiveDecimal('target-kw', '목표 DC 용량');
    const milliWatts = positiveDecimal('target-watts', '모듈 정격출력');
    const targetMilliWatts = targetMilliKw * 1000;
    const count = Math.floor((targetMilliWatts + milliWatts - 1) / milliWatts);
    const capacity = milliWatts * count / 1000000;
    return '목표 이상에 필요한 최소 수량: ' + number.format(count) + '장 · 합계 DC 용량: ' + number.format(capacity) + ' kW';
  });
})();
