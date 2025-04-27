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
        <>
        <Header />
        <div className='flex flex-col rounded-xl text-neutral-900 text-xl w-full p-16 m-auto md:mt-16 gap-4 md:w-3/5 bg-white text-center md:text-left'>
            <div className="flex flex-col">
                <h1 className="text-4xl font-bold tracking-tight mb-2">About Us</h1>
                <p>At ImpactWorks, we believe that impactful work starts with connecting the right people to the right opportunities. We’re more than just a jobs board—we’re a global platform dedicated to helping individuals and organizations make meaningful contributions to humanitarian, development, and sustainability initiatives around the world.</p>
            </div>

            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-4"><span className="border-b-2 border-rose-600 pb-1">Our Mission</span></h1>
                <p>We aim to bridge the gap between talent and need, ensuring that those committed to creating positive social change can easily find roles aligned with their passion and expertise. Whether it’s humanitarian relief in conflict zones, climate resilience projects in rural communities, or building robust health systems in underserved regions, our mission is to empower professionals and volunteers to step into roles where their skills can drive real, lasting impact.</p>
            </div>

            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-4"><span className="border-b-2 border-rose-600 pb-1">Our Vision</span></h1>
                <p>As we grow, we envision becoming a comprehensive ecosystem for the international development community. Beyond job listings, we’re working toward a future where organizations can host their own hubs on our platform—spaces designed for networking, knowledge exchange, and dynamic collaboration. By fostering these relationships, we aim to catalyze innovative solutions, support stronger partnerships, and accelerate sustainable progress in the places that need it most.</p>
            </div>

            <h1 className="text-2xl font-semibold mb-4"><span className="border-b-2 border-rose-600 pb-1">What You'll Find at ImpactWorks</span></h1>

            <div className="flex flex-col text-sm md:flex-row gap-8 text-center py-8">

                <div className="flex flex-col mb-4">
                    <h1>🌍</h1>
                    <h2 className="font-bold">Opportunities Across the Globe</h2>
                    <p>Curated listings from leading NGOs, social enterprises, multilateral agencies, and grassroots organizations, covering everything from project management and financial administration to field operations and tech innovation.</p>
                </div>


                <div className="flex flex-col mb-4">
                    <h1>📚</h1>
                    <h2 className="font-bold">Valuable Insights and Resources</h2>
                    <p>Stay informed with tailored newsletters, expert articles, and updates on emerging best practices in the humanitarian and development fields.</p>
                </div>

                <div className="flex flex-col mb-4">
                    <h1>🌱</h1>
                    <h2 className="font-bold">A Growing Community of Changemakers</h2>
                    <p>Connect with peers and thought leaders, share experiences, learn from case studies, and discover tools that can help you and your organization increase efficiency and deepen impact.</p>
                </div>

            </div>

            <div className="flex flex-col ">
                <h1 className="text-2xl font-semibold mb-4"><span className="border-b-2 border-rose-600 pb-1">Our Committment</span></h1>
                <p>We recognize that meaningful change often arises from inclusive, collaborative efforts. That’s why we’re dedicated to building a platform that elevates diverse voices, prioritizes local perspectives, and supports equitable opportunities for all. At ImpactWorks, we’re committed to breaking down barriers—geographical, cultural, and institutional—to ensure that everyone has a chance to contribute to a more just and sustainable world.</p>
            </div>

            Join us at ImpactWorks. Together, we can transform challenges into opportunities and ideals into action, creating a future where every inspired individual and organization finds their perfect place to make a difference.
        </div>
        </>

    )
}