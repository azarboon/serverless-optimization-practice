var randomize = require('randomatic');


function two(input) {

  return function bbbbb() {
    // coment bbbbbbb

    return function ccc() {
      // coment ccc

      return function ddd() {
        // coment ddd
        return function eee() {
          // coment eee
          return function ffff() {
            // coment fff
            return randomize('A', 5);

          }
        }
      }
    }
  }
}
module.exports.two = two;
