import React from 'react';
import styles from './index.module.css';

const SongElement = ({ name, count, img }) => {
    return (
        <div className={styles.song} onClick={() => window.open(`https://www.youtube.com/results?search_query=${name}`, '_blank')}>
            <img className={styles.cover} src={img} />
            <div className="d-flex flex-column">
                <span className={styles.name}>{name}</span>
                <span className={styles.count}>{count} {count === 1 ? 'vez' : 'vezes'}</span>
            </div>
        </div>
    );
}

export default SongElement;