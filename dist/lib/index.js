"use strict";
require("reflect-metadata");
class Route {
}
exports.Route = Route;
let targets = [];
;
exports.routesKey = Symbol('routesKey');
exports.basePathKey = Symbol('basePathKey');
function getRouteMetadata(target) {
    let routes = Reflect.getMetadata(exports.routesKey, target);
    if (!routes) {
        routes = [];
        Reflect.defineMetadata(exports.routesKey, routes, target);
    }
    return routes;
}
exports.getRouteMetadata = getRouteMetadata;
;
function route(method, path, middleware = []) {
    return (target, key, descriptor) => {
        let routes = getRouteMetadata(target);
        let handlers = middleware
            .map((m) => getMiddleware(target, m));
        routes.push({ method, path, key, handlers: [...handlers, descriptor.value] });
        return descriptor;
    };
}
exports.route = route;
;
function basePath(path) {
    return Reflect.metadata(exports.basePathKey, path);
}
exports.basePath = basePath;
;
function get(path = '*', middleware = []) {
    return route('get', path, middleware);
}
exports.get = get;
;
function post(path = '*', middleware = []) {
    return route('post', path, middleware);
}
exports.post = post;
;
function put(path = '*', middleware = []) {
    return route('put', path, middleware);
}
exports.put = put;
;
function patch(path = '*', middleware = []) {
    return route('patch', path, middleware);
}
exports.patch = patch;
;
function del(path = '*', middleware = []) {
    return route('delete', path, middleware);
}
exports.del = del;
;
function options(path = '*', middleware = []) {
    return route('options', path, middleware);
}
exports.options = options;
;
function head(path = '*', middleware = []) {
    return route('head', path, middleware);
}
exports.head = head;
;
function use(path = '*') {
    return route('use', path);
}
exports.use = use;
;
function all(path = '*', middleware = []) {
    return route('all', path, middleware);
}
exports.all = all;
;
function param(param) {
    return (target, key, descriptor) => {
        let routes = getRouteMetadata(target);
        routes.push({ method: 'param', path: param, key, handlers: [descriptor.value] });
        return descriptor;
    };
}
exports.param = param;
;
function middleware(fn) {
    return (target, key, descriptor) => {
        let routes = getRouteMetadata(target);
        let middleware = getMiddleware(target, fn);
        routes.push({ method: null, path: null, key, handlers: [middleware] });
        return descriptor;
    };
}
exports.middleware = middleware;
;
function getMiddleware(target, fn) {
    if (fn instanceof Function) {
        return fn;
    }
    else {
        let middleware = target[fn];
        if (!middleware)
            throw new Error('could not find middlware method ' + fn.toString());
        return middleware;
    }
}
function trimslash(s) {
    return s[s.length - 1] === '/'
        ? s.slice(0, s.length - 1)
        : s;
}
function getRoutes(target) {
    let routes = Reflect.getMetadata(exports.routesKey, target) || [];
    let basePath = Reflect.getMetadata(exports.basePathKey, target.constructor);
    if (basePath) {
        routes = routes.map(({ method, path, key, handlers }) => ({ method, path: method === 'param' ? path : trimslash(basePath) + path, key, handlers }));
    }

    let groups = routes
        .reduce((groups, route) => {
        if (!groups[route.key])
    groups[route.key] = [];
    groups[route.key].push(route);
    return groups;
}, {});
    routes = [];
    for (let k in groups) {
        let group = groups[k];
        let middleware = group
            .filter((x) => x.method === null)
    .map(({ handlers }) => handlers[0]);
        let notMiddleware = group
            .filter((x) => x.method !== null)
    .map(({ method, path, key, handlers }) => ({ method, path, key, handlers: [...middleware, ...handlers].map((h) => h.bind(target)) }));
        [].push.apply(routes, notMiddleware);
    }
    return routes;
}
Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};
exports.getRoutes = getRoutes;
;
function register(router, target) {
    let routes = getRoutes(target);

    //Compare if we have any similar named targerts, this will define an overrided class!
    for(let t in targets)
    {
        let oldTarget = targets[t].constructor.name;
        let newTarget = target.constructor.name;

        let removeFromExpress = [];
        let removeFromNewRoutes = [];
        let removePaths = [];

        if(newTarget.indexOf(oldTarget) >= 0)
        {
            //Get the routes from the new target!
            let newRoutes = getRoutes(target);

            for(var i = 0; i < newRoutes.length; i++)
            {
                let a = newRoutes[i];

                for(var ii = i+1; ii < newRoutes.length; ii++)
                {
                    let b = newRoutes[ii];
                    if(a.path == b.path)
                    {
                        //A is always going to be the ORIGINAL function, so we need to add to B the new middlewares.
                        //We also need to store the index for comparison to remove the others from Express!
                        let newMiddleware = a.handlers;

                        //We want to remove the conclusion function, since this will be handleded with the override
                        newMiddleware.pop();
                        newMiddleware.forEach((oldMiddle)=>{
                            b.handlers.unshift(oldMiddle);
                        })
                        //b.handlers = newMiddleware.concat(b.handlers);

                        newRoutes[ii] = b;

                        removePaths.push(a.path);
                        removeFromNewRoutes.push(i);
                    }

                }
            }

            //Remove the dup route
            removeFromNewRoutes.forEach((value)=>{
                newRoutes.splice(value, 1);
            });
            routes = newRoutes;
            //Cycle and remove
            router._router.stack.forEach((value, index, array)=>
            {
                if(value['route'] != null && value.route['path'] != null)
                {
                    if(removePaths.indexOf(value.route.path) >= 0)
                    {
                        removeFromExpress.push(index);
                    }
                }
            });
            //Final remove
            removeFromExpress.forEach((value)=>{
                router._router.stack.splice(value, 1);
            });

        }
    }


    targets.push(target);

    for (let route of routes) {
        let args = [route.path, ...route.handlers];
        router[route.method].apply(router, args);
    }
}
exports.register = register;
;
//# sourceMappingURL=index.js.map
