// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

type AStarNode = {
    x: number,
    y: number,
    g: number,
    h: number,
    f: number,
    parent: AStarNode
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class AStar extends cc.Component {

    private obstacle: cc.Vec2[] = [
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

    @property(cc.Prefab)
    cell: cc.Prefab = null;

    startPos: cc.Vec2 = cc.v2(-5, 0);

    targetPos: cc.Vec2 = cc.v2(3, 0);

    openList: AStarNode[] = [];
    closeList: AStarNode[] = [];


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.initObstacle();
        this.initStart();
        this.initEnd();
        this.startCheck();
    }

    startCheck(): void {
        // 把初始点，放入close
        let startNode: AStarNode = {
            x: this.startPos.x,
            y: this.startPos.y,
            g: 0,
            h: 0,
            f: 0,
            parent: null
        }
        this.closeList.push(startNode);

        // 把障碍点放入close
        for (let index = 0; index < this.obstacle.length; index++) {
            const element = this.obstacle[index];
            let node: AStarNode = {
                x: element.x,
                y: element.y,
                g: 0,
                h: 0,
                f: 0,
                parent: null
            }
            this.closeList.push(node);
        }

        this.checkFromCenterPos(startNode);

    }

    drawRoad(node: AStarNode): void {
        this.creatCell(cc.v2(node.x, node.y), cc.Color.ORANGE);
        if (node.parent) {
            this.drawRoad(node.parent);
        }
    }

    // 从一个节点查找附近8个
    checkFromCenterPos(center: AStarNode): void {
        if (cc.v2(center.x, center.y).equals(this.targetPos)) {
            this.drawRoad(center);
            return;
        }
        // 如果当前节点在open中，则移除，并放入close
        const idx = this.openList.findIndex((node)=> node.x === center.x && node.y === center.y);
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
        
        // 按f排序，通过最小的f去继续检索
        this.openList.sort((n1, n2)=> n1.f - n2.f);
        this.checkFromCenterPos(this.openList[0]);
    }
    
    // 查找具体一个节点
    checkFromOnePos(p: cc.Vec2, parent: AStarNode, g: number): void {
        // 如果在close中，则放弃
        if(this.closeList.find(node=> node.x === p.x && node.y === p.y)) {
            return;
        }

        let targetNode = this.openList.find(node=> node.x === p.x && node.y === p.y);
        let nowg = parent.g + g;
        // 如果在open中
        if(targetNode) {
            // 新的g值更小，则替换新g值，并替换parent
            if (targetNode.g > nowg) {
                targetNode.g = nowg;
                targetNode.f = nowg + targetNode.h;
                targetNode.parent = parent;
            }
        } else {
            // 如果不在open中，则新建并加入
            let nowh = cc.Vec2.distance(p, this.targetPos);
            let node: AStarNode = {
                x: p.x,
                y: p.y,
                g: nowg,
                h: nowh,
                f: nowg + nowh,
                parent: parent
            }
            this.openList.push(node);
        }
    }

    checkAndAddOpen(starNode: AStarNode): void {
        if(this.openList.find(node=> node.x === starNode.x && node.y === starNode.y)) {
            return;
        }
        if(this.closeList.find(node=> node.x === starNode.x && node.y === starNode.y)) {
            return;
        }
        this.openList.push(starNode);
    }



    initObstacle(): void {
        for (let index = 0; index < this.obstacle.length; index++) {
            const element = this.obstacle[index];
            this.creatCell(element, cc.Color.MAGENTA);
        }
    }

    creatCell(p: cc.Vec2, color: cc.Color): void {
        let node = cc.instantiate(this.cell);
        node.x = p.x * 64;
        node.y = p.y * 64;
        node.color = color;
        node.parent = this.node;
    }

    initStart(): void {
        this.creatCell(this.startPos, cc.Color.GREEN);
    }

    initEnd(): void {
        this.creatCell(this.targetPos, cc.Color.CYAN);
    }

    // update (dt) {}
}
