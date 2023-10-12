"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCSV = void 0;
const json2csv_1 = require("json2csv");
/**
 * Generate a CSV from a JSON array/object or readable input stream.
 * fields, transformFunction, flattenObjects, flattenArrays, and pathsToUnwind belong to json2csv.options but
 * they are also provided as parameters here for convenience.
 * For examples using each of these params, see the CSVUtils.test.ts file.
 * @param data JSON array/object or stream to convert to a CSV string
 * @param fields columns to include in the csv
 * @param transformFunction function to transform fields of the object before converting to csv
 * @param flattenObjects indicates whether each property of object fields should be split into a different column
 * @param flattenArrays indicates whether each element of array fields should be split into a different column
 * @param pathsToUnwind array fields that should be split into different rows
 * @param opts options from json2csv to override or add additional options (https://mircozeiss.com/json2csv/#available-options)
 * @param transformOpts transform options from stream module (https://nodejs.org/api/stream.html#stream_new_stream_transform_options)
 * @returns CSV string
 * @throws Error if JSON is not parsed properly
 */
/* eslint-disable-next-line import/prefer-default-export */
const generateCSV = async ({ data, fields, transformFunction, flattenObjects = false, flattenArrays = false, pathsToUnwind, opts, transformOpts, }) => {
    const transformations = [
        json2csv_1.transforms.flatten({
            objects: flattenObjects,
            arrays: flattenArrays,
        }),
    ];
    if (transformFunction) {
        transformations.push(transformFunction);
    }
    if (pathsToUnwind) {
        transformations.push(json2csv_1.transforms.unwind({ paths: pathsToUnwind }));
    }
    const options = {
        fields,
        transforms: transformations,
        ...opts,
    };
    return json2csv_1.parseAsync(data, options, transformOpts);
};
exports.generateCSV = generateCSV;
