const basePath = process.cwd();
import NETWORK from "../constants/network.js";
import fs from "fs";

import {
  hiddenBaseUri,
  description,
  namePrefix,
  network,
  solanaMetadata,
} from "../src/config.js";

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);

let placeHolderText = "unknown";

if (!fs.existsSync(`${basePath}/build/hidden_json`)){
  fs.mkdirSync(`${basePath}/build/hidden_json`);
}

data.forEach((item) => {
  if (network == NETWORK.sol) {
    item.name = `${namePrefix} #${item.edition}`;
    item.description = placeHolderText;
  } else {
    item.name = `${namePrefix} #${item.edition}`;
    item.description = placeHolderText;
    item.image = `${hiddenBaseUri}/${item.edition}.png`;
  }

  item.attributes.forEach((attribute) => {
      attribute.value = placeHolderText;
  });

  fs.writeFileSync(
    `${basePath}/build/hidden_json/${item.edition}.json`,
    JSON.stringify(item, null, 2)
  );
});

fs.writeFileSync(
  `${basePath}/build/hidden_json/_metadata.json`,
  JSON.stringify(data, null, 2)
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
