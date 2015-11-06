var React = require('../React');
var Content = require('../types/Content.jsx');
var style = require('subschema-styles/CheckboxTemplate-style');
var CheckboxTemplate = React.createClass({
    render(){
        return (<div className={style.checkbox}>
            <label>
                {this.props.children}
                {this.props.label}
            </label>
        </div>);
    }
});

module.exports = CheckboxTemplate;