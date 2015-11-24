"use strict";

import React, {Component} from 'react';
import styles from 'subschema-styles/FormTemplate-style';
import PropTypes from '../PropTypes';
export default class FormTemplate extends Component {
    static propTypes = {
        onSubmit: PropTypes.event
    }
    static defaultProps = {
        className: styles.formClass
    }

    render() {
        var {children, name, fieldAttrs, enctype, className, action, method, onSubmit, ...props} = this.props;
        return (<form name={name} action={action} enctype={enctype} method={method} onSubmit={onSubmit}
                      className={className} {...fieldAttrs}>
            {children}
        </form>);
    }
}