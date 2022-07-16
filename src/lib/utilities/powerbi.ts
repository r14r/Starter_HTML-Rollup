import * as d3 from "d3";
import { debug } from "./helper";

type DataViewMatrix = any;
type DataViewMetadataColumn = any;
type DataViewMatrixNode = any;

function convert(obj: any, level: number) {
  return [
    ...Object.keys(obj).map((key) => {
      return {
        level: level,
        isSubtotal: false,
        index: -1,
        value: obj[key].value,
      };
    }),
  ];
}

/**
 *
 */
export function rowParser(data: any, level = 0, prefix: string = "") {
  const __p = `rowParser/${level}: `;

  debug(4, `${__p} -> MAIN  data=`, JSON.stringify(data));
  
  var result: any[] = [];

  try {
    /**/
    var names = data
      .filter((item: any) => item.levelValues)
      .map((item: any) => item.levelValues[0].value);

    /**/
    debug(4, `${__p} -> MAIN  data=`, data);

    /**/
   
    debug(4, `${__p} -- MAIN  result`, result);

    data.forEach((node: any, index: any) => {
      var levelIsSubtotal = data[index].isSubtotal ?? false;
      var levelValue = levelIsSubtotal ? "TOTALS" : data[index].value;

      var __p2 = `${index}/${levelValue}`;

      debug(4, `${__p} -- NODES ${__p2}: result`, result);
      debug(4, `${__p} -- NODES ${__p2}: node`, node);

      if (data[index].children) {
        debug(6, `${__p} -> RECURSE ${__p2}: children`, data[index].children);
        var childs = rowParser(data[index].children, level + 1, prefix);
        debug(4, `${__p} -- CHILD 1 ${__p2}: childs = `, childs);

        childs.forEach((child, childIndex) => {
          debug(
            4,
            `${__p} -- CHILD 3 + ${__p2}: ${childIndex}   ${levelValue} `,
            child
          );
          try {
            child.headers.unshift(levelValue);
          } catch (error) {
            console.error(`${__p} ERROR ${error}`);
          }

          debug(
            4,
            `${__p} -- CHILD 3 + ${__p2}: ${childIndex} + ${levelValue} `,
            child
          );
        });

        /**/
        debug(4, `${__p} -- CHILD 5 RETURN ${__p2}: result   ${index}`, result);
        debug(4, `${__p} -- CHILD 5 RETURN ${__p2}: childs   ${index}`, childs);
        result.push(childs);
        debug(4, `${__p} -- CHILD 5 RETURN ${__p2}: result + ${index}`, result);
      } else {
        var values = convert(data[index].values, level + 1);
        var item = {
          level: level + 1,
          headers: [levelValue],
          values: values.map((i) => i.value),
        };

        debug(5, `${__p} -- VALUE 2 ${__p2}: item   =`, item);

        result.push(item);
        debug(4, `${__p} -- VALUE 3 RESULT ${__p2}: result + ${index}`, result);
      }
    });

    debug(4, `${__p} <- MAIN ${level} result=`, result);
  } catch (error) {
    debug(4, `${__p} <- ERROR ${level} ${error}`, error);
  }

  return result;
}

export function getRowLevels(matrix: DataViewMatrix): any {
  var names: any[] = [];

  matrix.rows.levels
    .map((level: any) => level.sources)
    .forEach((data: DataViewMetadataColumn[]) => {
      names.push(data[0].displayName);
    });

  return names;
}

/**/
export function getColumnLevels(matrix: any): any {
  var names: any[] = [];

  matrix.columns.levels
    .map((level: any) => level.sources)
    .forEach((data: DataViewMetadataColumn[]) => {
      // if (data[0].roles.columns) {
      names.push(data[0].displayName);
      // }
    });

  return names;
}

export function getRowNames(matrix: any): any {
  return getNamesFromChild(matrix.rows.root.children);
}

export function getColumnNames(matrix: any): any {
  return getNamesFromChild(matrix.columns.root.children);
}

export function getNamesFromChild(child: any): any {
  var names: any[] = [];

  // @TODO child.forEach((data: DataViewMetadataColumn[any]) => {
  child.forEach((data: any) => {
    if (data.levelValues) {
      names.push({ level: data.level, value: data.levelValues[0].value });
    }

    if (data.children) {
      var values = getNamesFromChild(data.children);
      values.forEach((item: any) => {
        names.push(item);
      });
    }
  });

  return names;
}


export function   sortChildren(children: any[]): any[] {
  console.log("children=", children);

  // Step - 1: Create the array of key-value pairs
  var items = Object.keys(children).map((key: any) => {
    let child = children[key];
    let sortBy = child.isSubtotal ? "" : child.levelValues[0].value;

    return { key: sortBy, obj: children[key] };
  });
  console.log("items=", items);

  // Step - 2: Sort the array based on the second element (i.e. the value)
  items.sort((i1: any, i2: any) => {
    return i1.key - i2.key;
  });
  console.log("sorted=", items);

  // Step - 3: Obtain the list of keys in sorted order of the values.
  return items.map((e) => {
    return e.obj;
  });
}
