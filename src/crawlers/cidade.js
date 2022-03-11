const cheerio = require('cheerio');

const compare = (a, b) => {
    if (a.count < b.count) {
        return 1;
    }

    if (a.count > b.count) {
        return -1;
    }

    return 0;
}

const encodeHTML = async (response) => { // é lidar irmoum
    const buffer = await response.arrayBuffer();
    let decoder = new TextDecoder('iso-8859-1');

    return decoder.decode(buffer);;
}


const getCidadeFMData = async (configs) => {
    const list = [];
    const days = Object.keys(configs).filter(k => !!configs[k]);

    for (let d = 0; d < days.length; d++) {
        const day = days[d];

        for (let i = 0; i < 24; i++) {
            const response = await fetch(`https://cidade.iol.pt/passou?d=${day}&h=${i}`);
            const cleanHtml = await encodeHTML(response);
            const $ = cheerio.load(cleanHtml);
            const items = $('.passou-items').children();

            items.each((i, item) => {
                const artist = $(item).children().find('.top8artistname').text().trim();
                const name = $(item).children().find('.top8songname').text().trim();
                const img = $(item).children().find('img').attr('src');
                const songName = `${artist} - ${name}`;
                const index = list.findIndex((e => e.name === songName));

                if (index === -1) {
                    list.push({ name: songName, count: 1, img: `https://cidade.iol.pt/${img}` });
                } else {
                    list[index].count++;
                }
            });
        }
    }

    list.sort(compare);

    return list;
}

export default getCidadeFMData;