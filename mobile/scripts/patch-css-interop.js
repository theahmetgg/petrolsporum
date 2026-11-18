const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../node_modules/react-native-css-interop/dist/runtime/native/render-component.js');

if (!fs.existsSync(targetFile)) {
    process.exit(0);
}

let content = fs.readFileSync(targetFile, 'utf8');

const targetStr = `function stringify(object) {
    const seen = new WeakSet();
    return JSON.stringify(object, function replace(_, value) {
        if (!(value !== null && typeof value === "object")) {
            return value;
        }
        if (seen.has(value)) {
            return "[Circular]";
        }
        seen.add(value);
        const newValue = Array.isArray(value) ? [] : {};
        for (const entry of Object.entries(value)) {
            newValue[entry[0]] = replace(entry[0], entry[1]);
        }
        seen.delete(value);
        return newValue;
    }, 2);
}`;

const replacementStr = `function stringify(object) {
    const seen = new WeakSet();
    try {
        return JSON.stringify(object, function replace(key, value) {
            if (key === "_owner" || key === "_store" || key === "children") {
                return undefined;
            }
            if (!(value !== null && typeof value === "object")) {
                return value;
            }
            if (seen.has(value)) {
                return "[Circular]";
            }
            seen.add(value);
            const newValue = Array.isArray(value) ? [] : {};
            try {
                for (const entry of Object.entries(value)) {
                    if (entry[0] === "_owner" || entry[0] === "_store" || entry[0] === "children") continue;
                    try {
                        newValue[entry[0]] = replace(entry[0], entry[1]);
                    } catch {
                        newValue[entry[0]] = "[Unreadable]";
                    }
                }
            } catch {
                return "[Object]";
            }
            seen.delete(value);
            return newValue;
        }, 2);
    } catch {
        return "[Unstringifiable Object]";
    }
}`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('[Postinstall] Successfully patched react-native-css-interop for React 19');
}
