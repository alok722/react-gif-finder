import React from 'react';
import style from './gif.module.css';

const Gif = ({ img }) => {

    return (
        <div className={style.gif}>
            <img className={style.image} src={img} alt="tenorgif" />
        </div>
    );
}

export default Gif;