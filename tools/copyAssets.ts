import * as shell from "shelljs";

// Copy all the view templates
shell.cp( "-R", ["src/views"], "dist/" );
shell.cp( "-R", ["src/public/css"], "dist/public/" );


// // unused lib
// npm install copyfiles --save-dev
// npm script
// "scripts": {
//     "html": "copyfiles -u 1 app/**/*.html app/**/*.css dist/"
//   }