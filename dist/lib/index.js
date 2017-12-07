var express-decorators;
(function (express-decorators) {
    class Route {
    }
    express-decorators.Route = Route;
    ;
    express-decorators.routesKey = Symbol('routesKey');
    express-decorators.basePathKey = Symbol('basePathKey');
    function getRouteMetadata(target) {
        let routes = Reflect.getMetadata(express-decorators.routesKey, target);
        if (!routes) {
            routes = [];
            Reflect.defineMetadata(express-decorators.routesKey, routes, target);
        }
        return routes;
    }
    express-decorators.getRouteMetadata = getRouteMetadata;
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
    express-decorators.route = route;
    ;
    function basePath(path) {
        return Reflect.metadata(express-decorators.basePathKey, path);
    }
    express-decorators.basePath = basePath;
    ;
    function get(path = '*', middleware = []) {
        return route('get', path, middleware);
    }
    express-decorators.get = get;
    ;
    function post(path = '*', middleware = []) {
        return route('post', path, middleware);
    }
    express-decorators.post = post;
    ;
    function put(path = '*', middleware = []) {
        return route('put', path, middleware);
    }
    express-decorators.put = put;
    ;
    function patch(path = '*', middleware = []) {
        return route('patch', path, middleware);
    }
    express-decorators.patch = patch;
    ;
    function del(path = '*', middleware = []) {
        return route('delete', path, middleware);
    }
    express-decorators.del = del;
    ;
    function options(path = '*', middleware = []) {
        return route('options', path, middleware);
    }
    express-decorators.options = options;
    ;
    function head(path = '*', middleware = []) {
        return route('head', path, middleware);
    }
    express-decorators.head = head;
    ;
    function use(path = '*') {
        return route('use', path);
    }
    express-decorators.use = use;
    ;
    function all(path = '*', middleware = []) {
        return route('all', path, middleware);
    }
    express-decorators.all = all;
    ;
    function param(param) {
        return (target, key, descriptor) => {
            let routes = getRouteMetadata(target);
            routes.push({ method: 'param', path: param, key, handlers: [descriptor.value] });
            return descriptor;
        };
    }
    express-decorators.param = param;
    ;
    function middleware(fn) {
        return (target, key, descriptor) => {
            let routes = getRouteMetadata(target);
            let middleware = getMiddleware(target, fn);
            routes.push({ method: null, path: null, key, handlers: [middleware] });
            return descriptor;
        };
    }
    express-decorators.middleware = middleware;
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
        let routes = Reflect.getMetadata(express-decorators.routesKey, target) || [];
        let basePath = Reflect.getMetadata(express-decorators.basePathKey, target.constructor);
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
    express-decorators.getRoutes = getRoutes;
    ;
    function register(router, target) {
        let routes = getRoutes(target);
        for (let route of routes) {
            let args = [route.path, ...route.handlers];
            router[route.method].apply(router, args);
        }
    }
    express-decorators.register = register;
    ;
})(express-decorators || (express-decorators = {}));
//# sourceMappingURL=index.js.map