function hasAmiga(string) {
  return /\ba+mi+gaa+\b/ig.test(string);
}

export { hasAmiga }
