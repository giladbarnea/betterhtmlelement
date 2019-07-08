function extend(sup, base) {
	// var descriptor = Object.getOwnPropertyDescriptor(
	// 	base.prototype, 'constructor'
	// );
	// base.prototype = Object.create(sup.prototype);
	base.prototype = new sup.prototype.constructor();
	var handler = {
		construct: function (target, args) {
			var obj = Object.create(base.prototype);
			debugger;
			this.apply(obj, args);
			return obj;
		},
		apply: function (_, that, args) {
			console.log('\nthat: ', that, '\nargs: ', args);
			debugger;
			sup.apply(that, args);
			base.apply(that, args);
		}
	};
	var proxy = new Proxy(base, handler);
	// descriptor.value = proxy;
	// Object.defineProperty(base.prototype, 'constructor', descriptor);
	Object.defineProperty(base.prototype, 'constructor', proxy);
	return proxy;
}

var Person = function (name) {
	this.name = name;
};
var Boy = extend(Person, function (name, age) {
	this.age = age;
});

// Boy.prototype.gender = 'M';

var Peter = new Boy('Peter', 13);
console.log(Peter, Peter.prototype, typeof (Peter), Peter instanceof Boy);
debugger;


const MyHTMLElement = extend(HTMLElement, function (elemOptions) {
		const { tag, id, htmlElement, text, query, children, cls } = elemOptions;

		if ([tag, id, htmlElement, query].filter(x => x).length > 1)
			throw new Error(`Received more than one, pass exactly one of: [tag, id, htmlElement, query], ${{
				tag,
				id,
				htmlElement,
				query
			}}`);
		if (tag)
			this._htmlElement = document.createElement(tag);
		else if (id)
			this._htmlElement = document.getElementById(id);
		else if (query)
			this._htmlElement = document.querySelector(query);
		else if (htmlElement)
			this._htmlElement = htmlElement;
		else
			throw new Error(`Didn't receive one, pass exactly one of: [tag, id, htmlElement, query], ${{
				tag,
				id,
				htmlElement,
				query
			}}`);
		if (text !== undefined)
			this.text(text);
		if (cls !== undefined)
			this.class(cls);

		if (children !== undefined) {
			if (tag)
				throw new Error(`Received children and tag, impossible since tag implies creating a new element and children implies getting an existing one. ${{
					tag,
					id,
					htmlElement,
					text,
					query,
					children
				}}`);
			this.cacheChildren(children);
		}
		// Object.assign(this, proxy);
		/*const that = this;
		return new Proxy(this, {
			 get(target: BetterHTMLElement, p: string | number | symbol, receiver: any): any {
				  // console.log('logging');
				  // console.log('target: ', target,
				  //     '\nthat: ', that,
				  //     '\ntypeof(that): ', typeof (that),
				  //     '\np: ', p,
				  //     '\nreceiver: ', receiver,
				  //     '\nthis: ', this);
				  return that[p];
			 }
		})
		*/
	}
);
const e = new MyHTMLElement({ tag: 'DIV' });

// Boy.prototype.gender = 'M';


// const e = new BetterHTMLElement({ tag: 'DIV' });
// console.log(e);

// e.html('hi');
// console.log(e.innerHTML);
console.log('appending');
document.body.append(e);
