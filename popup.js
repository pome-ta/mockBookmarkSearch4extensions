import getTree from "./bookmarks.js";



function urlParse(urlstr) {
    const urlBase = new URL(urlstr);
    const origin = urlBase.origin;
    const [, x, y, ..._] = urlBase.pathname.split('/');
    const url = [origin, x, y].join('/');
    return url;
}
const faviconUrl = (url) => `https://www.google.com/s2/favicons?domain=${urlParse(url)}`;



function getBookmarksList(bookmarkTreeNodes) {
    const rawbookmarks = new Array();
    const setBookmarkNodes = (treeNodes => {
        treeNodes.forEach(nodes => {
            (nodes.children) ? setBookmarkNodes(nodes.children) : rawbookmarks.push(nodes);
        });
    });

    setBookmarkNodes(bookmarkTreeNodes);
    rawbookmarks.sort((x, y) => (x.dateAdded > y.dateAdded) ? -1 : 1);

    const bookmarks = rawbookmarks.map(node => {
        return {
            favicon: faviconUrl(node.url),
            title: node.title || node.url,
            url: node.url
        };
    });
    return bookmarks;
}


const json_path = './dummyData/bookmark.js';

const container = document.querySelector('#container');



document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM');
    // const all_bookmark_tree = await res_json(uri);
    const all_bookmark_tree = await getTree(json_path);
    console.log(all_bookmark_tree);
    const bookmarksList = getBookmarksList(all_bookmark_tree);
    console.log(bookmarksList);
    container.innerHTML = setBookmarksTableHTML(bookmarksList);


});


function setBookmarksTableHTML(bookmarks) {
    // let insertHtml = '<input type="search" class="light-table-filter" data-table="order-table" placeholder="ブックマーク検索" /><table class="order-table"><thead>';
    let insertHtml = '<input type="search" class="light-table-filter" data-table="order-table" placeholder="ブックマーク検索"  autofocus /><table class="order-table">';
    // insertHtml += '<tr><th>favicon</th><th>title</th><th>URL</th></tr></thead><tbody>';
    insertHtml += '<tbody>';
    for (const bm of bookmarks) {
        insertHtml += `
        <tr>
            <td><img src="${bm.favicon}"></td>
            <td><div><a href="${bm.url}">${bm.title}</a>${bm.url}</div></td>
        </tr>`;
    }
    insertHtml += '</tbody></table>';
    return insertHtml;

}

// http://kachibito.net/snippets/light-javascript-table-filter
const LightTableFilter = (Arr => {
    let _input;
    function _onInputEvent(e) {
        _input = e.target;
        let tables = document.getElementsByClassName(_input.getAttribute('data-table'));
        console.log(tables);
        Arr.forEach.call(tables, table => {
            Arr.forEach.call(table.tBodies, tbody => {
                Arr.forEach.call(tbody.rows, _filter);
            });
        });
    }
    function _filter(row) {
        console.log(row);
        let text = row.textContent.toLowerCase();
        let val = _input.value.toLowerCase();
        row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
    }
    return {
        init: function () {
            let inputs = document.getElementsByClassName('light-table-filter');
            Arr.forEach.call(inputs, input => {
                console.log(input);
                input.oninput = _onInputEvent;
            });
        }
    };
})(Array.prototype);

document.addEventListener('readystatechange', function () {
    console.log('hoge');
    if (document.readyState === 'complete') {
        console.log('load');
        LightTableFilter.init();
    }
});

