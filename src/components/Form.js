import React, {useState} from 'react';
import RecordModel from "../models/RecordModel";

function Form() {
    const [records, setRecords] = useState([]);
    const [form, setForm] = useState({date: '', km: ''});

    function parseDate(date) {
        const arr = String(date).split("-");
        return`${arr[2]}.${arr[1]}.${arr[0]}`;
    }

    function compare(b, a) {
        const arr1 = String(a).split(".");
        const arr2 = String(b).split(".");
        const year = Number(arr1[2]) - Number(arr2[2]);
        const month = Number(arr1[1]) - Number(arr2[1]);
        const day = Number(arr1[0]) - Number(arr2[0]);

        if (year !== 0) return year;
        if (month !== 0) return month;
        if (day !== 0) return day;
        return 0;
    }

    const handleChange = evt => {
        const {name, value} = evt.target;
        setForm(prevForm => ({...prevForm, [name]: value}));
    };

    const handleRemove = date => {
        setRecords(prevRecords => prevRecords.filter(o => o.id !== date));
    };

    const handleSubmit = evt => {
        evt.preventDefault();
        if (!form.date || !form.km) return;
        form.date = parseDate(form.date);
        setRecords(prevRecords => {
            const arr = prevRecords.slice();
            //проверить если уже есть такая дата
            const index = arr.findIndex((item) => item.id === form.date);
            if (index > -1) {
                const km = String(Number(arr[index].km) + Number(form.km));
                arr.splice(index, 1);
                arr.push(new RecordModel(form.date, km));
                arr.sort((a, b) => compare(a.id, b.id));

            } else {
                const record = new RecordModel(form.date, form.km);
                arr.push(record);
                arr.sort((a, b) => compare(a.id, b.id));
            }
            setForm({date: '', km: ''});
            return [...arr];
        });
    };

    return (
        <div className={"main"}>
            <div className={"container"}>
                <form className="main-form" onSubmit={handleSubmit}>
                    <div className="form-block">
                        <label htmlFor="date" className="form-label">Дата (ДД.ММ.ГГ)</label>
                        <input className="form-input" name={"date"} type={"date"} value={form.date} onChange={handleChange}/>
                    </div>
                    <div className="form-block">
                        <label htmlFor="km" className="form-label">Пройдено км</label>
                        <input className="form-input" name={"km"} type={"number"} value={form.km} onChange={handleChange}/>
                    </div>
                    <div className="form-block bottom">
                        <input className="form-button" type={"submit"} value={"OK"}/>
                    </div>

                </form>
                <div className={"history"}>
                    <table className='form-table'>
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Пройдено км</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                        {records.map(element => {
                                return <tr key={element.id}>
                                    <th>{element.id}</th>
                                    <th>{element.km}</th>
                                    <th>{<button className={"remove"}
                                                onClick={() => handleRemove(element.id)}>{"X"}</button>}</th>
                                </tr>
                            }
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    )
}

export default Form;