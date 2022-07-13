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
} else {
  item.name = `Unrevealed ${namePrefix}`;
  item.description = description;
  item.image = `${hiddenImageUri}`;
}

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
  console.log(`Updated baseUri for images to ===> ${placeHolderText}`);
  console.log(`Updated description for images to ===> ${placeHolderText}`);
  console.log(`Updated name prefix for images to ===> ${placeHolderText}`);
}
