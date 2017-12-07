"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const web = require("../lib");
const express = require("express");
const supertest = require("supertest-as-promised");
ava_1.default('get', (t) => {
    class Test {
        getTest() { }
    }
    __decorate([
        web.get('/test')
    ], Test.prototype, "getTest", null);
    let routes = web.getRoutes(new Test());
    t.is(routes.length, 1);
    let route = routes[0];
    t.is(route.key, 'getTest');
    t.is(route.handlers.length, 1);
    t.is(route.method, 'get');
    t.is(route.path, '/test');
});
ava_1.default('multiple', (t) => {
    class Test {
        getTest() { }
        postTest() { }
    }
    __decorate([
        web.get('/test')
    ], Test.prototype, "getTest", null);
    __decorate([
        web.post('/test')
    ], Test.prototype, "postTest", null);
    let routes = web.getRoutes(new Test());
    t.is(routes.length, 2);
});
ava_1.default('basePath', (t) => {
    let Test = class Test {
        getTest() { }
        ;
    };
    __decorate([
        web.get('/foo')
    ], Test.prototype, "getTest", null);
    Test = __decorate([
        web.basePath('/test')
    ], Test);
    let route = web.getRoutes(new Test())[0];
    t.is(route.path, '/test/foo');
});
ava_1.default('middleware string', (t) => {
    let Test = class Test {
        getTest() { }
        ;
        testMiddleware() {
        }
    };
    __decorate([
        web.middleware('testMiddleware'),
        web.get('/foo')
    ], Test.prototype, "getTest", null);
    Test = __decorate([
        web.basePath('/test')
    ], Test);
    let route = web.getRoutes(new Test())[0];
    t.is(route.path, '/test/foo');
    t.is(route.handlers.length, 2);
});
ava_1.default('express', (t) => {
    let Test = class Test {
        constructor() {
            this.bar = 'hello';
        }
        setup(request, response, next) {
            request.foo = 8;
            t.is(this.bar, 'hello');
            next();
        }
        idParam(request, response, next, id) {
            request.params.id = parseInt(request.params.id);
            t.is(this.bar, 'hello');
            next();
        }
        foo(request, response) {
            t.is(request.params.id, 5);
            t.is(request.foo, 8);
            t.is(this.bar, 'hello');
            response.send();
        }
    };
    __decorate([
        web.use()
    ], Test.prototype, "setup", null);
    __decorate([
        web.param('id')
    ], Test.prototype, "idParam", null);
    __decorate([
        web.get('/foo/:id')
    ], Test.prototype, "foo", null);
    Test = __decorate([
        web.basePath('/test')
    ], Test);
    let app = express();
    let controller = new Test();
    web.register(app, controller);
    t.plan(5);
    return supertest(app)
        .get('/test/foo/5')
        .expect(200);
});
//# sourceMappingURL=index.js.map