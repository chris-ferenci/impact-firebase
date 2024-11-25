import React from "react"
import JobDetails from "../components/JobDetails/JobDetails"
import { useNavigate, Outlet } from "react-router-dom"
import Header from "../components/Header/Header"

export default function About() {

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    return(
        <div className="app">
        <Header />
        <div className='flex flex-col w-full px-64 py-16 bg-gray-50'>
                About
        </div>
        </div>

    )
}