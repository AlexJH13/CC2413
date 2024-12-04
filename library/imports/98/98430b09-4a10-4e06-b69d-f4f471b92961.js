"use strict";
cc._RF.push(module, '98430sJShBOBrad9PRxuSlh', 'AStar');
// Script/AStar.ts

"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AStar = /** @class */ (function (_super) {
    __extends(AStar, _super);
    function AStar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.obstacle = [
            cc.v2(0, 0),
            cc.v2(0, 1),
            cc.v2(0, -1),
            cc.v2(0, -2),
            cc.v2(0, 2),
            cc.v2(-1, 2),
            cc.v2(-2, 2),
            cc.v2(-3, 2),
            cc.v2(-1, -2),
            cc.v2(-2, -2),
            cc.v2(-3, -2),
        ];
        _this.cell = null;
        _this.startPos = cc.v2(-5, 0);
        _this.targetPos = cc.v2(3, 0);
        _this.openList = [];
        _this.closeList = [];
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    AStar.prototype.start = function () {
        this.initObstacle();
        this.initStart();
        this.initEnd();
        this.startCheck();
    };
    AStar.prototype.startCheck = function () {
        // 把初始点，放入close
        var startNode = {
            x: this.startPos.x,
            y: this.startPos.y,
            g: 0,
            h: 0,
            f: 0,
            parent: null
        };
        this.closeList.push(startNode);
        // 把障碍点放入close
        for (var index = 0; index < this.obstacle.length; index++) {
            var element = this.obstacle[index];
            var node = {
                x: element.x,
                y: element.y,
                g: 0,
                h: 0,
                f: 0,
                parent: null
            };
            this.closeList.push(node);
        }
        this.checkFromCenterPos(startNode);
    };
    AStar.prototype.drawRoad = function (node) {
        this.creatCell(cc.v2(node.x, node.y), cc.Color.ORANGE);
        if (node.parent) {
            this.drawRoad(node.parent);
        }
    };
    // 从一个节点查找附近8个
    AStar.prototype.checkFromCenterPos = function (center) {
        if (cc.v2(center.x, center.y).equals(this.targetPos)) {
            this.drawRoad(center);
            return;
        }
        var idx = this.openList.findIndex(function (node) { return node.x === center.x && node.y === center.y; });
        if (idx != -1) {
            this.openList.splice(idx, 1);
            this.closeList.push(center);
        }
        // 左上
        this.checkFromOnePos(cc.v2(center.x - 1, center.y + 1), center, 14);
        // 中上
        this.checkFromOnePos(cc.v2(center.x, center.y + 1), center, 10);
        // 右上
        this.checkFromOnePos(cc.v2(center.x + 1, center.y + 1), center, 14);
        // 左中
        this.checkFromOnePos(cc.v2(center.x - 1, center.y), center, 10);
        // 右中
        this.checkFromOnePos(cc.v2(center.x + 1, center.y), center, 10);
        // 左下
        this.checkFromOnePos(cc.v2(center.x - 1, center.y - 1), center, 14);
        // 中下
        this.checkFromOnePos(cc.v2(center.x, center.y - 1), center, 10);
        // 右下
        this.checkFromOnePos(cc.v2(center.x + 1, center.y - 1), center, 14);
        this.openList.sort(function (n1, n2) { return n1.f - n2.f; });
        this.checkFromCenterPos(this.openList[0]);
    };
    // 查找具体一个节点
    AStar.prototype.checkFromOnePos = function (p, parent, g) {
        if (this.closeList.find(function (node) { return node.x === p.x && node.y === p.y; })) {
            return;
        }
        var targetNode = this.openList.find(function (node) { return node.x === p.x && node.y === p.y; });
        var nowg = parent.g + g;
        if (targetNode) {
            if (targetNode.g > nowg) {
                targetNode.g = nowg;
                targetNode.f = nowg + targetNode.h;
                targetNode.parent = parent;
            }
        }
        else {
            var nowh = cc.Vec2.distance(p, this.targetPos);
            var node = {
                x: p.x,
                y: p.y,
                g: nowg,
                h: nowh,
                f: nowg + nowh,
                parent: parent
            };
            this.openList.push(node);
        }
    };
    AStar.prototype.checkAndAddOpen = function (starNode) {
        if (this.openList.find(function (node) { return node.x === starNode.x && node.y === starNode.y; })) {
            return;
        }
        if (this.closeList.find(function (node) { return node.x === starNode.x && node.y === starNode.y; })) {
            return;
        }
        this.openList.push(starNode);
    };
    AStar.prototype.initObstacle = function () {
        for (var index = 0; index < this.obstacle.length; index++) {
            var element = this.obstacle[index];
            this.creatCell(element, cc.Color.MAGENTA);
        }
    };
    AStar.prototype.creatCell = function (p, color) {
        var node = cc.instantiate(this.cell);
        node.x = p.x * 64;
        node.y = p.y * 64;
        node.color = color;
        node.parent = this.node;
    };
    AStar.prototype.initStart = function () {
        this.creatCell(this.startPos, cc.Color.GREEN);
    };
    AStar.prototype.initEnd = function () {
        this.creatCell(this.targetPos, cc.Color.CYAN);
    };
    __decorate([
        property(cc.Prefab)
    ], AStar.prototype, "cell", void 0);
    AStar = __decorate([
        ccclass
    ], AStar);
    return AStar;
}(cc.Component));
exports.default = AStar;

cc._RF.pop();