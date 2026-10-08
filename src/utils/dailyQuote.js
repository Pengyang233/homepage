import { maoQuotes } from "../assets/maoQuotes.js";

const MS_PER_DAY = 86_400_000;

// 使用访问者的本地日历日期，而不是 UTC 时区或刷新次数。
const localDayNumber = (date) =>
  Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY);

const shuffleForCycle = (cycle, count) => {
  const indices = Array.from({ length: count }, (_, index) => index);
  let seed = (Math.imul(cycle, 1664525) + 1013904223) >>> 0;
  for (let i = indices.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
};

export const getDailyQuote = (date = new Date()) => {
  const count = maoQuotes.length;
  if (!count) return "";
  if (count === 1) return maoQuotes[0];

  const day = localDayNumber(date);
  const cycle = Math.floor(day / count);
  const offset = ((day % count) + count) % count;
  const indices = shuffleForCycle(cycle, count);

  // 一轮用尽全部句子再换一轮；相邻两轮的边界也避免重复。
  // count >= 3 时，只交换开头两个元素，不影响上一轮结尾。
  if (count > 2 && indices[0] === shuffleForCycle(cycle - 1, count)[count - 1]) {
    [indices[0], indices[1]] = [indices[1], indices[0]];
  }
  return maoQuotes[indices[offset]];
};
