import * as PIXI from "pixi.js";
import {noop} from "../../utils/noop";

export const CenterAnchor = new PIXI.ObservablePoint(noop, undefined, 0.5, 0.5);