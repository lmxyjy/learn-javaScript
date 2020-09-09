"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//head first咖啡代码
var coffe;
(function (coffe) {
    //实现一个饮料抽象类
    var Beverage = /** @class */ (function () {
        function Beverage() {
            //关于饮品的描述
            this.description = '';
        }
        //实现一个方法得到coffe描述
        Beverage.prototype.getDescription = function () {
            return this.description;
        };
        return Beverage;
    }());
    //实现一个调料抽象类,继承饮料抽象类(装饰类)
    var CodimentDcorator = /** @class */ (function (_super) {
        __extends(CodimentDcorator, _super);
        function CodimentDcorator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CodimentDcorator;
    }(Beverage));
    //实现一些具体的饮料
    var Espresso = /** @class */ (function (_super) {
        __extends(Espresso, _super);
        function Espresso(description) {
            var _this = _super.call(this) || this;
            _this.cost = function () {
                return 1.99;
            };
            _this.description = description;
            return _this;
        }
        return Espresso;
    }(Beverage));
    var HouseBlend = /** @class */ (function (_super) {
        __extends(HouseBlend, _super);
        function HouseBlend(description) {
            var _this = _super.call(this) || this;
            _this.cost = function () {
                return .89;
            };
            _this.description = description;
            return _this;
        }
        return HouseBlend;
    }(Beverage));
    //实现摩卡装饰者
    var Mocha = /** @class */ (function (_super) {
        __extends(Mocha, _super);
        function Mocha(beverage) {
            var _this = _super.call(this) || this;
            _this.getDescription = function () {
                return _this.beverage.getDescription() + ",Mocha";
            };
            _this.cost = function () {
                return _this.beverage.cost() + .20;
            };
            _this.beverage = beverage;
            return _this;
        }
        return Mocha;
    }(CodimentDcorator));
    //实现soy装饰者
    var Soy = /** @class */ (function (_super) {
        __extends(Soy, _super);
        function Soy(beverage) {
            var _this = _super.call(this) || this;
            _this.getDescription = function () {
                return _this.beverage.getDescription() + ",Soy";
            };
            _this.cost = function () {
                return _this.beverage.cost() + .20;
            };
            _this.beverage = beverage;
            return _this;
        }
        return Soy;
    }(CodimentDcorator));
    //测试实现
    var testcoffe = new Espresso("this is test coffe");
    //不加调料直接打印出价格
    console.log(testcoffe.getDescription(), testcoffe.cost());
    //增加调料进行测试
    var d = new Mocha(testcoffe);
    d = new Mocha(testcoffe);
    d = new Soy(testcoffe);
    console.log(d.getDescription(), d.cost());
})(coffe || (coffe = {}));
