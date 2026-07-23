import { Container, Graphics, Text } from "pixi.js";

/** Simple clickable "Girar" button; disabled visually + functionally while spinning. */
export class SpinButton {
  readonly view: Container;
  private readonly background: Graphics;
  private readonly label: Text;
  private onClickHandler: (() => void) | null = null;

  constructor(width: number, height: number, label = "GIRAR") {
    this.view = new Container();
    this.background = new Graphics()
      .roundRect(0, 0, width, height, 8)
      .fill(0x2f80ed);

    this.label = new Text({
      text: label,
      style: { fill: 0xffffff, fontSize: 20, fontWeight: "bold" },
    });
    this.label.anchor.set(0.5);
    this.label.position.set(width / 2, height / 2);

    this.view.addChild(this.background, this.label);
    this.view.eventMode = "static";
    this.view.cursor = "pointer";
    this.view.on("pointertap", this.handleTap);
  }

  onClick(handler: () => void): void {
    this.onClickHandler = handler;
  }

  setEnabled(enabled: boolean): void {
    this.view.eventMode = enabled ? "static" : "none";
    this.view.alpha = enabled ? 1 : 0.5;
  }

  destroy(): void {
    this.view.off("pointertap", this.handleTap);
    this.onClickHandler = null;
    this.view.destroy({ children: true });
  }

  private handleTap = (): void => {
    this.onClickHandler?.();
  };
}
