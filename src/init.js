'use strict'

const fs = require('fs');
const csvparser = require('csv-parser');
const path = require('path')
const env = process.env.NODE_ENV || 'development';

class Init {
    start() {
        return this.read_data_from_csv()
    }

    read_data_from_csv() {
        let self = this;
        let filepath = path.resolve(__dirname + '/resource/pca.csv');

        const latlng = new Map();   //[province, city, dist] -> [lat, lng]
        const dist = new Map();     //[dist] -> [province, city, dist]
        const city = new Map();     //[city] -> [province, city]
        const province_dist = new Map();    //[province, dist] -> [province, city, dist]

        const content = fs.readFileSync(filepath, 'utf-8');
        const arr = content.split('\r\n');
        for(let row of arr) {
            let values = row.split(',');
            let item = {
                sheng: values[1],
                shi: values[2],
                qu: values[3],
                lat: values[4],
                lng: values[5]
            };
            self._fill_latlng_map(latlng, item)
            self._fill_dist_map(dist, item);
            self._fill_city_map(city, item);
            self._fill_province_dist_map(province_dist, item);
        }

        return {
            provinceDistMap: province_dist,
            cityMap: city,
            distMap: dist,
            latlngMap: latlng
        }
        // return new Promise((res, rej) => {
        //     fs.createReadStream(filepath)
        //     .pipe(csvparser())
        //     .on('data', row => {
        //         if (row) {
        //             self._fill_latlng_map(latlng, row)
        //             self._fill_dist_map(dist, row);
        //             self._fill_city_map(city, row);
        //             self._fill_province_dist_map(province_dist, row);
        //         }
        //     })
        //     .on('end', () => {
        //         res({
        //             provinceDistMap: province_dist,
        //             cityMap: city,
        //             distMap: dist,
        //             latlngMap: latlng
        //         })
        //     })
        // });
    }

    _fill_dist_map(dist, row) {
        let key = row.qu;
        let value = [row.sheng, row.shi];
        dist.set(key, value);
    }

    _fill_latlng_map(latlng, row) {
        let key = [row.sheng, row.shi, row.qu];
        let value = [row.lat, row.lng];
        latlng.set(key, value);
    }

    _fill_city_map(city, row) {
        let key = row.shi;
        if(key === '香港特别行政区') key = '香港';
        if(key === '澳门特别行政区') key = '澳门';
        if(key.includes('市')) key = key.replace(/市/,'');
        let value = [row.sheng, row.shi];
        city.set(key, value);
    }

    _fill_province_dist_map(province_dist, row) {
        let key = [row.sheng, row.qu];
        let value = [row.sheng, row.shi, row.qu];
        province_dist.set(key, value);
    }
}

module.exports = Init;