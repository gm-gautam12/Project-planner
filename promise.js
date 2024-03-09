// how to create a promise

const promise =  new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve();
    },duration);
});

//to overcome the callback nesting or callback hell we 
//generally use promise as it optimise the call back
//by removing unnecessary nesting