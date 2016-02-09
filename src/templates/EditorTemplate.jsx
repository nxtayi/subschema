"use strict";
import React, {Component} from 'react';
import style from 'subschema-styles/EditorTemplate-style';
import {forEditor} from '../css';
import PropTypes from '../PropTypes';
import Content from '../types/Content.jsx';

export default class EditorTemplate extends Component {
    static propTypes = {
        error: PropTypes.error,
        title: PropTypes.title,
        name: PropTypes.string,
        help: PropTypes.node
    };

    render() {
        var {name, title, help, error, errorClassName, message, fieldClass,  children} = this.props;
        if (!title) {
            title = ''
        }
        return (<div
            className={style.group+" " + (error != null ? errorClassName || '' : '') + ' ' +  forEditor(this)}>
            <Content content={title} type="label" className={style.label} htmlFor={name}/>

            <div className={title ? style.hasTitle : style.noTitle}>
                {children}
                {help === false ? null : <Content content={error ? error : help || ''} key='error-block' type='p'
                                                  className={error ? style.error : style.help}/>}
            </div>
        </div>);
    }
};