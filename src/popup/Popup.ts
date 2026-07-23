import { Application, Container, Graphics } from "pixi.js";

export interface PopupOptions {
  panelWidth?: number;
  panelHeight?: number;
  overlayColor?: number;
  overlayAlpha?: number;
  panelColor?: number;
  cornerRadius?: number;
}

const DEFAULTS: Required<PopupOptions> = {
  panelWidth: 420,
  panelHeight: 360,
  overlayColor: 0x000000,
  overlayAlpha: 0.6,
  panelColor: 0x1b1b1f,
  cornerRadius: 16,
};

/** Simple popup chrome: a darkened full-screen overlay plus a centered panel. No slot logic lives here. */
export class Popup {
  readonly view: Container;
  readonly content: Container;
  private readonly app: Application;
  private readonly options: Required<PopupOptions>;
  private readonly overlay: Graphics;
  private readonly panel: Graphics;

  constructor(app: Application, options: PopupOptions = {}) {
    this.app = app;
    this.options = { ...DEFAULTS, ...options };

    this.view = new Container();
    this.overlay = new Graphics();
    this.panel = new Graphics();
    this.content = new Container();

    this.view.eventMode = "static";
    this.view.addChild(this.overlay, this.panel, this.content);

    this.redraw();
    this.app.renderer.on("resize", this.redraw);
  }

  addContent(view: Container): void {
    this.content.addChild(view);
    this.layoutContent(view);
  }

  show(): void {
    this.view.visible = true;
  }

  hide(): void {
    this.view.visible = false;
  }

  destroy(): void {
    this.app.renderer.off("resize", this.redraw);
    this.view.destroy({ children: true });
  }

  private redraw = (): void => {
    const {
      panelWidth,
      panelHeight,
      overlayColor,
      overlayAlpha,
      panelColor,
      cornerRadius,
    } = this.options;

    this.overlay.clear();
    this.overlay
      .rect(0, 0, this.app.screen.width, this.app.screen.height)
      .fill({ color: overlayColor, alpha: overlayAlpha });

    this.panel.clear();
    this.panel
      .roundRect(0, 0, panelWidth, panelHeight, cornerRadius)
      .fill(panelColor);
    this.panel.position.set(
      (this.app.screen.width - panelWidth) / 2,
      (this.app.screen.height - panelHeight) / 2,
    );

    this.content.position.copyFrom(this.panel.position);
  };

  private layoutContent(view: Container): void {
    const { panelWidth, panelHeight } = this.options;
    view.position.set(
      panelWidth / 2 - view.width / 2,
      panelHeight / 2 - view.height / 2,
    );
  }
}
