import * as React from "react";
import {Component} from "react";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";
import {emptyObject} from "../../utils/emptyObject";

const log = new ConsoleLogger("Stage");

export interface StageProps {
    backgroundColor?: number;
    transparent?: boolean;
    className?: string;
    autoStart?: boolean;
    children?: PIXI.DisplayObject[];
}

export abstract class Stage<P extends StageProps> extends Component<P> {
    protected canvas: HTMLCanvasElement | null = null;
    protected app: PIXI.Application | null = null;

    public componentDidMount(): void {
        const {backgroundColor, transparent, autoStart, children} = this.props;

        if (!this.canvas) {
            throw new Error("canvas missing");
        }

        if (!autoStart) {
            const ticker = PIXI.ticker.shared;
            ticker.autoStart = false;
            ticker.stop();
        }

        const size = this.getSize();
        const pixiOptions = {
            width: size.width,
            height: size.height,
            backgroundColor,
            transparent,
            view: this.canvas,
            autoStart
        };
        this.app = new PIXI.Application(pixiOptions);

        this.addChildren();

        window.addEventListener("resize", this.onResize);
    }

    public componentWillUnmount() {
        if (this.app) {
            this.app.destroy();
        }
        window.removeEventListener("resize", this.onResize);
    }

    public componentDidUpdate(prevProps: Readonly<StageProps>): void {
        if (!this.app) {
            return;
        }

        this.removeChildren();
        this.addChildren();
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
        return emptyObject;
    }

    private removeChildren(): void {
        if (!this.app) {
            return;
        }

        while (this.app.stage.children[0]) {
            this.app.stage.removeChild(this.app.stage.children[0]);
        }
    }

    private addChildren(): void {
        if (!this.app) {
            return;
        }

        const {children} = this.props;
        if (!Array.isArray(children)) {
            return;
        }

        for (const child of children) {
            if (child instanceof PIXI.DisplayObject) {
                this.app.stage.addChild(child);
            }
        }
    }

    private onResize = () => {
        if (!this.app) {
            return;
        }

        const size = this.getSize();
        this.app.renderer.resize(size.width, size.height);
    };

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