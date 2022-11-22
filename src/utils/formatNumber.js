import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00').concat(' đ');
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}

const defaultNumbers = ' hai ba bốn năm sáu bảy tám chín';

const chuHangDonVi = `1 một${defaultNumbers}`.split(' ');
const chuHangChuc = `lẻ mười${defaultNumbers}`.split(' ');
const chuHangTram = `không một${defaultNumbers}`.split(' ');

function convertBlockThree(number) {
  if (number === '000') return '';
  const _a = number.toString();

  switch (_a.length) {
    case 0: { return '' }
    case 1: { return chuHangDonVi[_a] }
    case 2: { return convertBlockTwo(_a) }
    case 3: {
      let chucDv = '';
      if (_a.slice(1, 3) !== '00') {
        chucDv = convertBlockTwo(_a.slice(1, 3));
      }
      const tram = `${chuHangTram[_a[0]]} trăm`;
      return `${tram} ${chucDv}`;
    }
    default: {
      return null;
    }
  }
}

function convertBlockTwo(number) {
  let dv = chuHangDonVi[number[1]];
  const chuc = chuHangChuc[number[0]];
  let append = '';

  // Nếu chữ số hàng đơn vị là 5
  if (number[0] > 0 && number[1] === 5) {
    dv = 'lăm'
  }

  // Nếu số hàng chục lớn hơn 1
  if (number[0] > 1) {
    append = ' mươi';

    if (number[1] === 1) {
      dv = ' mốt';
    }
  }

  return `${chuc} ${append} ${dv}`;
}

const dvBlock = '1 nghìn triệu tỷ'.split(' ');

export function toVietnamese(number) {
  const str = parseInt(number, 10).toString();
  let i = 0;
  const arr = [];
  let index = str.length;
  const result = [];
  let rsString = '';

  if (index === 0 || str === 'NaN') {
    return '';
  }

  while (index >= 0) {
    arr.push(str.substring(index, Math.max(index - 3, 0)));
    index -= 3;
  }

  for (i = arr.length - 1; i >= 0; i -= 1) {
    if (arr[i] !== '' && arr[i] !== '000') {
      result.push(convertBlockThree(arr[i]));

      if (dvBlock[i]) {
        result.push(dvBlock[i]);
      }
    }
  }
  rsString = result.join(' ');
  return rsString.replace(/[0-9]/g, '').replace(/ /g, ' ').replace(/ $/, '');
}