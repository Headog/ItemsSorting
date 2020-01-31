"use strict";
//from StackOverflow
Array.prototype.equals = function(array=[])
{
    if (!array)
        return false;
    if (this.length != array.length)
        return false;
    for (var i=0,l=this.length;i<l;i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
}
Object.defineProperty(Array.prototype,"equals",{enumerable: false});

Array.prototype.isIn = function(list2=[],times=-1)
{
    //判断一个数组是否在另一个数组中 time表示重复次数 time为-1时无限制
    var count=0;
    //此处若使用for...in...句型会TypeError(鬼知道为什么)
        for (var i=0;i<list2.length;i++) {
            try {
                if (list2[i].equals(this)) 
                    count++;
            } catch {
                continue;
            }
        }
    if (times==-1) {
        if (count>0)
            return true;
        else
            return false;
    }
    if (times==count)
        return true;
    return false;
}

Number.prototype.getLength = function()
{
    //获取数字长度
    var length=0;
    var num = this;
    while (num) {
        num = Math.floor(num/10);
        length++;
    }
    return length;
}

//仅用于开发
function view(ctime)
{
    var result=[];
    for (var i=0;i<C;i++) {
        result.push(timeline[i][ctime]);
    }
    return result;
}