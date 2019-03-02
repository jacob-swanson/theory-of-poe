import * as React from "react";
import {Component} from "react";
import {emptyObject} from "../../utils/emptyObject";
import ResizeObserver from "resize-observer-polyfill";
import {bind} from "../../utils/bind";
import {Rectangle} from "../../utils/Rectangle";
import {Assert} from "../../utils/Assert";

export interface StageRect {
    readonly offsetLeft: number;
    readonly offsetTop: number;
}

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
    /**
     * Callback for when the canvas resizes.
     * @param rect
     */
    onResize?: (rect: StageRect) => void;
}

/**
 * Manages the Pixi app.
 */
export abstract class Stage<P extends StageProps> extends Component<P> {
    protected canvas: HTMLCanvasElement | null = null;
    protected app: PIXI.Application | null = null;

    private resizeObserver: ResizeObserver = new ResizeObserver(entries => {
        const canvas = entries[0];
        this.onResize(canvas.contentRect);
    });

    /**
     * Setup the Pixi application.
     */
    public componentDidMount(): void {
        const canvas = Assert.notNull(this.canvas, "canvas must be set");

        // Handle auto-start
        const autoStart = this.props.autoStart === undefined ? true : this.props.autoStart;
        if (!autoStart) {
            const ticker = PIXI.ticker.shared;
            ticker.autoStart = false;
            ticker.stop();
        }

        // Create the app
        const size = this.getSize();
        const pixiOptions = {
            width: size.width,
            height: size.height,
            backgroundColor: this.props.backgroundColor,
            transparent: this.props.transparent,
            view: canvas,
            autoStart
        };
        this.app = new PIXI.Application(pixiOptions);

        this.setChildren(this.props.children);
        this.resizeObserver.observe(canvas);
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

    /**
     * Add children using the children provided via props.
     */
    protected setChildren(children: any): void {
        const app = Assert.notNull(this.app, "app must be set");

        for (const child of children) {
            if (child instanceof PIXI.DisplayObject) {
                app.stage.addChild(child);
            }
        }
    }

    @bind
    private onResize(rect: Rectangle) {
        const app = Assert.notNull(this.app, "app must be set");
        app.renderer.resize(rect.width, rect.height);

        const {onResize} = this.props;
        if (onResize && this.canvas) {
            onResize({
                offsetLeft: this.canvas.offsetLeft,
                offsetTop: this.canvas.offsetTop
            });
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