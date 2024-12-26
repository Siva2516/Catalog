const fs = require('fs');

// Decode a number given its base
function decodeValue(base, value) {
    return BigInt(parseInt(value, base));
}

// Lagrange Interpolation to find the constant term (y-value at x=0)
function lagrangeInterpolation(points) {
    let constantTerm = BigInt(0);
    
    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;
        
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                const denominator = BigInt(points[i].x - points[j].x);
                const numerator = BigInt(0) - BigInt(points[j].x);
                term = term * numerator / denominator;
            }
        }
        constantTerm += term;
    }
    
    return constantTerm;
}

// Function to read JSON file and parse it
function findSecretConstant(jsonFile) {
    // Read JSON data
    const data = JSON.parse(fs.readFileSync(jsonFile));

    const n = data.keys.n;
    const k = data.keys.k;

    // Decode the points
    const points = [];
    for (const key in data) {
        if (key !== "keys") {
            const x = parseInt(key); // x is the key
            const base = data[key].base;
            const value = data[key].value;
            const y = decodeValue(base, value);
            points.push({ x: x, y: y });
        }
    }

    if (points.length < k) {
        throw new Error("Not enough points to determine the polynomial.");
    }

    // Calculate the secret constant using Lagrange interpolation
    return lagrangeInterpolation(points.slice(0, k));
}

// Option 1: Process multiple test case files
const testCaseFiles = ["test_case1.json", "test_case2.json"];
for (const file of testCaseFiles) {
    console.log(`Processing ${file}...`);
    const secret = findSecretConstant(file);
    console.log(`The secret constant term for ${file} is: ${secret}`);
}

// Option 2: Use command-line arguments (uncomment below to test)
// const file = process.argv[2];
// if (!file) {
//     console.log("Usage: node LagrangeInterpolation.js <test_case_file>");
//     process.exit(1);
// }
// const secret = findSecretConstant(file);
// console.log(`The secret constant term for ${file} is: ${secret}`);
