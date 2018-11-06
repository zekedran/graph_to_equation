import {canvasHeight, canvasWidth} from "./draw";

export class Point {
  constructor(x,y, convert=false) {
    if(convert) {
      this.x = (x - canvasWidth / 2) / (canvasWidth/10);
      this.y = (-(y - canvasHeight / 2)) / (canvasHeight/10);
    } else {
      this.x = x;
      this.y = y;
    }
  }
  convertToCanvasPoint() {
    let {x, y} = this;
    this.x = ( x + canvasWidth / 2 );
    this.y = ( -(y - canvasHeight / 2) );
    return this;
  };

  distanceFrom(a,b) {
    let {x,y} = this;
    let dist = y - (a*x + b);
    return dist * dist;
  }
}

export function predictEquation(points) {
  console.log({points});

  let a = 0;
  let b = 0;
  let initialLoss = NaN;
  let previousLoss = 9999;
  let loss = 9990;

  for(let iterations=0; previousLoss-loss>0.01; iterations++) {
    previousLoss = loss;
    loss = points.reduce((loss, point) => {
      console.log(point, point.distanceFrom(a, b));
      loss += point.distanceFrom(a, b);
      return loss;
    }, 0);

    if(iterations===0) initialLoss = loss;

    let learningRate = 0.1 / points.length;
    let dJda = points.reduce((dJda, {x,y}) => {
      let current_dJda = (y - (a*x+b))*(-1)*(x);
      return dJda + current_dJda;
    }, 0);
    let dJdb = points.reduce((dJda, {x,y}) => {
      let current_dJda = (y - (a*x+b))*(-1)*(1);
      return dJda + current_dJda;
    }, 0);

    console.log({previousLoss, loss, dJda, dJdb});

    a = a - learningRate * dJda;
    b = b - learningRate * dJdb;
  }


  let newLoss = points.reduce((loss, point) => {
    console.log(point, point.distanceFrom(a, b));
    loss += point.distanceFrom(a, b);
    return loss;
  }, 0);

  return {initialLoss, newLoss, a, b};

}
