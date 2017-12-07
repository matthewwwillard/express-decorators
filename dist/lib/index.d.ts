declare namespace express_decorators {
    import 'reflect-metadata';
    class Route {
        method: string;
        path: string;
        key: string | symbol;
        handlers: (Express.Handler | Express.RequestParamHandler)[];
    }
    type Middleware = Express.Handler | string | symbol;
    const routesKey: symbol;
    const basePathKey: symbol;
    function getRouteMetadata(target: any): Route[];
    function route(method: string, path: string, middleware?: Middleware[]): <T extends any>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
    function basePath(path: string): any;
    function get(path?: string, middleware?: Middleware[]): <T extends any>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
    function post(path?: string, middleware?: Middleware[]): <T extends any>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
    function put(path?: string, middleware?: Middleware[]): <T extends any>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
    function patch(path?: string, middleware?: Middleware[]): <T extends any>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
    function del(path?: string, middleware?: Middleware[]): <T extends any>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
    function options(path?: string, middleware?: Middleware[]): <T extends any>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
    function head(path?: string, middleware?: Middleware[]): <T extends any>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
    function use(path?: string): <T extends any>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
    function all(path?: string, middleware?: Middleware[]): <T extends any>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
    function param(param: string): <T extends any>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
    function middleware(fn: Middleware): <T extends any>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
    function getRoutes(target: Object): Route[];
    function register(router: Express.Router, target: Object): void;
}
