import React from 'react';
import { connect } from 'react-redux';
import { Paginator } from 'zooniverse-react-components';

import { projectsShape } from '../../projects/model';
import { organizationShape } from '../model';

import OrganizationProjectsList from '../components/organization-projects-list';
import OrganizationAddProject from '../components/organization-add-project';

import { setOrganizationProjects, setCurrentOrganization } from '../action-creators';
import notificationHandler from '../../../lib/notificationHandler';

class ProjectsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectToAdd: { value: '', label: '' },
    };

    this.addProject = this.addProject.bind(this);
    this.changeSelectedProject = this.changeSelectedProject.bind(this);
    this.getLinkedProjects = this.getLinkedProjects.bind(this);
    this.removeProject = this.removeProject.bind(this);
    this.resetProjectToAdd = this.resetProjectToAdd.bind(this);
  }

  componentDidMount() {
    this.getLinkedProjects();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.organization !== this.props.organization ||
      nextProps.location.query.page !== this.props.location.query.page) {
      this.getLinkedProjects(nextProps.organization, nextProps.location.query.page);
    }
  }

  getLinkedProjects(organization = this.props.organization, page = 1) {
    if (organization) {
      const query = { sort: 'display_name', page };

      organization.get('projects', query).then((projects) => {
        const allProjects = organization.links.projects.map((projectID) => {
          if (projects.filter(project => project.id === projectID).length) {
            return projects.filter(project => project.id === projectID)[0];
          }
          return {
            display_name: `Project ${projectID}`,
            id: projectID,
            links: {
              owner: {
                display_name: 'CHECK WITH OTHER ORG COLLABORATORS'
              },
            },
          };
        });
        this.props.dispatch(setOrganizationProjects(allProjects));
      }).catch((error) => {
        const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };

        notificationHandler(this.props.dispatch, notification);
      });
    }
  }

  addProject() {
    const id = this.state.projectToAdd.value;

    this.props.organization.addLink('projects', [id])
      .then(([organization]) => {
        this.props.dispatch(setCurrentOrganization(organization));
        this.getLinkedProjects(organization);
        this.resetProjectToAdd();
      }).catch((error) => {
        const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };

        notificationHandler(this.props.dispatch, notification);
      });
  }

  removeProject(id) {
    this.props.organization.removeLink('projects', [id])
      .then(([organization]) => {
        this.props.dispatch(setCurrentOrganization(organization));
        this.getLinkedProjects(organization);
        this.resetProjectToAdd();
      }).catch((error) => {
        const notification = { status: 'critical', message: `${error.statusText}: ${error.message}` };

        notificationHandler(this.props.dispatch, notification);
      }).then(() => {
        this.props.organization.uncacheLink('projects');
      });
  }

  changeSelectedProject(selectedProject) {
    const projectToAdd = selectedProject || { value: '', label: '' };
    this.setState({ projectToAdd });
  }

  resetProjectToAdd() {
    this.setState({ projectToAdd: { value: '', label: '' } });
  }

  render() {
    return (
      <div>
        <div className="organization-section-header">Affiliated Projects</div>
        <OrganizationProjectsList
          onRemove={this.removeProject}
          projects={this.props.organizationProjects}
        />
        {this.props.organizationProjects.length &&
          (<Paginator
            page={this.props.organizationProjects[0]._meta.projects.page}
            pageCount={this.props.organizationProjects[0]._meta.projects.page_count}
            router={this.props.router}
          />)
        }
        <hr />
        <h4>Add a project</h4>
        <p>Add projects that you want to include in this organization.</p>
        <OrganizationAddProject
          onAdd={this.addProject}
          onChange={this.changeSelectedProject}
          onReset={this.resetProjectToAdd}
          value={this.state.projectToAdd.value}
        />
      </div>
    );
  }
}

ProjectsContainer.defaultProps = {
  location: {},
  organization: {},
  organizationProjects: {}
};

ProjectsContainer.propTypes = {
  dispatch: React.PropTypes.func,
  location: React.PropTypes.shape({
    query: React.PropTypes.shape({
      page: React.PropTypes.string,
    }),
  }),
  organization: organizationShape,
  organizationProjects: projectsShape,
  router: React.PropTypes.shape({
    push: React.PropTypes.func
  }),
};

function mapStateToProps(state) {
  return {
    organization: state.organization,
    organizationProjects: state.organizationProjects,
  };
}

export default connect(mapStateToProps)(ProjectsContainer);
