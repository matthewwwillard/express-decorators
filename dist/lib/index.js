var express_decorators;
(function (express_decorators) {
    class Route {
    }
    express_decorators.Route = Route;
    ;
    express_decorators.routesKey = Symbol('routesKey');
    express_decorators.basePathKey = Symbol('basePathKey');
    function getRouteMetadata(target) {
        let routes = Reflect.getMetadata(express_decorators.routesKey, target);
        if (!routes) {
            routes = [];
            Reflect.defineMetadata(express_decorators.routesKey, routes, target);
        }
        return routes;
    }
    express_decorators.getRouteMetadata = getRouteMetadata;
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
    express_decorators.route = route;
    ;
    function basePath(path) {
        return Reflect.metadata(express_decorators.basePathKey, path);
    }
    express_decorators.basePath = basePath;
    ;
    function get(path = '*', middleware = []) {
        return route('get', path, middleware);
    }
    express_decorators.get = get;
    ;
    function post(path = '*', middleware = []) {
        return route('post', path, middleware);
    }
    express_decorators.post = post;
    ;
    function put(path = '*', middleware = []) {
        return route('put', path, middleware);
    }
    express_decorators.put = put;
    ;
    function patch(path = '*', middleware = []) {
        return route('patch', path, middleware);
    }
    express_decorators.patch = patch;
    ;
    function del(path = '*', middleware = []) {
        return route('delete', path, middleware);
    }
    express_decorators.del = del;
    ;
    function options(path = '*', middleware = []) {
        return route('options', path, middleware);
    }
    express_decorators.options = options;
    ;
    function head(path = '*', middleware = []) {
        return route('head', path, middleware);
    }
    express_decorators.head = head;
    ;
    function use(path = '*') {
        return route('use', path);
    }
    express_decorators.use = use;
    ;
    function all(path = '*', middleware = []) {
        return route('all', path, middleware);
    }
    express_decorators.all = all;
    ;
    function param(param) {
        return (target, key, descriptor) => {
            let routes = getRouteMetadata(target);
            routes.push({ method: 'param', path: param, key, handlers: [descriptor.value] });
            return descriptor;
        };
    }
    express_decorators.param = param;
    ;
    function middleware(fn) {
        return (target, key, descriptor) => {
            let routes = getRouteMetadata(target);
            let middleware = getMiddleware(target, fn);
            routes.push({ method: null, path: null, key, handlers: [middleware] });
            return descriptor;
        };
    }
    express_decorators.middleware = middleware;
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
        let routes = Reflect.getMetadata(express_decorators.routesKey, target) || [];
        let basePath = Reflect.getMetadata(express_decorators.basePathKey, target.constructor);
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
    express_decorators.getRoutes = getRoutes;
    ;
    function register(router, target) {
        let routes = getRoutes(target);
        for (let route of routes) {
            let args = [route.path, ...route.handlers];
            router[route.method].apply(router, args);
        }
    }
    express_decorators.register = register;
    ;
})(express_decorators || (express_decorators = {}));
//# sourceMappingURL=index.js.map