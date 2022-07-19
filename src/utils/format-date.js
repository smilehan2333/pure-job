// 格式化时间  "yyyy-MM-dd hh:mm:ss 星期几"
export default function formatDate(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date(); // 判断是否传入了字符串，如果没传则生成当前日期

  const year = date.getFullYear();
  const month = getFullNumber(date.getMonth() + 1);
  const day = getFullNumber(date.getDate());
  const hour = getFullNumber(date.getHours());
  const minutes = getFullNumber(date.getMinutes());
  const seconds = getFullNumber(date.getSeconds());
  const week = getWeek(date.getDay());

  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds} 星期${week}`;

  // 1~9补全为01~09
  function getFullNumber(num) {
    return num < 10 ? "0" + num : "" + num;
  }
  // 星期
  function getWeek(num) {
    return ["天", "一", "二", "三", "四", "五", "六"][num];
  }
}
