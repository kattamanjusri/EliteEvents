import { useEffect, useState } from "react";
import axios from "axios";
import React from 'react'; 
import './admin.css';
import config from "../config";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ViewCustomers() 
{
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState("");

    const displayCustomers = async () => 
    {
        try 
        {
            const response = await axios.get(`${config.url}/api/admin/allcustomers`);
            setCustomers(response.data);
        } 
        catch (err) 
        {
            setError("Failed to fetch customers data ... " + err.message);
        }
    };

    useEffect(() => {
        displayCustomers();
    }, []);

    const deleteCustomer = async (cid) => 
    {
        try 
       {
            const response = await axios.delete(`${config.url}/admin/deletecustomer?cid=${cid}`);
            alert(response.data);
            displayCustomers();
        } 
        catch (err) 
        {
            setError("Unexpected Error Occurred... " + err.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h3 style={{ textAlign: "center", color: "black", fontWeight: "bolder" }}>
                <u><h2>Customers</h2></u>
            </h3>

            {error ? (
                <p style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "red" }}>
                    {error}
                </p>
            ) : customers.length === 0 ? (
                <p style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "red" }}>
                    No Customer Data Found
                </p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>DOB</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Mobile No</th>
                            <th>Location</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.gender}</td>
                                <td>{customer.dob}</td>
                                <td>{customer.email}</td>
                                <td>{customer.username}</td>
                                <td>{customer.mobileno}</td>
                                <td>{customer.location}</td>
                                
                                <td>
       <Button variant="outlined" startIcon={<DeleteIcon />}  onClick={()=>{deleteCustomer(customer.id)}}>
        Delete
      </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
