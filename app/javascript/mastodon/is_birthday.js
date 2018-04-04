const BIRTHDAY = new Date(Date.UTC(2017, 3, 10, 6, 0));
// note: months start at 0 in javascript because, fuck if i know
const TOLERANCE = 24*60*60*1000;

export default function is_birthday(){
  const now = new Date();
  const birthday = new Date(BIRTHDAY);
  birthday.setUTCFullYear(now.getUTCFullYear());
  return +now > +birthday && +now < +birthday + TOLERANCE;
  // the weird use of unary + is to cast the dates to numbers
}
