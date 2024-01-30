const isPrime = (num) => {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
};

const fibonacci = (num) => {
  if (num === 0) return 0;
  if (num <= 1) return 1;

  return fibonacci(num - 1) + fibonacci(num - 2);
};

module.exports = {
  isPrime,
  fibonacci,
};
