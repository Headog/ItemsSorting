//深度优先搜索
"use strict";

//定义节点
class Point {
    constructor() {
        this.x;
        this.y;
        this.pre;
        this.d;
        this.step;
    }
}

const DIR = [[-1, 0], [0, 1], [1, 0], [0, -1]];
function BFS(sx = 0, sy = 0, ex = 0, ey = 0, ctime, target = false) {
    var xx, yy;
    var vis = [];
    for (var i = 0; i < M; i++) {
        vis.push([]);
        for (var j = 0; j < N; j++) {
            vis[i][j] = false;
        }
    }

    var p = [], tmp = new Point;
    //用于检测并执行数组p是否需要添加新节点
    function sp(ref) {
        if (ref >= p.length)
            p[ref] = new Point;
        return ref;
    }
    var track = [];

    //用于保存结果
    function output(n) {
        if (n == 0)
            return;
        output(p[n].pre);
        track[tmp++] = [p[n].x, p[n].y];
    }


    var front = 0, rear = 1;
    p[sp(front)].x = sx;
    p[front].y = sy;
    p[front].pre = 0;
    p[front].step = 0;
    vis[sx][sy] = 1;

    while (front < rear) {
        tmp = p[front];

        if (tmp.x == ex && tmp.y == ey) {
            var end = front;
            break;
        }

        front++;
        for (var i = 0; i < DIR.length; i++) {
            xx = tmp.x + DIR[i][0];
            yy = tmp.y + DIR[i][1];
            //需修改
            if (xx < 0 || xx >= M || yy < 0 || yy >= N || vis[xx][yy])
                continue;
            if (target > 0 && ![xx, yy].equals([ex, ey]) && [xx, yy].isIn(targets))
                continue;
            if (target === false && [xx, yy].isIn(targets))
                continue;
            if (ctime + tmp.step + 1 < isUsed.length && (isUsed[ctime + tmp.step + 1][[xx, yy]] || isUsed[ctime + tmp.step + 1][[tmp.x, tmp.y]]))
                continue;

            vis[xx][yy] = true;
            p[sp(rear)].x = xx;
            p[rear].y = yy;
            p[rear].pre = front - 1;
            p[rear].d = i;
            p[sp(rear++)].step = tmp.step + 1;
        }
    }

    if (end == undefined)
        return [[sx, sy]];
    var tmp = 0;
    output(end);
    return track;
}
