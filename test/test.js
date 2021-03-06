var assert = require('chai').assert,
    expect = require('chai').expect,
    JSBloom = require('../bloom.js'),
    filter = new JSBloom.filter(10000, 1E-10),
    generator = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });
    };

global.btoa = function (str) { return new Buffer(str).toString('base64'); };

describe('JSBloom - Bloom Filter', function () {

    var test_entries = [],
        false_entries = [],
        importData = "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";

    describe('Errors', function () {
        it('should throw an error when instantiated without arguments', function () {

            expect(function () {
                new JSBloom.filter();
            }).to.throw(Error);

        });
    });

    describe('Insertion', function () {
        it('should insert 1000 random elements individually without error', function () {
            for (var i = 1000 - 1; i >= 0; i--) {
                var rand_string = generator();

                test_entries.push(rand_string);

                assert.equal(filter.addEntry(rand_string), true);
            };
        });

        it('should insert 1000 random elements in an array without error', function () {

            var arr = [];

            for (var i = 1000 - 1; i >= 0; i--) {

                var rand_string = generator();

                arr.push(rand_string);

            };

            test_entries = test_entries.concat(arr);

            assert.equal(filter.addEntries(arr), true);

        });
    });

    describe('Existence', function () {
        it('should return true for 2000 added elements', function () {
            for (var i = test_entries.length - 1; i >= 0; i--) {
                assert.equal(filter.checkEntry(test_entries[i]), true);
            };
        });
    });

    describe('Duplicate Insertion', function () {
        it('should return true for 2000 added elements', function () {
            for (var i = test_entries.length - 1; i >= 0; i--) {
                assert.equal(filter.addEntry(test_entries[i]), false);
            };
        });
    });

    describe('Non-Existence', function () {
        it('should return false for 1000 non elements', function () {
            var positive = 0;
            for (var i = 1000 - 1; i >= 0; i--) {
                if (filter.checkEntry(generator()))
                    positive++;
            };
            assert.ok(positive <= 10, 'should have had less than 10 positive tests, but had:' + positive);
        });
    });

    describe('Import & Export', function () {
        it('should return true on predefined element in imported array', function () {
            filter = new JSBloom.filter(1071, 0.000001)

            filter.importData(Buffer.from(importData, 'base64'));

            assert.equal(filter.checkEntry("en.wikipedia.org"), true);
        });

        it('should return expected output on export', function () {
            this.timeout(0);

            assert.equal(filter.exportData().toString('base64'), importData);
        });

        it('should return expected output to callback on export', function () {
            this.timeout(0);

            filter.exportData(function (s) {
                assert.equal(s, importData);
            });

        });
    });

});
