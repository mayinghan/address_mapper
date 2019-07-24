const Init = require('./src/init');
const _init = new Init();
const jieba = require('nodejieba');
let result = null;

exports.init = () => (result = _init.start());

function main(input) {
    const provinceDistMap = result.provinceDistMap;
    const cityMap = result.cityMap;
    const distMap = result.distMap;
    const latlngMap = result.latlngMap;
    
    jieba.load();
    var location = getDetail(input, distMap, cityMap);
    return location;
}

function getDetail(input, distMap, cityMap) {
    //extract useful info by using jieba
    let cutResult = jieba.cut(input);

    for(let item of cutResult) {
        if(item.includes('市')) {
            item = item.replace(/市/,'');
        }
        if(cityMap.has(item)) {
            return cityMap.get(item);
        }
    }

    for(let item of cutResult) {
        if(distMap.has(item)) {
            return distMap.get(item);
        }
    }
    return [];
}

exports.transform = function(input) {
    //console.log(main('南山区南海大道蛇山景山山庄'));
    return main(input);
}

