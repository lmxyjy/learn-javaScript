console.log(+0 === -0); //true
console.log(NaN === NaN); //false
console.log((+0).toString()); //'0'
console.log((-0).toString());//'0'

console.log(1/+0); //Infinity
console.log(1/-0); //-Infinity

// 对于正负零的判断
function eq(a,b){
    if(a === b) return a !== 0 || 1/a === 1/b;
    return false; //其他情况下return false
}

console.log(eq(0,0)); //true
console.log(eq(+0,-0)); //false

//对比NaN
function eq2(a,b){
    if(a !== a) return b !== b;
}

console.log(eq2(NaN,NaN));//true

/**
 * 第一版参数对比函数,用来过滤掉简单的类型比较，复杂的对象使用deepEq函数进行处理
 * @param {Any} a 
 * @param {Any} b 
 */
function eq(a,b){
    //结果为true区分出+0和-0
    if(a === b) return a !== 0 || 1/a !== 1/b;

    //typeof null的结果为object，这里判断，是为了让有null的情况尽早退出函数
    if(a == null || a == null) return false;

    //判断NaN
    if(a !== a) return b !== b;

    // 判断参数a类型，如果是基本类型，在这里可以直接返回false
    //这里不加b !== function的情况是因为，如果一旦b是function，而a是基本类型的话，就会调用到deepEq函数，
    //而这样的对比是没有意义的
    var type = typeof a;
    if(type !== 'function' && type !== 'object' && typeof b !== 'object') return false;

    //更复杂的对象使用deepEq函数进行判断
    return deepEq(a,b);

}

// 对于String对象的判断
console.log(typeof 'Curly'); //string
console.log(typeof new String('Curly')); //object

console.log(Object.prototype.toString.call('Curly')); //[object String]
console.log(Object.prototype.toString.call(new String('Curly'))); //[object String]

console.log('Curly' + "" === new String('Curly') + ''); //true

//Boolean
var a = true;
var b = new Boolean(true);
console.log(+a === +b);//true

//Date
var a = new Date(2009, 9, 25);
var b = new Date(2009, 9, 25);
console.log(+a === +b);//true

//RegExp
var a = /a/i;
var b = new RegExp(/a/i);
console.log('' + a === '' + b) // true

// Number
var a = 1;
var b = new Number(1);
console.log(+a === +b); //true
//但是数字不能这么判断，因为
var a = new Number(NaN);
var d = new Number(NaN);
console.log(+a === +b); //false

// 所以只能使用特殊的判断方式
function eqNaN(a,b){
    if(+a !== +b) return +b !== +a;
}

console.log(eqNaN(a,b)); //true

// deepEq函数

var toString = Object.prototype.toString;
/**
 * 深度对比函数
 * @param {any} a 
 * @param {any} b 
 */
function deepEq(a,b){
    var className = toString.call(a);
    if(className !== toString.call(b)) return false;

    //除了Number以外，其他类型判断都比较相似
    switch (className) {
        case '[object RegExp]':
        case '[object String]':    
            return ''+ a === '' + b;
        case '[object Number]':
            if(+a !== a) return +b !== b;//判断是否为NaN的情况
            return +a === 0 ? 1/+a === 1/b : +a === +b; //判断是否为new Number(+0),new Number(-0)的情况
        case '[object Date]':
        case '[object Boolean]':
            return +a === +b;
    }

    //关于构造函数的判断
    var areArrays = className === '[object Array]';
    //不是数组
    if(!areArrays){
        //过滤掉两个函数的情况
        if(typeof a != 'object' || typeof b != 'object')return false;

        var aCtor = a.constructor, bCtor=b.constructor;
        //aCtor和bCtor必须都存在并且都不是Object构造函数的情况下，aCtor不等于bCtor，那这两个对象就真的不相等啦
        //Object instanceof Object // true有这个特点存在
        if(aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor)
            && ('constructor' in a && 'constructor' in b)){
            return false;
        }
    }

    //对于数组和对象的判断，不过其实这个很简单，就是递归遍历一遍……
    if(areArrays){
        length = a.length;
        if(length !== b.length) return false;

        while(length--){
            if(!eq(a[length],b[length])) return false;
        }
    }else{
        var keys = Object.keys(a),key;
        length = keys.length;

        if(Object.keys(b).length !== length) return false;

        while(length--){
            key = keys[length];
            if(!(b.hasOwnProperty(key) && eq(a[key],b[key]))) return false;
        }
    }
    return true;
}

//判断是否为函数
function isFunction(obj){
    return toString.call(obj) === '[object Function]';
}


var a, b;

a = { foo: { b: { foo: { c: { foo: null } } } } };
b = { foo: { b: { foo: { c: { foo: null } } } } };
a.foo.b.foo.c.foo = a;
b.foo.b.foo.c.foo = b;

function eq(a, b, aStack, bStack) {
    if (typeof a == 'number') {
        return a === b;
    }

    return deepEq(a, b, aStack, bStack)
}

function deepEq(a, b, aStack, bStack) {

    aStack = aStack || [];
    bStack = bStack || [];

    var length = aStack.length;

    while (length--) {
        if (aStack[length] === a) {
            console.log("===>",aStack[length] ,"aaa===>",a);
              return bStack[length] === b;
        }
    }

    aStack.push(a);
    bStack.push(b);

    var keys = Object.keys(a);
    var length = keys.length;
    var key;

    while (length--) {
        key = keys[length]

        console.log(a[key], b[key], aStack, bStack)

        if (!eq(a[key], b[key], aStack, bStack)) return false;
    }

    // aStack.pop();
    // bStack.pop();
    return true;

}

console.log(eq(a, b))


// 最终版本的eq函数
var toString = Object.prototype.toString;

function isFunction(obj) {
    return toString.call(obj) === '[object Function]'
}

function eq(a, b, aStack, bStack) {

    // === 结果为 true 的区别出 +0 和 -0
    if (a === b) return a !== 0 || 1 / a === 1 / b;

    // typeof null 的结果为 object ，这里做判断，是为了让有 null 的情况尽早退出函数
    if (a == null || b == null) return false;

    // 判断 NaN
    if (a !== a) return b !== b;

    // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;

    // 更复杂的对象使用 deepEq 函数进行深度比较
    return deepEq(a, b, aStack, bStack);
};

function deepEq(a, b, aStack, bStack) {

    // a 和 b 的内部属性 [[class]] 相同时 返回 true
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;

    switch (className) {
        case '[object RegExp]':
        case '[object String]':
            return '' + a === '' + b;
        case '[object Number]':
            if (+a !== +a) return +b !== +b;
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            return +a === +b;
    }

    var areArrays = className === '[object Array]';
    // 不是数组
    if (!areArrays) {
        // 过滤掉两个函数的情况
        if (typeof a != 'object' || typeof b != 'object') return false;

        var aCtor = a.constructor,
            bCtor = b.constructor;
        // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦
        if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
    }


    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;

    // 检查是否有循环引用的部分
    while (length--) {
        if (aStack[length] === a) {
            return bStack[length] === b;
        }
    }

    aStack.push(a);
    bStack.push(b);

    // 数组判断
    if (areArrays) {

        length = a.length;
        if (length !== b.length) return false;

        while (length--) {
            if (!eq(a[length], b[length], aStack, bStack)) return false;
        }
    }
    // 对象判断
    else {

        var keys = Object.keys(a),
            key;
        length = keys.length;

        if (Object.keys(b).length !== length) return false;
        while (length--) {

            key = keys[length];
            if (!(b.hasOwnProperty(key) && eq(a[key], b[key], aStack, bStack))) return false;
        }
    }

    aStack.pop();
    bStack.pop();
    return true;

}

console.log(eq(0, 0)) // true
console.log(eq(0, -0)) // false

console.log(eq(NaN, NaN)); // true
console.log(eq(Number(NaN), Number(NaN))); // true

console.log(eq('Curly', new String('Curly'))); // true

console.log(eq([1], [1])); // true
console.log(eq({ value: 1 }, { value: 1 })); // true

var a, b;

a = { foo: { b: { foo: { c: { foo: null } } } } };
b = { foo: { b: { foo: { c: { foo: null } } } } };
a.foo.b.foo.c.foo = a;
b.foo.b.foo.c.foo = b;

console.log(eq(a, b)) // true


// 自己封装一个检测实例,不含循环嵌套
/**
 * @param {Any} a 
 * @param {Any} b 
 */
function equal(a,b){
    // 首先对基本数据类型和+0,-0做一个判断
    /*这里可以对相同的基本数据类型和+0，-0做一个过滤。*/
    if(a === b) return a !== 0 || 1/a === 1/b;

    //判断是否为null,如果为null就退出函数
    /*到了这一步后，说明a,b两个值不能简单的通过===判断是否相同，那么就再判断他们其中一个是否是null，如果是空就直接返回false*/
    if(a === null || b === null ) return false;

    //判读是否是NaN
    /*到这里数据两个数据对比还未完成，那么再看其是否是特殊的NaN，假设a='a',b='NaN'那么条件不满足，程序继续执行。
    如果a='NaN',b='a'，那么条件满足，直接返回false。假设a，b都是NaN，那么条件满足，直接返回true。
    */
    if(a !== a) return b !== b;

    //判断a是否是基本类型，如果是基本类型就返回false
    /*来到这里后，a肯定不是NaN了。判断a是否是基本的数据类型，如果a是基本数据类型，同时b是函数或者基本数据类型的情况下，直接返回false
    之所以不写typeof b !== 'function';的原因是因为，基本数据类型不可能和函数类型相同,如果我们写上了typeof b !== 'function'的话。
    它就会在虽然a是基本数据，b是function的情况下进入到deepEqual函数中去，实际上这是没有意义的对比。
    而基本数据类型我们是判定和它的包装对象是相同的，所以，如果a，b都不是包装对象的情况下，依旧返回false。
    */
    let type = typeof a;
    if(type !== 'function' && type !== 'object' && typeof b !== 'object') return false;

    //如果以上的条件都无法判断，那么就进入到深层次的判断当中去。
    /*当a是复杂数据类型或者b是包装对象的时候，进入到深层次的判断当中去*/
    return deepEqual(a,b);
}

/**
 * 深度对比
 * @param {Any} a 
 * @param {Any} b 
 */
const toString = Object.prototype.toString;

function isFunction(obj){
    return toString(obj) === '[object Function]';
}

function deepEqual(a,b){
    //这里的情况是，a是基本数据类型(除了null和NaN)，b是复杂数据类型（除了function）。
    // a是复杂数据类型，b是除了null以外的基本数据类型，或者复杂数据类型。

    // 首先对包装对象进行判断处理,如果他们的类型不同，就直接返回false。因为基本数据类型调用toString方法
    // 和它的包装对象调用toString方法的返回值是一致的。
    let typea = toString.call(a);
    let typeb = toString.call(b);
    if(typea !== typeb) return false;

    // 这里的判断方式是使用的隐式的类型转换。'' + 'str' === '' + new String('str');除了Number类型比较特殊以外
    switch (typea) {
        case '[object RegExp]':
        case '[object String]':
            return ''+a === '' + b;
        case '[object Number]':
            if(+a !== +a) return +b !== +b; //这里是为了判断new Number(NaN)和 new Number(NaN) 
            return +a === 0 ? 1 / +a === 1 / +b : +a === +b;//这里是为了判断是否是new Number(+/-0)
        case '[object Boolean]':
        case '[object Date]':
            return +a === +b;
    }

    //如果上面都不满足，那么就进行对构造函数的判断
    let areArrays = typea === '[object Array]';
    // 如果不是数组
    if(!areArrays){
        //过滤掉2个都是函数的情况
        if(typeof a !== 'object' || typeof b !== 'object') return false;

        let aCtor = a.constructor; 
        let bCtor = b.constructor;

        // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦 因为Object instanceof Object === true
        if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
    }

    // 对对象和数组进行判断
    if(areArrays){
        length = a.length;
        if(length !== b.length) return false;

        while(length--){
            if(!eq(a[length],b[length])) return false;
        }
    }else{
        let keys = Object.keys(a);
        let key;

        if(Object.keys(b).length !== keys) return false;

        while(length--){
            key = keys[length];
            if(!(b.hasOwnProperty(key) && eq(a[key],b[key]))) return false;
        }
    }

    return true;
}


