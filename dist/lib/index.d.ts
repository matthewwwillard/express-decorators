/// <reference types="express" />
import * as Express from 'express';
import 'reflect-metadata';
export declare class Route {
    method: string;
    path: string;
    key: string | symbol;
    handlers: (Express.Handler | Express.RequestParamHandler)[];
}
export declare type Middleware = Express.Handler | string | symbol;
export declare const routesKey: symbol;
export declare const basePathKey: symbol;
export declare function getRouteMetadata(target: any): Route[];
export declare function route(method: string, path: string, middleware?: Middleware[]): <T extends Express.Handler>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare function basePath(path: string): {
    (target: Function): void;
    (target: Object, targetKey: string | symbol): void;
};
export declare function get(path?: string, middleware?: Middleware[]): <T extends Express.Handler>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare function post(path?: string, middleware?: Middleware[]): <T extends Express.Handler>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare function put(path?: string, middleware?: Middleware[]): <T extends Express.Handler>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare function patch(path?: string, middleware?: Middleware[]): <T extends Express.Handler>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare function del(path?: string, middleware?: Middleware[]): <T extends Express.Handler>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare function options(path?: string, middleware?: Middleware[]): <T extends Express.Handler>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare function head(path?: string, middleware?: Middleware[]): <T extends Express.Handler>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare function use(path?: string): <T extends Express.Handler>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare function all(path?: string, middleware?: Middleware[]): <T extends Express.Handler>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare function param(param: string): <T extends Express.RequestParamHandler>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare function middleware(fn: Middleware): <T extends Express.Handler>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare function getRoutes(target: Object): Route[];
export declare function register(router: Express.Router, target: Object): void;
