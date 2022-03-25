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
// const uri = get_path(json_path);

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM');
    // const all_bookmark_tree = await res_json(uri);
    const all_bookmark_tree = await getTree(json_path);
    console.log(all_bookmark_tree);
    const bookmarksList = getBookmarksList(all_bookmark_tree);
    console.log(bookmarksList);
});
