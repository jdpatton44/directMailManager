import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import typeAhead from './modules/typeAhead';

typeAhead($('.search'));

const checkWeight = () => {
  const total = Array.from($$('input.truck__check'))
    .filter(el => el.checked)
    .map(w => w.attributes['data-weight'].value)
    .reduce((acc, w) => acc + parseInt(w), 0);

  const totalWeightEl = document.getElementById('totalWeight');
  if(totalWeightEl) {
    totalWeightEl.innerHTML = total;
  }
};

checkWeight();
const boxes = document.getElementById('truck__boxes');
boxes.addEventListener('change', checkWeight);
