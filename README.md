# obsidian-calendar-ui

> ⚠️ Work in progress.

The UI that currently powers the [Obsidian Calendar plugin](https://github.com/liamcain/obsidian-calendar-plugin).

## Basic Usage

```ts
// const contentEl = ...;
this.calendar = new Calendar({
  target: contentEl, // the HTML element you're attaching it to
  props: {
    onClickDay: () => {},
    onHoverDay: () => {},
    onClickWeek: () => {},
    onHoverWeek: () => {},
    showWeekNums: false,
  },
});
```
