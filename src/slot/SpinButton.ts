import { Container, Graphics, Text } from "pixi.js";

export interface SpinButtonStyle {
  backgroundColor?: number;
  backgroundBottomColor?: number;
  textColor?: number;
  borderColor?: number;
  borderThickness?: number;
}

/** Simple clickable "Girar" button; disabled visually + functionally while spinning. */
export class SpinButton {
  readonly view: Container;
  private readonly backgroundFill: Graphics;
  private readonly backgroundMask: Graphics;
  private readonly backgroundBorder: Graphics;
  private readonly disabledOverlay: Graphics;
  private readonly label: Text;
  private readonly width: number;
  private readonly height: number;
  private readonly style: Required<SpinButtonStyle>;
  private onClickHandler: (() => void) | null = null;

  constructor(
    width: number,
    height: number,
    label = "GIRAR",
    style: SpinButtonStyle = {},
  ) {
    this.width = width;
    this.height = height;
    this.style = {
      backgroundColor: style.backgroundColor ?? 0x54d69f,
      backgroundBottomColor: style.backgroundBottomColor ?? 0x2f9c74,
      textColor: style.textColor ?? 0x111111,
      borderColor: style.borderColor ?? 0x2aa37d,
      borderThickness: style.borderThickness ?? 2,
    };

    this.view = new Container();
    this.backgroundFill = new Graphics();
    this.backgroundMask = new Graphics();
    this.backgroundBorder = new Graphics();
    this.disabledOverlay = new Graphics();
    this.drawBackground();

    this.label = new Text({
      text: label,
      style: {
        fill: this.style.textColor,
        fontSize: Math.round(height * 0.48),
        fontWeight: "900",
        letterSpacing: 1,
      },
    });
    this.label.anchor.set(0.5);
    this.label.position.set(width / 2, height / 2);

    this.disabledOverlay
      .roundRect(0, 0, this.width, this.height, this.height / 2)
      .fill({ color: 0x000000, alpha: 0.32 });
    this.disabledOverlay.visible = false;

    this.backgroundFill.mask = this.backgroundMask;
    this.view.addChild(
      this.backgroundFill,
      this.backgroundMask,
      this.backgroundBorder,
      this.disabledOverlay,
      this.label,
    );
    this.view.eventMode = "static";
    this.view.cursor = "pointer";
    this.view.on("pointertap", this.handleTap);
  }

  onClick(handler: () => void): void {
    this.onClickHandler = handler;
  }

  setEnabled(enabled: boolean): void {
    this.view.eventMode = enabled ? "static" : "none";
    this.view.cursor = enabled ? "pointer" : "default";
    this.disabledOverlay.visible = !enabled;
  }

  destroy(): void {
    this.view.off("pointertap", this.handleTap);
    this.onClickHandler = null;
    this.view.destroy({ children: true });
  }

  private handleTap = (): void => {
    this.onClickHandler?.();
  };

  private drawBackground(): void {
    const {
      backgroundColor,
      backgroundBottomColor,
      borderColor,
      borderThickness,
    } = this.style;
    this.backgroundFill.clear();
    this.backgroundMask.clear();
    this.backgroundBorder.clear();

    const steps = 18;
    for (let i = 0; i < steps; i++) {
      const t = i / Math.max(1, steps - 1);
      const color = lerpColor(backgroundColor, backgroundBottomColor, t);
      const y = (this.height / steps) * i;
      const h = this.height / steps + 1;
      this.backgroundFill.rect(0, y, this.width, h).fill(color);
    }

    this.backgroundMask
      .roundRect(0, 0, this.width, this.height, this.height / 2)
      .fill(0xffffff);

    this.backgroundBorder
      .roundRect(0, 0, this.width, this.height, this.height / 2)
      .stroke({ color: borderColor, width: borderThickness });
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
