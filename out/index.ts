// import App from "./app_table_working";
import App from "./app";

function main() {
  const app = new App();
}

/**
 * Hierarchical table rows object
 */
var treeTable = (options: any) => {
  "use strict";

  var tableSelector = (options && options.tableSelector) || "table";
  var parentClass = (options && options.parentClass) || "header";
  var childClassPrefix = (options && options.childClassPrefix) || "";
  var collapsedClass = (options && options.collapsedClass) || "collapsed";

  /**
   * Recursively hide all child rows or show immediate children
   *
   * All direct children must have a class that is the same as the parent id with an optional prefix
   */
  var toggleRowChildren = (parentRow: any) => {
    var toggle = (row: any) => {
      row.style.display = row.style.display ? "" : "none";

      return row;
    };

    /**
     * Encapsulate the recursion check
     */
    var collapsible = (row: any) => {
      return (
        row.classList.contains(parentClass) &&
        !row.classList.contains(collapsedClass)
      );
    };

    var childClass = childClassPrefix + parentRow.getAttribute("id");
    var childrenRows = parentRow.parentNode.querySelectorAll("tr." + childClass);

    // toggle all the children
    childrenRows.forEach((row: any) => {
      toggle(row);
      // if a child is a parent and isn't collapsed
      if (collapsible(row)) {
        // recurse to the child
        toggleRowChildren(row);
      }
    });

    // 'mark' that the child has been hidden or not
    parentRow.classList.toggle(collapsedClass);
  };

  return {
    init: function () {
      document.querySelectorAll(tableSelector).forEach(function (table) {
        table.addEventListener("click", (elem: any) => {
          if (elem.target && elem.target.parentNode.matches("tr." + parentClass)) {
            toggleRowChildren(elem.target.parentNode);
          }
        });
      });
    },
  };
};

var myTreeTable = treeTable({
  parentClass: "parent",
  collapsedClass: "active",
  childClassPrefix: "child-",
});

window.addEventListener("DOMContentLoaded", myTreeTable.init.bind(myTreeTable));
window.addEventListener("load", main);
