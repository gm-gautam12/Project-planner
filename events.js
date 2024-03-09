const buttons = document.querySelectorAll('button');

// button.onclick = function() {

// };

const buttonClickHandler = event => {
  // event.target.disabled = true;
  console.log(event);
};

const anotherButtonClickHandler = () => {
  console.log('This was clicked!');
};

// button.onclick = buttonClickHandler;
// button.onclick = anotherButtonClickHandler;

const boundFn = buttonClickHandler.bind(this);

// button.addEventListener('click', buttonClickHandler);

// setTimeout(() => {
//   button.removeEventListener('click', buttonClickHandler);
// }, 2000);

// buttons.forEach(btn => {
//   btn.addEventListener('mouseenter', buttonClickHandler);
// });

// window.addEventListener('scroll', event => {
//   console.log(event);
// });

// const form = document.querySelector('form');

// form.addEventListener('submit', event => {
//    event.preventDefault();
//   console.log(event);
// });

const div = document.querySelector('div');
div.addEventListener('click', event => {
  console.log('click div');
  console.log(event);
},true);


 const listItems = document.querySelectorAll('li');

// listItems.forEach(listItem => {
//   listItem.addEventListener('click',events => {
//     events.target.classList.toggle('highlight');
//   });
// });  not recomennded to use

function events(){
  events.target.classList.toggle('highlight');
}
const list =document.querySelector('ul');
list.addEventListener('click',events);

//closest() hmesha apne close wale ancestor ko call dega
// for eg: agar hmne h2 ko click kiya hoga toh woh agar li
//ke andar h toh us pure li ko call krega closest() or
//red kr dega
//event delegation

/*other type of events
1. click event
2. mouseenter
3. scroll event
4. submit event

*/
