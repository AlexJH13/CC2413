
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/AStar.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxDQUFDO1lBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO1FBRUQsS0FBSztRQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVwRSxLQUFLO1FBQ0wsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFaEUsS0FBSztRQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUdwRSxLQUFLO1FBQ0wsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFHaEUsS0FBSztRQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBR2hFLEtBQUs7UUFDTCxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxD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O1FBREMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7dUNBQ0c7SUFqQk4sS0FBSztRQUR6QixPQUFPO09BQ2EsS0FBSyxDQTBMekI7SUFBRCxZQUFDO0NBMUxELEFBMExDLENBMUxrQyxFQUFFLENBQUMsU0FBUyxHQTBMOUM7a0JBMUxvQixLQUFLIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTGVhcm4gVHlwZVNjcmlwdDpcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci8yLjQvbWFudWFsL2VuL3NjcmlwdGluZy90eXBlc2NyaXB0Lmh0bWxcbi8vIExlYXJuIEF0dHJpYnV0ZTpcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci8yLjQvbWFudWFsL2VuL3NjcmlwdGluZy9yZWZlcmVuY2UvYXR0cmlidXRlcy5odG1sXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci8yLjQvbWFudWFsL2VuL3NjcmlwdGluZy9saWZlLWN5Y2xlLWNhbGxiYWNrcy5odG1sXG5cbnR5cGUgQVN0YXJOb2RlID0ge1xuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgZzogbnVtYmVyLFxuICAgIGg6IG51bWJlcixcbiAgICBmOiBudW1iZXIsXG4gICAgcGFyZW50OiBBU3Rhck5vZGVcbn1cblxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XG5cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBU3RhciBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG5cbiAgICBwcml2YXRlIG9ic3RhY2xlOiBjYy5WZWMyW10gPSBbXG4gICAgICAgIGNjLnYyKDAsIDApLFxuICAgICAgICBjYy52MigwLCAxKSxcbiAgICAgICAgY2MudjIoMCwgLTEpLFxuICAgICAgICBjYy52MigwLCAtMiksXG4gICAgICAgIGNjLnYyKDAsIDIpLFxuICAgICAgICBjYy52MigtMSwgMiksXG4gICAgICAgIGNjLnYyKC0yLCAyKSxcbiAgICAgICAgY2MudjIoLTMsIDIpLFxuICAgICAgICBjYy52MigtMSwgLTIpLFxuICAgICAgICBjYy52MigtMiwgLTIpLFxuICAgICAgICBjYy52MigtMywgLTIpLFxuICAgIF07XG5cbiAgICBAcHJvcGVydHkoY2MuUHJlZmFiKVxuICAgIGNlbGw6IGNjLlByZWZhYiA9IG51bGw7XG5cbiAgICBzdGFydFBvczogY2MuVmVjMiA9IGNjLnYyKC01LCAwKTtcblxuICAgIHRhcmdldFBvczogY2MuVmVjMiA9IGNjLnYyKDMsIDApO1xuXG4gICAgb3Blbkxpc3Q6IEFTdGFyTm9kZVtdID0gW107XG4gICAgY2xvc2VMaXN0OiBBU3Rhck5vZGVbXSA9IFtdO1xuXG5cbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcblxuICAgIC8vIG9uTG9hZCAoKSB7fVxuXG4gICAgc3RhcnQgKCkge1xuICAgICAgICB0aGlzLmluaXRPYnN0YWNsZSgpO1xuICAgICAgICB0aGlzLmluaXRTdGFydCgpO1xuICAgICAgICB0aGlzLmluaXRFbmQoKTtcbiAgICAgICAgdGhpcy5zdGFydENoZWNrKCk7XG4gICAgfVxuXG4gICAgc3RhcnRDaGVjaygpOiB2b2lkIHtcbiAgICAgICAgLy8g5oqK5Yid5aeL54K577yM5pS+5YWlY2xvc2VcbiAgICAgICAgbGV0IHN0YXJ0Tm9kZTogQVN0YXJOb2RlID0ge1xuICAgICAgICAgICAgeDogdGhpcy5zdGFydFBvcy54LFxuICAgICAgICAgICAgeTogdGhpcy5zdGFydFBvcy55LFxuICAgICAgICAgICAgZzogMCxcbiAgICAgICAgICAgIGg6IDAsXG4gICAgICAgICAgICBmOiAwLFxuICAgICAgICAgICAgcGFyZW50OiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbG9zZUxpc3QucHVzaChzdGFydE5vZGUpO1xuXG4gICAgICAgIC8vIOaKiumanOeijeeCueaUvuWFpWNsb3NlXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm9ic3RhY2xlLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMub2JzdGFjbGVbaW5kZXhdO1xuICAgICAgICAgICAgbGV0IG5vZGU6IEFTdGFyTm9kZSA9IHtcbiAgICAgICAgICAgICAgICB4OiBlbGVtZW50LngsXG4gICAgICAgICAgICAgICAgeTogZWxlbWVudC55LFxuICAgICAgICAgICAgICAgIGc6IDAsXG4gICAgICAgICAgICAgICAgaDogMCxcbiAgICAgICAgICAgICAgICBmOiAwLFxuICAgICAgICAgICAgICAgIHBhcmVudDogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbG9zZUxpc3QucHVzaChub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2hlY2tGcm9tQ2VudGVyUG9zKHN0YXJ0Tm9kZSk7XG5cbiAgICB9XG5cbiAgICBkcmF3Um9hZChub2RlOiBBU3Rhck5vZGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jcmVhdENlbGwoY2MudjIobm9kZS54LCBub2RlLnkpLCBjYy5Db2xvci5PUkFOR0UpO1xuICAgICAgICBpZiAobm9kZS5wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd1JvYWQobm9kZS5wYXJlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g5LuO5LiA5Liq6IqC54K55p+l5om+6ZmE6L+ROOS4qlxuICAgIGNoZWNrRnJvbUNlbnRlclBvcyhjZW50ZXI6IEFTdGFyTm9kZSk6IHZvaWQge1xuICAgICAgICBpZiAoY2MudjIoY2VudGVyLngsIGNlbnRlci55KS5lcXVhbHModGhpcy50YXJnZXRQb3MpKSB7XG4gICAgICAgICAgICB0aGlzLmRyYXdSb2FkKGNlbnRlcik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5vcGVuTGlzdC5maW5kSW5kZXgoKG5vZGUpPT4gbm9kZS54ID09PSBjZW50ZXIueCAmJiBub2RlLnkgPT09IGNlbnRlci55KTtcbiAgICAgICAgaWYgKGlkeCAhPSAtMSkge1xuICAgICAgICAgICAgdGhpcy5vcGVuTGlzdC5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VMaXN0LnB1c2goY2VudGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOW3puS4ilxuICAgICAgICB0aGlzLmNoZWNrRnJvbU9uZVBvcyhjYy52MihjZW50ZXIueCAtIDEsIGNlbnRlci55ICsgMSksIGNlbnRlciwgMTQpO1xuXG4gICAgICAgIC8vIOS4reS4ilxuICAgICAgICB0aGlzLmNoZWNrRnJvbU9uZVBvcyhjYy52MihjZW50ZXIueCwgY2VudGVyLnkgKyAxKSwgY2VudGVyLCAxMCk7XG5cbiAgICAgICAgLy8g5Y+z5LiKXG4gICAgICAgIHRoaXMuY2hlY2tGcm9tT25lUG9zKGNjLnYyKGNlbnRlci54ICsgMSwgY2VudGVyLnkgKyAxKSwgY2VudGVyLCAxNCk7XG4gICAgXG5cbiAgICAgICAgLy8g5bem5LitXG4gICAgICAgIHRoaXMuY2hlY2tGcm9tT25lUG9zKGNjLnYyKGNlbnRlci54IC0gMSwgY2VudGVyLnkpLCBjZW50ZXIsIDEwKTtcblxuXG4gICAgICAgIC8vIOWPs+S4rVxuICAgICAgICB0aGlzLmNoZWNrRnJvbU9uZVBvcyhjYy52MihjZW50ZXIueCArIDEsIGNlbnRlci55KSwgY2VudGVyLCAxMCk7XG4gICAgXG4gICAgICAgIFxuICAgICAgICAvLyDlt6bkuItcbiAgICAgICAgdGhpcy5jaGVja0Zyb21PbmVQb3MoY2MudjIoY2VudGVyLnggLSAxLCBjZW50ZXIueSAtIDEpLCBjZW50ZXIsIDE0KTtcbiAgICBcblxuICAgICAgICAvLyDkuK3kuItcbiAgICAgICAgdGhpcy5jaGVja0Zyb21PbmVQb3MoY2MudjIoY2VudGVyLngsIGNlbnRlci55IC0gMSksIGNlbnRlciwgMTApO1xuICAgIFxuXG4gICAgICAgIC8vIOWPs+S4i1xuICAgICAgICB0aGlzLmNoZWNrRnJvbU9uZVBvcyhjYy52MihjZW50ZXIueCArIDEsIGNlbnRlci55IC0gMSksIGNlbnRlciwgMTQpO1xuICAgICAgICBcblxuICAgICAgICB0aGlzLm9wZW5MaXN0LnNvcnQoKG4xLCBuMik9PiBuMS5mIC0gbjIuZik7XG4gICAgICAgIHRoaXMuY2hlY2tGcm9tQ2VudGVyUG9zKHRoaXMub3Blbkxpc3RbMF0pO1xuICAgIH1cbiAgICBcbiAgICAvLyDmn6Xmib7lhbfkvZPkuIDkuKroioLngrlcbiAgICBjaGVja0Zyb21PbmVQb3MocDogY2MuVmVjMiwgcGFyZW50OiBBU3Rhck5vZGUsIGc6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5jbG9zZUxpc3QuZmluZChub2RlPT4gbm9kZS54ID09PSBwLnggJiYgbm9kZS55ID09PSBwLnkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdGFyZ2V0Tm9kZSA9IHRoaXMub3Blbkxpc3QuZmluZChub2RlPT4gbm9kZS54ID09PSBwLnggJiYgbm9kZS55ID09PSBwLnkpO1xuICAgICAgICBsZXQgbm93ZyA9IHBhcmVudC5nICsgZztcbiAgICAgICAgaWYodGFyZ2V0Tm9kZSkge1xuICAgICAgICAgICAgaWYgKHRhcmdldE5vZGUuZyA+IG5vd2cpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXROb2RlLmcgPSBub3dnO1xuICAgICAgICAgICAgICAgIHRhcmdldE5vZGUuZiA9IG5vd2cgKyB0YXJnZXROb2RlLmg7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbm93aCA9IGNjLlZlYzIuZGlzdGFuY2UocCwgdGhpcy50YXJnZXRQb3MpO1xuICAgICAgICAgICAgbGV0IG5vZGU6IEFTdGFyTm9kZSA9IHtcbiAgICAgICAgICAgICAgICB4OiBwLngsXG4gICAgICAgICAgICAgICAgeTogcC55LFxuICAgICAgICAgICAgICAgIGc6IG5vd2csXG4gICAgICAgICAgICAgICAgaDogbm93aCxcbiAgICAgICAgICAgICAgICBmOiBub3dnICsgbm93aCxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IHBhcmVudFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vcGVuTGlzdC5wdXNoKG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tBbmRBZGRPcGVuKHN0YXJOb2RlOiBBU3Rhck5vZGUpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5vcGVuTGlzdC5maW5kKG5vZGU9PiBub2RlLnggPT09IHN0YXJOb2RlLnggJiYgbm9kZS55ID09PSBzdGFyTm9kZS55KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuY2xvc2VMaXN0LmZpbmQobm9kZT0+IG5vZGUueCA9PT0gc3Rhck5vZGUueCAmJiBub2RlLnkgPT09IHN0YXJOb2RlLnkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcGVuTGlzdC5wdXNoKHN0YXJOb2RlKTtcbiAgICB9XG5cblxuXG4gICAgaW5pdE9ic3RhY2xlKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5vYnN0YWNsZS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLm9ic3RhY2xlW2luZGV4XTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRDZWxsKGVsZW1lbnQsIGNjLkNvbG9yLk1BR0VOVEEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRDZWxsKHA6IGNjLlZlYzIsIGNvbG9yOiBjYy5Db2xvcik6IHZvaWQge1xuICAgICAgICBsZXQgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2VsbCk7XG4gICAgICAgIG5vZGUueCA9IHAueCAqIDY0O1xuICAgICAgICBub2RlLnkgPSBwLnkgKiA2NDtcbiAgICAgICAgbm9kZS5jb2xvciA9IGNvbG9yO1xuICAgICAgICBub2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAgICB9XG5cbiAgICBpbml0U3RhcnQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3JlYXRDZWxsKHRoaXMuc3RhcnRQb3MsIGNjLkNvbG9yLkdSRUVOKTtcbiAgICB9XG5cbiAgICBpbml0RW5kKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNyZWF0Q2VsbCh0aGlzLnRhcmdldFBvcywgY2MuQ29sb3IuQ1lBTik7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIChkdCkge31cbn1cbiJdfQ==