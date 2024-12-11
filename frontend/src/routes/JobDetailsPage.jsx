import React from "react"
import JobDetails from "../components/JobDetails/JobDetails"
import { useNavigate, Outlet } from "react-router-dom"
import Header from "../components/Header/Header"
import { IoChevronBack } from "react-icons/io5"
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary"

export default function JobDetailsPage() {

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    return(
        <>
        <Header />
        <div className='flex flex-col w-full bg-white'>
            <ErrorBoundary>
                <JobDetails />
            </ErrorBoundary>
        </div>
        </>

    )
}