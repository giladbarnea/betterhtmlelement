console.log('new');
const e = new BetterHTMLElement({ tag: 'DIV' });
// console.log(e);

// e.html('hi');
// console.log(e.innerHTML);
console.log('appending');
document.body.append(e);
