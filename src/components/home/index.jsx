import React, { useCallback, useState } from 'react';
import getCidadeFMData from '../../crawlers/cidade';
import SongElement from '../song';
import styles from './index.module.css';

const Home = () => {
    const [cidadeData, setCidadeData] = useState([]);
    const [configs, setConfigs] = useState({
        ontem: true,
        hoje: true
    });
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        repeatedSongs: 0,
        repeatedTimes: 0,
    });
    const [search, setSearch] = useState('');

    const fetchDataHandler = async () => {
        window.umami?.('Fetched data');

        let tempStats = {
            repeatedSongs: 0,
            repeatedTimes: 0,
        };

        setLoading(true);
        setCidadeData([]);
        setStats(tempStats);

        const data = await getCidadeFMData(configs);

        for (let i = 0; i < data.length; i++) {
            const element = data[i];

            if (element.count > 1) {
                tempStats.repeatedSongs++;
                tempStats.repeatedTimes += element.count;
            }

        }

        setCidadeData(data);
        setLoading(false);
        setStats(tempStats);
    }

    const toggleCheckHandler = (key) => {
        const newConfigs = { ...configs };

        newConfigs[key] = !newConfigs[key];
        setConfigs(newConfigs);
    }

    const searchHandler = (event) => {
        const text = event.target.value;
        setSearch(text);
    }

    const filterSongs = (song) => {
        const cleanSearch = search.trim().toLocaleLowerCase();
        const cleanName = song.name.trim().toLocaleLowerCase();

        if (!cleanSearch) {
            return true;
        }

        return !!cleanName.includes(cleanSearch);
    }

    return (
        <div className="container">
            <div>
                <div className="d-flex flex-column justify-content-center">
                    <h1 className="text-center">Cidade FM</h1>
                    <h3 className="text-center">Quantas músicas repete?</h3>
                    <p className="text-center">Se achas que estão sempre a passar as mesmas músicas na Cidade FM, então estás no sítio certo para teres a certeza.</p>
                    <div className={styles.actions}>
                        {!loading ?
                            (<button className="btn btn-lg btn-outline-success" onClick={fetchDataHandler} disabled={!configs.hoje && !configs.ontem}>POR FAVOR MOSTRA-ME!</button>)
                            : (
                                <div className="spinner-border text-success" role="status">
                                </div>
                            )}
                    </div>
                </div>
                <div className={styles.configs}>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="ontemCheck" checked={configs.ontem} onChange={() => toggleCheckHandler('ontem')} />
                        <label className="form-check-label" htmlFor="ontemCheck">
                            Ontem
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="hojeCheck" checked={configs.hoje} onChange={() => toggleCheckHandler('hoje')} />
                        <label className="form-check-label" htmlFor="hojeCheck">
                            Hoje
                        </label>
                    </div>
                </div>
                <div className="d-flex flex-column justify-content-center mt-2">
                    <span className="text-center"><a className={styles.github} href="https://github.com/bruxo00/ouverepete" target="_blank">Github</a></span>
                    <span className="text-center"><a className={styles.github} href="https://www.youtube.com/watch?v=4o84CvRJ9uw" target="_blank">Pela Música</a></span>
                </div>
                {!loading && cidadeData.length > 0 && (
                    <>
                        <div className="card mt-3">
                            <div className="card-body">
                                <div>
                                    <div class="input-group mb-3">
                                        <input value={search} onChange={searchHandler} type="text" class="form-control" placeholder="Procura por uma música aqui..." aria-label="Nome" />
                                    </div>
                                </div>
                                <div className={styles.items}>
                                    De <span className="fw-bold">{cidadeData.length}</span> músicas, <span className="fw-bold">{stats.repeatedSongs}</span> foram repetidas <span className="fw-bold">{stats.repeatedTimes}</span> vezes.
                                </div>
                            </div>
                        </div>
                        <div className="card mt-3 mb-3">
                            <div className="card-body">
                                <div className={styles.items}>
                                    {cidadeData.filter(filterSongs).map(element => {
                                        return <SongElement key={element.name} {...element} />;
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;