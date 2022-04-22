const basePath = process.cwd().replaceAll('\\', '/');
const inputDir = `${basePath}/build/images`;
const tmpOutputDir = `${basePath}/build/compressed-images/`;

import compress_images from 'compress-images';
import fs from 'fs';
import fastFolderSize from 'fast-folder-size';

let initalSize = 0;
fastFolderSize(inputDir, (err, bytes) => {
    if (err) {
        throw err
    }

    initalSize = bytes / 1000000;
    console.log(`Initial size: ${initalSize}MB`)
})

await compress_images(
    `${inputDir}/*.{jpg,JPG,jpeg,JPEG,png}`, // Input
    tmpOutputDir, // Output
    {compress_force: true, statistic: false, autoupdate: true, pathLog: './log/lib/compress-images'}, false,
    {jpg: {engine: 'jpegRecompress', command: ['--quality', 'high', '--min', '100']}},
    {png: {engine: 'pngout', command: ['--quality=100', '-o']}},
    {svg: {engine: 'svgo', command: '--multipass'}},
    {gif: {engine: 'gifsicle', command: ['--colors', '100', '--use-col=web']}}, function (err, completed) {
        if (err !== null) {
            //---------------------------------------
            //if you get an ERROR from 'jpegRecompress' ---> We can use alternate config of compression
            //---------------------------------------
            if (err.engine === 'jpegRecompress') {
                compress_images(err.input, err.output, {
                        compress_force: false,
                        statistic: true,
                        autoupdate: true
                    }, false,
                    {jpg: {engine: 'mozjpeg', command: ['-quality', '100']}},
                    {png: {engine: false, command: false}},
                    {svg: {engine: false, command: false}},
                    {gif: {engine: false, command: false}}, function (err) {
                        if (err !== null) {
                            //Alternative config of compression
                        }
                    });
            }
            //---------------------------------------

        }

        if (!completed)
            return;

        fs.rmSync(inputDir, {recursive: true, force: true}); // Remove input data folder
        fs.mkdirSync(inputDir); // Create empty input data folder

        // Move the files from the compressed-images folder into the input data folder
        fs.readdir(tmpOutputDir, (err, files) => {
            files.forEach(file => {
                fs.rename(`${tmpOutputDir}/${file}`, `${inputDir}/${file}`, (err) => {
                    if (err) throw err;
                });
            });
        });

        fastFolderSize(inputDir, (err, bytes) => {
            if (err) {
                throw err
            }
            let finalSize = bytes / 1000000;
            console.log(`Final size: ${finalSize}MB => ~${Math.round(100 - (finalSize / initalSize) * 100)}% saved`)
        })
    });