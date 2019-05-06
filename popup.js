'use strict';

// 获取当前日期在本年度的周数
// https://blog.csdn.net/zzyymaggie/article/details/19289549
const getWeekOfYear = (weekStart) => {
    weekStart = weekStart || 0;
    if (isNaN(weekStart) || weekStart > 6) weekStart = 0;
    const currentWeek = document.querySelector('#currentWeek');
    const now = new Date();
    const year = now.getFullYear();
    const firstDay = new Date(year, 0, 1);
    let firstDayDay = firstDay.getDay();
    if (firstDayDay === 0) firstDayDay = 7;
    const firstWeekDay = 7 - firstDayDay + weekStart;
    const dayOfYear = (now - firstDay) / (24 * 60 * 60 * 1000) + 1;
    const week = Math.ceil((dayOfYear - firstWeekDay) / 7) + 1;
    currentWeek.innerHTML = `本周是${year}年第${week}周`;
};+

document.addEventListener('DOMContentLoaded', () => {
    getWeekOfYear(1);
});