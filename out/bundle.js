(function (d3) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var d3__default = /*#__PURE__*/_interopDefaultLegacy(d3);

    /**/
    function debug(level, line, data = null, mode = "log") {
        const debuglevel = 1;
        var log;
        if (mode == "log") {
            log = console.log;
        }
        else if (mode == "info") {
            log = console.info;
        }
        else if (mode == "warn") {
            log = console.warn;
        }
        else if (mode == "error") {
            log = console.error;
        }
        else {
            log = console.log;
        }
        if (level <= debuglevel) {
            if (data) {
                log(`${level}/${debuglevel}] ${line}`, data);
            }
            else {
                log(`${level}/${debuglevel}] ${line}`);
            }
        }
    }

    class App {
        constructor(fileName = "data/matrix_xy_abc.json") {
            debug(2, `app/construtor: read file ${fileName}`);
            d3__default["default"].json(fileName).then((data) => {
                this.parseData(data.rows.root);
            });
        }
        levelName(child) {
            var levelName = "";
            try {
                if (child.levelValues) {
                    levelName = child.levelValues[0].value;
                }
                else if (child.level == 0) {
                    levelName = "MAIN";
                }
                else {
                    levelName = "TOTALS";
                }
            }
            catch (error) {
                console.error(`levelName: ERROR ${error}`, child);
            }
            return levelName;
        }
        levelNames(levels) {
            return levels === null || levels === void 0 ? void 0 : levels.join(", ");
        }
        parseData(data) {
            const _p = "parseData";
            debug(1, `${_p} data=`, data.children);
            this.results = [];
            try {
                this.parseChildren(data.children, 0, []);
            }
            catch (error) {
                debug(2, `${error} result=`, data.children, "error");
            }
            debug(2, `${_p} result=`, this.results);
        }
        addResult(result) {
            if (!this.results) {
                this.results = [];
            }
            this.results.push(result);
        }
        parseChildren(children, level, levels) {
            const _p = `parseChildren/${level}`;
            var results;
            if (levels == null) {
                levels = [];
            }
            debug(4, `${_p}: 1 (${this.levelNames(levels)}) children=`, children);
            /**/
            children.forEach((child) => {
                var levelName = this.levelName(child);
                debug(4, `${_p}: 2 ${levelName}`, child);
                this.parseChild(child, level + 1, [
                    ...levels,
                    this.levelName(child),
                ]);
                debug(4, `${_p}: 3 ${levelName}: results=`, results);
            });
        }
        parseChild(child, level = 0, levels) {
            const _p = `parseChild/${level}`;
            const levelNames = this.levelNames(levels);
            if (levels == null) {
                levels = [];
            }
            var levelName = this.levelName(child);
            debug(4, `${_p}/${levelName}: level=${levels} (${this.levelNames(levels)}) row=`, child);
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
            }
            else {
                debug(4, `${_p} -> ${child.value} child=`, child);
                this.parseChildren(child.children, child.level + 1, [
                    ...levels,
                ]);
                return [];
            }
        }
        convert2array(obj, level) {
            return [...Object.keys(obj).map((key) => obj[key].value)];
        }
    }

    // import App from "./app_table_working";
    function main() {
        new App();
    }
    /**
     * Hierarchical table rows object
     */
    var treeTable = (options) => {
        var tableSelector = (options && options.tableSelector) || "table";
        var parentClass = (options && options.parentClass) || "header";
        var childClassPrefix = (options && options.childClassPrefix) || "";
        var collapsedClass = (options && options.collapsedClass) || "collapsed";
        /**
         * Recursively hide all child rows or show immediate children
         *
         * All direct children must have a class that is the same as the parent id with an optional prefix
         */
        var toggleRowChildren = (parentRow) => {
            var toggle = (row) => {
                row.style.display = row.style.display ? "" : "none";
                return row;
            };
            /**
             * Encapsulate the recursion check
             */
            var collapsible = (row) => {
                return (row.classList.contains(parentClass) &&
                    !row.classList.contains(collapsedClass));
            };
            var childClass = childClassPrefix + parentRow.getAttribute("id");
            var childrenRows = parentRow.parentNode.querySelectorAll("tr." + childClass);
            // toggle all the children
            childrenRows.forEach((row) => {
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
                    table.addEventListener("click", (elem) => {
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

})(d3);
