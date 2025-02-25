let moduleMap = {
'assets/internal/index.js' () { return require('assets/internal/index.js') },
'assets/FarmScene/index.js' () { return require('assets/FarmScene/index.js') },
'assets/egg/index.js' () { return require('assets/egg/index.js') },
'assets/main/index.js' () { return require('assets/main/index.js') },
// tail
};

window.__cocos_require__ = function (moduleName) {
    let func = moduleMap[moduleName];
    if (!func) {
        throw new Error(`cannot find module ${moduleName}`);
    }
    return func();
};