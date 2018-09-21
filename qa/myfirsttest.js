let { assert } = require("chai");




describe("Employee Service", function (){
    
    before(function() {
        // runs before all tests in this block
    });

    describe("#indexOf()", function() {
        
        it("should return -1 when the value is not present", function () {
            let array = [1, 2, 3];
            assert( array.indexOf(4) === -1);
        });

        it("should return [] when no employee is present", function() {

        });
    });
});