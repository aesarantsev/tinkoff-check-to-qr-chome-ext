import moment from 'moment';

export const createQrContent = ({ t, s, fn, i, fp, n }) => {
  return `t=${moment(t).format(
    'YYYYMMDDTHHmm'
  )}&s=${s}&fn=${fn}&i=${i}&fp=${fp}&n=${n}`;
};
