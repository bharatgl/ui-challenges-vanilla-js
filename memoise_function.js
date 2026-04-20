const sum = (a, b) => (a + b)


function memoize(sum) {

    const cache = {}
    return function (a = 4, b = 2) {
        const key = JSON.stringify(a, b)

        console.log(
            {JSON, second : JSON.stringify(2, 2)}, "JSON"
        )
        console.log("key", key)

        if (key in cache) {
            console.log("cache", cache[key], cache)
            return cache[key]
        }
        const functionOutput = sum(a, b);
        console.log("functionOutput", functionOutput)
        cache[key] = functionOutput;
        return functionOutput

    }
}
console.log(memoize(sum)(2, 2))

// Input:
// fnName = "sum"
// actions = ["call","call","getCallCount","call","getCallCount"]
// values = [[2,2],[2,2],[],[1,2],[]]
// Output: [4,4,1,3,2]
// Explanation:
// const sum = (a, b) => a + b;
// const memoizedSum = memoize(sum);
// memoizedSum(2, 2); // "call" - returns 4. sum() was called as (2, 2) was not seen before.
// memoizedSum(2, 2); // "call" - returns 4. However sum() was not called because the same inputs were seen before.
// // "getCallCount" - total call count: 1
// memoizedSum(1, 2); // "call" - returns 3. sum() was called as (1, 2) was not seen before.
// // "getCallCount" - total call count: 2
 