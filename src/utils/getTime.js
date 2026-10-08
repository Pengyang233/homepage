import { h } from "vue";
import { SpaCandle } from "@icon-park/vue-next";
import dayjs from "dayjs";

// 时钟
export const getCurrentTime = () => {
  let time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
  let day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  let hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  let minute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  let second = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
  let weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  let currentTime = {
    year,
    month,
    day,
    hour,
    minute,
    second,
    weekday: weekday[time.getDay()],
  };
  return currentTime;
};

// 时光胶囊
export const getTimeCapsule = (date = new Date()) => {
  const now = dayjs(date);
  const periods = {
    day: { name: "今日", start: now.startOf("day"), end: now.add(1, "day").startOf("day"), unit: "小时" },
    week: { name: "本周", start: now.startOf("day").subtract((now.day() + 6) % 7, "day"), unit: "天" },
    month: { name: "本月", start: now.startOf("month"), end: now.add(1, "month").startOf("month"), unit: "天" },
    year: { name: "本年", start: now.startOf("year"), end: now.add(1, "year").startOf("year"), unit: "天" },
  };
  periods.week.end = periods.week.start.add(7, "day");
  return Object.fromEntries(Object.entries(periods).map(([key, p]) => {
    const total = p.end.diff(p.start, p.unit === "小时" ? "hour" : "day");
    const passed = Math.min(total, Math.max(0, now.diff(p.start, p.unit === "小时" ? "hour" : "day")));
    const fraction = Math.min(1, Math.max(0, (now.valueOf() - p.start.valueOf()) / (p.end.valueOf() - p.start.valueOf())));
    return [key, { name: p.name, total, passed, remaining: total - passed, percentage: (fraction * 100).toFixed(2) }];
  }));
};

// 欢迎提示
export const helloInit = () => {
  const hour = new Date().getHours();
  let hello = null;
  if (hour < 6) {
    hello = "凌晨好";
  } else if (hour < 9) {
    hello = "早上好";
  } else if (hour < 12) {
    hello = "上午好";
  } else if (hour < 14) {
    hello = "中午好";
  } else if (hour < 17) {
    hello = "下午好";
  } else if (hour < 19) {
    hello = "傍晚好";
  } else if (hour < 22) {
    hello = "晚上好";
  } else {
    hello = "夜深了";
  }
  ElMessage({
    dangerouslyUseHTMLString: true,
    message: `<strong>${hello}</strong> 欢迎来到我的主页`,
  });
};

// 默哀模式
const anniversaries = {
  4.4: "清明节",
  5.12: "汶川大地震纪念日",
  7.7: "中国人民抗日战争纪念日",
  9.18: "九·一八事变纪念日",
  12.13: "南京大屠杀死难者国家公祭日",
};
export const checkDays = () => {
  const myDate = new Date();
  const mon = myDate.getMonth() + 1;
  const date = myDate.getDate();
  const key = `${mon}.${date}`;
  if (Object.prototype.hasOwnProperty.call(anniversaries, key)) {
    console.log(`今天是${anniversaries[key]}`);
    const gray = document.createElement("style");
    gray.innerHTML = "html{filter: grayscale(100%)}";
    document.head.appendChild(gray);
    ElMessage({
      message: `今天是${anniversaries[key]}`,
      duration: 14000,
      icon: h(SpaCandle, { theme: "filled", fill: "#efefef" }),
    });
  }
};

// 建站日期统计
export const siteDateStatistics = (startDate) => {
  const currentDate = new Date();
  let years = currentDate.getFullYear() - startDate.getFullYear();
  let months = currentDate.getMonth() - startDate.getMonth();
  let days = currentDate.getDate() - startDate.getDate();

  // 如果天数或月份为负数，则调整天数和月份
  if (days < 0) {
    months--;
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `本站已经苟活了 ${years} 年 ${months} 月 ${days} 天`;
};
