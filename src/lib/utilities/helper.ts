"use strict";

/**/
export function debug(
  level: number,
  line: string,
  data: any = null,
  mode = "log"
): void {
  const debuglevel = 1;

  var log;
  if (mode == "log") {
    log = console.log;
  } else if (mode == "info") {
    log = console.info;
  } else if (mode == "warn") {
    log = console.warn;
  } else if (mode == "error") {
    log = console.error;
  } else {
    log = console.log;
  }

  if (level <= debuglevel) {
    if (data) {
      log(`${level}/${debuglevel}] ${line}`, data);
    } else {
      log(`${level}/${debuglevel}] ${line}`);
    }
  }
}
