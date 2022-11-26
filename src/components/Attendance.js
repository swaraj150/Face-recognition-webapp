import React, { useContext, useEffect, useRef, useState } from 'react'
import { CSVLink } from 'react-csv';
import TextContext from '../context/textContext'
const headers = [
    { label: "Date", key: "date" },
    { label: "Name", key: "name" },
    { label: "Roll No.", key: "rollno" },
    { label: "Branch", key: "branch" },
    { label: "Status", key: "status" }
]
function Attendance() {
    const host = "http://localhost:8000";
    const context = useContext(TextContext);
    const { students, getstudents } = context;
    const [downloadeddata, setdata] = useState([]);
    const csvdownloadref = useRef(null);
    useEffect(() => {
        getstudents();
    })
    const downloaddata = async () => {
        const response = await fetch(`${host}/api/create/getallstudents`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        setdata(json);
        setTimeout(() => {
            csvdownloadref.current.link.click();
        }, 500);
    }
    return (
        <div className="my-3 mx-3 mx-3">
            <table className="table table-bordered">
                <thead >
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Roll No.</th>
                        <th scope="col">Branch</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>

                    {students.map((entry, i) => {
                        return (
                            <tr>
                                <th scope="row">{i + 1}</th>
                                <td>{entry.name}</td>
                                <td>{entry.rollno}</td>
                                <td>{entry.branch}</td>
                                <td>{entry.status}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="display-flex justify-content-center margin ">
                <button type='button' className="btn btn-success" id='btn1' onClick={downloaddata}>Export Attendance</button>
            </div>

            <CSVLink
                data={downloadeddata}
                headers={headers}
                filename={"attendance.csv"}
                target={"_blank"}
                ref={csvdownloadref}
            />
        </div>
    )
}
export default Attendance;