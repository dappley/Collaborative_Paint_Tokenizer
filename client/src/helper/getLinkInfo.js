function getLinkInfo(url) {
    var roomId = "";
    var linkType = "";
    var slashCount = 0;

    for (var i = 0; i < url.length; i++) {
        if (url[i] === "/") {
            slashCount++;
        } else if (slashCount === 3) {
            linkType += url[i];
        } else if (slashCount === 4) {
            roomId += url[i];
        } else if (slashCount > 4) {
            break;
        }
    }
    roomId = roomId.replace('room=', '');

    return [linkType, roomId];
}

export default getLinkInfo;