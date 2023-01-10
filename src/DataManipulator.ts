import { ServerRespond } from './DataStreamer';

export interface Row {
  ratio: number,
  price_abc: number,
  price_def: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + (ratio*0.1);
    const lowerBound = 1 - (ratio*0.1);
    /*
    Failed attempt at +-10% historical avg of ratio over last 12 months.
    Probably because date constantly updates so there is no difference in prevmonth
    var history = [];
    var date = new Date(serverRespond[0].timestamp);
    var prevmonth = date.getMonth();
    if (date.getMonth() > prevmonth){
      history.push(ratio);
      prevmonth = date.getMonth();
    }
    var sum = history.reduce((cur, prev) => cur + prev, 0);
    var histavg = sum / history.length;
    const upperBound = 1 + histavg*0.1;
    const lowerBound = 1 - histavg*0.1;
    if (history.length = 12){
      history = [];
    }
    */
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp: serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio: undefined,
    }
  }
}
