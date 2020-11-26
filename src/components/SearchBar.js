import React from "react"
import "./SearchBar.css"

const SearchBar = (props) => {
    return (
        <input 
            type="search" 
            placeholder={props.placeholder} 
            className="search" 
            onChange={props.handleChange} 
        />
    )
}

export default SearchBar;