// Function to calculate the sum from 1 to n using the formula (n * (n + 1)) / 2
// This is a mathematical formula for the sum of natural numbers from 1 to n
function sum_to_n_a(n: number): number {
  return (n * (n + 1)) / 2; // Return the result calculated by the formula
}

// Function to calculate the sum from 1 to n by adding each value individually
// Uses a for loop to accumulate the sum of all numbers from 1 to n
function sum_to_n_b(n: number): number {
  let sum = 0; // Initialize the sum variable to store the total
  // Loop from 1 to n, adding each value to the sum
  for (let i = 1; i <= n; i++) {
    sum += i; // Add the value of i to the sum
  }
  return sum; // Return the total sum
}

// Function to calculate the sum from 1 to n using Array and reduce method
// Creates an array from 1 to n and calculates the sum of the elements using reduce
function sum_to_n_c(n: number): number {
  return Array.from({ length: n }, (_, i) => i + 1) // Create an array from 1 to n
    .reduce((sum, num) => sum + num, 0); // Use reduce to sum the array elements
}

// Function to verify the results of all implementations
// Uses several test cases to compare the output of the three methods
function verify_sum_to_n() {
  const testCases = [1, 2, 5, 10, 100, 1000]; // Test cases for validation
  testCases.forEach((n) => {
    // Call each function with the test case value n
    const resultA = sum_to_n_a(n);
    const resultB = sum_to_n_b(n);
    const resultC = sum_to_n_c(n);

    // Output the result from each method
    console.log(`n = ${n}`);
    console.log(`sum_to_n_a: ${resultA}`);
    console.log(`sum_to_n_b: ${resultB}`);
    console.log(`sum_to_n_c: ${resultC}`);
    // Check if all results match
    console.log(
      `Results: ${
        resultA === resultB && resultB === resultC ? "~PASS" : "~FAIL"
      }\n`
    );
  });
}

// Run the verification with the defined test cases
verify_sum_to_n();
