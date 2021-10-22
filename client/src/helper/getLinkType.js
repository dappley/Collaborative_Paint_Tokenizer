function getLinkType(url) {
    var linkType = "";
    var slashCount = 0;

    for (var i = 0; i < url.length; i++) {
        if (slashCount === 4) {
            break;
        } else if (slashCount === 3) {
            linkType += url[i];
        } else if (url[i] === "/") {
            slashCount++;
        }
    }

    return linkType;
}

export default getLinkType;