// components/CustomSelect.js
import Select from "react-select";
import PropTypes from "prop-types";

const CustomSelect = ({ icon, label, value, onChange, options, isDisabled = false, editButton }) => {
  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "transparent",
      borderRadius: "0.375rem",
      borderWidth: 0,
      boxShadow: "none",
      padding: "0.5rem 0",
      minHeight: 0,
      cursor: "pointer",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: 0,
      color: "inherit",
    }),
    singleValue: (base) => ({
      ...base,
      color: "inherit",
    }),
    input: (base) => ({
      ...base,
      color: "inherit",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "rgba(255,255,255,0.85)",
      borderRadius: "0.75rem",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(209, 213, 219, 0.5)",
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
      overflow: "hidden",
      width: "100%",
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      padding: 4,
      overflowX: "hidden",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#8b5cf6"
        : state.isFocused
        ? "rgba(139, 92, 246, 0.1)"
        : "transparent",
      color: state.isSelected ? "#fff" : "#1f2937",
      borderRadius: "0.5rem",
      padding: "0.5rem 1rem",
      margin: "0.125rem 0.25rem",
      cursor: "pointer",
      transition: "all 0.15s",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div>
      <label className="block mb-1 text-sm sm:text-base text-gray-800 dark:text-white">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white backdrop-blur border border-gray-300 dark:border-gray-600 rounded-md px-3 pl-0 py-0 shadow-inner">
        {icon && (
          <span className="text-xl text-violet-600 dark:text-violet-400">{icon}</span>
        )}
        <div className="w-full relative">
          <Select
            value={options.find((opt) => opt.value === value)}
            onChange={(selected) => onChange(selected.value)}
            options={options}
            isSearchable={false}
            closeMenuOnSelect={true}
            closeMenuOnScroll={true}
            styles={customStyles}
            menuPortalTarget={document.body}
            menuPosition="absolute"
            isDisabled={isDisabled}
            placeholder=""
            components={{
              IndicatorSeparator: () => null,
            }}
            classNames={{
              control: () => "text-sm bg-transparent",
              menu: () => "dark:!bg-gray-800/90 dark:!border dark:!border-gray-600 pl-2",
              option: () =>
                "dark:hover:!bg-violet-600/20 dark:!text-white transition-colors duration-100",
              singleValue: () => "dark:!text-white",
            }}
          />
        </div>

        {editButton && (
          <>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            <div className="pl-[15px]">{editButton}</div>
          </>
        )}
      </div>
    </div>
  );
};
CustomSelect.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  editButton: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomSelect;