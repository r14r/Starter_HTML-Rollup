import d3, { HierarchyNode, HierarchyPointLink, HierarchyPointNode } from "d3";

import { debug } from "./lib/utilities/helper";

type ParseArray = any[];

export default class App {
  constructor(fileName: string = "data/matrix_xy_abc.json") {
    debug(2, `app/construtor: read file ${fileName}`);

    d3.json(fileName).then((data: any) => {
      this.parseData(data.rows.root);
    });
  }

  levelName(child: any): string {
    var levelName = "";
    try {
      if (child.levelValues) {
        levelName = child.levelValues[0].value;
      } else if (child.level == 0) {
        levelName = "MAIN";
      } else {
        levelName = "TOTALS";
      }
    } catch (error) {
      console.error(`levelName: ERROR ${error}`, child);
    }
    return levelName;
  }

  levelNames(levels: any): string {
    return levels?.join(", ");
  }

  parseData(data: any) {
    const _p = "parseData";

    debug(1, `${_p} data=`, data.children);

    this.results = [];
    try {
      this.parseChildren(data.children, 0, []);
    } catch (error) {
      debug(2, `${error} result=`, data.children, "error");
    }

    debug(2, `${_p} result=`, this.results);
  }

  results: any;
  addResult(result: any) {
    if (!this.results) {
      this.results = [];
    }
    this.results.push(result);
  }

  parseChildren(children: any, level: number, levels: ParseArray) {
    const _p = `parseChildren/${level}`;

    var results: ParseArray;

    if (levels == null) {
      levels = [];
    }

    debug(4, `${_p}: 1 (${this.levelNames(levels)}) children=`, children);

    /**/
    children.forEach((child: any) => {
      var levelName = this.levelName(child);

      debug(4, `${_p}: 2 ${levelName}`, child);
      let result = this.parseChild(child, level + 1, [
        ...levels,
        this.levelName(child),
      ]);

      results?.push(result);
      debug(4, `${_p}: 3 ${levelName}: results=`, results);
    });
  }

  parseChild(child: any, level: number = 0, levels: ParseArray) {
    const _p = `parseChild/${level}`;

    const levelNames = this.levelNames(levels);

    if (levels == null) {
      levels = [];
    }

    var levelName: string = this.levelName(child);

    debug(
      4,
      `${_p}/${levelName}: level=${levels} (${this.levelNames(levels)}) row=`,
      child
    );

    if (!child) {
      console.error(`${_p} ERROR: row=`, child);
      return [];
    }

    if (child.isSubtotal) {
      let item = {
        level: child.level,
        levels: levels,
        value: child.value,
        values: this.convert2array(child.values, child.level + 1),
        isSubtotal: true,
        child: child,
      };

      debug(2, `${_p} -- ${levelNames} item=`, item, "warn");

      this.addResult(item);
    }

    if (!child.children) {
      debug(4, `${_p} VALUES child=`, child);
      let item = {
        level: child.level,
        levels: levels,
        value: child.value,
        values: this.convert2array(child.values, child.level + 1),
        isSubtotal: false,
        child: child,
      };
      debug(2, `${_p} ## ${levelNames} child ${child.value} =`, item, "warn");

      this.addResult(item);
    } else {
      let result: any[] = [];

      debug(4, `${_p} -> ${child.value} child=`, child);
      let values: any = this.parseChildren(child.children, child.level + 1, [
        ...levels,
      ]);

      return [];
    }
  }

  convert2array(obj: any, level: number) {
    return [...Object.keys(obj).map((key) => obj[key].value)];
  }
}
