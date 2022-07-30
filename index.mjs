import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);

const accBob = await stdlib.newTestAccount(startingBalance);
const accAlice = await stdlib.newTestAccount(stdlib.parseCurrency(6000));
  
console.log('Hello, Alice and Bob!');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const choiceArray = ["I'm not here", "I'm still here"]

const getBalance = async (who) => stdlib.formatCurrency((await stdlib.balanceOf(who)));

console.log(`Alice's account balance before is: ${await getBalance(accAlice)}`);
console.log(`Bob's account balance before is: ${await getBalance(accBob)}`);

const Shared = () =>({
  showTime: (t) =>{
    console.log(`Time is ${t}`)
  }
})

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    ...stdlib.hasRandom,
    ...Shared(),
    inherit: stdlib.parseCurrency(5000),
    getChoice: () => {
      const choice = Math.floor(Math.random() * 2);
      console.log(`Alice's choice is ${choiceArray[choice]}`)
      return (choice == 0 ? false : true);
    },
    // implement Alice's interact object here
  }),
  backend.Bob(ctcBob, {
    ...stdlib.hasRandom,
    ...Shared(),
    acceptTerms: (num) => {
      console.log(`Bob accepts the terms of The Vault for ${stdlib.formatCurrency(num)}`)
      return true;
    },
    // implement Bob's interact object here
  }),
]);

console.log(`Alice's account balance after is: ${await getBalance(accAlice)}`);
console.log(`Bob's account balance after is: ${await getBalance(accBob)}`);

console.log('Goodbye, Alice and Bob!');
