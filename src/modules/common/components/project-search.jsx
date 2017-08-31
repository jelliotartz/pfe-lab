import React from 'react';
import ReactSelect from 'react-select';
import apiClient from 'panoptes-client/lib/api-client';

const ProjectSearch = ({ clearable, onChange, value }) => {
  const getOptions = (input) => {
    const query = {
      search: `%${input}%`
    };

    if (!apiClient.params.admin) {
      query.current_user_roles = ['collaborator', 'owner'];
    } else {
      query.launch_approved = null;
    }

    return apiClient.type('projects').get(query, {
      page_size: 10,
    }).then((projects) => {
      const opts = projects.map(project => ({
        value: project.id,
        label: project.display_name,
      }));
      return { options: opts };
    });
  };

  return (
    <ReactSelect.Async
      autoload={false}
      className="project-search"
      clearable={clearable}
      multi={false}
      isLoading={true}
      loadOptions={getOptions}
      name="projectSearch"
      onChange={onChange}
      placeholder="Name:"
      searchPromptText="Search by name"
      value={value || ''}
    />
  );
};

ProjectSearch.propTypes = {
  clearable: React.PropTypes.bool,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired,
};

export default ProjectSearch;
