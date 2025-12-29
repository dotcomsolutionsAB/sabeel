import { FaImage, FaUsers, FaBuilding, FaFileAlt, FaBars } from "react-icons/fa";

export default function TopBar() {
    return (
        <div className="sabeel-topbar">
            {/* Left */}
            <div className="font-semibold text-[#8c3e1b]">Dashboard</div>

            {/* Center Nav (NOTCH STYLE like your original screenshot) */}
            <div className="sabeel-topnav hidden sm:flex">
                {/* notch circles that “cut” the strip */}
                {/* <span className="sabeel-notch left" />
                <span className="sabeel-notch right" /> */}

                <div className="sabeel-nav-pill">
                    <span className="sabeel-nav-icon"><FaImage size={14} /></span>
                    <span className="sabeel-nav-icon"><FaUsers size={14} /></span>
                    <span className="sabeel-nav-icon"><FaBuilding size={14} /></span>
                    <span className="sabeel-nav-icon"><FaFileAlt size={14} /></span>
                    <span className="sabeel-nav-icon"><FaBars size={14} /></span>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                <div className="text-sm text-gray-700">Hi, Nematullah</div>
                <div className="h-9 w-9 rounded-full bg-gray-300 border border-white shadow" />
            </div>
        </div>
    );
}
