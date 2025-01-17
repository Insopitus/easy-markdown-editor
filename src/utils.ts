import { bindings } from "./easymde";

export function createSep() {
    var el = document.createElement('i');
    el.className = 'separator';
    el.innerHTML = '|';
    return el;
}

export function createTooltip(title, action, shortcuts) {
    var actionName;
    var tooltip = title;

    if (action) {
        actionName = getBindingName(action);
        if (shortcuts[actionName]) {
            tooltip += ' (' + fixShortcut(shortcuts[actionName]) + ')';
        }
    }

    return tooltip;
}

/**
 * Modify HTML to remove the list-style when rendering checkboxes.
 * @param {string} htmlText - HTML to be modified.
 * @return {string} The modified HTML text.
 */
export function removeListStyleWhenCheckbox(htmlText: string): string {

    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(htmlText, 'text/html');
    var listItems = htmlDoc.getElementsByTagName('li');

    for (var i = 0; i < listItems.length; i++) {
        var listItem = listItems[i];

        for (var j = 0; j < listItem.children.length; j++) {
            var listItemChild = listItem.children[j];

            if (listItemChild instanceof HTMLInputElement && listItemChild.type === 'checkbox') {
                // From Github: margin: 0 .2em .25em -1.6em;
                listItem.style.marginLeft = '-1.5em';
                listItem.style.listStyleType = 'none';
            }
        }
    }

    return htmlDoc.documentElement.innerHTML;
}


export const isMac = /Mac/.test(navigator.platform);
/**
 * Fix shortcut. Mac use Command, others use Ctrl.
 */
export function fixShortcut(name: string) {
    if (isMac) {
        name = name.replace('Ctrl', 'Cmd');
    } else {
        name = name.replace('Cmd', 'Ctrl');
    }
    return name;
}

export function getBindingName(f) {
    for (var key in bindings) {
        if (bindings[key] === f) {
            return key;
        }
    }
    return null;
};

export function isMobile() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};


var anchorToExternalRegex = new RegExp(/(<a.*?https?:\/\/.*?[^a]>)+?/g);

/**
 * Modify HTML to add 'target="_blank"' to links so they open in new tabs by default.
 * @param {string} htmlText - HTML to be modified.
 * @return {string} The modified HTML text.
 */
export function addAnchorTargetBlank(htmlText: string): string {
    var match;
    while ((match = anchorToExternalRegex.exec(htmlText)) !== null) {
        // With only one capture group in the RegExp, we can safely take the first index from the match.
        var linkString = match[0];

        if (linkString.indexOf('target=') === -1) {
            var fixedLinkString = linkString.replace(/>$/, ' target="_blank">');
            htmlText = htmlText.replace(linkString, fixedLinkString);
        }
    }
    return htmlText;
}

/**
 * The state of CodeMirror at the given position.
 */
export function getState(cm: CodeMirror.Editor, pos: CodeMirror.Position) {
    pos = pos || cm.getCursor('start');
    var stat = cm.getTokenAt(pos);
    if (!stat.type) return {};

    var types = stat.type.split(' ');

    var ret = {},
        data, text;
    for (var i = 0; i < types.length; i++) {
        data = types[i];
        if (data === 'strong') {
            ret.bold = true;
        } else if (data === 'variable-2') {
            text = cm.getLine(pos.line);
            if (/^\s*\d+\.\s/.test(text)) {
                ret['ordered-list'] = true;
            } else {
                ret['unordered-list'] = true;
            }
        } else if (data === 'atom') {
            ret.quote = true;
        } else if (data === 'em') {
            ret.italic = true;
        } else if (data === 'quote') {
            ret.quote = true;
        } else if (data === 'strikethrough') {
            ret.strikethrough = true;
        } else if (data === 'comment') {
            ret.code = true;
        } else if (data === 'link' && !ret.image) {
            ret.link = true;
        } else if (data === 'image') {
            ret.image = true;
        } else if (data.match(/^header(-[1-6])?$/)) {
            ret[data.replace('header', 'heading')] = true;
        }
    }
    return ret;
}


/**
 * Convert a number of bytes to a human-readable file size. If you desire
 * to add a space between the value and the unit, you need to add this space
 * to the given units.
 * @param bytes {number} A number of bytes, as integer. Ex: 421137
 * @param units {number[]} An array of human-readable units, ie. [' B', ' K', ' MB']
 * @returns string A human-readable file size. Ex: '412 KB'
 */
export function humanFileSize(bytes: number, units: number[]) {
    if (Math.abs(bytes) < 1024) {
        return '' + bytes + units[0];
    }
    var u = 0;
    do {
        bytes /= 1024;
        ++u;
    } while (Math.abs(bytes) >= 1024 && u < units.length);
    return '' + bytes.toFixed(1) + units[u];
}

// Merge the properties of one object into another.
function mergeProperties(target: Object, source: Object) {
    for (var property in source) {
        if (Object.prototype.hasOwnProperty.call(source, property)) {
            if (source[property] instanceof Array) {
                target[property] = source[property].concat(target[property] instanceof Array ? target[property] : []);
            } else if (
                source[property] !== null &&
                typeof source[property] === 'object' &&
                source[property].constructor === Object
            ) {
                target[property] = mergeProperties(target[property] || {}, source[property]);
            } else {
                target[property] = source[property];
            }
        }
    }

    return target;
}

// Merge an arbitrary number of objects into one.
export function extend(target: Object, ...source: Object[]) {

    for (let s of source) {
        target = mergeProperties(target, s);
    }

    return target;
}

/* The right word count in respect for CJK. */
export function wordCount(data: string) {
    var pattern = /[a-zA-Z0-9_\u00A0-\u02AF\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
    var m = data.match(pattern);
    var count = 0;
    if (m === null) return count;
    for (var i = 0; i < m.length; i++) {
        if (m[i].charCodeAt(0) >= 0x4E00) {
            count += m[i].length;
        } else {
            count += 1;
        }
    }
    return count;
}

