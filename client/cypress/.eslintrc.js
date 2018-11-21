module.exports = {
  plugins: [
    "cypress"
  ],
  extends: [
    "plugin:cypress/recommended"
  ],
  env: {
    "cypress/globals": true
  },
  rules: {
    "implicit-arrow-linebreak": "off",
    "prefer-arrow-callback": "off",
    "func-names": "off",
    "spaced-comment": "off",
    "indent": "off",
  }
}
