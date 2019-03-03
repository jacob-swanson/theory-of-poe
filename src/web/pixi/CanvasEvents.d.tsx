import {CanvasEvents} from "./CanvasEvents";

namespace PIXI {
    interface WebGLRenderer {
        plugins: {
            canvasevents: CanvasEvents
        };
    }

    interface CanvasRenderer {
        plugins: {
            canvasevents: CanvasEvents
        };
    }
}