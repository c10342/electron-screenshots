import { Rectangle, screen } from 'electron';

export interface Display extends Rectangle {
  id: number
  scaleFactor: number
}

export default (): Display => {
  const point = screen.getCursorScreenPoint();
  const { id, bounds, scaleFactor } = screen.getDisplayNearestPoint(point);

  // https://github.com/nashaofu/screenshots/issues/98
  return {
    id,
    x: Math.floor(bounds.x),
    y: Math.floor(bounds.y),
    width: Math.floor(bounds.width),
    height: Math.floor(bounds.height),
    scaleFactor,
  };
};

export const getAllDisplays = () => {
  // 获取所有屏幕的信息
  const displays = screen.getAllDisplays();
  let width = 0;
  let height = 0;
  let x = 0;
  let y = 0;
  const list: Display[] = [];
  displays.forEach((item) => {
    const itemWidth = Math.floor(item.bounds.width);
    const itemHeight = Math.floor(item.bounds.height);
    const itemX = Math.floor(item.bounds.x);
    const itemY = Math.floor(item.bounds.y);
    list.push({
      id: item.id,
      x: itemX,
      y: itemY,
      width: itemWidth,
      height: itemHeight,
      scaleFactor: item.scaleFactor,
    });
    // 宽度累加
    width += itemWidth;
    if (itemHeight > height) {
      // 取高度最高的
      height = itemHeight;
    }
    if (itemX < x) {
      x = itemX;
    }
    if (itemY < y) {
      y = itemY;
    }
  });

  return {
    // 宽高要可以覆盖所有屏幕
    width,
    height,
    // x，y为第一个屏幕的起点
    x,
    y,
    list,
  };
};
