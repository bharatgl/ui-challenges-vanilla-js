// reduce polyfill


Array.prototype.myReduce = function(callback, initialValue){
    let acc = initialValue; //2 
    let startIndex = 0;
    if(arguments.length<2){

        if(this.length===0) throw new TypeError('Reduce of empty array with no initial values')
        acc = this[0];
        startIndex = 1;
    }
    for(let i = startIndex;i<this.length;i++){ // 0
       if(i in this){
         acc = callback(acc,this[i],i , this) 
       }
    }
    return acc;
}


console.log([1,2,3,10,50].myReduce(x=>x*8,{}))






const add = (prev: any, curr: any) => prev + curr;
const multiplyByIndex = (prev: number, curr: number, index: number) =>
  prev + curr * index;
const subtract = (prev: number, curr: number) => prev - curr;
const sumOfSquares = (prev: any, curr: any, index: number, array: Array<any>) =>
  prev + curr * array[index];
const combineObj = (prev: Object, curr: Object) => ({ ...prev, ...curr });
const combineArr = (prev: Array<any>, curr: any) => [...prev, curr];

describe('Array.prototype.myReduce', () => {
  test('empty array equals initial value', () => {
    expect([].myReduce(add, 0)).toEqual(0);
    expect([].myReduce(subtract, 0)).toEqual(0);
  });

  test('one value', () => {
    expect([1].myReduce(add, 0)).toEqual(1);
    expect(['a'].myReduce(add, '')).toEqual('a');
  });

  test('two values', () => {
    expect([-4, 10].myReduce(add, 0)).toEqual(6);
    expect(['b', 'c', 'd'].myReduce(add, '')).toEqual('bcd');
  });

  test('multiple values', () => {
    expect([1, 2, 3].myReduce(add, 0)).toEqual(6);
    expect(['a', 'b', 'c', 'd'].myReduce(add, '')).toEqual('abcd');
  });

  test('object values', () => {
    expect([{ foo: 1 }, { bar: 2 }].myReduce(combineObj)).toEqual({
      foo: 1,
      bar: 2,
    });
    expect([{ foo: 1 }, { bar: 2 }].myReduce(combineObj, {})).toEqual({
      foo: 1,
      bar: 2,
    });
  });

  test('array values', () => {
    expect([1, 2, 3].myReduce(combineArr, [])).toEqual([1, 2, 3]);
  });

  test('reducer uses index argument when provided', () => {
    expect([1, 2, 3].myReduce(multiplyByIndex, 0)).toEqual(8);
    expect([-1, -3, 4].myReduce(multiplyByIndex, 0)).toEqual(5);
  });

  test('reducer uses array argument when provided', () => {
    expect([1, 2, 3, 4].myReduce(sumOfSquares, 0)).toEqual(30);
    expect([-1, -3, 4].myReduce(sumOfSquares, 0)).toEqual(26);
  });

  test('no initial value provided and array is empty', () => {
    expect(() => {
      [].myReduce(add);
    }).toThrow();
  });

  test('no initial value provided and array is non-empty', () => {
    expect([1, 2, 3].myReduce(add)).toEqual(6);
    expect([-1, -3, 4].myReduce(sumOfSquares, 0)).toEqual(26);
  });

  test('sparse arrays', () => {
    // eslint-disable-next-line no-sparse-arrays
    expect([1, 2, , 3].myReduce(add)).toEqual(6);
    // eslint-disable-next-line no-sparse-arrays
    expect([-1, -3, 4, , ,].myReduce(sumOfSquares, 0)).toEqual(26);
  });
});





// //map polyfill
// Array.prototype.myMap = function (callback){

//     let result = [];
//    for(let i=0;i<this.length;i++){
//     if(i in this){
//         result.push(callback(this[i],i,this))
//     }
//    }
//    return result;
// }


// console.log([1,2,3].myMap(x=>x*2))

// //filter polyfill 

// Array.prototype.myFilter = function(callback){
// let result = [];
// for (let i = 0; i<this.length; i++){
//  if(i in this && callback(this[i],i,this)){
//    result.push(this[i])
//    }
//   }
//   return result
//  }

// console.log([10,20,30].myFilter((x, i) => i > 0))   // [20, 30]

