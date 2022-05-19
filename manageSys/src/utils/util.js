/**
 * 工具函数封装
 */
export default {
  formateDate(date, rule) {
    let fmt = rule || "yyyy-MM-dd hh:mm:ss";
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, date.getFullYear());
    }
    const obj = {
      // "y+": date.getFullYear(),
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
    };
    for (let o in obj) {
      if (new RegExp(`(${o})`).test(fmt)) {
        const val = obj[o] + "";
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? val : ("00" + val).substr(val.length)
        );
      }
    }
    return fmt;
  },
};
