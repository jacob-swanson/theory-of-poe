import * as React from "react";
import {Component} from "react";
import {ReactPIXIRenderer} from "./ReactPIXIRenderer";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";
import * as _ from "lodash";

const log = new ConsoleLogger("Stage");

export interface StageProps {
    backgroundColor?: number;
    transparent?: boolean;
    className?: string;
}

export class Stage<P extends StageProps = StageProps> extends Component<P> {
    protected canvas: HTMLCanvasElement | null = null;
    protected app: PIXI.Application | null = null;
    protected mountNode = null;

    private onResize = () => {
        if (!this.app) {
            return;
        }

        const size = this.getSize();
        this.app.renderer.resize(size.width, size.height);
    };

    private onResizeDebounce = _.debounce(this.onResize, (1 / 60) * 2 * 1000);

    public componentDidMount(): void {
        const {children, backgroundColor, transparent} = this.props;

        if (!this.canvas) {
            throw new Error("canvas missing");
        }

        const size = this.getSize();
        const pixiOptions = {
            width: size.width,
            height: size.height,
            backgroundColor,
            transparent,
            view: this.canvas
        };
        this.app = new PIXI.Application(pixiOptions);
        this.mountNode = ReactPIXIRenderer.createContainer(this.app.stage, false, false);
        ReactPIXIRenderer.updateContainer(children, this.mountNode, this);

        window.addEventListener("resize", this.onResize);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    public render() {
        const {
            className
        } = this.props;
        return (
            <canvas
                ref={ref => this.canvas = ref}
                className={className}
                {...this.getAdditionalProps()}
            />
        );
    }

    protected getAdditionalProps() {
        return {};
    }

    private getSize() {
        if (!this.canvas || !this.canvas.parentElement) {
            return {width: 0, height: 0};
        }
        const style = getComputedStyle(this.canvas.parentElement);
        return {
            width: parseInt(style.getPropertyValue("width"), 10),
            height: parseInt(style.getPropertyValue("height"), 10)
        };
    }
}