//promises pollyfills
Promise.myAll = function(iterable){
    return new Promise((resolve,reject)=>{
        const result = [];
        let completed = 0;
        if(promise.length===0){
            return resolve([]);
        }
        iterable.forEach((p,i)=>{
            Promise.resolve(p).then(val=>(
                result[i]= val;
                completed++;

                if(completed===iterable.length){
                    resolve( result)
                }
            ),reject)       
         })
    })
}


//polyfill for promice.race 

Promise.race = function(iterable){
    return new Promise ((resolve,reject)=>{
iterable.forEach((p)=>{Promise.resolve(p).then(resolve,reject)})
    })
}

//polyfill for promise.allSettled

Promise.allSettled = function(iterable){
    return new Promise((resolve,reject)=>{
   iterable.forEach(p)=>{
    Promise.resolve(p).then(val=>({
        status:"fulfilled",val
    })).catch(reason:({status:"rejected",reason}))   }
    })
}

//promise for promise.any

Promise.any = funciton(iterable){
    return new Promise((resolve,reject)=>{

        const errors = [];
        let rejected = 0;
        if(iterable.length){
            return reject([]);
        }
(
        iterable.forEach((p,i)=>{
            Promise.resolve(p).then(resolve).catch(err=>(
              
                    error[i]=err;
                    rejected++
                    
               if(iterable.length===rejected)AggregateError(new AgrigateError(error))
            ))
        }))
    })
}

