const basePath = process.cwd();
import NETWORK from "../constants/network.js";
import fs from "fs";

import {
    baseUri,
    description,
    namePrefix,
    network,
    solanaMetadata,
    simpleDnaBlockSize
} from "../src/config.js";

import occurences from "./rarity.js";

let traits = occurences['traits'];
let layerAmount = Object.keys(traits).length;

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);

function simplifyDNA(attributes) {
    let newDna = "";

    for (let i = 0; i < layerAmount; i++) {
        let layerName = Object.keys(traits)[i];
        for (let j = 0; j < attributes.length; j++) {
            if (attributes[j]["trait_type"] === layerName) {
                let traitName = attributes[j]["value"];
                let traitIndex = Object.keys(traits[layerName]).indexOf(traitName)
                newDna += ('0'.repeat(simpleDnaBlockSize) + traitIndex).slice(-simpleDnaBlockSize);
            }
        }
    }

    if (newDna.length !== layerAmount * simpleDnaBlockSize)
        throw new Error("DNA length doesn't fit layer amount.");

    return newDna;
}

data.forEach((item) => {
    item.dna = simplifyDNA(item["attributes"]);

    fs.writeFileSync(
        `${basePath}/build/json/${item.edition}.json`,
        JSON.stringify(item, null, 2)
    );
});

fs.writeFileSync(
    `${basePath}/build/json/_metadata.json`,
    JSON.stringify(data, null, 2)
);

let dnaOrder = {"layers": {}, "traits": {}};
for (let i = 0; i < layerAmount; i++) {
    let layerName = Object.keys(traits)[i];
    dnaOrder["layers"][layerName] = i;
    dnaOrder["traits"][layerName] = {};
    for (let j = 0; j < Object.keys(traits[layerName]).length; j++) {
        dnaOrder["traits"][layerName][Object.keys(traits[layerName])[j]] = ('0'.repeat(simpleDnaBlockSize) + j).slice(-simpleDnaBlockSize);
    }
}

fs.writeFileSync(
    `${basePath}/build/dnaOrder.json`,
    JSON.stringify(dnaOrder), null, 2
);

console.log("Successfully simplified DNA!")
