var React = require('../react');
var FieldValueMixin = require('../FieldValueMixin');
var css = require('../css');
var Constants = require('../Constants')
var makeFormatter = require('../formatter');
function ret(op) {
    return op;
}
var cardRe = /^(\d{0,4})(?:[^\d]?(\d{0,4}))(?:[^\d]?(\d{0,4}))(?:[^\d]?(\d{0,4}))$/;
var dateRe = /^([0,1]?\d?)(?:\/?(\d{0,2}))?$/;
var zipRe = /^(\d{0,5})(?:[^\d]?(\d{0,4}))?$/;
var reRe = /(#*)?(A*)?(a*)?([^#Aa]*)?/g;
function lastEq(input, val) {
    return input && input[input.length - 1] === val;
}
var Restricted = React.createClass({
    mixins: [FieldValueMixin],
    statics: {
        inputClassName: Constants.inputClassName
    },
    getInitialState(){
        var value = this.props.value ? this.formatter(this.props.value) : {
            isValid: false,
            value: ''
        };

        return {
            value: value.value || '',
            hasValidValue: value.isValid
        }
    },
    formatters: {
        uszip(value, isBackspace){
            value = (value || '').substring(0, 10);
            var parts = zipRe.exec(value) || [], isValid = false;

            if (parts) {
                if (parts[2]) {
                    value = parts[1] + '-' + parts[2]
                } else {
                    value = parts[1];
                }
                isValid = value.length === 5 || value.length === 10;

            } else {
                value = '';
            }

            return {
                value,
                isValid
            }
        },
        creditcard: '#### #### #### ####',
        shortDate(value, isBackspace){
            var parts = dateRe.exec(value) || [];
            if (parts.shift()) {
                var str = '';
                var last = parts.pop();
                var mm = parts.shift();
                if (mm.length === 2) {
                    str += mm + '/'
                } else if (last || last === '') {
                    str += '0' + mm + '/'
                } else {
                    str += mm;
                }
                str += (last || '');
                return {
                    value: (isBackspace) ? str.substring(0, (lastEq(value, '/') ? value.length - 1 : value.length)) : str,
                    isValid: str.length === 5
                };
            }
            if (value && value.trim() === '') {
                return {
                    value: value.trim(),
                    isValid: false
                }
            }
            return {
                value: '',
                isValid: false
            }
        }
    },
    makeFormatter: function (format) {
        return makeFormatter(format);
    },
    formatter: function (value, isBackspace) {
        if (this._formatter) {
            return this._formatter.call(this, value, isBackspace);
        }
        var field = this.props.field;
        var formatter = field.formatter || this.props.formatter;

        if (typeof formatter === 'string') {
            formatter = this.formatters[formatter] || formatter;
            if (typeof formatter === 'function') {
                return (this._formatter = formatter).call(this, value, isBackspace);
            } else {
                return (this._formatter = this.makeFormatter(formatter)).call(this, value, isBackspace);
            }
        } else if (typeof formatter === 'function') {
            return (this._formatter = formatter).call(this, value, isBackspace);
        }
        return value;
    },
    handleKeyDown(e){
        if (e.key === 'Enter') {
            this.props.onValid(this.state.hasValidValue, {
                isValid: this.state.hasValidValue,
                value: this.state.value
            });
            return;
        }
        if (e.key === 'Delete') {
            e.preventDefault();
            var pos = e.target.selectionStart, end = e.target.selectionEnd;
            var value = (this.state.value || '');
            value = value.substring(0, pos) + value.substring(end);
            this._value(value);
            return;
        }
        if (e.key === 'Backspace') {
            e.preventDefault();
            e.stopPropagation();
            var value = (this.state.value || '');
            var pos = e.target.selectionStart, end = e.target.selectionEnd;
            var back = false;
            if (pos === end) {
                value = value.trim().substring(0, value.length - 1);
                back = true;
            } else {
                value = value.substring(0, pos) + value.substring(end);
            }
            this._value(value, back);
            return;
        }
    },
    _value(str, isBackspace){
        var value = this.formatter(str, isBackspace) || {isValid: false};
        this.props.onValid(value.isValid, value);
        this.props.onValueChange(value.value);
        this.setState({
            value: value.value,
            hasValue: value.value.length !== 0,
            hasValidValue: value.isValid
        });

    },
    handleValueChange(e){
        this._value(e.target.value.trim());
    },
    render(){
        var field = this.props.field;
        var autoFocus = field && field.autoFocus || this.props.autoFocus;
        var placeholder = field && field.placeholder || this.props.placeholder;
        if (autoFocus) {
            autoFocus = {autoFocus}
        }
        return <input type="text" value={this.state.value}
                      className={css.forField(this)}
                      onChange={this.handleValueChange}
                      onFocus={this.props.onFocus}
                      onBlur={this.props.onBlur}
                      onKeyDown={this.handleKeyDown}
            {...{placeholder}}
            {...autoFocus}
            />;
    }
});

module.exports = Restricted;