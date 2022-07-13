const basePath = process.cwd();
import NETWORK from "../constants/network.js";
import fs from "fs";

import {
  hiddenImageUri,
  description,
  namePrefix,
  network,
  solanaMetadata,
} from "../src/config.js";

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);

let placeHolderText = "unknown";

let item = data[0];
if (network == NETWORK.sol) {
  item.name = `Unrevealed ${namePrefix}`;
  item.description = description;
  item.dna = placeHolderText;
  item.edition = 0;
} else {
  item.name = `Unrevealed ${namePrefix}`;
  item.description = description;
  item.image = `${hiddenImageUri}`;
  item.dna = placeHolderText;
  item.edition = 0;
}

item.attributes = {};

fs.writeFileSync(
    `${basePath}/build/hidden.json`,
    JSON.stringify(item, null, 2)
);

if (network == NETWORK.sol) {
  console.log(`Updated description for images to ===> ${placeHolderText}`);
  console.log(`Updated name prefix for images to ===> ${placeHolderText}`);
  console.log(
      `Updated creators for images to ===> ${JSON.stringify(
          solanaMetadata.creators
      )}`
  );
} else {
  console.log(`Updated description to ===> ${description}`);
  console.log(`Updated name prefix to ===> Unrevealed ${namePrefix}`);
  console.log(`Updated edition to ===> 0`);
  console.log(`Updated baseUri for images to ===> ${placeHolderText}`);
  console.log(`Updated dna to ===> ${placeHolderText}`);
}
