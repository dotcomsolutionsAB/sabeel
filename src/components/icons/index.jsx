import PropTypes from "prop-types";
// Outline icons (recommended for nav UI)
import {
    CalendarDaysIcon, Squares2X2Icon, UserGroupIcon, BuildingOffice2Icon, DocumentTextIcon, UsersIcon as HeroUsersIcon,
    MagnifyingGlassIcon, ChevronDownIcon as HeroChevronDownIcon, EyeIcon as HeroEyeIcon, PrinterIcon, UserCircleIcon,
    ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

function withDefaults(Icon, defaultClassName = "") {
    const WrappedIcon = ({ className = "", ...props }) => {
        const finalClassName = [defaultClassName, className].filter(Boolean).join(" ");
        return <Icon className={finalClassName || undefined} aria-hidden="true" {...props} />;
    };

    WrappedIcon.propTypes = {
        className: PropTypes.string,
    };

    return WrappedIcon;
}

// ✅ Keep your existing exported names (so TopBar code stays same)
export const CalendarIcon = withDefaults(CalendarDaysIcon, "w-4 h-4 text-[#2c86c8]");

export const DashboardIcon = withDefaults(Squares2X2Icon);
export const FamilyIcon = withDefaults(UserGroupIcon);
export const EstablishmentIcon = withDefaults(BuildingOffice2Icon);
export const ReceiptsIcon = withDefaults(DocumentTextIcon);
export const UsersIcon = withDefaults(HeroUsersIcon);

// ✅ Other icons you showed earlier (same export names)
export const SearchIcon = withDefaults(MagnifyingGlassIcon, "w-4 h-4");
export const ChevronDownIcon = withDefaults(HeroChevronDownIcon, "w-4 h-4");
export const EyeIcon = withDefaults(HeroEyeIcon, "w-4 h-4");
export const PrintIcon = withDefaults(PrinterIcon, "w-4 h-4");

export const ProfileIcon = withDefaults(UserCircleIcon, "w-4 h-4");
export const LogoutIcon = withDefaults(ArrowRightOnRectangleIcon, "w-4 h-4");