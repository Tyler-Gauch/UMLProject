let React = require('react');
let FilterLink = require('../containers/FilterLink');

const Footer = () => (
	<p>
		Show: {" "}
		<FilterLink filter="SHOW_ALL">
			All
		</FilterLink>
		{", "}
	    <FilterLink filter="SHOW_ACTIVE">
	      Active
	    </FilterLink>
	    {", "}
	    <FilterLink filter="SHOW_COMPLETED">
	      Completed
	    </FilterLink>
	</p>
)

modules.export = Footer;