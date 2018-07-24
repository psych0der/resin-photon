// @flow

/**
 * Geometry helper for converting polar coordinates to cartesian ones
 * @param {Number} offX additional x
 * @param {Number} offY additional y
 * @param {Number} radius
 * @param {Number} degrees Polar angle
 */
export const polarToCartesian = (
  offX: number,
  offY: number,
  radius: number,
  degrees: number
): { x: number, y: number } => {
  // conversion to radian as polar conversion is conveniently expressed in radians
  //  subtraction of 90 is important as y axis increases downwards in browsers
  const radians = (degrees * Math.PI) / 180.0;
  return {
    x: offX + radius * Math.cos(radians),
    y: offY + radius * Math.sin(radians),
  };
};

/**
 * Calculates angle difference between a pair of cartesian coordinates
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 */
export const calcAngleDiff = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return (Math.atan2(x1 * y2 - y1 * x2, x1 * x2 + y1 * y2) * 180) / Math.PI;
};

/**
 * Creates an Arc using SVG arc function
 * @param {Number} centerX center of the circle
 * @param {Number} centerY center of the circle
 * @param {Number} radius radius of the circle
 * @param {Number} startAngle angle from the center of the circle  of starting point of the arc
 * @param {Number} endAngle angle from the center of the circle  of ending point of the arc
 */
export const createCircularArc = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  useLargerArc: number | null = null,
  arcSweep: number = 0
) => {
  // this is because we want to draw from endpoint to counter clockwise
  let start = polarToCartesian(centerX, centerY, radius, endAngle);
  let end = polarToCartesian(centerX, centerY, radius, startAngle);

  // we want to use larger arc if the difference between the starting and ending point is > 180
  useLargerArc =
    useLargerArc != null ? useLargerArc : endAngle - startAngle <= 180 ? 0 : 1;

  return `M ${start.x} ${
    start.y
  } A ${radius} ${radius} 0 ${useLargerArc} ${arcSweep} ${end.x} ${end.y}`;
};
