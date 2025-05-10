import { useEffect, useState } from "react";
import axios from "axios";
import React from 'react';
import './admin.css';
import config from "../config";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

export default function ViewManagers() {
    const [managers, setManagers] = useState([]);
    const [error, setError] = useState("");
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({});
    const navigate = useNavigate();

    const displayManagers = async () => {
        try {
            const response = await axios.get(`${config.url}/api/admin/allmanagers`);
            setManagers(response.data);
        } catch (err) {
            setError("Failed to fetch event managers data ... " + err.message);
        }
    };

    useEffect(() => {
        displayManagers();
    }, []);

    const deleteManager = async (managerId) => {
        try {
            const response = await axios.delete(`${config.url}/api/admin/deletemanager/${managerId}`);
            alert(response.data);
            displayManagers();
        } catch (err) {
            setError("Unexpected Error Occurred... " + err.message);
        }
    };

    const startEditing = (manager) => {
        setEditId(manager.managerId);
        setEditData({ ...manager });
    };

    const cancelEditing = () => {
        setEditId(null);
        setEditData({});
    };

    const saveEditing = async () => {
        try {
            const response = await axios.put(`${config.url}/api/admin/updatemanager/${editId}`, editData);
            alert("Manager updated successfully");
            setEditId(null);
            setEditData({});
            displayManagers();
        } catch (err) {
            setError("Failed to update manager... " + err.message);
        }
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const goToAddManager = () => {
        navigate('/admin/addmanager');
    };

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <h3 style={{ color: "black", fontWeight: "bolder" }}>
                    <u><h2>Event Managers</h2></u>
                </h3>
                <div className="custom-button" onClick={goToAddManager}>
                    <AddIcon style={{ marginRight: "8px" }} />
                    Add Manager
                </div>
            </div>

            {error ? (
                <p style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "red" }}>
                    {error}
                </p>
            ) : managers.length === 0 ? (
                <p style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "red" }}>
                    No Event Managers Data Found
                </p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                    <thead>
                        <tr>
                            <th>Manager ID</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>DOB</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Mobile No</th>
                            <th>Manager Role</th>
                            <th>Company Name</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {managers.map((manager) => (
                            <tr key={manager.managerId}>
                                <td>{manager.managerId}</td>
                                <td>
                                    {editId === manager.managerId ? (
                                        <TextField name="name" value={editData.name} onChange={handleEditChange} />
                                    ) : (
                                        manager.name
                                    )}
                                </td>
                                <td>
                                    {editId === manager.managerId ? (
                                        <TextField name="gender" value={editData.gender} onChange={handleEditChange} />
                                    ) : (
                                        manager.gender
                                    )}
                                </td>
                                <td>
                                    {editId === manager.managerId ? (
                                        <TextField name="dob" value={editData.dob} onChange={handleEditChange} />
                                    ) : (
                                        manager.dob
                                    )}
                                </td>
                                <td>
                                    {editId === manager.managerId ? (
                                        <TextField name="email" value={editData.email} onChange={handleEditChange} />
                                    ) : (
                                        manager.email
                                    )}
                                </td>
                                <td>
                                    {editId === manager.managerId ? (
                                        <TextField name="username" value={editData.username} onChange={handleEditChange} />
                                    ) : (
                                        manager.username
                                    )}
                                </td>
                                <td>
                                    {editId === manager.managerId ? (
                                        <TextField name="mobileno" value={editData.mobileno} onChange={handleEditChange} />
                                    ) : (
                                        manager.mobileno
                                    )}
                                </td>
                                <td>
                                    {editId === manager.managerId ? (
                                        <TextField name="role" value={editData.role} onChange={handleEditChange} />
                                    ) : (
                                        manager.role
                                    )}
                                </td>
                                <td>
                                    {editId === manager.managerId ? (
                                        <TextField name="company_name" value={editData.company_name} onChange={handleEditChange} />
                                    ) : (
                                        manager.company_name
                                    )}
                                </td>
                                <td>
                                    {editId === manager.managerId ? (
                                        <TextField name="company_location" value={editData.company_location} onChange={handleEditChange} />
                                    ) : (
                                        manager.company_location
                                    )}
                                </td>
                                <td>
                                    {editId === manager.managerId ? (
                                        <>
                                            <Button variant="contained" color="success" startIcon={<SaveIcon />} onClick={saveEditing}>
                                                Save
                                            </Button>
                                            <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={cancelEditing}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => startEditing(manager)}>
                                                Edit
                                            </Button>
                                            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => deleteManager(manager.managerId)}>
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
