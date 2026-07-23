import { Application, Container, Graphics } from "pixi.js";
import { Logger } from "../monitoring/Logger";

export interface PopupOptions {
  panelWidth?: number;
  panelHeight?: number;
  innerPadding?: number;
  borderTopColor?: number;
  borderBottomColor?: number;
  borderThickness?: number;
  gradientTopColor?: number;
  gradientBottomColor?: number;
  cornerRadius?: number;
}

const DEFAULTS: Required<PopupOptions> = {
  panelWidth: 360,
  panelHeight: 430,
  innerPadding: 16,
  borderTopColor: 0xffdf88,
  borderBottomColor: 0xca8b2c,
  borderThickness: 4,
  gradientTopColor: 0x1a3470,
  gradientBottomColor: 0x0e1d45,
  cornerRadius: 18,
};

/** Gold-framed popup with an inner navy gradient panel. No slot logic lives here. */
export class Popup {
  readonly view: Container;
  readonly content: Container;
  private readonly logger = new Logger("Popup");
  private readonly app: Application;
  private readonly options: Required<PopupOptions>;
  private readonly frame: Graphics;
  private readonly frameMask: Graphics;
  private readonly panel: Graphics;
  private readonly panelMask: Graphics;
  private contentView: Container | null = null;

  constructor(app: Application, options: PopupOptions = {}) {
    this.app = app;
    this.options = { ...DEFAULTS, ...options };

    this.view = new Container();
    this.frame = new Graphics();
    this.frameMask = new Graphics();
    this.panel = new Graphics();
    this.panelMask = new Graphics();
    this.content = new Container();

    this.view.addChild(
      this.frame,
      this.frameMask,
      this.panel,
      this.panelMask,
      this.content,
    );
    this.frame.mask = this.frameMask;
    this.panel.mask = this.panelMask;

    this.redraw();
    this.app.renderer.on("resize", this.redraw);
  }

  addContent(view: Container): void {
    this.contentView = view;
    this.content.addChild(view);
    this.layoutContent(view);
  }

  show(): void {
    this.view.visible = true;
    this.logger.info("Opened");
  }

  hide(): void {
    this.view.visible = false;
    this.logger.info("Closed");
  }

  destroy(): void {
    this.logger.info("Destroy requested");
    this.app.renderer.off("resize", this.redraw);
    this.view.destroy({ children: true });
    this.logger.info("Destroyed");
  }

  private redraw = (): void => {
    const {
      panelWidth,
      panelHeight,
      innerPadding,
      borderTopColor,
      borderBottomColor,
      borderThickness,
      gradientTopColor,
      gradientBottomColor,
      cornerRadius,
    } = this.options;

    const panelX = (this.app.screen.width - panelWidth) / 2;
    const panelY = (this.app.screen.height - panelHeight) / 2;

    this.frame.clear();
    this.frameMask.clear();
    const borderSteps = 32;
    for (let i = 0; i < borderSteps; i++) {
      const t = i / Math.max(1, borderSteps - 1);
      const color = lerpColor(borderTopColor, borderBottomColor, t);
      const y = panelY + (panelHeight / borderSteps) * i;
      const h = panelHeight / borderSteps + 1;
      this.frame.rect(panelX, y, panelWidth, h).fill(color);
    }
    this.frameMask
      .roundRect(panelX, panelY, panelWidth, panelHeight, cornerRadius)
      .fill(0xffffff);

    this.panel.clear();
    this.panelMask.clear();
    const innerX = panelX + borderThickness;
    const innerY = panelY + borderThickness;
    const innerWidth = panelWidth - borderThickness * 2;
    const innerHeight = panelHeight - borderThickness * 2;
    const innerRadius = Math.max(0, cornerRadius - borderThickness);
    const steps = 28;

    for (let i = 0; i < steps; i++) {
      const t = i / Math.max(1, steps - 1);
      const color = lerpColor(gradientTopColor, gradientBottomColor, t);
      const y = innerY + (innerHeight / steps) * i;
      const h = innerHeight / steps + 1;
      this.panel.rect(innerX, y, innerWidth, h).fill(color);
    }
    this.panelMask
      .roundRect(innerX, innerY, innerWidth, innerHeight, innerRadius)
      .fill(0xffffff);

    this.content.position.set(innerX + innerPadding, innerY + innerPadding);
    if (this.contentView) {
      this.layoutContent(this.contentView);
    }
  };

  private layoutContent(view: Container): void {
    const { panelWidth, panelHeight, borderThickness, innerPadding } =
      this.options;
    const availableWidth = panelWidth - borderThickness * 2 - innerPadding * 2;
    const availableHeight =
      panelHeight - borderThickness * 2 - innerPadding * 2;
    const bounds = view.getLocalBounds();

    view.position.set(
      availableWidth / 2 - bounds.width / 2 - bounds.x,
      availableHeight / 2 - bounds.height / 2 - bounds.y,
    );
  }
}

function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff;
  const ag = (a >> 8) & 0xff;
  const ab = a & 0xff;
  const br = (b >> 16) & 0xff;
  const bg = (b >> 8) & 0xff;
  const bb = b & 0xff;

  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const b2 = Math.round(ab + (bb - ab) * t);

  return (r << 16) + (g << 8) + b2;
}
