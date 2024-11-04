/**
 * @file 手势事件方向控制
 * @author Mikey
 * @copyright ©️SPHMedia Technology Co.,Ltd.
 * @createDate 2024-04-03 17:19:20
 */

export default class Event {
    static get Direction(){
        return {
            UP:1,
            DOWN:2,
            RIGHT:4,
            LEFT:3,
            NONE:0,
            CLICK:-1
        }
    }
    constructor(touch) {
        // touch = {
        //     startX:0,
        //     startY:0,
        //     beginTime:0,
        //     endTime:0,
        //     endX:0,
        //     endY:0
        // }
        this.touch = touch;
    }

    /**
     * 计算角度
     * @param angx
     * @param angy
     * @return {number}
     */
    getAngle(angx, angy) {
        return Math.atan2(angy, angx) * 180 / Math.PI;
    }

    /**
     * 计算方向
     * @return {number}
     */
    getDirection() {
        const {startY,startX,endX,endY,beginTime,endTime} = this.touch;
        const angx = endX - startX;
        const angy = endY - startY;
        //如果滑动距离太短
        if (Math.abs(angx) < 5 && Math.abs(angy) < 5) {
            if(endTime - beginTime > 0 && endTime - beginTime < 300){
                return Event.Direction.CLICK
            }else {
                return Event.Direction.NONE;
            }
        }
        const angle = this.getAngle(angx, angy);
        //通过计算手势所在的象限判断在什么方向
        if (angle >= -135 && angle <= -45) {
            return Event.Direction.UP;
        } else if (angle > 45 && angle < 135) {
            return Event.Direction.DOWN;
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            return Event.Direction.LEFT;
        } else if (angle >= -45 && angle <= 45) {
            return Event.Direction.RIGHT;
        }
    }
}
