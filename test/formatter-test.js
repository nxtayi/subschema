var formatter = require('../src/formatter');

var expect = require('expect');
describe('should create a formatter from a a pattern', function () {

    this.timeout(20000);
    describe('1 (###) ###-####', function(){
        it('should format even with a number', function(){
            var pattern = formatter('1 (###) ###-####'), result;
            result = pattern('2345678901')
            expect(result.value).toBe('1 (234) 567-8901')
        });
        it('should format even with a number and matches', function(){
            var pattern = formatter('1 (###) ###-####'), result;
            result = pattern('12345678901')
            expect(result.value).toBe('1 (234) 567-8901')
        });
    });

    describe('###-##-#### ', function () {
        var pattern = formatter('###-##-####'), result;
        it('should format  an invalid delimiter', function () {
            result = pattern('123 445678');
            expect(result.isValid).toBe(true);
            expect(result.value).toBe('123-44-5678');

            result = pattern('123456789');
            expect(result.isValid).toBe(true);
            expect(result.value).toBe('123-45-6789');

        });
        it('should format incomplete 3rd group', function () {
            result = pattern('12345');
            expect(result.value).toBe('123-45-');
            expect(result.isValid).toBe(false);

        });
        it('should format incomplete 2nd group', function () {
            result = pattern('123');
            expect(result.value).toBe('123-');
            expect(result.isValid).toBe(false);

        });

        it('should format incomplete 3rd group with backspace', function () {
            result = pattern('12345', true);
            expect(result.value).toBe('123-45');
            expect(result.isValid).toBe(false);

        });
        it('should format incomplete 2nd group with backspace', function () {
            result = pattern('123', true);
            expect(result.value).toBe('123');
            expect(result.isValid).toBe(false);

        });
        it('should format incomplete 1st group with backspace', function () {
            result = pattern('12', true);
            expect(result.value).toBe('12');
            expect(result.isValid).toBe(false);

        });

        it('should format incomplete and backspace', function () {
            result = pattern('12345', true);
            expect(result.value).toBe('123-45');
            expect(result.isValid).toBe(false);

        });
        it('should format swallow extra charecters', function () {
            result = pattern('123-45-678901234');
            expect(result.value).toBe('123-45-6789');
            expect(result.isValid).toBe(true);

        });
    });

    describe('format # (###) ###-####', function () {


        var pattern = formatter('# (###) ###-####'), result;

        it('should format a complete', function () {

            result = pattern('1234567');
            expect(result.isValid).toBe(false);
        });

        it('should format an incomplete', function () {
            result = pattern('1234');
            expect(result.value).toBe('1 (234) ');
            expect(result.isValid).toBe(false);
        });

        it('should format an incomplete 3rd group', function () {
            result = pattern('12345');
            expect(result.value).toBe('1 (234) 5');
            expect(result.isValid).toBe(false);

        });
        it('should forma a complete 3rd group', function () {
            result = pattern('123456');
            expect(result.value).toBe('1 (234) 56');
            expect(result.isValid).toBe(false);

        });
        it('should format the rest', function () {
            result = pattern('12345678901', true);
            expect(result.value).toBe('1 (234) 567-8901');
            expect(result.isValid).toBe(true);

            result = pattern('1234567890');
            expect(result.value).toBe('1 (234) 567-890');
            expect(result.isValid).toBe(false);


            result = pattern('1234567');
            expect(result.value).toBe('1 (234) 567-');
            expect(result.isValid).toBe(false);

            result = pattern('1234567', true);
            expect(result.value).toBe('1 (234) 567');
            expect(result.isValid).toBe(false);
        });
        it('should format incomplete and backpace', function () {
            result = pattern('1234', true);
            expect(result.value).toBe('1 (234');
            expect(result.isValid).toBe(false);
        });

        it('should handle incomplete patterns', function () {
            result = pattern('123456789');
            expect(result.isValid).toBe(false);
            expect(result.value).toBe('1 (234) 567-89');
        });
        it('should handle invalid delimeters', function () {
            result = pattern('123-45-6789');

            expect(result.isValid).toBe(false);
            expect(result.value).toBe('1 (234) 567-89');
        })
    });
    describe('00000', function () {

        var pattern = formatter('00000'), result;
        it('should pad 10', function () {
            result = pattern('10');
            expect(result.value).toBe('00010');
        });

        it('should pad 1000', function () {
            result = pattern('1000');
            expect(result.value).toBe('01000');
        });
    });

});