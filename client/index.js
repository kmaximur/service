async function requestServer(req) {
    return new Promise(async (resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", req.route, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = async function () {
            try {
                if (xhr.readyState === 4) {
                    if (xhr.status < 300 && xhr.status >= 200) {
                        resolve(JSON.parse(xhr.response))
                    } else {
                        reject(JSON.parse(xhr.response))
                    }
                }
            } catch (e) {
                reject(e)
            }
        }
        xhr.send(JSON.stringify(req.body));
    })
}

function toast(message) {
    document.getElementById('messsageToast').innerHTML = message
    document.getElementById('toast').style.opacity = '1'
    setTimeout(() => {
        document.getElementById('toast').style.opacity = '0'
    }, 1500)
}

let allowUpdates = false

function rgba2rgb(RGB_background, RGBA_color) {
    const alpha = RGBA_color.a;
    return `
        rgb(${(1 - alpha) * RGB_background.r + alpha * RGBA_color.r},
         ${(1 - alpha) * RGB_background.g + alpha * RGBA_color.g},
         ${(1 - alpha) * RGB_background.b + alpha * RGBA_color.b})
    `
}

function createTable(data) {
    const tbody = document.getElementById('data')
    for (let i = 0; i <= 22; i++) {
        const row = document.createElement("TR");
        tbody.appendChild(row);
        for (let j = 0; j <= 20; j++) {
            if (i === 0) {
                if (j === 0) {
                    const td = document.createElement("TD");
                    row.appendChild(td);
                    td.innerText = 'ID'
                } else {
                    const td = document.createElement("TD");
                    row.appendChild(td);
                    td.innerText = `param${j}`
                }
            } else if (i < 21) {
                if (j === 0) {
                    const td = document.createElement("TD");
                    row.appendChild(td);
                    row.id = data[i - 1].id
                    td.innerText = data[i - 1].id
                } else {
                    const td = document.createElement("TD");
                    row.appendChild(td);
                    const value = data[i - 1][`param${j}`]
                    td.innerHTML = `<span>${value}</span>`
                    if (value > 0) {
                        td.style.backgroundColor = `rgba(255, 140, 0, ${value})`
                        td.style.color = rgba2rgb({r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0, a: value > 0.6 ? 0 : 1})
                    }
                    else if (value < 0) {
                        td.style.backgroundColor = `rgba(0, 0, 0, ${Math.abs(value)})`
                        td.style.color = rgba2rgb({r: 255, g: 255, b: 255}, {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: Math.abs(value) > 0.5 ? 0 : 1
                        })
                    }
                    else {
                        td.style.backgroundColor = 'rgb(255, 255, 255)'
                        td.style.color = 'rgb(0, 0, 0)'
                    }
                }
            } else if (i === 21) {
                if (j === 0) {
                    const td = document.createElement("TD");
                    row.appendChild(td);
                    td.innerText = 'ИТОГО'
                } else {
                    const td = document.createElement("TD");
                    row.appendChild(td);
                    td.innerText = ''
                }
            } else {
                if (j === 0) {
                    const td = document.createElement("TD");
                    row.appendChild(td);
                    td.innerText = ''
                } else {
                    const td = document.createElement("TD");
                    row.appendChild(td);
                    const select = document.createElement("SELECT");
                    td.appendChild(select);
                    select.id = `select${j}`
                    const sum = document.createElement("OPTION");
                    select.appendChild(sum);
                    sum.value = 'sum'
                    sum.selected = true
                    sum.innerText = 'sum'
                    select.onchange = () => {
                        calc(j);
                    }
                    const max = document.createElement("OPTION");
                    select.appendChild(max);
                    max.value = 'max'
                    max.innerText = 'max'
                    const min = document.createElement("OPTION");
                    select.appendChild(min);
                    min.value = 'min'
                    min.innerText = 'min'
                    const avg = document.createElement("OPTION");
                    select.appendChild(avg);
                    avg.value = 'avg'
                    avg.innerText = 'avg'
                }
            }
        }
    }
    for (let i = 1; i <= 20; i++) {
        calc(i)
    }
}

function calc(numParam) {
    const selectElem = document.getElementById(`select${numParam}`).value;
    const table = document.getElementById('data');
    if (selectElem === 'sum') {
        let sum = 0
        for (let i = 1; i <= 20; i++) {
            sum += table.rows[i].cells[numParam].innerText * 1
        }
        table.rows[21].cells[numParam].innerText = sum.toFixed(4)
    } else if (selectElem === 'max') {
        let max = 0
        for (let i = 1; i <= 20; i++) {
            if (max === 0 || table.rows[i].cells[numParam].innerText * 1 > max)
                max = table.rows[i].cells[numParam].innerText * 1
        }
        table.rows[21].cells[numParam].innerText = max.toFixed(4)
    } else if (selectElem === 'min') {
        let min = 0
        for (let i = 1; i <= 20; i++) {
            if (min === 0 || table.rows[i].cells[numParam].innerText * 1 < min)
                min = table.rows[i].cells[numParam].innerText * 1
        }
        table.rows[21].cells[numParam].innerText = min.toFixed(4)
    } else if (selectElem === 'avg') {
        let avg = 0
        for (let i = 1; i <= 20; i++) {
            avg += table.rows[i].cells[numParam].innerText * 1
        }
        avg /= 20
        table.rows[21].cells[numParam].innerText = avg.toFixed(4)
    }
}

function changeHandler(event) {
    if (event.target.id === 'enableUpdates')
        allowUpdates = true
    else if (event.target.id === 'disableUpdates')
        allowUpdates = false
}

window.onload = () => {
    let req = {route: '/api/main/getAll', body: {}}
    requestServer(req).then(res => {
        createTable(res.data)
        document.getElementById('buttons').style.display = 'inline-block';
    }, err => {
        window.toast(err.message)
    }).catch((e) => {
        window.toast(e)
    })

    const socket = io("http://localhost:4005", {
        transports: ['websocket']
    });

    socket.on('newData', function (data) {
        if (allowUpdates) {
            data.forEach(item => {
                const table = document.getElementById('data');
                for (let i = 1; i <= 20; i++) {
                    if (table.rows[i].cells[0].innerText === item.id) {
                        for (let j = 1; j <= 20; j++) {
                            table.rows[i].cells[j].innerText = item[`param${j}`]
                        }
                    }
                }
            })
            for (let i = 1; i <= 20; i++) {
                calc(i)
            }
        }
    });

    const enableUpdatesButtons = document.querySelectorAll('input[type=radio][name="updatesChecker"]');
    Array.prototype.forEach.call(enableUpdatesButtons, function (radio) {
        radio.addEventListener('change', changeHandler);
    });
}

