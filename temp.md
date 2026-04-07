function isPrime(num) {
if (num <= 1) return { prime: false, factors: [] }; // 0 and 1 are not prime numbers const factors=[]; for (let i=2; i
<=Math.sqrt(num); i++) { if (num % i===0) { factors.push(i); if (i !==num / i) { factors.push(num / i); // Add the
complementary factor } } } if (factors.length===0) { return { prime: true, factors: [] }; // No factors found, hence
it is prime } else { factors.unshift(1); // 1 is a factor for all numbers factors.push(num); // the number itself is
a factor return { prime: false, factors: [...new Set(factors)] }; // Return unique factors } } // Example usages:
console.log(isPrime(7)); // { prime: true, factors: [] } console.log(isPrime(12)); // { prime: false, factors: [ 1,
2, 3, 4, 6, 12 ] } console.log(isPrime(13)); // { prime: true, factors: [] } console.log(isPrime(15)); // { prime:
false, factors: [ 1, 3, 5, 15 ] }

/\*\*

- Checks if a number is prime and returns its factors if it is not.
- @param {number} num - The number to check.
- @returns {Object} An object containing the result: isPrime boolean and factors array.
  \*/
  function isPrime(num) {
  // Validate input
  if (typeof num !== 'number' || num < 1) { throw new Error('Input must be a positive integer.'); } // Handle edge cases
  for 1 and 2 if (num===1) return { isPrime: false, factors: [1] }; if (num===2) return { isPrime: true, factors: []
  }; // Check for factors and determine if the number is prime let factors=[]; for (let i=1; i <=Math.sqrt(num); i++)
  { if (num % i===0) { factors.push(i); if (i !==num / i) { factors.push(num / i); } } } factors.sort((a, b)=> a - b);
  // Sort factors for better readability
  return { isPrime: factors.length === 2, factors: factors };
  }

      // Example usage:
      const number = 28; // Change this number to test
      const result = isPrime(number);
      if (result.isPrime) {
      console.log(`${number} is a prime number.`);
      } else {
      console.log(`${number} is not a prime number. Its factors are: ${result.factors.join(', ')}`);
      }


/**
* Function to check if a number is prime and return factors if not.
* @param {number} num - The number to be checked.
* @returns {Object} - An object containing a boolean 'isPrime' and an array 'factors' (if not prime).
*/
function checkPrimeAndFactors(num) {
// Handle edge case for numbers less than 2
if (num < 2) { return { isPrime: false, factors: num>= 0 ? [num] : [] // For negative numbers, return empty array
    };
    }

    let isPrime = true; // Assume the number is prime
    const factors = []; // Array to hold factors of the number

    // Loop through 2 to the square root of the number
    for (let i = 2; i <= Math.sqrt(num); i++) { // Check if the current number divides num if (num % i===0) {
        isPrime=false; // Number is not prime factors.push(i); // Add the factor // Also add the corresponding factor
        (num / i) if it's different if (i !==num / i) { factors.push(num / i); } } } return { isPrime: isPrime, factors:
        isPrime ? [] : factors.sort((a, b)=> a - b) // Sort factors if not prime
        };
        }

        // Example usage:
        const result = checkPrimeAndFactors(28);
        console.log(`Is it prime? ${result.isPrime}`);
        console.log(`Factors: ${result.factors}`);