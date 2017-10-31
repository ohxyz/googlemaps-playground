/* Fix Function#name on browsers that do not support it (IE):
 *
 * Source: https://stackoverflow.com/questions/6903762/function-name-not-supported-in-ie
 * 
 * Function.name is considered not standard at the time I'm writing. So it is not a polyfill.
 */
if (!(function f() {}).name) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function() {
            var name = (this.toString().match(/^function\s*([^\s(]+)/) || [])[1];
            // For better performance only parse once, and then cache the
            // result through a new accessor for repeated access.
            Object.defineProperty(this, 'name', { value: name });
            return name;
        }
    });
}