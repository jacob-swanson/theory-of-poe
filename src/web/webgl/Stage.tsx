import * as React from "react";
import {Component} from "react";
import {ReactPixiRenderer} from "./ReactPixiRenderer";

export interface StageProps {
    width: number;
    height: number;
    backgroundColor?: number;
    className?: string;
}

export class Stage extends Component<StageProps> {
    private canvas: HTMLCanvasElement | null = null;
    private app: PIXI.Application | null = null;
    private mountNode = null;

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
        this.mountNode = ReactPixiRenderer.createContainer(this.app.stage, false, false);
        ReactPixiRenderer.updateContainer(children, this.mountNode, this);
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