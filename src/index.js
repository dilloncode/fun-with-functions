function log(input) {
  document.writeln(input + "<br />");
}

function logify(input) {
  document.writeln(JSON.stringify(input) + "<br />");
}

function add(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

function mul(a, b) {
  return a * b;
}

function identityf(arg) {
  return function() {
    return arg;
  };
}

function addf(arg1) {
  return function(arg2) {
    return arg1 + arg2;
  };
}

function liftf(func) {
  return function(arg1) {
    return function(arg2) {
      return func(arg1, arg2);
    };
  };
}

function curry(func, arg1) {
  return function(arg2) {
    return func(arg1, arg2);
  };
}

function twice(func) {
  return function(arg1) {
    return func(arg1, arg1);
  };
}

function reverse(func) {
  return function(a, b) {
    return func(b, a);
  };
}

function composeu(func1, func2) {
  return function(arg1) {
    return func2(func1(arg1));
  };
}

var doubl = twice(add);
var square = twice(mul);

function composeb(func1, func2) {
  return function(arg1, arg2, arg3) {
    return func2(func1(arg1, arg2), arg3);
  };
}

function limit(func, limit) {
  return function(arg1, arg2) {
    if (limit > 0) {
      limit -= 1;
      return func(arg1, arg2);
    }
    return undefined;
  };
}

function from(arg1) {
  return function() {
    var next = arg1;
    arg1 += 1;
    return next;
  };
}

function to(func1, arg1) {
  return function() {
    var result = func1();
    if (result < arg1) {
      return result;
    }
  };
}

function fromTo(start, end) {
  return to(from(start), end);
}

function element(arr, gen) {
  if (gen === undefined) {
    gen = fromTo(0, arr.length);
  }
  return function() {
    var index = gen();
    if (index !== undefined) {
      return arr[index];
    }
  };
}

function collect(gen, arr) {
  return function() {
    var result = gen();
    if (result !== undefined) {
      arr.push(result);
    }
    return result;
  };
}

function filter(gen, pred) {
  return function redo() {
    var value = gen();
    if (value === undefined || pred(value)) {
      return value;
    }
    return redo();
  };
}

function concat(func1, func2) {
  return function() {
    var value = func1();
    return value !== undefined ? value : func2();
  };
}

function gensymf(prefix) {
  var gen = from(1);
  return function() {
    return prefix + gen();
  };
}

function fibonaccif(first, second) {
  return function() {
    var result = first;
    first = second;
    second += result;
    return result;
  };
}

function counter(init) {
  return {
    up: () => (init += 1),
    down: () => (init -= 1)
  };
}

function revocable(func) {
  var revoked = false;
  return {
    invoke: function(a, b) {
      if (revoked) return undefined;
      return func(a, b);
    },
    revoke: function() {
      revoked = true;
    }
  };
}

function m(value, source) {
  return {
    value: value,
    source: typeof source === "string" ? source : String(value)
  };
}

function addm(a, b) {
  return m(a.value + b.value, `(${a.source}+${b.source})`);
}

function liftm(binary, op) {
  return function(a, b) {
    if (typeof a === "number") {
      a = m(a);
    }
    if (typeof b === "number") {
      b = m(b);
    }
    return m(binary(a.value, b.value), `(${a.source}${op}${b.source})`);
  };
}

function exp(arr) {
  if (Array.isArray(arr)) {
    return arr[0](exp(arr[1]), exp(arr[2]));
  }
  return arr;
}

//var sae = [mul, 5, 11];
// log(exp(sae));
// log(exp(42));

// var nae = [Math.sqrt, [add, [square, 3], [square, 4]]];
// log(exp(nae));

function addg(first) {
  function more(next) {
    if (next === undefined) {
      return first;
    }
    first += next;
    return more; // retursion: a function returns itself
  }
  if (first !== undefined) {
    return more;
  }
}

//log(addg(5)(3)(2)());

function liftg(func) {
  function first(a) {
    function more(next) {
      if (next === undefined) {
        return a;
      }
      a = func(a, next);
      return more;
    }
    if (a !== undefined) {
      return more;
    }
  }
  if (func !== undefined) {
    return first;
  }
}

// log(liftg(mul)());
// log(liftg(mul)(3)());
// log(liftg(mul)(3)(0)(4)());
// log(liftg(mul)(1)(2)(4)(8)());

// function arrayg(value) {
//   var result = [];
//   if (value !== undefined) {
//     result.push(value);
//     return function addVal(newVal) {
//       if (newVal === undefined) {
//         return result;
//       }
//       result.push(newVal);
//       return addVal;
//     }
//   }
//   return result;
// }

function arrayg(first) {
  var array = [];
  function more(next) {
    if (next === undefined) {
      return array;
    }
    array.push(next);
    return more;
  }
  return more(first);
}

// logify(arrayg());
// logify(arrayg(3)());
// logify(arrayg(3)(4)(5)());

function continuize(func1) {
  return function(func2, input) {
    return func2(func1(input));
  };
}

// var sqrtc = continuize(Math.sqrt);
// sqrtc(alert, 81);

function vector() {
  var array = [];

  return {
    get: i => array[i],
    store: (i, v) => (array[i] = v),
    append: v => array.push(v)
  };
}

// var test = vector();
// test.append(5);
// test.store('push', function() { return this });
// logify(test.append(this));

function pubsub() {
  var subscribers = [];
  return Object.freeze({
    subscribe: function(subscriber) {
      subscribers.push(subscriber);
    },
    publish: function(publication) {
      subscribers.forEach(function(s) {
        try {
          s(publication);
        } catch (ignore) {}
      });
    }
  });
}

var hey = pubsub();
hey.subscribe(log);
hey.publish("howdy");
