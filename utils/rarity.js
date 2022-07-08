const basePath = process.cwd();
import fs from "fs";
const layersDir = `${basePath}/layers`;

import layerConfigurations from "../src/config.js";

import getElements from "../src/main.js";

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);

let occurences = { "count": [], "traits": [] };
data.forEach((item) => {
  item.attributes.forEach((attribute) => {
    let trait_type = attribute.trait_type;
    let value = attribute.value;

    if (occurences["count"][trait_type] === undefined)
      occurences["count"][trait_type] = 1;
    else
      occurences["count"][trait_type]++;

    if (occurences["traits"][attribute.trait_type] === undefined) {
      occurences["traits"][trait_type] = [];
      occurences["traits"][trait_type][value] = 1;
    }
    else {
      if (occurences["traits"][attribute.trait_type][value] === undefined)
        occurences["traits"][attribute.trait_type][value] = 1;
      else
        occurences["traits"][attribute.trait_type][value]++;
    }
  });
});

console.log(occurences);

export default occurences;