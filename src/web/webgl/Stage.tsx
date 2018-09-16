import * as React from "react";
import {Component} from "react";
import {ReactPIXIRenderer} from "./ReactPIXIRenderer";

export interface StageProps {
    width?: number;
    height?: number;
    backgroundColor?: number;
    className?: string;
}

export class Stage extends Component<StageProps> {
    protected canvas: HTMLCanvasElement | null = null;
    protected app: PIXI.Application | null = null;
    protected mountNode = null;

    public componentDidMount(): void {
        const {children, backgroundColor} = this.props;

        if (!this.canvas) {
            throw new Error("canvas missing");
        }

        const pixiOptions = {
            width: this.canvas.width,
            height: this.canvas.height,
            backgroundColor,
            view: this.canvas
        };
        this.app = new PIXI.Application(pixiOptions);
        this.mountNode = ReactPIXIRenderer.createContainer(this.app.stage, false, false);
        ReactPIXIRenderer.updateContainer(children, this.mountNode, this);


    }

    public render() {
        const {
            width,
            height,
            className
        } = this.props;
        return (
            <canvas
                ref={ref => this.canvas = ref}
                width={width}
                height={height}
                className={className}
            />
        );
    }

}