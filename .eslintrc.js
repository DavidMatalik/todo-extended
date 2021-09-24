/* 
  ESLint is a linter. Linting is something that can 
  AUTOMATICALLY find the dumb mistakes we all make, so you can 
  fix them without thinking. It’ll make your code break less 
  and prevent some very confusing problems. 
  From: https://mikecavaliere.com/javascript-linting-what-developers-need-to-know/
*/

module.exports = {
  /* 
    "env" stands for Environments. Our script is designed to run 
    in the Browser and in es2021. Each environment brings with it 
    a certain set of predefined global variables.
    More information: https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments 
  */
  env: {
    browser: true,
    es2021: true
  },
  /* 
    "extends" tells ESLint if rules from another file should be applied.
    Popular files or Styleguides are: Airbnb Style Guide, Google Style Guide
    or JavaScript Standard Style. We use JavaScript Standard Style
    More information: https://eslint.org/docs/user-guide/configuring/configuration-files#extending-configuration-files
  */
  extends: [
    'standard'
  ],
  /* 
    "parserOptions" allows you to specify the JavaScript language 
    options you want to support. 
    More information: https://eslint.org/docs/user-guide/configuring/language-options#specifying-parser-options 
  */
  parserOptions: {
    // Default of "ecmaVersion" is 5.
    ecmaVersion: 12,
    // Default of "sourceType" is "script".
    sourceType: 'module'
  },
}
