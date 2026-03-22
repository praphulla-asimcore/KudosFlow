"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/documents/generate/route";
exports.ids = ["app/api/documents/generate/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdocuments%2Fgenerate%2Froute&page=%2Fapi%2Fdocuments%2Fgenerate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdocuments%2Fgenerate%2Froute.ts&appDir=%2FUsers%2Fasimcore%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2FDevelopment%20Projects%2FKudosFlow_Audit_Platform%2Fkudosflow%2Fnextjs_space%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fasimcore%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2FDevelopment%20Projects%2FKudosFlow_Audit_Platform%2Fkudosflow%2Fnextjs_space&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdocuments%2Fgenerate%2Froute&page=%2Fapi%2Fdocuments%2Fgenerate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdocuments%2Fgenerate%2Froute.ts&appDir=%2FUsers%2Fasimcore%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2FDevelopment%20Projects%2FKudosFlow_Audit_Platform%2Fkudosflow%2Fnextjs_space%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fasimcore%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2FDevelopment%20Projects%2FKudosFlow_Audit_Platform%2Fkudosflow%2Fnextjs_space&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_asimcore_Library_Mobile_Documents_com_apple_CloudDocs_Development_Projects_KudosFlow_Audit_Platform_kudosflow_nextjs_space_app_api_documents_generate_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/documents/generate/route.ts */ \"(rsc)/./app/api/documents/generate/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/documents/generate/route\",\n        pathname: \"/api/documents/generate\",\n        filename: \"route\",\n        bundlePath: \"app/api/documents/generate/route\"\n    },\n    resolvedPagePath: \"/Users/asimcore/Library/Mobile Documents/com~apple~CloudDocs/Development Projects/KudosFlow_Audit_Platform/kudosflow/nextjs_space/app/api/documents/generate/route.ts\",\n    nextConfigOutput,\n    userland: _Users_asimcore_Library_Mobile_Documents_com_apple_CloudDocs_Development_Projects_KudosFlow_Audit_Platform_kudosflow_nextjs_space_app_api_documents_generate_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/documents/generate/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZkb2N1bWVudHMlMkZnZW5lcmF0ZSUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGZG9jdW1lbnRzJTJGZ2VuZXJhdGUlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZkb2N1bWVudHMlMkZnZW5lcmF0ZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmFzaW1jb3JlJTJGTGlicmFyeSUyRk1vYmlsZSUyMERvY3VtZW50cyUyRmNvbX5hcHBsZX5DbG91ZERvY3MlMkZEZXZlbG9wbWVudCUyMFByb2plY3RzJTJGS3Vkb3NGbG93X0F1ZGl0X1BsYXRmb3JtJTJGa3Vkb3NmbG93JTJGbmV4dGpzX3NwYWNlJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmFzaW1jb3JlJTJGTGlicmFyeSUyRk1vYmlsZSUyMERvY3VtZW50cyUyRmNvbX5hcHBsZX5DbG91ZERvY3MlMkZEZXZlbG9wbWVudCUyMFByb2plY3RzJTJGS3Vkb3NGbG93X0F1ZGl0X1BsYXRmb3JtJTJGa3Vkb3NmbG93JTJGbmV4dGpzX3NwYWNlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNxSDtBQUNsTTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL2FwcC8/NGQ4OCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvYXNpbWNvcmUvTGlicmFyeS9Nb2JpbGUgRG9jdW1lbnRzL2NvbX5hcHBsZX5DbG91ZERvY3MvRGV2ZWxvcG1lbnQgUHJvamVjdHMvS3Vkb3NGbG93X0F1ZGl0X1BsYXRmb3JtL2t1ZG9zZmxvdy9uZXh0anNfc3BhY2UvYXBwL2FwaS9kb2N1bWVudHMvZ2VuZXJhdGUvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2RvY3VtZW50cy9nZW5lcmF0ZS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2RvY3VtZW50cy9nZW5lcmF0ZVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvZG9jdW1lbnRzL2dlbmVyYXRlL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2FzaW1jb3JlL0xpYnJhcnkvTW9iaWxlIERvY3VtZW50cy9jb21+YXBwbGV+Q2xvdWREb2NzL0RldmVsb3BtZW50IFByb2plY3RzL0t1ZG9zRmxvd19BdWRpdF9QbGF0Zm9ybS9rdWRvc2Zsb3cvbmV4dGpzX3NwYWNlL2FwcC9hcGkvZG9jdW1lbnRzL2dlbmVyYXRlL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9kb2N1bWVudHMvZ2VuZXJhdGUvcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdocuments%2Fgenerate%2Froute&page=%2Fapi%2Fdocuments%2Fgenerate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdocuments%2Fgenerate%2Froute.ts&appDir=%2FUsers%2Fasimcore%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2FDevelopment%20Projects%2FKudosFlow_Audit_Platform%2Fkudosflow%2Fnextjs_space%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fasimcore%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2FDevelopment%20Projects%2FKudosFlow_Audit_Platform%2Fkudosflow%2Fnextjs_space&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/documents/generate/route.ts":
/*!*********************************************!*\
  !*** ./app/api/documents/generate/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth_options__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth-options */ \"(rsc)/./lib/auth-options.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var _lib_audit_logger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/audit-logger */ \"(rsc)/./lib/audit-logger.ts\");\nconst dynamic = \"force-dynamic\";\n\n\n\n\n\nasync function POST(request) {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth_options__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n        if (!session) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unauthorized\"\n        }, {\n            status: 401\n        });\n        const user = session?.user;\n        const body = await request.json();\n        const ip = request.headers.get(\"x-forwarded-for\") ?? \"unknown\";\n        const { engagementId, documentType } = body;\n        if (!engagementId || !documentType) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"engagementId and documentType required\"\n            }, {\n                status: 400\n            });\n        }\n        const engagement = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.engagement.findUnique({\n            where: {\n                id: engagementId\n            },\n            include: {\n                client: true,\n                partner: true,\n                manager: true\n            }\n        });\n        if (!engagement) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Engagement not found\"\n        }, {\n            status: 404\n        });\n        const dataEntry = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.dataEntry.findUnique({\n            where: {\n                engagementId\n            },\n            include: {\n                debtorsCreditors: true,\n                relatedParties: true\n            }\n        });\n        if (!dataEntry) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Data entry not found. Please complete data entry first.\"\n        }, {\n            status: 404\n        });\n        // Upsert generated document record\n        const existing = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.generatedDocument.findFirst({\n            where: {\n                engagementId,\n                documentType\n            }\n        });\n        let doc;\n        if (existing) {\n            doc = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.generatedDocument.update({\n                where: {\n                    id: existing.id\n                },\n                data: {\n                    generatedById: user.id,\n                    generatedAt: new Date()\n                }\n            });\n        } else {\n            doc = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.generatedDocument.create({\n                data: {\n                    engagementId,\n                    clientId: engagement.clientId,\n                    documentType,\n                    generatedById: user.id\n                }\n            });\n        }\n        // Update engagement docs count\n        const docsCount = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.generatedDocument.count({\n            where: {\n                engagementId\n            }\n        });\n        await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.engagement.update({\n            where: {\n                id: engagementId\n            },\n            data: {\n                docsGeneratedCount: docsCount\n            }\n        });\n        await (0,_lib_audit_logger__WEBPACK_IMPORTED_MODULE_4__.logAuditEvent)({\n            userId: user.id,\n            userName: user.name,\n            action: \"GENERATE\",\n            module: \"Documents\",\n            details: `${documentType} generated for ${engagement.client.companyName} FY${engagement.financialYear}`,\n            ipAddress: ip\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(doc);\n    } catch (e) {\n        console.error(\"Document generate error:\", e);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2RvY3VtZW50cy9nZW5lcmF0ZS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFPLE1BQU1BLFVBQVUsZ0JBQWdCO0FBQ0k7QUFDRTtBQUNJO0FBQ1g7QUFDYTtBQUc1QyxlQUFlTSxLQUFLQyxPQUFnQjtJQUN6QyxJQUFJO1FBQ0YsTUFBTUMsVUFBVSxNQUFNTiwyREFBZ0JBLENBQUNDLDBEQUFXQTtRQUNsRCxJQUFJLENBQUNLLFNBQVMsT0FBT1AscURBQVlBLENBQUNRLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQWUsR0FBRztZQUFFQyxRQUFRO1FBQUk7UUFDaEYsTUFBTUMsT0FBT0osU0FBU0k7UUFDdEIsTUFBTUMsT0FBTyxNQUFNTixRQUFRRSxJQUFJO1FBQy9CLE1BQU1LLEtBQUtQLFFBQVFRLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLHNCQUFzQjtRQUNyRCxNQUFNLEVBQUVDLFlBQVksRUFBRUMsWUFBWSxFQUFFLEdBQUdMO1FBRXZDLElBQUksQ0FBQ0ksZ0JBQWdCLENBQUNDLGNBQWM7WUFDbEMsT0FBT2pCLHFEQUFZQSxDQUFDUSxJQUFJLENBQUM7Z0JBQUVDLE9BQU87WUFBeUMsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQzlGO1FBRUEsTUFBTVEsYUFBYSxNQUFNZiwrQ0FBTUEsQ0FBQ2UsVUFBVSxDQUFDQyxVQUFVLENBQUM7WUFDcERDLE9BQU87Z0JBQUVDLElBQUlMO1lBQWE7WUFDMUJNLFNBQVM7Z0JBQUVDLFFBQVE7Z0JBQU1DLFNBQVM7Z0JBQU1DLFNBQVM7WUFBSztRQUN4RDtRQUNBLElBQUksQ0FBQ1AsWUFBWSxPQUFPbEIscURBQVlBLENBQUNRLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQXVCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO1FBRTNGLE1BQU1nQixZQUFZLE1BQU12QiwrQ0FBTUEsQ0FBQ3VCLFNBQVMsQ0FBQ1AsVUFBVSxDQUFDO1lBQ2xEQyxPQUFPO2dCQUFFSjtZQUFhO1lBQ3RCTSxTQUFTO2dCQUFFSyxrQkFBa0I7Z0JBQU1DLGdCQUFnQjtZQUFLO1FBQzFEO1FBQ0EsSUFBSSxDQUFDRixXQUFXLE9BQU8xQixxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBMEQsR0FBRztZQUFFQyxRQUFRO1FBQUk7UUFFN0gsbUNBQW1DO1FBQ25DLE1BQU1tQixXQUFXLE1BQU0xQiwrQ0FBTUEsQ0FBQzJCLGlCQUFpQixDQUFDQyxTQUFTLENBQUM7WUFDeERYLE9BQU87Z0JBQUVKO2dCQUFjQztZQUFhO1FBQ3RDO1FBRUEsSUFBSWU7UUFDSixJQUFJSCxVQUFVO1lBQ1pHLE1BQU0sTUFBTTdCLCtDQUFNQSxDQUFDMkIsaUJBQWlCLENBQUNHLE1BQU0sQ0FBQztnQkFDMUNiLE9BQU87b0JBQUVDLElBQUlRLFNBQVNSLEVBQUU7Z0JBQUM7Z0JBQ3pCYSxNQUFNO29CQUFFQyxlQUFleEIsS0FBS1UsRUFBRTtvQkFBRWUsYUFBYSxJQUFJQztnQkFBTztZQUMxRDtRQUNGLE9BQU87WUFDTEwsTUFBTSxNQUFNN0IsK0NBQU1BLENBQUMyQixpQkFBaUIsQ0FBQ1EsTUFBTSxDQUFDO2dCQUMxQ0osTUFBTTtvQkFDSmxCO29CQUNBdUIsVUFBVXJCLFdBQVdxQixRQUFRO29CQUM3QnRCO29CQUNBa0IsZUFBZXhCLEtBQUtVLEVBQUU7Z0JBQ3hCO1lBQ0Y7UUFDRjtRQUVBLCtCQUErQjtRQUMvQixNQUFNbUIsWUFBWSxNQUFNckMsK0NBQU1BLENBQUMyQixpQkFBaUIsQ0FBQ1csS0FBSyxDQUFDO1lBQUVyQixPQUFPO2dCQUFFSjtZQUFhO1FBQUU7UUFDakYsTUFBTWIsK0NBQU1BLENBQUNlLFVBQVUsQ0FBQ2UsTUFBTSxDQUFDO1lBQzdCYixPQUFPO2dCQUFFQyxJQUFJTDtZQUFhO1lBQzFCa0IsTUFBTTtnQkFBRVEsb0JBQW9CRjtZQUFVO1FBQ3hDO1FBRUEsTUFBTXBDLGdFQUFhQSxDQUFDO1lBQ2xCdUMsUUFBUWhDLEtBQUtVLEVBQUU7WUFBRXVCLFVBQVVqQyxLQUFLa0MsSUFBSTtZQUNwQ0MsUUFBUTtZQUFZQyxRQUFRO1lBQzVCQyxTQUFTLENBQUMsRUFBRS9CLGFBQWEsZUFBZSxFQUFFQyxXQUFXSyxNQUFNLENBQUMwQixXQUFXLENBQUMsR0FBRyxFQUFFL0IsV0FBV2dDLGFBQWEsQ0FBQyxDQUFDO1lBQ3ZHQyxXQUFXdEM7UUFDYjtRQUVBLE9BQU9iLHFEQUFZQSxDQUFDUSxJQUFJLENBQUN3QjtJQUMzQixFQUFFLE9BQU9vQixHQUFRO1FBQ2ZDLFFBQVE1QyxLQUFLLENBQUMsNEJBQTRCMkM7UUFDMUMsT0FBT3BELHFEQUFZQSxDQUFDUSxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFTLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQzlEO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcHAvLi9hcHAvYXBpL2RvY3VtZW50cy9nZW5lcmF0ZS9yb3V0ZS50cz9lNTM5Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBkeW5hbWljID0gJ2ZvcmNlLWR5bmFtaWMnO1xuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gJ25leHQtYXV0aCc7XG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gJ0AvbGliL2F1dGgtb3B0aW9ucyc7XG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL2xpYi9wcmlzbWEnO1xuaW1wb3J0IHsgbG9nQXVkaXRFdmVudCB9IGZyb20gJ0AvbGliL2F1ZGl0LWxvZ2dlcic7XG5pbXBvcnQgdHlwZSB7IERhdGFFbnRyeURhdGEgfSBmcm9tICdAL2xpYi9kb2N1bWVudC10eXBlcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG4gICAgaWYgKCFzZXNzaW9uKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1VuYXV0aG9yaXplZCcgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICBjb25zdCB1c2VyID0gc2Vzc2lvbj8udXNlciBhcyBhbnk7XG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuICAgIGNvbnN0IGlwID0gcmVxdWVzdC5oZWFkZXJzLmdldCgneC1mb3J3YXJkZWQtZm9yJykgPz8gJ3Vua25vd24nO1xuICAgIGNvbnN0IHsgZW5nYWdlbWVudElkLCBkb2N1bWVudFR5cGUgfSA9IGJvZHk7XG5cbiAgICBpZiAoIWVuZ2FnZW1lbnRJZCB8fCAhZG9jdW1lbnRUeXBlKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ2VuZ2FnZW1lbnRJZCBhbmQgZG9jdW1lbnRUeXBlIHJlcXVpcmVkJyB9LCB7IHN0YXR1czogNDAwIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVuZ2FnZW1lbnQgPSBhd2FpdCBwcmlzbWEuZW5nYWdlbWVudC5maW5kVW5pcXVlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBlbmdhZ2VtZW50SWQgfSxcbiAgICAgIGluY2x1ZGU6IHsgY2xpZW50OiB0cnVlLCBwYXJ0bmVyOiB0cnVlLCBtYW5hZ2VyOiB0cnVlIH0sXG4gICAgfSk7XG4gICAgaWYgKCFlbmdhZ2VtZW50KSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0VuZ2FnZW1lbnQgbm90IGZvdW5kJyB9LCB7IHN0YXR1czogNDA0IH0pO1xuXG4gICAgY29uc3QgZGF0YUVudHJ5ID0gYXdhaXQgcHJpc21hLmRhdGFFbnRyeS5maW5kVW5pcXVlKHtcbiAgICAgIHdoZXJlOiB7IGVuZ2FnZW1lbnRJZCB9LFxuICAgICAgaW5jbHVkZTogeyBkZWJ0b3JzQ3JlZGl0b3JzOiB0cnVlLCByZWxhdGVkUGFydGllczogdHJ1ZSB9LFxuICAgIH0pO1xuICAgIGlmICghZGF0YUVudHJ5KSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0RhdGEgZW50cnkgbm90IGZvdW5kLiBQbGVhc2UgY29tcGxldGUgZGF0YSBlbnRyeSBmaXJzdC4nIH0sIHsgc3RhdHVzOiA0MDQgfSk7XG5cbiAgICAvLyBVcHNlcnQgZ2VuZXJhdGVkIGRvY3VtZW50IHJlY29yZFxuICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgcHJpc21hLmdlbmVyYXRlZERvY3VtZW50LmZpbmRGaXJzdCh7XG4gICAgICB3aGVyZTogeyBlbmdhZ2VtZW50SWQsIGRvY3VtZW50VHlwZSB9LFxuICAgIH0pO1xuXG4gICAgbGV0IGRvYztcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIGRvYyA9IGF3YWl0IHByaXNtYS5nZW5lcmF0ZWREb2N1bWVudC51cGRhdGUoe1xuICAgICAgICB3aGVyZTogeyBpZDogZXhpc3RpbmcuaWQgfSxcbiAgICAgICAgZGF0YTogeyBnZW5lcmF0ZWRCeUlkOiB1c2VyLmlkLCBnZW5lcmF0ZWRBdDogbmV3IERhdGUoKSB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvYyA9IGF3YWl0IHByaXNtYS5nZW5lcmF0ZWREb2N1bWVudC5jcmVhdGUoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZW5nYWdlbWVudElkLFxuICAgICAgICAgIGNsaWVudElkOiBlbmdhZ2VtZW50LmNsaWVudElkLFxuICAgICAgICAgIGRvY3VtZW50VHlwZSxcbiAgICAgICAgICBnZW5lcmF0ZWRCeUlkOiB1c2VyLmlkLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGVuZ2FnZW1lbnQgZG9jcyBjb3VudFxuICAgIGNvbnN0IGRvY3NDb3VudCA9IGF3YWl0IHByaXNtYS5nZW5lcmF0ZWREb2N1bWVudC5jb3VudCh7IHdoZXJlOiB7IGVuZ2FnZW1lbnRJZCB9IH0pO1xuICAgIGF3YWl0IHByaXNtYS5lbmdhZ2VtZW50LnVwZGF0ZSh7XG4gICAgICB3aGVyZTogeyBpZDogZW5nYWdlbWVudElkIH0sXG4gICAgICBkYXRhOiB7IGRvY3NHZW5lcmF0ZWRDb3VudDogZG9jc0NvdW50IH0sXG4gICAgfSk7XG5cbiAgICBhd2FpdCBsb2dBdWRpdEV2ZW50KHtcbiAgICAgIHVzZXJJZDogdXNlci5pZCwgdXNlck5hbWU6IHVzZXIubmFtZSxcbiAgICAgIGFjdGlvbjogJ0dFTkVSQVRFJywgbW9kdWxlOiAnRG9jdW1lbnRzJyxcbiAgICAgIGRldGFpbHM6IGAke2RvY3VtZW50VHlwZX0gZ2VuZXJhdGVkIGZvciAke2VuZ2FnZW1lbnQuY2xpZW50LmNvbXBhbnlOYW1lfSBGWSR7ZW5nYWdlbWVudC5maW5hbmNpYWxZZWFyfWAsXG4gICAgICBpcEFkZHJlc3M6IGlwLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGRvYyk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0RvY3VtZW50IGdlbmVyYXRlIGVycm9yOicsIGUpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnRmFpbGVkJyB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiZHluYW1pYyIsIk5leHRSZXNwb25zZSIsImdldFNlcnZlclNlc3Npb24iLCJhdXRoT3B0aW9ucyIsInByaXNtYSIsImxvZ0F1ZGl0RXZlbnQiLCJQT1NUIiwicmVxdWVzdCIsInNlc3Npb24iLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJ1c2VyIiwiYm9keSIsImlwIiwiaGVhZGVycyIsImdldCIsImVuZ2FnZW1lbnRJZCIsImRvY3VtZW50VHlwZSIsImVuZ2FnZW1lbnQiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJpZCIsImluY2x1ZGUiLCJjbGllbnQiLCJwYXJ0bmVyIiwibWFuYWdlciIsImRhdGFFbnRyeSIsImRlYnRvcnNDcmVkaXRvcnMiLCJyZWxhdGVkUGFydGllcyIsImV4aXN0aW5nIiwiZ2VuZXJhdGVkRG9jdW1lbnQiLCJmaW5kRmlyc3QiLCJkb2MiLCJ1cGRhdGUiLCJkYXRhIiwiZ2VuZXJhdGVkQnlJZCIsImdlbmVyYXRlZEF0IiwiRGF0ZSIsImNyZWF0ZSIsImNsaWVudElkIiwiZG9jc0NvdW50IiwiY291bnQiLCJkb2NzR2VuZXJhdGVkQ291bnQiLCJ1c2VySWQiLCJ1c2VyTmFtZSIsIm5hbWUiLCJhY3Rpb24iLCJtb2R1bGUiLCJkZXRhaWxzIiwiY29tcGFueU5hbWUiLCJmaW5hbmNpYWxZZWFyIiwiaXBBZGRyZXNzIiwiZSIsImNvbnNvbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/documents/generate/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/audit-logger.ts":
/*!*****************************!*\
  !*** ./lib/audit-logger.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   logAuditEvent: () => (/* binding */ logAuditEvent)\n/* harmony export */ });\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\nasync function logAuditEvent(input) {\n    try {\n        await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.auditTrail.create({\n            data: {\n                userId: input.userId ?? null,\n                userName: input.userName ?? \"System\",\n                action: input.action,\n                module: input.module ?? null,\n                details: input.details ?? null,\n                ipAddress: input.ipAddress ?? null\n            }\n        });\n    } catch (e) {\n        console.error(\"Audit log error:\", e);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXVkaXQtbG9nZ2VyLnRzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQXNDO0FBVy9CLGVBQWVDLGNBQWNDLEtBQW9CO0lBQ3RELElBQUk7UUFDRixNQUFNRiwrQ0FBTUEsQ0FBQ0csVUFBVSxDQUFDQyxNQUFNLENBQUM7WUFDN0JDLE1BQU07Z0JBQ0pDLFFBQVFKLE1BQU1JLE1BQU0sSUFBSTtnQkFDeEJDLFVBQVVMLE1BQU1LLFFBQVEsSUFBSTtnQkFDNUJDLFFBQVFOLE1BQU1NLE1BQU07Z0JBQ3BCQyxRQUFRUCxNQUFNTyxNQUFNLElBQUk7Z0JBQ3hCQyxTQUFTUixNQUFNUSxPQUFPLElBQUk7Z0JBQzFCQyxXQUFXVCxNQUFNUyxTQUFTLElBQUk7WUFDaEM7UUFDRjtJQUNGLEVBQUUsT0FBT0MsR0FBRztRQUNWQyxRQUFRQyxLQUFLLENBQUMsb0JBQW9CRjtJQUNwQztBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXBwLy4vbGliL2F1ZGl0LWxvZ2dlci50cz81MzBlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByaXNtYSB9IGZyb20gJ0AvbGliL3ByaXNtYSc7XG5cbmludGVyZmFjZSBBdWRpdExvZ0lucHV0IHtcbiAgdXNlcklkPzogc3RyaW5nIHwgbnVsbDtcbiAgdXNlck5hbWU/OiBzdHJpbmcgfCBudWxsO1xuICBhY3Rpb246IHN0cmluZztcbiAgbW9kdWxlPzogc3RyaW5nO1xuICBkZXRhaWxzPzogc3RyaW5nO1xuICBpcEFkZHJlc3M/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dBdWRpdEV2ZW50KGlucHV0OiBBdWRpdExvZ0lucHV0KSB7XG4gIHRyeSB7XG4gICAgYXdhaXQgcHJpc21hLmF1ZGl0VHJhaWwuY3JlYXRlKHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdXNlcklkOiBpbnB1dC51c2VySWQgPz8gbnVsbCxcbiAgICAgICAgdXNlck5hbWU6IGlucHV0LnVzZXJOYW1lID8/ICdTeXN0ZW0nLFxuICAgICAgICBhY3Rpb246IGlucHV0LmFjdGlvbixcbiAgICAgICAgbW9kdWxlOiBpbnB1dC5tb2R1bGUgPz8gbnVsbCxcbiAgICAgICAgZGV0YWlsczogaW5wdXQuZGV0YWlscyA/PyBudWxsLFxuICAgICAgICBpcEFkZHJlc3M6IGlucHV0LmlwQWRkcmVzcyA/PyBudWxsLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0F1ZGl0IGxvZyBlcnJvcjonLCBlKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbInByaXNtYSIsImxvZ0F1ZGl0RXZlbnQiLCJpbnB1dCIsImF1ZGl0VHJhaWwiLCJjcmVhdGUiLCJkYXRhIiwidXNlcklkIiwidXNlck5hbWUiLCJhY3Rpb24iLCJtb2R1bGUiLCJkZXRhaWxzIiwiaXBBZGRyZXNzIiwiZSIsImNvbnNvbGUiLCJlcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/audit-logger.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth-options.ts":
/*!*****************************!*\
  !*** ./lib/auth-options.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\n\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) return null;\n                try {\n                    const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n                        where: {\n                            email: credentials.email\n                        }\n                    });\n                    if (!user || user?.status !== \"active\") return null;\n                    const isValid = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(credentials.password, user.password);\n                    if (!isValid) return null;\n                    await _lib_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.update({\n                        where: {\n                            id: user.id\n                        },\n                        data: {\n                            lastLogin: new Date()\n                        }\n                    });\n                    return {\n                        id: user.id,\n                        email: user.email,\n                        name: user.name,\n                        role: user.role\n                    };\n                } catch  {\n                    return null;\n                }\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n                token.role = user.role;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (session?.user) {\n                session.user.id = token.id;\n                session.user.role = token.role;\n            }\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/login\"\n    },\n    session: {\n        strategy: \"jwt\",\n        maxAge: 30 * 60\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC1vcHRpb25zLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ2tFO0FBQ3BDO0FBQ1E7QUFFL0IsTUFBTUcsY0FBK0I7SUFDMUNDLFdBQVc7UUFDVEosMkVBQW1CQSxDQUFDO1lBQ2xCSyxNQUFNO1lBQ05DLGFBQWE7Z0JBQ1hDLE9BQU87b0JBQUVDLE9BQU87b0JBQVNDLE1BQU07Z0JBQVE7Z0JBQ3ZDQyxVQUFVO29CQUFFRixPQUFPO29CQUFZQyxNQUFNO2dCQUFXO1lBQ2xEO1lBQ0EsTUFBTUUsV0FBVUwsV0FBVztnQkFDekIsSUFBSSxDQUFDQSxhQUFhQyxTQUFTLENBQUNELGFBQWFJLFVBQVUsT0FBTztnQkFDMUQsSUFBSTtvQkFDRixNQUFNRSxPQUFPLE1BQU1WLCtDQUFNQSxDQUFDVSxJQUFJLENBQUNDLFVBQVUsQ0FBQzt3QkFDeENDLE9BQU87NEJBQUVQLE9BQU9ELFlBQVlDLEtBQUs7d0JBQUM7b0JBQ3BDO29CQUNBLElBQUksQ0FBQ0ssUUFBUUEsTUFBTUcsV0FBVyxVQUFVLE9BQU87b0JBQy9DLE1BQU1DLFVBQVUsTUFBTWYsdURBQWMsQ0FBQ0ssWUFBWUksUUFBUSxFQUFFRSxLQUFLRixRQUFRO29CQUN4RSxJQUFJLENBQUNNLFNBQVMsT0FBTztvQkFDckIsTUFBTWQsK0NBQU1BLENBQUNVLElBQUksQ0FBQ00sTUFBTSxDQUFDO3dCQUN2QkosT0FBTzs0QkFBRUssSUFBSVAsS0FBS08sRUFBRTt3QkFBQzt3QkFDckJDLE1BQU07NEJBQUVDLFdBQVcsSUFBSUM7d0JBQU87b0JBQ2hDO29CQUNBLE9BQU87d0JBQ0xILElBQUlQLEtBQUtPLEVBQUU7d0JBQ1haLE9BQU9LLEtBQUtMLEtBQUs7d0JBQ2pCRixNQUFNTyxLQUFLUCxJQUFJO3dCQUNma0IsTUFBTVgsS0FBS1csSUFBSTtvQkFDakI7Z0JBQ0YsRUFBRSxPQUFNO29CQUNOLE9BQU87Z0JBQ1Q7WUFDRjtRQUNGO0tBQ0Q7SUFDREMsV0FBVztRQUNULE1BQU1DLEtBQUksRUFBRUMsS0FBSyxFQUFFZCxJQUFJLEVBQU87WUFDNUIsSUFBSUEsTUFBTTtnQkFDUmMsTUFBTVAsRUFBRSxHQUFHUCxLQUFLTyxFQUFFO2dCQUNsQk8sTUFBTUgsSUFBSSxHQUFHWCxLQUFLVyxJQUFJO1lBQ3hCO1lBQ0EsT0FBT0c7UUFDVDtRQUNBLE1BQU1DLFNBQVEsRUFBRUEsT0FBTyxFQUFFRCxLQUFLLEVBQU87WUFDbkMsSUFBSUMsU0FBU2YsTUFBTTtnQkFDaEJlLFFBQVFmLElBQUksQ0FBU08sRUFBRSxHQUFHTyxNQUFNUCxFQUFFO2dCQUNsQ1EsUUFBUWYsSUFBSSxDQUFTVyxJQUFJLEdBQUdHLE1BQU1ILElBQUk7WUFDekM7WUFDQSxPQUFPSTtRQUNUO0lBQ0Y7SUFDQUMsT0FBTztRQUNMQyxRQUFRO0lBQ1Y7SUFDQUYsU0FBUztRQUNQRyxVQUFVO1FBQ1ZDLFFBQVEsS0FBSztJQUNmO0lBQ0FDLFFBQVFDLFFBQVFDLEdBQUcsQ0FBQ0MsZUFBZTtBQUNyQyxFQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXBwLy4vbGliL2F1dGgtb3B0aW9ucy50cz9hYTcxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRBdXRoT3B0aW9ucyB9IGZyb20gJ25leHQtYXV0aCc7XG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tICduZXh0LWF1dGgvcHJvdmlkZXJzL2NyZWRlbnRpYWxzJztcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJztcblxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zOiBOZXh0QXV0aE9wdGlvbnMgPSB7XG4gIHByb3ZpZGVyczogW1xuICAgIENyZWRlbnRpYWxzUHJvdmlkZXIoe1xuICAgICAgbmFtZTogJ2NyZWRlbnRpYWxzJyxcbiAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgIGVtYWlsOiB7IGxhYmVsOiAnRW1haWwnLCB0eXBlOiAnZW1haWwnIH0sXG4gICAgICAgIHBhc3N3b3JkOiB7IGxhYmVsOiAnUGFzc3dvcmQnLCB0eXBlOiAncGFzc3dvcmQnIH0sXG4gICAgICB9LFxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHJldHVybiBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcbiAgICAgICAgICAgIHdoZXJlOiB7IGVtYWlsOiBjcmVkZW50aWFscy5lbWFpbCB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICghdXNlciB8fCB1c2VyPy5zdGF0dXMgIT09ICdhY3RpdmUnKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoY3JlZGVudGlhbHMucGFzc3dvcmQsIHVzZXIucGFzc3dvcmQpO1xuICAgICAgICAgIGlmICghaXNWYWxpZCkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgYXdhaXQgcHJpc21hLnVzZXIudXBkYXRlKHtcbiAgICAgICAgICAgIHdoZXJlOiB7IGlkOiB1c2VyLmlkIH0sXG4gICAgICAgICAgICBkYXRhOiB7IGxhc3RMb2dpbjogbmV3IERhdGUoKSB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICAgICAgcm9sZTogdXNlci5yb2xlLFxuICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBjYWxsYmFja3M6IHtcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9OiBhbnkpIHtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHRva2VuLmlkID0gdXNlci5pZDtcbiAgICAgICAgdG9rZW4ucm9sZSA9IHVzZXIucm9sZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9OiBhbnkpIHtcbiAgICAgIGlmIChzZXNzaW9uPy51c2VyKSB7XG4gICAgICAgIChzZXNzaW9uLnVzZXIgYXMgYW55KS5pZCA9IHRva2VuLmlkO1xuICAgICAgICAoc2Vzc2lvbi51c2VyIGFzIGFueSkucm9sZSA9IHRva2VuLnJvbGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICB9LFxuICB9LFxuICBwYWdlczoge1xuICAgIHNpZ25JbjogJy9sb2dpbicsXG4gIH0sXG4gIHNlc3Npb246IHtcbiAgICBzdHJhdGVneTogJ2p3dCcsXG4gICAgbWF4QWdlOiAzMCAqIDYwLCAvLyAzMCBtaW51dGVzXG4gIH0sXG4gIHNlY3JldDogcHJvY2Vzcy5lbnYuTkVYVEFVVEhfU0VDUkVULFxufTtcbiJdLCJuYW1lcyI6WyJDcmVkZW50aWFsc1Byb3ZpZGVyIiwiYmNyeXB0IiwicHJpc21hIiwiYXV0aE9wdGlvbnMiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsInN0YXR1cyIsImlzVmFsaWQiLCJjb21wYXJlIiwidXBkYXRlIiwiaWQiLCJkYXRhIiwibGFzdExvZ2luIiwiRGF0ZSIsInJvbGUiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiIsInNlc3Npb24iLCJwYWdlcyIsInNpZ25JbiIsInN0cmF0ZWd5IiwibWF4QWdlIiwic2VjcmV0IiwicHJvY2VzcyIsImVudiIsIk5FWFRBVVRIX1NFQ1JFVCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth-options.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5QyxNQUFNQyxrQkFBa0JDO0FBRWpCLE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILHdEQUFZQSxHQUFHO0FBRW5FLElBQUlJLElBQXlCLEVBQWNILGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL2FwcC8uL2xpYi9wcmlzbWEudHM/OTgyMiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCc7XG5cbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7IHByaXNtYTogUHJpc21hQ2xpZW50IH07XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hIHx8IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWE7XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsVGhpcyIsInByaXNtYSIsInByb2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdocuments%2Fgenerate%2Froute&page=%2Fapi%2Fdocuments%2Fgenerate%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdocuments%2Fgenerate%2Froute.ts&appDir=%2FUsers%2Fasimcore%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2FDevelopment%20Projects%2FKudosFlow_Audit_Platform%2Fkudosflow%2Fnextjs_space%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fasimcore%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2FDevelopment%20Projects%2FKudosFlow_Audit_Platform%2Fkudosflow%2Fnextjs_space&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();