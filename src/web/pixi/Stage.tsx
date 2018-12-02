import * as React from "react";
import {Component} from "react";
import {emptyObject} from "../../utils/emptyObject";
import ResizeObserver from "resize-observer-polyfill";

export interface StageProps {
    /**
     * Color that the background should be.
     */
    backgroundColor?: number;
    /**
     * True to make the background, false otherwise.
     */
    transparent?: boolean;
    /**
     * Provide CSS classes for the underlying canvas.
     */
    className?: string;
    /**
     * True to automatically render, false otherwise. Defaults to true.
     */
    autoStart?: boolean;
    /**
     * Children to add to the stage.
     */
    children?: PIXI.DisplayObject[];
}

/**
 * Manages the Pixi app.
 */
export abstract class Stage<P extends StageProps> extends Component<P> {
    protected canvas: HTMLCanvasElement | null = null;
    protected app: PIXI.Application | null = null;

    private resizeObserver: ResizeObserver = new ResizeObserver(entries => {
        if (!this.app) {
            return;
        }
        const canvas = entries[0];
        this.resize(canvas.contentRect.width, canvas.contentRect.height);
    });

    /**
     * Setup the Pixi application.
     */
    public componentDidMount(): void {
        if (!this.canvas) {
            throw new Error("Canvas is required");
        }

        const autoStart = this.props.autoStart === undefined ? true : this.props.autoStart;
        if (!autoStart) {
            const ticker = PIXI.ticker.shared;
            ticker.autoStart = false;
            ticker.stop();
        }

        const size = this.getSize();
        const pixiOptions = {
            width: size.width,
            height: size.height,
            backgroundColor: this.props.backgroundColor,
            transparent: this.props.transparent,
            view: this.canvas,
            autoStart
        };
        this.app = new PIXI.Application(pixiOptions);
        this.addChildren(this.props.children);
        this.resizeObserver.observe(this.canvas);
    }

    /**
     * Destroy the Pixi app.
     */
    public componentWillUnmount() {
        if (this.app) {
            this.app.destroy(false, {children: true});
            this.app = null;
        }

        this.resizeObserver.disconnect();
    }

    /**
     * Update the Pixi app's children.
     * @param prevProps
     */
    public componentDidUpdate(prevProps: Readonly<StageProps>): void {
        if (!this.app) {
            return;
        }

        this.removeChildren();
        this.addChildren(this.props.children);
    }

    public render() {
        const {
            className
        } = this.props;
        return (
            <canvas
                ref={ref => this.canvas = ref}
                className={className}
                {...this.getAdditionalCanvasProps()}
            />
        );
    }

    /**
     * Override this method to provide additional properties on the canvas.
     */
    protected getAdditionalCanvasProps() {
        return emptyObject;
    }

    private resize(width: number, height: number) {
        if (!this.app) {
            return;
        }
        this.app.renderer.resize(width, height);
    }

    /**
     * Remove all of the children.
     */
    private removeChildren(): void {
        if (!this.app) {
            return;
        }

        while (this.app.stage.children[0]) {
            this.app.stage.removeChild(this.app.stage.children[0]);
        }
    }

    /**
     * Add children using the children provided via props.
     * @param children
     */
    private addChildren(children: any): void {
        if (!this.app) {
            return;
        }

        for (const child of children) {
            if (child instanceof PIXI.DisplayObject) {
                this.app.stage.addChild(child);
            }
        }
    }

    /**
     * Get the size of the canvas, so the Pixi app can be sized the same.
     */
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