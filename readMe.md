# Chinese address mapper 
This is a chinese address mapper which can auto fill the missing field of a piece of address.

## How to use
```javascript
const adrmap = require('address_mapper');
adrmap.init()
adrmap.transform('xxxxx')  // => this will return the [province, city] of this address in an array
```