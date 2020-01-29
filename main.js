"use strict";
const M=19, N=19, P=1, C=20, FPS=30;
const HOSTS=[[0,0],[0,N-1],[M-1,0],[M-1,N-1]];
const ctx = document.getElementsByTagName("canvas")[0].getContext("2d");
const DI = Math.floor(ctx.canvas.height/M);
const DJ = Math.floor(ctx.canvas.width/N);
var map=[], robots=[], tasks=[], timeline=[], waiting=[], targets=[], offsetIs=[], offsetJs=[];
var count=1, tmp, time=0, frame=0;

function create()
{
    //创建地图
    for (var i=0;i<M;i++) {
        map.push([]);
        for (var j=0;j<N;j++) {
            if ((i+1)%(P+1)==0 && (j+1)%(P+1)==0 && j>1 && i>1 && i<M-2 && j<N-2) {
                map[i][j] = count;
                targets[count++] = [i,j];
            } else {
                map[i][j] = -1;
            }
            if ([i,j].isIn(HOSTS))
                map[i][j] = 0;
        }
    }
    window.L = count.getLength();

    //创建机器人
    for (var i=0;i<C;i++) {
        robots.push([]);
        timeline.push([]);
        tasks.push(-Math.floor(Math.random()*HOSTS.length)-1);
        waiting.push(1);
        robots[i][0] = Math.floor(Math.random()*M);
        robots[i][1] = Math.floor(Math.random()*N);
        while (map[robots[i][0]][robots[i][1]]>0 || robots[i].isIn(robots,2) || robots[i].isIn(HOSTS)) {
            robots[i][0] = Math.floor(Math.random()*M);
            robots[i][1] = Math.floor(Math.random()*N);
        }
    }
    /**/draw();
    for (var j=0;j<C;j++)
        prepare(j);
}

function draw(frame)
{
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    //绘制网格
    ctx.beginPath();
    ctx.moveTo(0,0);
    for (var i=0;i<M;i++) {
        for (var j=0;j<N;j++) {
            ctx.lineTo(DJ*(j+1),DI*i);
            ctx.lineTo(DJ*(j+1),DI*(i+1));
            ctx.lineTo(DJ*j,DI*(i+1));
            ctx.lineTo(DJ*j,DI*i);
            ctx.moveTo(DJ*(j+1),DI*i);
        }
        ctx.moveTo(0,DI*(i+1));
    }
    ctx.stroke();

    const offsetI=DI*(frame/FPS),offsetJ=DJ*(frame/FPS);
    for (var i=0;i<C;i++) {
        if (time==0) {
            offsetIs[i] = 0;
            offsetJs[i] = 0;
            continue;
        }
        tmp = timeline[i][time][0]-timeline[i][time-1][0];
        if (tmp>0)
            offsetIs[i] = offsetI;
        else if (tmp==0)
            offsetIs[i] = 0;
        else
            offsetIs[i] = -offsetI;
        tmp = timeline[i][time][1]-timeline[i][time-1][1];
        if (tmp>0)
            offsetJs[i] = offsetJ;
        else if (tmp==0)
            offsetJs[i] = 0;
        else
            offsetJs[i] = -offsetJ;
    }
    //绘制色块
    ctx.beginPath();
    ctx.fillStyle = "#0000ff";
    for (i in HOSTS)
        ctx.fillRect(DJ*HOSTS[i][1]+1,DI*HOSTS[i][0]+1,DJ-2,DI-2);
    ctx.fillStyle = "#ffffff";
    for (var i=0;i<M;i++)
        for (var j=0;j<N;j++)
            if(map[i][j]>0)
                ctx.fillRect(DJ*j+1,DI*i+1,DJ-2,DI-2);
    ctx.fillStyle = "#000000";
    for (var i=0;i<C;i++) {
        ctx.fillRect(DJ*(robots[i][1]+0.3)+offsetJs[i],DI*(robots[i][0]+0.3)+offsetIs[i],DJ*0.4,DI*0.4);
    }
    
    //绘制数字*
    ctx.beginPath();
    for (var i=0;i<C;i++) {
        ctx.fillStyle = "#ffffff";
        ctx.font = (DJ*0.3)+"px 黑体";
        ctx.textAlign = "center";
        ctx.fillText(i+1,DJ*(robots[i][1]+0.5)+offsetJs[i],DI*(robots[i][0]+0.61)+offsetIs[i]);
        if (tasks[i]==null)
            continue
        ctx.font = (DJ*0.2)+"px 黑体";
        ctx.textAlign = "start";
        if (tasks[i] > 0) {
            tmp = tasks[i];
        } else if (tasks[i] < 0) {
            tmp = -tasks[i];
            ctx.fillStyle = "#0000ff";
        }
        ctx.fillText(tmp,DJ*(robots[i][1]+0.7)+offsetJs[i],DI*(robots[i][0]+0.85)+offsetIs[i]);
    }
    //以下还需修改
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.font = (DJ/L)+"px 黑体";
    for (var i=0;i<M;i++)
        for (var j=0;j<N;j++)
            if (map[i][j]>0)
                ctx.fillText((Array(L).join(0)+map[i][j]).slice(-L)/*补零*/,DJ*(j+0.5),DI*(i+0.85-1/6));
    return;
}

function prepare(robot=0)
{
    var track;
    if (waiting[robot] == -1) {
        if (tasks[robot] < 0) {
            tasks[robot] = Math.ceil(Math.random()*(count-1));
            track = BFS(robots[robot][0],robots[robot][1],targets[tasks[robot]][0],targets[tasks[robot]][1],tasks[robot]);
        } else {
            tasks[robot] = -Math.floor(Math.random()*HOSTS.length)-1;
            track = BFS(robots[robot][0],robots[robot][1],HOSTS[-tasks[robot]-1][0],HOSTS[-tasks[robot]-1][1],false);
        }
    } else {
        if (tasks[robot] < 0)
            track = BFS(robots[robot][0],robots[robot][1],HOSTS[-tasks[robot]-1][0],HOSTS[-tasks[robot]-1][1],false);
        else
            track = BFS(robots[robot][0],robots[robot][1],targets[tasks[robot]][0],targets[tasks[robot]][1],tasks[robot]);
        waiting[robot] = -1;
    }
    timeline[robot] = timeline[robot].concat(track);
    return;
}

function move(robot=0)
{
    if (timeline[robot][time] == robots[robot]) {
        waiting[robot] = 1;
        return true;
    } else {
        robots[robot][0] = timeline[robot][time][0];
        robots[robot][1] = timeline[robot][time][1];
        if (time >= timeline[robot].length-1)
            return true;
    }
    return false;
}

function main()
{
    //console.log(timeline);
    draw(frame++);

    if (frame==FPS) {
        frame=0;
        for (var i=0;i<C;i++)
            if(move(i))
                prepare(i);
        time++;
    }
    requestAnimationFrame(main);
}

create();
requestAnimationFrame(main);
