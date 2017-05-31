function detectAmiga(status) {
  return {...status, amiga: /\ba+mi+gaa+\b/ig.test(status.content)};
}

export default detectAmiga;
