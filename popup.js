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
};

const getReposInfo = (repoName, type) => {
    repoName = repoName.replace('/', '%2F');
    type = type || 'tags';
    const token = document.querySelector('#token').value;
    if (!token) {
        alert('还未输入token')
        return;
    }
    chrome.storage.sync.set({
        token,
    });
    return fetch(`http://gitlab.alibaba-inc.com/api/v3/projects/${repoName}/repository/${type}?private_token=${token}`)
        .then(function(response) {
            return response.json();
        });
};

const renderNameList = (res, container) => {
    const nameList = res.map(item => `<li>${item.name}</li>`);
    container.innerHTML = `<ul>${nameList.join('')}</ul>`;
};

const initQueryRepo = () => {
    const tokenInput = document.querySelector('#token');
    const repoList = document.querySelector('#repoList');
    const branchsDiv = document.querySelector('#repoResult .branches .list');
    const tagsDiv = document.querySelector('#repoResult .tags .list');
    chrome.storage.sync.get('token', items => {
        if (items.token) {
            tokenInput.value = items.token;
        }
    });

    repoList.addEventListener('click', e => {
        if (e.target.tagName.toLowerCase() === 'a') {
            const repoName = e.target.innerText;
            getReposInfo(repoName, 'branches').then(res => {
                if (res.message) res = [];
                renderNameList(res, branchsDiv);
            });
            getReposInfo(repoName, 'tags').then(res => {
                if (res.message) res = [];
                renderNameList(res, tagsDiv);
            });
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    getWeekOfYear(1);
    initQueryRepo();
});