const get_path = (path) => {
    const _location = `${location.protocol}//${location.host}${location.pathname}`;
    return new URL(path, _location).href;
}


async function res_json(uri) {
    const res = await fetch(uri);
    const json_data = await res.json();
    return json_data;
}



export default function getTree(uri) {
    const json_path = get_path(uri);
    return res_json(json_path);
}