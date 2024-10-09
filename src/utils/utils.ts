// export const toDTO = (DtoDef) => (schema) => {
//     let transform;
//
//     // preserve the previously defined transform, if any
//     if (schema.options.toJSON && schema.options.toJSON.transform) {
//         transform = schema.options.toJSON.transform;
//     }
//
//     const assembleDTO = (doc) =>
//         Object.entries(DtoDef).reduce((acc, [currKey, currVal]) => {
//             if (!currVal) {
//                 // property should not be included in the assembled DTO (explicitly declared falsy value for this property)
//                 return acc;
//             }
//
//             const source = currVal.hasOwnProperty("fromProp")
//                 ? doc[currVal.fromProp]
//                 : doc[currKey];
//
//             const result = currVal.hasOwnProperty("transform")
//                 ? currVal.transform(source, doc)
//                 : source;
//
//             acc[currKey] = result;
//             return acc;
//         }, {});
//
//     schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
//         transform(doc, ret, options) {
//             const dto = assembleDTO(doc);
//
//             // apply the previously defined transform, if any
//             if (transform) {
//                 return transform(doc, dto, options);
//             }
//             return dto;
//         },
//     });
//
//     // can opt to skip this aliasing if you would prefer to call the plugin using the more typical `doc.toJSON()`.
//     schema.method("toDTO", function () {
//         return this.toJSON(); // this = doc
//     });
// };